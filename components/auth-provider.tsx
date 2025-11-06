"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { subscribeToAuth, createSession, clearSession } from "@/lib/auth"

type AuthContextValue = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToAuth(async (u) => {
      setUser(u)
      setLoading(false)

      // Create or clear session when user state changes
      try {
        if (typeof document !== "undefined") {
          if (u) {
            // Create proper session with Firebase ID token
            await createSession(u)
            
            // Set up token refresh (Firebase tokens expire after 1 hour)
            // Refresh token every 50 minutes to keep session active
            const refreshInterval = setInterval(async () => {
              try {
                await createSession(u)
              } catch (error) {
                // If refresh fails, clear interval
                clearInterval(refreshInterval)
              }
            }, 50 * 60 * 1000) // 50 minutes
            
            // Clean up interval on logout
            return () => clearInterval(refreshInterval)
          } else {
            // Clear session when user logs out
            clearSession()
          }
        }
      } catch (error) {
        // If session creation fails, still set session flag
        if (u) {
          const expires = new Date()
          expires.setDate(expires.getDate() + 7)
          document.cookie = `fb_session=1; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
        } else {
          clearSession()
        }
      }
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


