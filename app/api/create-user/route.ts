import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createUserWithEmailAndPassword } from "firebase/auth"

export async function POST() {
  try {
    const email = "albert@nrgug.radio"
    const password = "123456"
    
    // Try to create the user
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return NextResponse.json({ 
        success: true, 
        message: `User created successfully!`,
        credentials: { email, password }
      })
    } catch (error: any) {
      // If user already exists, that's fine
      if (error.code === "auth/email-already-in-use") {
        return NextResponse.json({ 
          success: true, 
          message: "User already exists",
          credentials: { email, password }
        })
      }
      throw error
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Failed to create user" 
    }, { status: 500 })
  }
}

