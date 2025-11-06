"use client"

import * as React from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { logOut, clearSession } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"

function DashboardHeader() {
  const { toggleSidebar, isMobile } = useSidebar()
  const router = useRouter()
  const { user } = useAuth()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex flex-1 items-center gap-2">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <Input
          type="search"
          placeholder="Search..."
          className="max-w-sm hidden sm:flex"
        />
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Bell className="h-4 w-4" />
          </Button>
          {user && (
            <Button
              variant="outline"
              onClick={async () => {
                await logOut()
                clearSession()
                router.replace("/login")
              }}
              className="text-sm"
            >
              Sign out
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

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
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

