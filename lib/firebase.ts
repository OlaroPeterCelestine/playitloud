// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAnalytics, Analytics } from "firebase/analytics"
import { getFirestore, Firestore } from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq8p7f-0gokiALj6DlBsF-l3lunEUw7Sk",
  authDomain: "playitloud-1e8fe.firebaseapp.com",
  projectId: "playitloud-1e8fe",
  storageBucket: "playitloud-1e8fe.firebasestorage.app",
  messagingSenderId: "547064693002",
  appId: "1:547064693002:web:bc750b0c3ec51153c53af3",
  measurementId: "G-4PDMHWGK48"
}

// Initialize Firebase
let app: FirebaseApp
let analytics: Analytics | null = null
let db: Firestore

// Initialize Firebase app (works on both server and client)
app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firestore
db = getFirestore(app)

// Initialize Analytics only on client side
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    // Analytics initialization failed silently
  }
}

export { app, analytics, db }

