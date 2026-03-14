"use client"

import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface LevelSelectorProps {
  selectedLevel: string | null
  onSelectLevel: (level: string) => void
}

const levels = [
  {
    id: "1AC",
    title: "1ère Année Collège",
    short: "1AC",
    description: "Programme de première année",
  },
  {
    id: "2AC",
    title: "2ème Année Collège",
    short: "2AC",
    description: "Programme de deuxième année",
  },
  {
    id: "3AC",
    title: "3ème Année Collège",
    short: "3AC",
    description: "Programme de troisième année",
  },
]

export function LevelSelector({ selectedLevel, onSelectLevel }: LevelSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Sélectionnez le niveau</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelectLevel(level.id)}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-xl p-6 transition-all duration-200 border-2",
              selectedLevel === level.id
                ? "border-transparent bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg"
                : "border-border bg-card text-card-foreground hover:border-primary/50 hover:shadow-md"
            )}
          >
            <div
              className={cn(
                "mb-3 flex h-12 w-12 items-center justify-center rounded-full",
                selectedLevel === level.id
                  ? "bg-primary-foreground/20"
                  : "bg-gradient-to-br from-primary/10 to-secondary/10"
              )}
            >
              <BookOpen
                className={cn(
                  "h-6 w-6",
                  selectedLevel === level.id ? "text-primary-foreground" : "text-primary"
                )}
              />
            </div>
            <span className="text-2xl font-bold">{level.short}</span>
            <span
              className={cn(
                "mt-1 text-sm",
                selectedLevel === level.id
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}
            >
              {level.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
