import { app } from "@/lib/firebase"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, type User, getIdToken } from "firebase/auth"

export const auth = getAuth(app)

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function createUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function logOut() {
  return signOut(auth)
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

// Get and store Firebase ID token for session
export async function createSession(user: User) {
  try {
    const token = await getIdToken(user)
    // Store token in cookie with HttpOnly-like security (client-side)
    const expires = new Date()
    expires.setDate(expires.getDate() + 7) // 7 days
    document.cookie = `fb_auth_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
    document.cookie = `fb_session=1; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
    return token
  } catch (error) {
    console.error("Failed to create session:", error)
    throw error
  }
}

// Clear session
export function clearSession() {
  document.cookie = "fb_auth_token=; path=/; max-age=0"
  document.cookie = "fb_session=; path=/; max-age=0"
}


