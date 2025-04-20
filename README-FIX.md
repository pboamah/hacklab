# Fix for Headers API Issue

The project was encountering build errors because `next/headers` APIs were being used in components that might be rendered in the Pages Router, which doesn't support Server Components.

## How to Fix

1. Use the compatibility layers provided:
   - `lib/headers-compat.ts` - For headers and cookies functionality
   - `lib/auth-compat.ts` - For auth functionality

2. For any component that imports from 'next/headers', modify it to use these compatibility functions instead:

   BEFORE:
   \`\`\`tsx
   import { cookies, headers } from 'next/headers';
   
   export function MyComponent() {
     const cookieStore = cookies();
     const headersList = headers();
     const myCookie = cookieStore.get('my-cookie');
     const myHeader = headersList.get('x-my-header');
     // ...
   }
   \`\`\`

   AFTER:
   \`\`\`tsx
   import { getCookieCompat, getHeaderCompat } from '../lib/headers-compat';
   
   export function MyComponent() {
     const myCookie = getCookieCompat('my-cookie');
     const myHeader = getHeaderCompat('x-my-header');
     // ...
   }
   \`\`\`

3. Make sure any component that uses these APIs is marked with 'use client' directive if it needs to be rendered on the client side.

4. For additional server-side functionality, consider using getServerSideProps in Pages Router pages.

## MobX Integration

The project now uses MobX for state management, including for headers and authentication state. The stores are:

- `headersStore` - For managing headers and cookies
- `hackathonStore` - For hackathon-related state
- `jobStore` - For job-related state
- `adminStore` - For admin-related state
- `reactionStore` - For reaction-related state

To use these stores in your components:

\`\`\`tsx
import { useStores } from '../lib/store/store-provider';

export function MyComponent() {
  const { headersStore, hackathonStore } = useStores();
  
  // Use the stores...
  const cookie = headersStore.getCookie('my-cookie');
  
  return (
    // JSX...
  );
}
