import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Download, Eye, Search, Calendar } from "lucide-react"

const archives = [
  {
    id: 1,
    title: "Les équations du premier degré",
    level: "3AC",
    date: "14 Mars 2026",
    type: "Cours",
  },
  {
    id: 2,
    title: "Les nombres relatifs - Addition",
    level: "1AC",
    date: "13 Mars 2026",
    type: "Exercices",
  },
  {
    id: 3,
    title: "Le théorème de Pythagore",
    level: "2AC",
    date: "12 Mars 2026",
    type: "Cours",
  },
  {
    id: 4,
    title: "Les fractions - Opérations",
    level: "1AC",
    date: "11 Mars 2026",
    type: "Évaluation",
  },
  {
    id: 5,
    title: "Les puissances",
    level: "3AC",
    date: "10 Mars 2026",
    type: "Cours",
  },
  {
    id: 6,
    title: "La proportionnalité",
    level: "2AC",
    date: "9 Mars 2026",
    type: "Exercices",
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "Cours":
      return "bg-primary/10 text-primary border-primary/20"
    case "Exercices":
      return "bg-secondary/10 text-secondary border-secondary/20"
    case "Évaluation":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function ArchivesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Archives</h1>
        <p className="text-muted-foreground">Retrouvez toutes vos fiches générées</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une fiche..."
            className="pl-10 bg-background border-border"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date
          </Button>
          <Button variant="outline">Niveau</Button>
          <Button variant="outline">Type</Button>
        </div>
      </div>

      {/* Archives List */}
      <div className="space-y-3">
        {archives.map((archive) => (
          <Card key={archive.id} className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">{archive.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                        {archive.level}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getTypeColor(archive.type)}`}>
                        {archive.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{archive.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
