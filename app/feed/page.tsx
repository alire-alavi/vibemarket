"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  Home,
  User,
  Settings,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const feedData = [
  {
    id: 1,
    type: "whale_alert",
    user: {
      name: "Whale Alert",
      username: "@whale_alert",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content: "🚨 1,000 BTC (42,350,000 USD) transferred from unknown wallet to Binance",
    timestamp: "2m",
    engagement: { likes: 234, comments: 45, shares: 89 },
    tags: ["Whale Movement", "Bitcoin"],
    priceChange: "+2.3%",
  },
  {
    id: 2,
    type: "social_post",
    user: {
      name: "Michael Saylor",
      username: "@saylor",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content:
      "Bitcoin is digital energy. Every satoshi represents stored human time and effort. The network effect grows stronger with each block. 🧡⚡",
    timestamp: "15m",
    engagement: { likes: 1234, comments: 156, shares: 234 },
    tags: ["Social", "Bitcoin Philosophy"],
  },
  {
    id: 3,
    type: "news",
    user: {
      name: "CoinDesk",
      username: "@coindesk",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content:
      "BREAKING: Major institutional investor announces $500M Bitcoin allocation. This marks the largest corporate Bitcoin purchase this quarter.",
    timestamp: "32m",
    engagement: { likes: 567, comments: 89, shares: 123 },
    tags: ["News", "Institutional"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    type: "price_alert",
    user: {
      name: "DeFi Pulse",
      username: "@defipulse",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content:
      "ETH breaks above $2,400 resistance level with strong volume. Next target: $2,600. RSI showing bullish momentum.",
    timestamp: "1h",
    engagement: { likes: 445, comments: 67, shares: 91 },
    tags: ["Price Alert", "Ethereum"],
    priceChange: "+5.7%",
  },
  {
    id: 5,
    type: "influencer_post",
    user: {
      name: "Vitalik Buterin",
      username: "@vitalikbuterin",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content:
      "Excited about the progress on Ethereum's next upgrade. Scalability improvements will unlock new possibilities for decentralized applications. The future is multi-chain! 🌐",
    timestamp: "2h",
    engagement: { likes: 2156, comments: 234, shares: 445 },
    tags: ["Influencer", "Ethereum", "Development"],
  },
]

function PostCard({ post }: { post: (typeof feedData)[0] }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "whale_alert":
        return "bg-red-100 text-red-700"
      case "social_post":
        return "bg-blue-100 text-blue-700"
      case "news":
        return "bg-green-100 text-green-700"
      case "price_alert":
        return "bg-yellow-100 text-yellow-700"
      case "influencer_post":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-sm">{post.user.name}</h3>
                {post.user.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                {post.user.username} · {post.timestamp}
              </p>
            </div>
          </div>
          {post.priceChange && (
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                post.priceChange.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {post.priceChange.startsWith("+") ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{post.priceChange}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm mb-3">{post.content}</p>

        {post.image && (
          <div className="mb-3">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post content"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className={getTypeColor(post.type)}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`space-x-1 ${liked ? "text-red-500" : ""}`}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              <span className="text-xs">{post.engagement.likes + (liked ? 1 : 0)}</span>
            </Button>
            <Button variant="ghost" size="sm" className="space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{post.engagement.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="space-x-1">
              <Share className="w-4 h-4" />
              <span className="text-xs">{post.engagement.shares}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={bookmarked ? "text-blue-500" : ""}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">VibeMarket</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search markets..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Link href="/feed">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trending
                  </Button>
                  <Link href="/analysis">
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Market Analysis
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Alerts
                  </Button>
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-4">
                {feedData.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sticky top-24">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Market Overview</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">BTC/USD</span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-sm font-medium">$42,350</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ETH/USD</span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-sm font-medium">$2,420</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">SOL/USD</span>
                    <div className="flex items-center space-x-1 text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-sm font-medium">$98.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Trending Topics</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="secondary">#Bitcoin</Badge>
                  <Badge variant="secondary">#Ethereum</Badge>
                  <Badge variant="secondary">#DeFi</Badge>
                  <Badge variant="secondary">#WhaleAlert</Badge>
                  <Badge variant="secondary">#Institutional</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
