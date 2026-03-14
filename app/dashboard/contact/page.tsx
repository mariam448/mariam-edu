"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MessageSquare, HelpCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contact & Support</h1>
        <p className="text-muted-foreground">Besoin d'aide ? Nous sommes là pour vous</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Form */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageSquare className="h-5 w-5 text-primary" />
              Envoyer un message
            </CardTitle>
            <CardDescription>
              Notre équipe vous répondra dans les plus brefs délais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Sujet
                </label>
                <Select>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Problème technique</SelectItem>
                    <SelectItem value="account">Mon compte</SelectItem>
                    <SelectItem value="feature">Suggestion de fonctionnalité</SelectItem>
                    <SelectItem value="content">Contenu pédagogique</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre demande en détail..."
                  rows={6}
                  className="bg-background border-border resize-none"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground mt-1">support@mathpro-maroc.ma</p>
                  <p className="text-xs text-muted-foreground mt-1">Réponse sous 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <Phone className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Téléphone</h3>
                  <p className="text-sm text-muted-foreground mt-1">+212 5 22 XX XX XX</p>
                  <p className="text-xs text-muted-foreground mt-1">Lun-Ven 9h-18h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">FAQ</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Consultez notre base de connaissances
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary mt-2">
                    Voir la FAQ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
