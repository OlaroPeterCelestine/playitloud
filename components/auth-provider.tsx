"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { subscribeToAuth } from "@/lib/auth"

type AuthContextValue = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToAuth((u) => {
      setUser(u)
      setLoading(false)

      // Keep a simple session cookie for middleware checks
      try {
        if (typeof document !== "undefined") {
          if (u) {
            // 7 days
            document.cookie = `fb_session=1; path=/; max-age=${7 * 24 * 60 * 60}`
          } else {
            document.cookie = "fb_session=; path=/; max-age=0"
          }
        }
      } catch {}
    })
    return () => unsub()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


