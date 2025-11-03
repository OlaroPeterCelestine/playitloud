import { app } from "@/lib/firebase"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth"

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


