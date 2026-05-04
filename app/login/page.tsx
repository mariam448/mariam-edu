"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let supabase
      try {
        supabase = getSupabase()
      } catch (configErr) {
        alert(
          configErr instanceof Error
            ? configErr.message
            : "Configuration Supabase invalide."
        )
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const msg = error.message
        if (/failed to fetch|networkerror|load failed/i.test(msg)) {
          alert(
            "Connexion à Supabase impossible (réseau ou configuration). Vérifiez NEXT_PUBLIC_SUPABASE_URL, la clé anon, et le fichier .env.local, puis redémarrez le serveur de développement."
          )
        } else {
          alert(msg)
        }
        return
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("[Login] signInWithPassword", err)
      const msg = err instanceof Error ? err.message : String(err)
      if (/failed to fetch|networkerror|load failed/i.test(msg)) {
        alert(
          "Échec réseau vers Supabase. Vérifiez l’URL du projet, le pare-feu, et que les variables NEXT_PUBLIC_SUPABASE_* sont chargées (redémarrage de `next dev` requis après .env.local)."
        )
      } else {
        alert(msg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">MathPro Maroc</h1>
          <p className="text-muted-foreground">Plateforme éducative</p>
        </div>

        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="professeur@ecole.ma"
                  required
                  className="bg-background border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="bg-background border-border pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Se souvenir de moi</span>
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  S'inscrire
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          En vous connectant, vous acceptez nos{" "}
          <Link href="#" className="underline hover:text-foreground">
            Conditions d'utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="#" className="underline hover:text-foreground">
            Politique de confidentialité
          </Link>
        </p>
      </div>
    </div>
  )
}
