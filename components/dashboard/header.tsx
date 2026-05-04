"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  LogOut, 
  User, 
  Menu,
  LayoutDashboard,
  Users,
  Archive,
  Mail,
  GraduationCap
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase"

const navItems = [
  { title: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { title: "Mes Classes", href: "/dashboard/classes", icon: Users },
  { title: "Archives", href: "/dashboard/archives", icon: Archive },
  { title: "Contact", href: "/dashboard/contact", icon: Mail },
]

function getCurrentDate() {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  
  const now = new Date()
  const dayName = days[now.getDay()]
  const day = now.getDate()
  const month = months[now.getMonth()]
  const year = now.getFullYear()
  
  return `${dayName} ${day} ${month} ${year}`
}

function extractNameFromEmail(email: string | null | undefined): string {
  if (!email) return "Professeur"
  const localPart = (email.split("@")[0] || "").trim()
  if (!localPart) return "Professeur"
  // Remplace les points par des espaces et ne garde que le premier mot (prénom)
  const cleaned = localPart.replace(/[.]+/g, " ")
  const firstWord = cleaned
    .split(/\s+/)
    .filter(Boolean)[0]

  if (!firstWord) return "Professeur"

  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase()
}

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const currentDate = getCurrentDate()
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadUser = async () => {
      try {
        const supabase = getSupabase()
        // Prefer getSession first — avoids AuthSessionMissingError before cookies are hydrated
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession()
        if (sessionError) {
          console.error("[DashboardHeader] getSession error:", sessionError)
        }
        if (!sessionData?.session?.user) {
          router.replace("/login")
          return
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError) {
          console.error("[DashboardHeader] getUser error:", userError)
          router.replace("/login")
          return
        }
        if (!user) {
          router.replace("/login")
          return
        }

        const email = user.email ?? null
        const nameFromEmail = extractNameFromEmail(email)
        console.log("[DashboardHeader] extractNameFromEmail:", email, "=>", nameFromEmail)
        if (isMounted) {
          setDisplayName(nameFromEmail)
        }
      } catch (e) {
        console.error("[DashboardHeader] auth / Supabase init:", e)
        router.replace("/login")
      } finally {
        if (isMounted) {
          setIsLoadingUser(false)
        }
      }
    }
    loadUser()
    return () => {
      isMounted = false
    }
  }, [router])

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">MathPro</span>
          </div>
          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Date */}
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-foreground">{currentDate}</p>
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <span className="hidden md:block text-sm text-muted-foreground min-w-[180px]">
          {isLoadingUser ? (
            <span className="inline-block animate-pulse bg-muted rounded px-4 py-1 h-[20px]" />
          ) : (
            <>
              Bienvenue,{" "}
              <span className="font-medium text-foreground">
                {displayName ? `Prof. ${displayName}` : "Professeur"}
              </span>
            </>
          )}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary">
              <User className="h-4 w-4 text-primary-foreground" />
              <span className="sr-only">Menu utilisateur</span>
            </Button>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">
                {displayName ? `Prof. ${displayName}` : "Professeur"}
              </p>
              {/* Email réel optionnel : peut être récupéré via getUser si besoin */}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
              onSelect={async (e) => {
                e.preventDefault()
                try {
                  const supabase = getSupabase()
                  await supabase.auth.signOut()
                } catch (err) {
                  console.error("[DashboardHeader] signOut:", err)
                }
                router.replace("/login")
                router.refresh()
              }}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
