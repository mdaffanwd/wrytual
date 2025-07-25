'use client'

import { useState, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Handle specific error messages
        if (result.error.includes('verify your email')) {
          setError('Please verify your email address before logging in. Check your inbox for the verification email.')
        } else {
          setError('Invalid email or password')
        }
      } else if (result?.ok) {
        // Use window.location to ensure proper redirect
        window.location.href = '/dashboard'
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted">
        <Card className="w-full max-w-sm shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-muted-foreground mb-3">
              Login to continue journaling your dev journey 🚀
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ✅ Suspense-wrapped search param handler */}
            <Suspense fallback={null}>
              <LoginMessages setSuccessMessage={setSuccessMessage} />
            </Suspense>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                  {successMessage}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  onChange={(e) => {
                    setSuccessMessage('')
                    register('email').onChange(e)
                  }}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm underline-offset-4 hover:underline">
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit + Google */}
              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" type="button"
                  onClick={() => signIn("google", { callbackUrl: '/dashboard' })}
                  disabled={loading} >
                  Login with Google
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-sm text-muted-foreground pt-2">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline text-primary hover:text-primary/80">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function LoginMessages({
  setSuccessMessage,
}: {
  setSuccessMessage: (msg: string) => void
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(message)

      const url = new URL(window.location.href)
      url.searchParams.delete('message')
      window.history.replaceState(null, '', url.toString())
    }
  }, [searchParams, setSuccessMessage])

  return null
}