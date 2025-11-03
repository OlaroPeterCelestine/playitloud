"use client"

import * as React from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { logOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (!loading && !user) {
    if (typeof window !== "undefined") {
      router.replace("/login")
    }
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex flex-1 gap-2">
            <Input
              type="search"
              placeholder="Search..."
              className="max-w-sm"
            />
            <Button variant="outline" size="icon" className="ml-auto">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            {user && (
              <Button
                variant="outline"
                onClick={async () => {
                  await logOut()
                  document.cookie = "fb_session=; Max-Age=0; path=/";
                  router.replace("/login")
                }}
              >
                Sign out
              </Button>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

