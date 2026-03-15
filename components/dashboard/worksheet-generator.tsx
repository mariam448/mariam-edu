"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { LevelSelector } from "./level-selector"
import { WorksheetDisplay } from "./worksheet-display"
import { Sparkles, FileText } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import myData from "./pedagogical_data.json";

// Définition des cours par niveau
const coursesByLevel: Record<string, string[]> = {
  "1AC": ["Les équations", "Nombres décimaux"],
  "2AC": ["Équations et inéquations", "Triangle rectangle"],
  "3AC": ["Théorème de Thalès", "Théorème de Pythagore"],
};

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

  // Liste des cours disponibles basée sur le niveau sélectionné
  const availableCourses = selectedLevel ? coursesByLevel[selectedLevel] || [] : []

  // Réinitialiser le cours sélectionné quand le niveau change
  useEffect(() => {
    setCourseName("")
  }, [selectedLevel])

 const handleGenerate = async () => {
  if (!selectedLevel || !courseName) return;
  setIsGenerating(true);

  const payload = {
    lesson: courseName,
    level: selectedLevel,
  };

  try {
    console.log("[WorksheetGenerator] Sending request to /api/generate with body:", payload);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("[WorksheetGenerator] Response status:", response.status);

    let data: any = null;
    try {
      data = await response.json();
      console.log("[WorksheetGenerator] Response JSON:", data);
    } catch (parseError) {
      console.error("[WorksheetGenerator] Failed to parse JSON response:", parseError);
    }

    console.log("Status:", response.status)
    console.log("Data:", data)

    if (!response.ok || !data) {
      const message = data?.message || `HTTP ${response.status}`;
      alert(`Erreur API (frontend): ${message}`);
      return;
    }

    const content = (data?.content ?? "").toString();
    const status = (data?.status ?? "").toString();

    if (status === "success") {
      setWorksheet({
        title: courseName,
        level: selectedLevel,
        course: content,
        objectives: ["Généré avec succès par Gemini API"],
        exercises: [],
      });
    } else {
      alert(`Erreur API (backend): ${data?.message || "Inconnue"}`);
    }
  } catch (err) {
    console.error("[WorksheetGenerator] Fetch error:", err);
    alert("Erreur réseau ou serveur. Vérifie la console du navigateur pour plus de détails.");
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
            <Select
              disabled={!selectedLevel}
              value={courseName}
              onValueChange={setCourseName}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Sélectionnez un cours" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!selectedLevel || !courseName || isGenerating}
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
