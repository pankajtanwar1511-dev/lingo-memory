import { Metadata } from "next"
import { SignupForm } from "@/components/auth/signup-form"
import { Header } from "@/components/layout/header"

export const metadata: Metadata = {
  title: "Sign Up - JapVocab",
  description: "Create an account to sync your Japanese vocabulary learning progress across all devices",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Get Started
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and start learning Japanese
          </p>
        </div>
        <SignupForm redirectTo="/" />
      </div>
    </main>
    </div>
  )
}
