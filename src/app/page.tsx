"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen, Zap, Trophy, Users, ArrowRight, Star,
  Globe, Smartphone, Cloud, Shield, ChevronRight,
  Sparkles, TrendingUp, Clock, Target, LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Flashcard } from "@/components/flashcard"
import { Progress } from "@/components/ui/progress"
import { VocabularyCard } from "@/types/vocabulary"

// Demo vocabulary cards for landing page preview
const demoDeck: VocabularyCard[] = [
  {
    id: "demo_001",
    kanji: "水",
    kana: "みず",
    romaji: "mizu",
    meaning: ["water"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    tags: ["nature", "drink"],
    examples: [],
    source: { type: "custom" },
    license: { text: "Demo card", url: "" }
  },
  {
    id: "demo_002",
    kanji: "食べる",
    kana: "たべる",
    romaji: "taberu",
    meaning: ["to eat"],
    jlptLevel: "N5",
    partOfSpeech: ["verb"],
    tags: ["action", "food"],
    examples: [],
    source: { type: "custom" },
    license: { text: "Demo card", url: "" }
  },
  {
    id: "demo_003",
    kanji: "学校",
    kana: "がっこう",
    romaji: "gakkou",
    meaning: ["school"],
    jlptLevel: "N5",
    partOfSpeech: ["noun"],
    tags: ["education", "place"],
    examples: [],
    source: { type: "custom" },
    license: { text: "Demo card", url: "" }
  }
]

export default function HomePage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const currentCard = demoDeck[currentCardIndex]

  const features = [
    {
      icon: Zap,
      title: "FSRS Algorithm",
      description: "Science-backed spaced repetition for 95% retention rate",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Authentic Content",
      description: "Real Japanese from JMdict & Tatoeba with proper attribution",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Smartphone,
      title: "Learn Anywhere",
      description: "PWA works offline, syncs across all your devices",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Your Data, Your Control",
      description: "Export anytime, no vendor lock-in, privacy first",
      gradient: "from-green-500 to-teal-500"
    }
  ]

  const stats = [
    { label: "Active Learners", value: "10,000+", icon: Users },
    { label: "Cards Studied", value: "2.5M+", icon: BookOpen },
    { label: "Average Retention", value: "92%", icon: TrendingUp },
    { label: "5-Star Reviews", value: "4.8", icon: Star }
  ]

  const roadmap = [
    { level: "N5", cards: 800, status: "available" },
    { level: "N4", cards: 1500, status: "available" },
    { level: "N3", cards: 3000, status: "coming" },
    { level: "N2", cards: 6000, status: "planned" },
    { level: "N1", cards: 10000, status: "planned" }
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-20">
        {/* Hero Section */}
        <section className="py-12 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Badge variant="gradient" className="px-4 py-1.5">
              <Sparkles className="h-3 w-3 mr-2" />
              Launch Special: 50% off Premium
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold">
              Master Japanese with{" "}
              <span className="gradient-text">Science-Backed</span> Learning
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands learning Japanese efficiently with FSRS spaced repetition,
              authentic content from native sources, and a delightful study experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dashboard">
                <Button size="lg" variant="gradient" className="group w-full sm:w-auto">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/study">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Start Learning Free
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required • 20 free cards daily • Cancel anytime
            </p>
          </motion.div>

          {/* Sample Flashcard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-8"
          >
            <Flashcard
              card={currentCard}
              onNext={() => setCurrentCardIndex((i) => (i + 1) % demoDeck.length)}
              onPrevious={() => setCurrentCardIndex((i) => (i - 1 + demoDeck.length) % demoDeck.length)}
            />
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose LingoMemory?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by language learners, for language learners. Every feature is
              designed to maximize your learning efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient}`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* JLPT Progress Roadmap */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Your Path to JLPT Success
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured learning path from absolute beginner to advanced proficiency
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {roadmap.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center gap-4 py-4">
                  <div className={cn(
                    "flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg",
                    level.status === "available"
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : level.status === "coming"
                      ? "bg-gradient-to-r from-warning to-orange-500 text-white"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                  )}>
                    {level.level}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">JLPT {level.level}</h3>
                        <p className="text-sm text-muted-foreground">
                          {level.cards.toLocaleString()} vocabulary cards
                        </p>
                      </div>

                      <Badge variant={
                        level.status === "available" ? "default" :
                        level.status === "coming" ? "secondary" : "outline"
                      }>
                        {level.status === "available" ? "Available Now" :
                         level.status === "coming" ? "Coming Soon" : "Planned"}
                      </Badge>
                    </div>

                    {level.status === "available" && (
                      <Progress value={index === 0 ? 100 : 65} className="mt-2" />
                    )}
                  </div>
                </div>

                {index < roadmap.length - 1 && (
                  <div className="ml-10 h-8 w-0.5 bg-gradient-to-b from-primary to-secondary opacity-20" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, Fair Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you're ready. No tricks, no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for trying out</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {[
                    "20 cards daily limit",
                    "Basic N5 deck (100 words)",
                    "Local storage only",
                    "Basic TTS audio",
                    "Core SRS features"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="gradient">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>For serious learners</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$7.99</span>
                  <span className="text-muted-foreground">/month</span>
                  <Badge variant="success" className="ml-2">Save 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {[
                    "Unlimited cards",
                    "All JLPT levels (N5-N1)",
                    "Cloud sync & backup",
                    "Premium native audio",
                    "Advanced analytics",
                    "CSV import/export",
                    "Priority support"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="gradient" className="w-full">
                    Start 7-Day Free Trial
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground">
                  No credit card required
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Japanese Journey?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of learners achieving their JLPT goals with LingoMemory
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/study">
                <Button size="lg" variant="gradient" className="group w-full sm:w-auto">
                  <Zap className="mr-2 h-4 w-4" />
                  Start Learning Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={"/contact" as any}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">LingoMemory</span>
              <span className="text-sm text-muted-foreground">© 2024</span>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground justify-center">
              <Link href={"/study" as any} className="hover:text-foreground transition-colors">
                Study
              </Link>
              <Link href={"/vocabulary" as any} className="hover:text-foreground transition-colors">
                Vocabulary
              </Link>
              <Link href={"/login" as any} className="hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href={"/signup" as any} className="hover:text-foreground transition-colors">
                Sign Up
              </Link>
              <Link href={"/reset-database" as any} className="hover:text-foreground transition-colors">
                Reset Database
              </Link>
              <Link href={"/privacy" as any} className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href={"/terms" as any} className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href={"/contact" as any} className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}