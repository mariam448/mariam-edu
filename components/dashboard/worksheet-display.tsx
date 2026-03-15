"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, Copy, Check, Target, BookOpen, PenTool } from "lucide-react"
import { useState, useEffect } from "react"

interface Worksheet {
  title: string
  level: string
  objectives: string[]
  course: string
  exercises: {
    id: number
    question: string
    difficulty: string
  }[]
}

interface WorksheetDisplayProps {
  worksheet: Worksheet
}

// Simple LaTeX renderer component
function LatexContent({ content }: { content: string }) {
  const [mounted, setMounted] = useState(false)
  const shouldRenderMath = typeof content === "string" && content.includes("$")

  useEffect(() => {
    setMounted(true)
    // Load KaTeX if not already loaded
    if (!shouldRenderMath) return

    if (typeof window !== "undefined" && !document.getElementById("katex-css")) {
      const link = document.createElement("link")
      link.id = "katex-css"
      link.rel = "stylesheet"
      link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
      script.async = true
      document.head.appendChild(script)

      const autoRender = document.createElement("script")
      autoRender.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
      autoRender.async = true
      autoRender.onload = () => {
        if ((window as unknown as { renderMathInElement?: (el: Element, opts: object) => void }).renderMathInElement) {
          (window as unknown as { renderMathInElement: (el: Element, opts: object) => void }).renderMathInElement(document.body, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
            ],
          })
        }
      }
      document.head.appendChild(autoRender)
    }
  }, [])

  useEffect(() => {
    if (!shouldRenderMath) return
    if (mounted && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        try {
          const renderFn = (window as unknown as { renderMathInElement?: (el: Element, opts: object) => void }).renderMathInElement
          if (renderFn) {
            renderFn(document.body, {
              delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
              ],
            })
          }
        } catch (error) {
          console.warn("[LatexContent] KaTeX render error:", error)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [mounted, content, shouldRenderMath])

  // Process markdown-like formatting
  const processContent = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        // Headers
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-bold text-foreground mt-6 mb-3">
              {line.replace("## ", "")}
            </h2>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">
              {line.replace("### ", "")}
            </h3>
          )
        }
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return (
            <p key={i} className="ml-4 text-foreground leading-relaxed">
              {line}
            </p>
          )
        }
        // Empty lines
        if (line.trim() === "") {
          return <br key={i} />
        }
        // Bold text
        const boldProcessed = line.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold">$1</strong>'
        )
        return (
          <p
            key={i}
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: boldProcessed }}
          />
        )
      })
  }

  if (!mounted) {
    return <div className="animate-pulse bg-muted rounded h-40" />
  }

  return <div className="prose prose-sm max-w-none">{processContent(content)}</div>
}

export function WorksheetDisplay({ worksheet }: WorksheetDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(worksheet.course)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "facile":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "moyen":
        return "bg-primary/10 text-primary border-primary/20"
      case "difficile":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="border-border overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-primary text-primary">
                {worksheet.level}
              </Badge>
              <Badge variant="outline" className="border-secondary text-secondary">
                Fiche de cours
              </Badge>
            </div>
            <CardTitle className="text-xl text-foreground">{worksheet.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copié" : "Copier"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Objectives */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Objectifs pédagogiques
          </h3>
          <ul className="space-y-2">
            {worksheet.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Course Content */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            Contenu du cours
          </h3>
          <div className="rounded-lg border border-border bg-card p-6">
            <LatexContent content={worksheet.course} />
          </div>
        </div>

        <Separator />

        {/* Exercises */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <PenTool className="h-5 w-5 text-primary" />
            Exercices
          </h3>
          <div className="space-y-4">
            {worksheet.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-foreground">
                      {exercise.id}
                    </span>
                    <p className="text-foreground pt-0.5">{exercise.question}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(exercise.difficulty)}
                  >
                    {exercise.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
