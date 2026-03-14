import { Card, CardContent } from "@/components/ui/card"
import { FileText, PenTool, Clock, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Fiches Générées",
    value: "47",
    icon: FileText,
    trend: "+12%",
    description: "ce mois",
  },
  {
    title: "Exercices Créés",
    value: "156",
    icon: PenTool,
    trend: "+8%",
    description: "ce mois",
  },
  {
    title: "Temps Gagné",
    value: "24h",
    icon: Clock,
    trend: "+18%",
    description: "ce mois",
  },
  {
    title: "Productivité",
    value: "+35%",
    icon: TrendingUp,
    trend: "",
    description: "vs mois dernier",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {stat.trend && (
                <span className="text-xs font-medium text-secondary">
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">
                {stat.title} <span className="text-xs">({stat.description})</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
