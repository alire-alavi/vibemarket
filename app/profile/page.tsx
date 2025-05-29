"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Save,
  Bitcoin,
  TrendingUp,
  Newspaper,
  Users,
  DollarSign,
  Zap,
  Globe,
  Smartphone,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { updateUserProfile, updateUserInterests } from "@/lib/api"

const interests = [
  { id: "crypto", name: "Cryptocurrency", icon: Bitcoin, color: "bg-orange-100 text-orange-700" },
  { id: "stocks", name: "Stock Market", icon: TrendingUp, color: "bg-green-100 text-green-700" },
  { id: "forex", name: "Forex", icon: DollarSign, color: "bg-blue-100 text-blue-700" },
  { id: "defi", name: "DeFi", icon: Zap, color: "bg-purple-100 text-purple-700" },
  { id: "nft", name: "NFTs", icon: Smartphone, color: "bg-pink-100 text-pink-700" },
  { id: "commodities", name: "Commodities", icon: Globe, color: "bg-yellow-100 text-yellow-700" },
  { id: "news", name: "Financial News", icon: Newspaper, color: "bg-gray-100 text-gray-700" },
  { id: "influencers", name: "Market Influencers", icon: Users, color: "bg-indigo-100 text-indigo-700" },
]

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: string; message: string } | null>(null)

  const [profileData, setProfileData] = useState({
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const [validation, setValidation] = useState({
    email: { isValid: true, message: "" },
    username: { isValid: true, message: "", isChecking: false },
    newPassword: { isValid: true, message: "", strength: 0 },
    confirmPassword: { isValid: true, message: "" },
  })

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setProfileData({
        email: parsedUser.email || "",
        username: parsedUser.username || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setSelectedInterests(parsedUser.interests || [])
    }
  }, [])

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    return {
      isValid,
      message: email ? (isValid ? "Valid email address" : "Please enter a valid email address") : "",
    }
  }

  const validatePassword = (password: string) => {
    if (!password) return { isValid: true, message: "", strength: 0 }

    let strength = 0
    let message = ""

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1

    const isValid = strength >= 3

    if (password.length < 8) {
      message = "Password must be at least 8 characters"
    } else if (strength < 3) {
      message = "Password should include uppercase, lowercase, numbers, and symbols"
    } else if (strength === 3) {
      message = "Good password strength"
    } else if (strength === 4) {
      message = "Strong password"
    } else {
      message = "Very strong password"
    }

    return { isValid, message, strength }
  }

  const handleInputChange = async (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus(null)

    switch (field) {
      case "email":
        setValidation((prev) => ({
          ...prev,
          email: validateEmail(value),
        }))
        break

      case "newPassword":
        const passwordValidation = validatePassword(value)
        setValidation((prev) => ({
          ...prev,
          newPassword: passwordValidation,
          confirmPassword:
            value && profileData.confirmPassword
              ? {
                  isValid: value === profileData.confirmPassword,
                  message: value === profileData.confirmPassword ? "Passwords match" : "Passwords don't match",
                }
              : prev.confirmPassword,
        }))
        break

      case "confirmPassword":
        setValidation((prev) => ({
          ...prev,
          confirmPassword: {
            isValid: value === profileData.newPassword,
            message: value ? (value === profileData.newPassword ? "Passwords match" : "Passwords don't match") : "",
          },
        }))
        break
    }
  }

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    )
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setSaveStatus(null)

    try {
      // Send profile update to API
      await updateUserProfile({
        email: profileData.email,
        username: profileData.username,
      })

      // Update local storage
      const updatedUser = {
        ...user,
        email: profileData.email,
        username: profileData.username,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSaveStatus({ type: "success", message: "Profile updated successfully!" })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setSaveStatus({ type: "error", message: error.message || "Failed to update profile. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePassword = async () => {
    if (
      !profileData.currentPassword ||
      !profileData.newPassword ||
      !validation.newPassword.isValid ||
      !validation.confirmPassword.isValid
    ) {
      setSaveStatus({ type: "error", message: "Please fill all password fields correctly." })
      return
    }

    setIsLoading(true)
    setSaveStatus(null)

    try {
      // Send password update to API
      await updateUserProfile({
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      })

      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setSaveStatus({ type: "success", message: "Password updated successfully!" })
    } catch (error: any) {
      console.error("Error updating password:", error)
      setSaveStatus({ type: "error", message: error.message || "Failed to update password. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveInterests = async () => {
    setIsLoading(true)
    setSaveStatus(null)

    try {
      // Send interests to API
      await updateUserInterests(selectedInterests)

      // Update local storage
      const updatedUser = {
        ...user,
        interests: selectedInterests,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSaveStatus({ type: "success", message: "Interests updated successfully!" })
    } catch (error: any) {
      console.error("Error updating interests:", error)
      setSaveStatus({ type: "error", message: error.message || "Failed to update interests. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500"
    if (strength === 3) return "bg-yellow-500"
    if (strength === 4) return "bg-blue-500"
    return "bg-green-500"
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Please sign in to access your profile</p>
              <Link href="/">
                <Button>Go to Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/feed" className="text-xl font-bold">
              VibeMarket
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("user")
                  window.location.href = "/"
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{selectedInterests.length} interests</Badge>
                    <Badge variant="outline">Member since 2024</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Alert */}
          {saveStatus && (
            <Alert
              className={`mb-6 ${saveStatus.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
            >
              <AlertDescription className={saveStatus.type === "success" ? "text-green-700" : "text-red-700"}>
                {saveStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
            </TabsList>

            {/* Profile Info Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription>Update your account details and email address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={
                        profileData.email !== user.email
                          ? validation.email.isValid
                            ? "border-green-500"
                            : "border-red-500"
                          : ""
                      }
                      disabled={isLoading}
                    />
                    {profileData.email !== user.email && validation.email.message && (
                      <div
                        className={`flex items-center space-x-1 text-xs ${validation.email.isValid ? "text-green-600" : "text-red-600"}`}
                      >
                        {validation.email.isValid ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{validation.email.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading || !validation.email.isValid}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Change Password</span>
                  </CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={profileData.currentPassword}
                        onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                        placeholder="Enter your current password"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={isLoading}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={profileData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        placeholder="Enter your new password"
                        className={
                          profileData.newPassword
                            ? validation.newPassword.isValid
                              ? "border-green-500"
                              : "border-red-500"
                            : ""
                        }
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={isLoading}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>

                    {profileData.newPassword && (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(validation.newPassword.strength)}`}
                              style={{ width: `${(validation.newPassword.strength / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{validation.newPassword.strength}/5</span>
                        </div>
                        <div
                          className={`flex items-center space-x-1 text-xs ${validation.newPassword.isValid ? "text-green-600" : "text-red-600"}`}
                        >
                          {validation.newPassword.isValid ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{validation.newPassword.message}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={profileData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Confirm your new password"
                        className={
                          profileData.confirmPassword
                            ? validation.confirmPassword.isValid
                              ? "border-green-500"
                              : "border-red-500"
                            : ""
                        }
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {profileData.confirmPassword && (
                      <div
                        className={`flex items-center space-x-1 text-xs ${validation.confirmPassword.isValid ? "text-green-600" : "text-red-600"}`}
                      >
                        {validation.confirmPassword.isValid ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{validation.confirmPassword.message}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSavePassword}
                    disabled={
                      isLoading ||
                      !profileData.currentPassword ||
                      !validation.newPassword.isValid ||
                      !validation.confirmPassword.isValid
                    }
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Interests Tab */}
            <TabsContent value="interests" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Interests</CardTitle>
                  <CardDescription>
                    Select the topics you want to see in your feed. You have {selectedInterests.length} interests
                    selected.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {interests.map((interest) => {
                      const Icon = interest.icon
                      const isSelected = selectedInterests.includes(interest.id)

                      return (
                        <Card
                          key={interest.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                          }`}
                          onClick={() => !isLoading && toggleInterest(interest.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div
                              className={`w-12 h-12 rounded-full ${interest.color} flex items-center justify-center mx-auto mb-2`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-medium text-sm">{interest.name}</h3>
                            {isSelected && (
                              <Badge className="mt-2" variant="secondary">
                                Selected
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <Button onClick={handleSaveInterests} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Interests
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
