import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"

export default function LoginPage({
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your Japanese learning journey
          </p>
        </div>
        <LoginForm redirectTo={next} />
      </div>
    </main>
    </div>
  )
}
