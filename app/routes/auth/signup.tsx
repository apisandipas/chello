import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useState, useRef } from "react"
import { signup } from '~/lib/services/auth'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('[Signup Form] Form submission started');
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      
      console.log('[Signup Form] Calling signup function with email:', email);
      const result = await signup({ data: { email, password } })

      if (result.error) {
        console.log('[Signup Form] Signup failed with error:', result.error);
        toast.error(result.error)
        return
      }

      console.log('[Signup Form] Signup successful, redirecting to login');
      toast.success('Successfully signed up! Please log in.')
      formRef.current?.reset()
      router.navigate({ to: '/auth/login' })
    } catch (error) {
      console.error('[Signup Form] Unexpected error:', error);
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      console.log('[Signup Form] Form submission completed');
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
              "Organize your tasks and collaborate with your team in a simple and efficient way."
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
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
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/auth/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
