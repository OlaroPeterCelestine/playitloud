"use client"

import { app, analytics } from "@/lib/firebase"

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  // Firebase is initialized silently
  return <>{children}</>
}

