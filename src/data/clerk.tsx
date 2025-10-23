import React from 'react'
import { ClerkProvider } from '@clerk/clerk-react'

interface Props {
  children: React.ReactNode
}

const frontendApi = import.meta.env.VITE_CLERK_FRONTEND_API || ''

// You can also use publishableKey: VITE_CLERK_PUBLISHABLE_KEY

export default function ClerkProviderWrapper({ children } : Props) {
  return (
    <ClerkProvider frontendApi={frontendApi}>
      {children}
    </ClerkProvider>
  )
}
