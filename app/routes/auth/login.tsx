import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useState, useRef } from "react"
import { login } from '~/lib/services/auth'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const result = await login({ data: { email, password } })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Successfully logged in!')
      formRef.current?.reset()
      router.navigate({ to: '/boards' })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative h-[100vh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/chell.svg" alt="Chello" className="w-6 h-6 mr-2" />
          Chello
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Welcome back! Pick up right where you left off with your tasks and projects."
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="flex flex-col space-y-2 text-center text-sm">
            <a href="/auth/forgot-password" className="text-muted-foreground underline underline-offset-4 hover:text-primary">
              Forgot your password?
            </a>
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <a href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
