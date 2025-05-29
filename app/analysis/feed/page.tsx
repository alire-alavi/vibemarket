"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Bell,
  ArrowLeft,
  RefreshCw,
  Filter,
  Twitter,
  Newspaper,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const assetFeedData = [
  {
    id: 1,
    type: "price_alert",
    source: "TradingView",
    user: {
      name: "TradingView Alerts",
      username: "@tradingview",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content: "BTC/USD has broken above the $42,500 resistance level with strong volume. Next resistance at $45,200.",
    timestamp: "2m",
    engagement: { likes: 156, comments: 23, shares: 45 },
    tags: ["Price Alert", "Technical Analysis"],
    priceChange: "+2.8%",
    relevanceScore: 95,
  },
  {
    id: 2,
    type: "twitter",
    source: "Twitter",
    user: {
      name: "Michael Saylor",
      username: "@saylor",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content:
      "Bitcoin's institutional adoption continues to accelerate. The digital asset is becoming the treasury reserve asset of choice for forward-thinking corporations. 🧡",
    timestamp: "8m",
    engagement: { likes: 2341, comments: 234, shares: 567 },
    tags: ["Twitter", "Institutional"],
    relevanceScore: 88,
  },
  {
    id: 3,
    type: "news",
    source: "CoinDesk",
    user: {
      name: "CoinDesk",
      username: "@coindesk",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content:
      "BREAKING: Major pension fund allocates 5% of portfolio to Bitcoin, citing inflation hedge properties and long-term value proposition.",
    timestamp: "15m",
    engagement: { likes: 445, comments: 67, shares: 123 },
    tags: ["News", "Institutional", "Pension Fund"],
    image: "/placeholder.svg?height=200&width=400",
    relevanceScore: 92,
  },
  {
    id: 4,
    type: "whale_alert",
    source: "Whale Alert",
    user: {
      name: "Whale Alert",
      username: "@whale_alert",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content: "🚨 2,500 BTC (105,875,000 USD) transferred from Coinbase to unknown wallet",
    timestamp: "22m",
    engagement: { likes: 334, comments: 56, shares: 89 },
    tags: ["Whale Movement", "Exchange Outflow"],
    priceChange: "+1.2%",
    relevanceScore: 85,
  },
  {
    id: 5,
    type: "analysis",
    source: "VibeMarket AI",
    user: {
      name: "VibeMarket AI",
      username: "@VibeMarket_ai",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content:
      "Technical Analysis Update: BTC showing strong bullish divergence on 4H RSI. Volume profile suggests accumulation around current levels. Target: $45,200 | Stop: $39,800",
    timestamp: "35m",
    engagement: { likes: 178, comments: 34, shares: 67 },
    tags: ["AI Analysis", "Technical"],
    relevanceScore: 90,
  },
]

function AssetPostCard({ post }: { post: (typeof assetFeedData)[0] }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "twitter":
        return <Twitter className="w-4 h-4" />
      case "coindesk":
      case "news":
        return <Newspaper className="w-4 h-4" />
      case "tradingview":
        return <BarChart3 className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "whale_alert":
        return "bg-red-100 text-red-700"
      case "twitter":
        return "bg-blue-100 text-blue-700"
      case "news":
        return "bg-green-100 text-green-700"
      case "price_alert":
        return "bg-yellow-100 text-yellow-700"
      case "analysis":
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
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm">{post.user.name}</h3>
                {post.user.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 text-muted-foreground">
                  {getSourceIcon(post.source)}
                  <span className="text-xs">{post.source}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                {post.user.username} · {post.timestamp}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {post.relevanceScore}% relevant
            </Badge>
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

export default function AssetFeedPage() {
  const [asset, setAsset] = useState("BTC/USD")
  const [assetName, setAssetName] = useState("Bitcoin")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlAsset = urlParams.get("asset")
    const urlAssetName = urlParams.get("assetName")

    if (urlAsset) setAsset(urlAsset)
    if (urlAssetName) setAssetName(urlAssetName)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const filteredData = assetFeedData.filter((post) => {
    if (activeTab === "all") return true
    return post.type === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/analysis/plan" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xl font-bold">VibeMarket</span>
              </Link>
              <Badge variant="secondary">Asset Feed</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Asset Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{asset}</h1>
                  <p className="text-muted-foreground">{assetName} - Customized Feed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$42,350</p>
                  <p className="text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2.8% (24h)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="price_alert">Price Alerts</TabsTrigger>
              <TabsTrigger value="twitter">Social</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="whale_alert">Whale Alerts</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  {filteredData.map((post) => (
                    <AssetPostCard key={post.id} post={post} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
