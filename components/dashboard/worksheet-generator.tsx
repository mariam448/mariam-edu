"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { LevelSelector } from "./level-selector"
import { WorksheetDisplay } from "./worksheet-display"
import { Sparkles, FileText } from "lucide-react"
import myData from "./pedagogical_data.json";

// Sample generated content for demo
const sampleWorksheet = {
  title: "Les Équations du Premier Degré",
  level: "3AC",
  objectives: [
    "Comprendre la notion d'équation du premier degré",
    "Résoudre des équations de la forme ax + b = c",
    "Appliquer les propriétés d'égalité"
  ],
  course: `
## Définition

Une **équation du premier degré** à une inconnue est une équation qui peut s'écrire sous la forme :

$$ax + b = 0$$

où $a$ et $b$ sont des nombres réels avec $a \\neq 0$.

## Propriétés fondamentales

### Propriété 1 : Addition/Soustraction
On peut ajouter ou soustraire le même nombre aux deux membres d'une équation sans changer ses solutions.

$$\\text{Si } a = b \\text{, alors } a + c = b + c$$

### Propriété 2 : Multiplication/Division
On peut multiplier ou diviser les deux membres d'une équation par un même nombre non nul.

$$\\text{Si } a = b \\text{ et } c \\neq 0 \\text{, alors } ac = bc$$

## Méthode de résolution

Pour résoudre $ax + b = c$ :

1. Isoler le terme contenant $x$ : $ax = c - b$
2. Diviser par le coefficient de $x$ : $x = \\frac{c - b}{a}$

## Exemple

Résoudre l'équation : $3x + 7 = 22$

**Solution :**
$$3x + 7 = 22$$
$$3x = 22 - 7$$
$$3x = 15$$
$$x = \\frac{15}{3}$$
$$x = 5$$

Vérification : $3(5) + 7 = 15 + 7 = 22$ ✓
`,
  exercises: [
    {
      id: 1,
      question: "Résoudre l'équation : $2x + 5 = 13$",
      difficulty: "Facile"
    },
    {
      id: 2,
      question: "Résoudre l'équation : $4x - 8 = 2x + 6$",
      difficulty: "Moyen"
    },
    {
      id: 3,
      question: "Résoudre l'équation : $\\frac{x + 3}{2} = \\frac{2x - 1}{3}$",
      difficulty: "Difficile"
    }
  ]
}

export function WorksheetGenerator() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [courseName, setCourseName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [worksheet, setWorksheet] = useState<typeof sampleWorksheet | null>(null)

 const handleGenerate = async () => {
  if (!selectedLevel || !courseName.trim()) return;
  setIsGenerating(true);

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson: courseName,
        level: selectedLevel,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      // إذا نجح الـ API، سيتم تحديث الواجهة
      setWorksheet({
        title: courseName,
        level: selectedLevel,
        course: data.content,
        objectives: ["Généré avec succès par Gemini API"],
        exercises: [],
      });
    } else {
      // سيظهر لكِ تنبيه بالخطأ القادم من السيرفر
      alert("خطأ من الـ API: " + data.message);
    }
  } catch (err) {
    alert("فشل الاتصال بالسيرفر. تأكدي من أن الموقع مرفوع على Vercel.");
  } finally {
    setIsGenerating(false);
  }
};
  return (
    <div className="space-y-6">
      {/* Level Selector */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <LevelSelector
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
          />
        </CardContent>
      </Card>

      {/* Course Input & Generate Button */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            Créer une nouvelle fiche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="courseName" className="text-sm font-medium text-foreground">
              Nom du cours
            </label>
            <Input
              id="courseName"
              placeholder="Ex: Les équations du premier degré"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!selectedLevel || !courseName.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 disabled:opacity-50 gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Spinner className="h-4 w-4" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer la fiche
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Worksheet Display */}
      { (worksheet || sampleWorksheet) && <WorksheetDisplay worksheet={worksheet || sampleWorksheet} /> }
    </div>
  )
}
