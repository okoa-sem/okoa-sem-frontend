# Authentication System

This document explains the email/password authentication system that has been added to the Okoa SEM frontend.

## Features

### Login Page
- **Email/Password Login**: Traditional login form with email and password fields
- **Google OAuth**: Alternative sign-in option with Google
- **Password Visibility Toggle**: Eye icon to show/hide password
- **Form Validation**: Client-side validation for email format and password requirements
- **Error Handling**: Clear error messages for failed login attempts
- **Forgot Password**: Link to initiate password reset (to be implemented)

### Registration Page (Future Enhancement)
- Similar form structure with additional name field
- Password confirmation field
- Stronger password requirements (8+ characters, uppercase, lowercase, number)

## Components

### 1. EmailPasswordForm
**Location**: `src/features/auth/components/EmailPasswordForm.tsx`

A reusable form component for email/password login.

**Props**:
- `onSubmit`: `(email: string, password: string) => Promise<void>` - Callback function when form is submitted
- `isLoading`: `boolean` - Loading state to disable form during submission

**Features**:
- Email validation
- Password minimum length validation (6 characters)
- Show/hide password toggle
- Forgot password link
- Real-time error clearing

### 2. EmailPasswordRegisterForm
**Location**: `src/features/auth/components/EmailPasswordRegisterForm.tsx`

A comprehensive registration form with stronger validation.

**Props**:
- `onSubmit`: `(name: string, email: string, password: string) => Promise<void>`
- `isLoading`: `boolean`

**Features**:
- Name field validation (minimum 2 characters)
- Email validation
- Strong password requirements (8+ chars, uppercase, lowercase, number)
- Password confirmation with matching validation
- Show/hide password toggles for both fields

### 3. SignUpCard (Updated)
**Location**: `src/features/auth/components/SignUpCard.tsx`

The main login card component that combines both authentication methods.

**Features**:
- Email/password form at the top
- "Or continue with" divider
- Google sign-in button
- Error message display
- Links to registration and back to home
- Terms and privacy policy links

## Services

### Auth Service
**Location**: `src/services/auth/authService.ts`

Handles all authentication API calls.

**Functions**:

#### `registerWithEmail(credentials)`
```typescript
interface RegisterCredentials {
  name: string
  email: string
  password: string
}
```
Registers a new user with email and password.

#### `loginWithEmail(credentials)`
```typescript
interface LoginCredentials {
  email: string
  password: string
}
```
Authenticates user with email and password.

#### `loginWithGoogle(googleToken)`
Signs in user with Google OAuth token.

#### `logout()`
Logs out the current user.

#### `getCurrentUser()`
Fetches the current authenticated user's profile.

#### `requestPasswordReset(email)`
Initiates password reset flow for given email.

## API Endpoints

The auth service expects the following backend endpoints:

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `POST /auth/google` - Login with Google OAuth
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/password-reset` - Request password reset

## Usage Example

### Login Page
```tsx
import { SignUpCard } from '@/features/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUpCard />
    </div>
  )
}
```

The `SignUpCard` component handles all the login logic internally, including:
- Form submission
- API calls
- Error handling
- Loading states
- Token storage

## Configuration

### Environment Variables

Make sure to set the API base URL in your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

### HTTP Client

The auth service uses the configured HTTP client from `src/services/http/client.ts`. The client is set up with:
- Base URL from environment variable
- 15-second timeout
- Response interceptors for error handling

## Token Management

Currently, the authentication token is stored in `localStorage`:

```typescript
localStorage.setItem('authToken', response.token)
```

**Recommended Improvements**:
1. Use HTTP-only cookies for better security
2. Implement token refresh mechanism
3. Add token expiration handling
4. Use a state management solution (Redux, Zustand) for auth state

## Security Considerations

### Current Implementation
- Client-side form validation
- HTTPS recommended for production
- Password visibility toggle

### Recommended Additions
1. **CSRF Protection**: Add CSRF tokens for form submissions
2. **Rate Limiting**: Implement on backend to prevent brute force
3. **Password Strength Meter**: Visual feedback on password strength
4. **Two-Factor Authentication**: Add 2FA option
5. **Session Management**: Implement proper session handling
6. **Secure Token Storage**: Move to HTTP-only cookies

## Styling

The authentication forms use Tailwind CSS with custom design tokens:

- `bg-dark`: Dark background
- `bg-dark-card`: Card background
- `text-primary`: Primary brand color
- `text-text-gray`: Secondary text color
- `border-[#2A2A2A]`: Border color

## Future Enhancements

1. **Social Login Options**: Add Facebook, Apple, etc.
2. **Magic Link Authentication**: Passwordless login via email
3. **Biometric Authentication**: Face ID, Touch ID on supported devices
4. **Remember Me**: Keep user logged in across sessions
5. **Multi-Factor Authentication**: SMS or authenticator app
6. **Account Recovery**: Multiple recovery options
7. **Email Verification**: Verify email after registration
8. **Progressive Profiling**: Collect additional info after sign-up

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if `NEXT_PUBLIC_API_URL` is set correctly
   - Verify backend server is running
   - Check CORS configuration on backend

2. **Form Validation Not Working**
   - Ensure form inputs have proper `name` attributes
   - Check validation regex patterns

3. **Token Not Persisting**
   - Check browser's localStorage support
   - Verify token is being saved after successful login

## Testing

To test the authentication flow:

1. **Manual Testing**:
   - Try logging in with valid credentials
   - Test with invalid email format
   - Test with wrong password
   - Test password visibility toggle
   - Test forgot password link

2. **Backend Testing**:
   - Ensure backend endpoints return expected responses
   - Test error scenarios (wrong password, user not found)
   - Verify token generation and validation

## Support

For issues or questions about the authentication system, please:
1. Check this documentation
2. Review the component code comments
3. Contact the development team
