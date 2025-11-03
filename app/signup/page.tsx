"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    try {
      setLoading(true)
      setError(null)
      await createUser(email, password)
      setSuccess(true)
      setTimeout(() => {
        router.replace("/login")
      }, 2000)
    } catch (err: any) {
      setError(err?.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-svh flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Account Created!</CardTitle>
            <CardDescription>Redirecting to login...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-svh flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="email">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="password">Password</label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="confirmPassword">Confirm Password</label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

