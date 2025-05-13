# Next.js Template AI Guide

This document provides guidance for AI assistants (like Claude) working with this Next.js template codebase.

## Project Overview

This is a modern Next.js frontend application using the App Router architecture, with TypeScript, React Query for data fetching, internationalization support, and ShadCN UI components.

## Architecture and Design Patterns

### Directory Structure
- **app/**: Routes and page components (Next.js App Router)
  - **[locale]/**: Internationalization-aware routes
  - **(guest)/** and **(logged)/**: Route grouping by authentication status
- **api/**: API client code and types (organized by domain)
- **components/**: Reusable React components
- **utils/**: Utility functions and helpers
- **providers/**: React Context providers
- **locales/**: Internationalization resources
- **middlewares/**: Custom middleware implementations
- **constants/**: Application constants and routes

### Rendering Strategies
- **Prioritize Server Components** for initial data fetching and static content
- **Client Components** only when necessary (for interactivity, hooks, browser APIs)
- **Static Site Generation (SSG)** with `generateStaticParams` for known paths
- **Server-Side Rendering (SSR)** for dynamic, authenticated content
- **Incremental Static Regeneration (ISR)** with appropriate `revalidate` periods
- Use `notFound()` and `redirect()` for navigation control

### Key Patterns to Follow

1. **Component Structure**
   - Use functional components with hooks
   - Add `'use client';` at the top of client components
   - Organization in `components/` directory:
     - UI components in `components/ui/`
     - Form components in `components/forms/`
     - Form fields in `components/form-fields/`
     - Layout components in `components/layouts/`
     - Reusable feature components grouped by domain

2. **Data Fetching**
   - **Server Components**: Direct `fetch` with Next.js caching options
   - **Client Components**: React Query with custom hooks
   - API client functions in `api/*/client-api.ts` files
   - Server API functions in `api/*/server-api.ts` files with `'use server';` directive
   - Mutations and queries in `api/*/mutations.ts` and `api/*/queries.ts`
   - Use `useQueryMutation` custom hook for mutations with toast notifications

3. **Form Handling**
   - React Hook Form with Zod validation schemas
   - Form components in `components/forms/`
   - Form field components in `components/form-fields/`
   - Connect forms to mutations for submission

4. **Routing**
   - App Router with locale-based routing: `app/[locale]/` structure
   - Route groups for authentication: `(guest)` and `(logged)`
   - Feature-based route groups: `(dashboard)`, `(subscription)`
   - Define routes as constants in `constants/routes.ts`
   - Use `useRouter()` for client-side navigation

5. **Internationalization**
   - Next International library for translations
   - Middleware-based locale detection and routing
   - String resources in `locales/` directory (per language)
   - Server components: `getI18n()` from `@/utils/localization/server`
   - Client components: `useI18n()` from `@/utils/localization/client`

## Core Features

### API Integration
- **Pattern**: Centralized API client in `utils/fetch-api.ts`
- **Server Components**: Direct API calls with `'use server';` directive
- **Client Components**: React Query hooks for data fetching
- **Example**:
  ```typescript
  // Server Component API call
  export async function getProducts() {
    return fetchApi<ProductType[]>({
      method: HTTPMethod.GET,
      endpoint: '/products',
    });
  }
  
  // Client Component with React Query
  export function useProducts() {
    return useQuery({
      queryKey: ProductQueryKeys.all,
      queryFn: getProducts,
    });
  }
  ```

### Authentication
- **Implementation**: Cookie-based JWT authentication
- **State Management**: React Query for user state
- **Login Flow**: See `components/forms/login-form.tsx`
- **Protected Routes**: Route grouping with `(logged)` prefix
- **Sign Out**: Cache clearing and cookie removal

### Form Components
- **Base Components**: `components/form-fields/` with React Hook Form integration
- **Form Wrappers**: `components/forms/` for complete form experiences
- **Validation**: Zod schemas with `zodResolver`
- **Error Handling**: Inline validation errors and API error display

### UI Components
- **Design System**: ShadCN UI (Radix UI + Tailwind)
- **Theming**: Dark/light mode via `next-themes`
- **Custom Components**: Extended in `components/ui/`
- **Layout Elements**: Sidebar, navigation, breadcrumbs in `components/bars/` and `components/layouts/`

## Working with the Codebase

### Adding a New Feature

1. **API Type Definitions**:
   ```typescript
   // src/api/feature/types.ts
   export interface Feature {
     id: string;
     name: string;
   }
   ```

2. **API Routes and Constants**:
   ```typescript
   // src/api/feature/constants.ts
   export enum FeatureRoutes {
     base = '/features',
     getOne = '/features/:id',
   }
   
   export class FeatureQueryKeys {
     static base = 'feature';
     static all = [this.base, 'all'];
     static detail = (id: string) => [this.base, 'detail', id];
   }
   ```

3. **API Client Functions**:
   ```typescript
   // src/api/feature/client-api.ts
   export async function getFeature(id: string): Promise<Feature> {
     return fetchApi<Feature>({
       method: HTTPMethod.GET,
       endpoint: FeatureRoutes.getOne.replace(':id', id),
     });
   }
   
   // src/api/feature/server-api.ts
   'use server';
   
   export async function getFeature(id: string) {
     return fetchApi<Feature>({
       method: HTTPMethod.GET,
       endpoint: FeatureRoutes.getOne.replace(':id', id),
     });
   }
   ```

4. **Query Hooks**:
   ```typescript
   // src/api/feature/queries.ts
   export function useFeature(id: string) {
     return useQuery({
       queryKey: FeatureQueryKeys.detail(id),
       queryFn: () => getFeature(id),
     });
   }
   ```

5. **Mutation Hooks**:
   ```typescript
   // src/api/feature/mutations.ts
   export function useUpdateFeature() {
     const t = useI18n();
     return useQueryMutation({
       mutationFn: updateFeature,
       onSuccessMessage: t('feature.update.success'),
       onErrorMessage: t('feature.update.error'),
     });
   }
   ```

6. **UI Components**:
   ```typescript
   // src/components/feature/feature-card.tsx
   'use client';
   
   import { Feature } from '@/api/feature/types';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   
   export function FeatureCard({ feature }: { feature: Feature }) {
     return (
       <Card>
         <CardHeader>
           <CardTitle>{feature.name}</CardTitle>
         </CardHeader>
         <CardContent>
           {/* Feature content */}
         </CardContent>
       </Card>
     );
   }
   ```

7. **Server Component Page**:
   ```typescript
   // src/app/[locale]/(logged)/features/[id]/page.tsx
   import { FeatureCard } from '@/components/feature/feature-card';
   import { getFeature } from '@/api/feature/server-api';
   import { notFound } from 'next/navigation';
   
   export async function generateStaticParams() {
     // Optional: for static generation of known feature IDs
     const features = await getFeatures();
     return features.map(feature => ({ id: feature.id }));
   }
   
   export default async function FeaturePage({ params }: { params: { id: string } }) {
     try {
       const feature = await getFeature(params.id);
       return <FeatureCard feature={feature} />;
     } catch (error) {
       notFound();
     }
   }
   ```

### State Management
- **Server State**: React Query with defined query keys
- **UI State**: React Context for global UI state
- **Component State**: Local state with `useState` and other hooks
- **Query Client**: Server/client unified query client in `utils/query-client.ts`

### Styling
- **Tailwind CSS**: Utility-first approach
- **ShadCN UI**: Component-based styling with Tailwind and Radix primitives
- **Class Variance Authority**: For component variants
- **Dark/Light Mode**: Theme support via `next-themes`

### Adding New Routes
1. Create directories in `app/[locale]/` following the App Router pattern
2. Use route groups for organization (`(logged)`, `(guest)`, etc.)
3. Implement the page as a Server Component by default
   ```typescript
   // app/[locale]/(logged)/products/page.tsx
   import { ProductsList } from '@/components/products/products-list';
   import { getProducts } from '@/api/products/server-api';
   import { getI18n } from '@/utils/localization/server';
   
   export default async function ProductsPage() {
     const products = await getProducts();
     const t = await getI18n();
     return (
       <>
         <h1>{t('products.title')}</h1>
         <ProductsList products={products} />
       </>
     );
   }
   ```
4. Add static generation for pages with predictable paths
5. Use layout.tsx files for shared layouts between related routes
6. Update navigation in menus and sidebar components

## Code Conventions

### Naming Conventions
- **Files**: kebab-case.tsx (e.g., `feature-card.tsx`)
- **Components**: PascalCase (e.g., `FeatureCard`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useFeature`)
- **Types/Interfaces**: PascalCase (e.g., `FeatureProps`)
- **Constants**: PascalCase class with static members (e.g., `FeatureRoutes`, `FeatureQueryKeys`)

### Component Organization
- Group related components in directories by feature
- Create domain-specific subdirectories
- Split complex features into multiple components
- Keep components focused on a single responsibility

### TypeScript Best Practices
- Strong typing for all props, state, and API responses
- Create interfaces for component props
- Use Zod for runtime validation
- Define types in dedicated files (e.g., `types.ts`)
- Use type inference with React Hook Form: `z.infer<typeof formSchema>`

### Error Handling
- Server components: try/catch with `notFound()` or error component
- Client components: React Query error states
- Form validation: Zod validation with React Hook Form
- API errors: Custom error handling in `fetchApi` with `AppException`
- Display user-friendly error messages with toasts

## Internationalization

### Adding New Strings
1. Add keys to `locales/en.ts` and other language files
2. Use nested objects for organization
3. Access in server components: `const t = await getI18n(); t('path.to.string')`
4. Access in client components: `const t = useI18n(); t('path.to.string')`

### Supporting New Languages
1. Add a new file in `locales/` directory
2. Add the language to client and server providers
3. Follow the same structure as existing language files

## Authentication & Authorization

### Auth Workflow
1. User authenticates via login or signup forms
2. JWT stored in secure, HTTP-only cookie
3. Auth state managed via React Query with custom hooks
4. Route groups control access to protected content

### Protected Routes
- App Router groups in `app/[locale]/(logged)/`
- Middleware for authenticated routes
- Client-side redirects based on auth state

## Data Fetching

### Server-Side Data Fetching
- **Server Components**: Use dedicated server API functions
- All server API functions in `api/*/server-api.ts` start with `'use server';` directive
- Use the same `fetchApi` utility for both client and server requests
- Implement error handling with `try/catch` or `notFound()` redirects
- Example of server API function:
  ```typescript
  // src/api/stripe/server-api.ts
  'use server';
  
  import { fetchApi, HTTPMethod } from '@/utils/fetch-api';
  import { StripeRoutes } from './constants';
  
  export async function getStripeProducts() {
    return fetchApi<Stripe.Product[]>({
      method: HTTPMethod.GET,
      endpoint: StripeRoutes.products,
    });
  }
  ```

### Client-Side Data Fetching with Query Keys
- **Pattern**: Query keys are defined as static class properties in `constants.ts` files
- **Organization**: Each domain has its own QueryKeys class
- **Format**: Keys are organized as arrays: `[baseKey, entityName, ...params]`
- **Dynamic Keys**: Functions that return arrays for parameterized queries
- **Example**:
  ```typescript
  export class AuthQueryKeys {
    static base = 'auth';
    static user = [this.base, 'user'];
  }
  
  export class FeatureQueryKeys {
    static base = 'feature';
    static all = [this.base, 'all'];
    static detail = (id: string) => [this.base, 'detail', id];
  }
  ```

### React Query Patterns
- Custom query client with default options in `utils/query-client.ts`
- `useQuery` for read operations with appropriate query keys
- Custom `useQueryMutation` hook for write operations with toast notifications
- Optimistic updates for better UX
- Query invalidation to update related data after mutations
- Infinite queries for paginated data

### Custom Hooks
- Feature-specific hooks in `api/*/queries.ts` and `api/*/mutations.ts`
- Reference query keys from constants files
- Encapsulate complex data fetching logic
- Add toast notifications via `useQueryMutation`

## Forms

### Form Creation Pattern
1. Define Zod schema for validation
   ```typescript
   const formSchema = z.object({
     email: z.string().email().min(1, { message: 'Email is required.' }),
     password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
   });
   
   type FormValues = z.infer<typeof formSchema>;
   ```

2. Set up React Hook Form with Zod resolver
   ```typescript
   const form = useForm<FormValues>({
     resolver: zodResolver(formSchema),
     defaultValues: { email: '', password: '' },
   });
   ```

3. Use form field components
   ```typescript
   <TextFormField
     control={form.control}
     name="email"
     label={t('email.label')}
     placeholder={t('email.placeholder')}
     required
   />
   ```

4. Handle submission with mutations
   ```typescript
   const mutation = useCreateItem();
   
   const onSubmit = async (data: FormValues) => {
     try {
       await mutation.mutateAsync(data);
       // Handle success
     } catch (error) {
       // Error handled by mutation
     }
   };
   ```

### Error Handling
- Form validation errors shown inline
- API errors displayed with toast notifications
- Loading states with spinner components
- Disabled form controls during submission

## UI Components

### Using ShadCN Components
- Import from `@/components/ui/`
- Follow the component API in their implementation
- Extend with additional props as needed
- Style with Tailwind utility classes

### Creating Custom Components
1. Follow the ShadCN pattern for consistency
2. Use Tailwind for styling
3. Support dark/light modes with appropriate classes
4. Make components responsive with mobile-first approach
5. Use class-variance-authority for variants

## Performance Optimizations

### React Query Optimizations
- Set appropriate `staleTime` and `cacheTime` values
- Use query keys consistently for proper cache management
- Implement selective revalidation when needed
- Prefetch critical data with `prefetchQuery`

### Next.js Optimization Techniques
- Use proper rendering strategy for each route
- Implement route segments for code splitting
- Optimize images with Next.js Image component
- Leverage static generation where possible
- Implement ISR for semi-dynamic content
- Use dynamic imports for heavy components

### Bundle Optimization
- Avoid large dependencies
- Use dynamic imports for code splitting
- Prefer smaller, focused components
- Leverage tree shaking with proper exports