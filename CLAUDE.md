1. Architectural Philosophy (Feature-Driven)
Strict Feature Isolation: All domain logic must reside within src/features/<feature-name>/. Do not cross-contaminate features. If multiple features need the same logic or component, move it to src/shared/.

Feature Internal Structure: Every feature must follow this internal taxonomy where applicable:

/api or /services: API calls and data fetching logic (e.g., past-papers/services/papersService.ts).

/components: Feature-specific UI components.

/hooks: Feature-specific custom React hooks.

/slices: Redux state slices specific to this feature.

/types: TypeScript definitions exclusively for this domain.

/utils: Helper functions only needed within this feature.

2. Next.js App Router Conventions
Routing Directory (src/app/): Use route groups (auth), (public), and (user) to manage layouts without affecting the URL structure.

Thin Pages: page.tsx and layout.tsx files should act only as entry points and composition layers. Keep them as clean as possible by importing complex UI components and hooks from src/features/.

Server vs. Client Components: Default to Server Components where possible. Only add "use client" at the top of feature components or shared components when interactivity, hooks (useState, useEffect), or browser APIs are required.

3. Data Fetching & State Management
HTTP Client: All external API requests MUST go through the centralized Axios/Fetch client defined in src/core/http/client.ts and respect interceptors (interceptors.ts).

Querying: Utilize the established Query setup (src/query/queryClient.ts and src/query/keys.ts) for asynchronous state and caching (likely React Query/TanStack Query).

Global vs Local State: * Use Redux (src/store/) only for truly global state (e.g., ui.slice.ts, authentication tokens).

Use local state (useState) or URL search parameters for component-level UI state (like active tabs or search inputs).

4. Shared UI & Styling
Tailwind CSS First: Use Tailwind CSS utility classes for all styling. Do not use inline styles (style={{}}) unless dynamically calculating a value (like a progress bar percentage).

Shared Components (src/shared/components/ui/): Always check the shared UI folder for foundational elements (button.tsx, input.tsx, etc.) before creating new ones. These look to be standard, reusable primitives (likely Shadcn UI or similar).

Theme Support: Ensure all new components support dark/light modes seamlessly, hooking into src/shared/components/ThemeToggle.tsx.

5. Type Safety (TypeScript)
Strict Typing: No any types. Everything must be strongly typed.

Global vs Feature Types: * Put domain-specific models in their respective feature folders (src/features/<name>/types/).

Put globally shared models (e.g., standard API responses, User objects) in src/types/index.ts.

Environment Variables: Reference src/env.d.ts for strictly typed environment variables.

6. Specific Domain Rules (Based on existing codebase)
WebSockets: When working on Chatbot or Payments, utilize the existing custom WebSocket hooks and slices (useWebSocket.ts, websocket.slice.ts) rather than establishing raw connections in components.

Authentication: Rely on src/features/auth/hooks/useAuth.ts and the AuthenticationProvider for handling protected routes and user sessions. Do not reinvent auth checks on individual pages.

Error Handling: Use the centralized error handler (src/shared/utils/errorHandler.ts) for catching and formatting API errors, rather than writing custom try/catch console logs in every component.