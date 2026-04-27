import { SignupForm } from "@/components/auth/signup-form"
import { Header } from "@/components/layout/header"

export default function SignupPage({
  searchParams,
}: {
  searchParams?: { next?: string }
}) {
  const next = typeof searchParams?.next === 'string' ? searchParams.next : '/'
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="w-full max-w-md">
        <SignupForm redirectTo={next} />
      </div>
    </main>
    </div>
  )
}
