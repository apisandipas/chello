import { createFileRoute } from '@tanstack/react-router'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useState } from "react"

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement password reset logic
    // Simulate email sent for now
    setTimeout(() => {
      setEmailSent(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container relative h-[calc(100vh-52px)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/chell.svg" alt="Chello" className="w-6 h-6 mr-2" />
          Chello
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "No worries! We'll help you get back into your account safely."
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
            <p className="text-sm text-muted-foreground">
              {emailSent 
                ? "Check your email for reset instructions" 
                : "Enter your email and we'll send you instructions to reset your password"}
            </p>
          </div>
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending instructions..." : "Send reset instructions"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If an account exists for that email, you'll receive password reset instructions.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Try another email
              </Button>
            </div>
          )}
          <div className="flex flex-col space-y-2 text-center text-sm">
            <p className="text-muted-foreground">
              Remember your password?{" "}
              <a href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
