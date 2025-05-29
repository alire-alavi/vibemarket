"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Users, Bell, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { signupUser, loginUser } from "@/lib/api"

interface ValidationState {
  email: { isValid: boolean; message: string }
  password: { isValid: boolean; message: string }
}

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
  })

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    return {
      isValid,
      message: email ? (isValid ? "Valid email address" : "Please enter a valid email address") : "",
    }
  }

  // Password validation (for login only)
  const validatePassword = (password: string) => {
    if (!password) return { isValid: false, message: "" }
    const isValid = password.length >= 6
    return {
      isValid,
      message: isValid ? "Valid password" : "Password must be at least 6 characters",
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setApiError(null)
    setSuccessMessage(null)

    switch (field) {
      case "email":
        setValidation((prev) => ({
          ...prev,
          email: validateEmail(value),
        }))
        break

      case "password":
        if (isLogin) {
          setValidation((prev) => ({
            ...prev,
            password: validatePassword(value),
          }))
        }
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setApiError(null)
    setSuccessMessage(null)

    try {
      if (isLogin) {
        // Handle login
        const response = await loginUser(formData.email, formData.password)

        // Store user data (assuming API returns user info)
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
            username: response.username || formData.email.split("@")[0],
            interests: response.interests || [],
          }),
        )

        setSuccessMessage("Login successful! Redirecting...")
        setTimeout(() => {
          window.location.href = "/feed"
        }, 1500)
      } else {
        // Handle signup - only email required
        const response = await signupUser(formData.email)

        if (!response || !response.success) {
          throw new Error("Signup failed. Please check your email and try again.")
        }

        // Store user data for the session
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
            username: formData.email.split("@")[0], // Generate username from email
            interests: [],
          }),
        )

        setSuccessMessage("Account created successfully! Redirecting to interests...")
        setTimeout(() => {
          window.location.href = "/interests"
        }, 1500)
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      setApiError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    if (isLogin) {
      return validation.email.isValid && validation.password.isValid
    } else {
      return validation.email.isValid
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">VibeMarket</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Stay ahead of the market with real-time social sentiment, whale movements, and breaking news all in one
              feed.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Market Signals</CardTitle>
                <CardDescription>Track whale movements and price alerts in real-time</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Social Sentiment</CardTitle>
                <CardDescription>Follow influential traders and market makers</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Bell className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Breaking News</CardTitle>
                <CardDescription>Get instant updates from trusted news sources</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Auth Form */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>{isLogin ? "Welcome Back" : "Join VibeMarket"}</CardTitle>
              <CardDescription>
                {isLogin ? "Sign in to your account" : "Enter your email to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Status Messages */}
              {apiError && (
                <Alert className="mb-4 border-red-500 bg-red-50">
                  <XCircle className="w-4 h-4" />
                  <AlertDescription className="text-red-700">{apiError}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="mb-4 border-green-500 bg-green-50">
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={formData.email ? (validation.email.isValid ? "border-green-500" : "border-red-500") : ""}
                    disabled={isLoading}
                  />
                  {formData.email && (
                    <div
                      className={`flex items-center space-x-1 text-xs ${validation.email.isValid ? "text-green-600" : "text-red-600"}`}
                    >
                      {validation.email.isValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{validation.email.message}</span>
                    </div>
                  )}
                </div>

                {/* Password (login only) */}
                {isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={
                          formData.password ? (validation.password.isValid ? "border-green-500" : "border-red-500") : ""
                        }
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>

                    {formData.password && (
                      <div
                        className={`flex items-center space-x-1 text-xs ${validation.password.isValid ? "text-green-600" : "text-red-600"}`}
                      >
                        {validation.password.isValid ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{validation.password.message}</span>
                      </div>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={!isFormValid() || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setFormData({ email: formData.email, password: "" })
                    setApiError(null)
                    setSuccessMessage(null)
                  }}
                  className="text-sm"
                  disabled={isLoading}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <Link href="/feed" className="text-sm text-blue-600 hover:underline">
                  Skip to demo feed
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
