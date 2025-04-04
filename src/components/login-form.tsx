"use client"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/lib/api.js" 
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
  const email = (form.elements.namedItem("email") as HTMLInputElement)?.value
  const password = (form.elements.namedItem("password") as HTMLInputElement)?.value

    try {
      const data = await loginUser(email, password)
      if (data && data.accessToken) {
        localStorage.setItem("jwt", data.accessToken)
        localStorage.setItem("userId", data.userId)
        setError(null) 

        
        router.push('/dashboard')
      } else {
        setError("Login failed. Invalid response from server.")
      }
    } catch (err: any) {
      
      console.error("Login error:", err)
      setError(err.message || "Login failed. Please try again.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error &&  <Alert className="mb-2" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Enter Valid Email or Password
      </AlertDescription>
    </Alert>} 
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Login
                </Button>
                
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
  Don&apos;t have an account?{" "}
  <Link href="/signup" className="underline underline-offset-4">
    Sign up
  </Link>
</div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}