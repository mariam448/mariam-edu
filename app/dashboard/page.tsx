import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { WorksheetGenerator } from "@/components/dashboard/worksheet-generator"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de travail MathPro
        </p>
      </div>

      <StatsCards />

      <WorksheetGenerator />
    </div>
  )
}
