"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

function extractNameFromEmail(email: string): string {
  const localPart = (email.split("@")[0] || "").trim()
  if (!localPart) return "Utilisateur"

  const cleaned = localPart.replace(/[.\-_]+/g, " ")
  const words = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

  return words.length ? words.join(" ") : "Utilisateur"
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const fullName = extractNameFromEmail(email)
      console.log("[Register] extractNameFromEmail:", email, "=>", fullName)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        // Si l'utilisateur existe déjà, on ne crée pas de doublon, on s'arrête avec un message clair.
        alert(error.message)
        return
      }

      const user = data?.user
      if (user) {
        // Upsert dans la table profiles (évite les doublons si le profil existe déjà)
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              full_name: fullName,
              email,
            },
            { onConflict: "id" }
          )

        if (profileError) {
          console.error("[Register] Supabase profiles upsert error:", profileError)
        }
      }

      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
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
            <CardTitle className="text-foreground">Créer un compte</CardTitle>
            <CardDescription>
              Rejoignez MathPro et commencez à créer vos fiches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    Prénom
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Mohammed"
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Nom
                  </label>
                  <Input
                    id="lastName"
                    placeholder="El Alaoui"
                    required
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email professionnel
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
                <label htmlFor="school" className="text-sm font-medium text-foreground">
                  Établissement
                </label>
                <Input
                  id="school"
                  placeholder="Collège Ibn Rochd"
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="level" className="text-sm font-medium text-foreground">
                  Niveaux enseignés
                </label>
                <Select>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Sélectionnez les niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ac">1AC uniquement</SelectItem>
                    <SelectItem value="2ac">2AC uniquement</SelectItem>
                    <SelectItem value="3ac">3AC uniquement</SelectItem>
                    <SelectItem value="1ac-2ac">1AC et 2AC</SelectItem>
                    <SelectItem value="2ac-3ac">2AC et 3AC</SelectItem>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                  </SelectContent>
                </Select>
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
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères avec une majuscule et un chiffre
                </p>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="rounded border-border mt-1" />
                <span className="text-sm text-muted-foreground">
                  J'accepte les{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Politique de confidentialité
                  </Link>
                </span>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
              >
                {isLoading ? "Création..." : "Créer mon compte"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Déjà inscrit ?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
