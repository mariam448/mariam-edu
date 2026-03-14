import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Plus, BookOpen } from "lucide-react"

const classes = [
  {
    id: 1,
    name: "1AC - Groupe A",
    students: 32,
    level: "1AC",
    lastActivity: "Il y a 2 heures",
  },
  {
    id: 2,
    name: "1AC - Groupe B",
    students: 28,
    level: "1AC",
    lastActivity: "Il y a 1 jour",
  },
  {
    id: 3,
    name: "2AC - Groupe A",
    students: 30,
    level: "2AC",
    lastActivity: "Il y a 3 heures",
  },
  {
    id: 4,
    name: "3AC - Groupe A",
    students: 35,
    level: "3AC",
    lastActivity: "Il y a 5 heures",
  },
]

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Classes</h1>
          <p className="text-muted-foreground">Gérez vos classes et vos élèves</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" />
          Nouvelle classe
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id} className="border-border hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-primary text-primary">
                  {cls.level}
                </Badge>
                <span className="text-xs text-muted-foreground">{cls.lastActivity}</span>
              </div>
              <CardTitle className="text-lg text-card-foreground">{cls.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{cls.students} élèves</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">12 fiches</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
