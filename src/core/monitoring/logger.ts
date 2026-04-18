

const SENSITIVE_KEYS = [
  'token',
  'accessToken',
  'refreshToken',
  'idToken',
  'apiKey',
  'secret',
  'password',
  'Authorization',
  'authorization',
  'X-API-Key',
  'x-api-key',
  'Bearer',
  'bearer',
  'privateKey',
  'private_key',
  'aws_secret_access_key',
  'credentials',
  'credential',
  'key',
  'sessionToken',
  'sessionId',
];

const SENSITIVE_PATTERNS = [
  /Bearer\s+[\w\-._~+/]+=*/gi, // JWT tokens
  /token["\s:=]+[\w\-._~+/]+=*/gi,
  /api[_-]?key["\s:=]+[\w\-._~+/]+=*/gi,
  /password["\s:=]+[^\s,}]*/gi,
  /secret["\s:=]+[\w\-._~+/]+=*/gi,
];

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

/**
 * Filter out sensitive data from objects and strings
 */
function sanitizeData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    let sanitized = data;
    SENSITIVE_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    return sanitized;
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map((item) => sanitizeData(item));
    }

    const sanitized: LogContext = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const isSensitiveKey = SENSITIVE_KEYS.some(
          (sensitiveKey) =>
            key.toLowerCase().includes(sensitiveKey.toLowerCase())
        );

        if (isSensitiveKey) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = sanitizeData(data[key]);
        }
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Check if logging should be enabled
 * Only log in development mode
 */
function isLoggingEnabled(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: check NODE_ENV
    return process.env.NODE_ENV === 'development';
  }
  // Client-side: disable all console logs in production
  return process.env.NODE_ENV === 'development';
}

/**
 * Format and log a message
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!isLoggingEnabled()) {
    return;
  }

  const timestamp = new Date().toISOString();
  const sanitizedContext = context ? sanitizeData(context) : undefined;
  const consoleMethod = console[level] || console.log;

  // Format the output
  const output = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(sanitizedContext && { context: sanitizedContext }),
  };

  consoleMethod(`[${output.timestamp}] ${output.level}: ${output.message}`, sanitizedContext || '');
}

export const logger = {
  /**
   * Debug level logging - most verbose
   * Use for detailed debugging information
   */
  debug: (message: string, context?: LogContext) =>
    log('debug', message, context),

  /**
   * Info level logging - general information
   * Use for successful operations, state changes
   */
  info: (message: string, context?: LogContext) =>
    log('info', message, context),

  /**
   * Warning level logging - warning messages
   * Use for potentially problematic situations
   */
  warn: (message: string, context?: LogContext) =>
    log('warn', message, context),

  /**
   * Error level logging - error messages
   * Use for error conditions
   */
  error: (message: string, context?: LogContext) =>
    log('error', message, context),
};

export default logger;
