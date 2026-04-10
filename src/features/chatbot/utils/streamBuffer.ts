/**
 * Stream Buffering Utilities
 * Manages accumulation of stream chunks and stream lifecycle
 * Handles chunk ordering, timeout detection, and buffer cleanup
 */

import { StreamBuffer } from '../types/websocket';

/**
 * StreamBufferManager
 * Accumulates stream chunks and manages their lifecycle
 */
export class StreamBufferManager {
	private buffers: Map<string, StreamBuffer> = new Map();
	private timeouts: Map<string, NodeJS.Timeout> = new Map();
	private readonly defaultTimeout: number = 60000; // 60 seconds

	/**
	 * Create a new stream buffer
	 */
	public createBuffer(
		sessionId: string,
		messageId: string,
		timeout?: number
	): void {
		this.clearTimeout(messageId);

		this.buffers.set(messageId, {
			sessionId,
			messageId,
			chunks: [],
			startTime: Date.now(),
			isComplete: false,
		});

		// Set timeout for stream completion
		const timeoutMs = timeout || this.defaultTimeout;
		const timeoutHandle = setTimeout(() => {
			this.clearBuffer(messageId);
			console.warn(
				`[StreamBufferManager] Stream timeout for message ${messageId}`
			);
		}, timeoutMs);

		this.timeouts.set(messageId, timeoutHandle);
	}

	/**
	 * Add chunk to buffer
	 */
	public addChunk(messageId: string, chunk: string): void {
		const buffer = this.buffers.get(messageId);
		if (buffer) {
			buffer.chunks.push(chunk);
		}
	}

	/**
	 * Get accumulated content from buffer
	 */
	public getContent(messageId: string): string {
		const buffer = this.buffers.get(messageId);
		if (!buffer) {
			return '';
		}
		return buffer.chunks.join('');
	}

	/**
	 * Get buffer object
	 */
	public getBuffer(messageId: string): StreamBuffer | null {
		return this.buffers.get(messageId) || null;
	}

	/**
	 * Mark stream as complete
	 */
	public completeStream(messageId: string): void {
		const buffer = this.buffers.get(messageId);
		if (buffer) {
			buffer.isComplete = true;
		}
		this.clearTimeout(messageId);
	}

	/**
	 * Get elapsed time since stream started
	 */
	public getElapsedTime(messageId: string): number {
		const buffer = this.buffers.get(messageId);
		if (!buffer) {
			return 0;
		}
		return Date.now() - buffer.startTime;
	}

	/**
	 * Get number of chunks accumulated
	 */
	public getChunkCount(messageId: string): number {
		const buffer = this.buffers.get(messageId);
		return buffer ? buffer.chunks.length : 0;
	}

	/**
	 * Clear buffer and timeout
	 */
	public clearBuffer(messageId: string): void {
		this.buffers.delete(messageId);
		this.clearTimeout(messageId);
	}

	/**
	 * Clear timeout for message
	 */
	private clearTimeout(messageId: string): void {
		const timeout = this.timeouts.get(messageId);
		if (timeout) {
			clearTimeout(timeout);
			this.timeouts.delete(messageId);
		}
	}

	/**
	 * Clear all buffers
	 */
	public clearAll(): void {
		this.buffers.clear();
		this.timeouts.forEach((timeout) => clearTimeout(timeout));
		this.timeouts.clear();
	}

	/**
	 * Get all active buffers
	 */
	public getAllBuffers(): StreamBuffer[] {
		return Array.from(this.buffers.values());
	}

	/**
	 * Get buffers for a specific session
	 */
	public getSessionBuffers(sessionId: string): StreamBuffer[] {
		return Array.from(this.buffers.values()).filter(
			(buffer) => buffer.sessionId === sessionId
		);
	}

	/**
	 * Check if buffer exists and is not complete
	 */
	public isStreaming(messageId: string): boolean {
		const buffer = this.buffers.get(messageId);
		return buffer ? !buffer.isComplete : false;
	}

	/**
	 * Get stats for a buffer
	 */
	public getStats(messageId: string) {
		const buffer = this.buffers.get(messageId);
		if (!buffer) {
			return null;
		}

		return {
			messageId: buffer.messageId,
			sessionId: buffer.sessionId,
			chunkCount: buffer.chunks.length,
			contentLength: this.getContent(messageId).length,
			elapsedTime: this.getElapsedTime(messageId),
			isComplete: buffer.isComplete,
			avgChunkSize: this.getContent(messageId).length / buffer.chunks.length,
		};
	}
}

/**
 * Utility function to format elapsed time
 */
export const formatElapsedTime = (ms: number): string => {
	if (ms < 1000) {
		return `${ms}ms`;
	}
	return `${(ms / 1000).toFixed(1)}s`;
};

/**
 * Utility function to format content size
 */
export const formatContentSize = (bytes: number): string => {
	if (bytes < 1024) {
		return `${bytes}B`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)}KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

/**
 * Global stream buffer manager instance
 */
let streamBufferManager: StreamBufferManager | null = null;

/**
 * Get or create stream buffer manager singleton
 */
export const getStreamBufferManager = (): StreamBufferManager => {
	if (!streamBufferManager) {
		streamBufferManager = new StreamBufferManager();
	}
	return streamBufferManager;
};
