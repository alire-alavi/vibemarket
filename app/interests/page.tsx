"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bitcoin,
  TrendingUp,
  Newspaper,
  Users,
  DollarSign,
  Zap,
  Globe,
  Smartphone,
  XCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { updateUserInterests } from "@/lib/api"

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

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    )
  }

  const handleContinue = async () => {
    setIsLoading(true)
    setApiError(null)

    try {
      // Send interests to API
      await updateUserInterests(selectedInterests)

      // Update local storage
      const userData = localStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        user.interests = selectedInterests
        localStorage.setItem("user", JSON.stringify(user))
      }

      // Redirect to feed
      window.location.href = "/feed"
    } catch (error: any) {
      console.error("Error updating interests:", error)
      setApiError(error.message || "Failed to save interests. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-2xl py-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Choose Your Interests</CardTitle>
            <CardDescription className="text-lg">
              Select the topics you want to see in your feed. You can always change these later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            {apiError && (
              <Alert className="border-red-500 bg-red-50">
                <XCircle className="w-4 h-4" />
                <AlertDescription className="text-red-700">{apiError}</AlertDescription>
              </Alert>
            )}

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

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">{selectedInterests.length} interests selected</p>
              <div className="space-y-2">
                <Button
                  onClick={handleContinue}
                  className="w-full"
                  disabled={selectedInterests.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving interests...
                    </>
                  ) : (
                    "Continue to Feed"
                  )}
                </Button>
                <Link href="/feed">
                  <Button variant="ghost" className="w-full" disabled={isLoading}>
                    Skip for now
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
