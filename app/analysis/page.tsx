"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, BarChart3, Brain, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { performAnalysis } from "@/lib/api"

const assetTypes = [
  { id: "crypto", name: "Cryptocurrency", icon: "₿" },
  { id: "stocks", name: "Stocks", icon: "📈" },
  { id: "forex", name: "Forex", icon: "💱" },
  { id: "commodities", name: "Commodities", icon: "🥇" },
]

const analysisTypes = [
  {
    id: "technical",
    name: "Technical Analysis",
    description: "Chart patterns, indicators, and price action analysis",
    icon: BarChart3,
  },
  {
    id: "fundamental",
    name: "Fundamental Analysis",
    description: "Company financials, economic indicators, and market conditions",
    icon: TrendingUp,
  },
  {
    id: "sentiment",
    name: "Sentiment Analysis",
    description: "Social media sentiment, news analysis, and market psychology",
    icon: Brain,
  },
  {
    id: "comprehensive",
    name: "Comprehensive Analysis",
    description: "Combined technical, fundamental, and sentiment analysis",
    icon: Target,
  },
]

const popularAssets = [
  { symbol: "BTC/USD", name: "Bitcoin", type: "crypto", price: "$42,350", change: "+2.3%" },
  { symbol: "ETH/USD", name: "Ethereum", type: "crypto", price: "$2,420", change: "+5.7%" },
  { symbol: "AAPL", name: "Apple Inc.", type: "stocks", price: "$185.25", change: "-0.8%" },
  { symbol: "TSLA", name: "Tesla Inc.", type: "stocks", price: "$248.50", change: "+1.2%" },
  { symbol: "EUR/USD", name: "Euro/US Dollar", type: "forex", price: "1.0875", change: "+0.15%" },
  { symbol: "GBP/USD", name: "British Pound/US Dollar", type: "forex", price: "1.2650", change: "-0.22%" },
]

export default function AnalysisPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssetType, setSelectedAssetType] = useState("all") // Updated default value
  const [selectedAsset, setSelectedAsset] = useState<(typeof popularAssets)[0] | null>(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState("")
  const [searchResults, setSearchResults] = useState(popularAssets)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const filtered = popularAssets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
          asset.name.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(filtered)
    } else {
      setSearchResults(popularAssets)
    }
  }

  const handleAssetSelect = (asset: (typeof popularAssets)[0]) => {
    setSelectedAsset(asset)
  }

  const handleStartAnalysis = async () => {
    if (selectedAsset && selectedAnalysis) {
      const analysisData = {
        ticker: selectedAsset.symbol,
        risk_tolerance: "medium", // Example value, adjust as needed
        time_horizon: "long-term", // Example value, adjust as needed
        analysis_type: selectedAnalysis,
        data_request_flags: {
          fetch_current_price: true,
          fetch_historical_data: true,
          fetch_fundamental_data: true,
          fetch_news: true,
          fetch_economic_indicator: false,
          fetch_emotions: true,
        },
      };

      try {
        const response = await performAnalysis(analysisData);
        console.log("Analysis response:", response);
        // Navigate to action plan page or handle response as needed
        window.location.href = `/analysis/plan?result=${encodeURIComponent(JSON.stringify(response))}`;
      } catch (error) {
        console.error("Failed to perform analysis:", error);
        alert("Failed to perform analysis. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/feed" className="text-xl font-bold">
                VibeMarket
              </Link>
              <Badge variant="secondary">Analysis</Badge>
            </div>
            <Link href="/feed">
              <Button variant="ghost">Back to Feed</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Market Analysis</h1>
            <p className="text-muted-foreground">
              Search for any tradable asset and get AI-powered analysis and action plans
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Asset Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search Assets</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Asset Type Filter */}
                <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem> {/* Updated value prop */}
                    {assetTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for stocks, crypto, forex..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults
                    .filter((asset) => selectedAssetType === "all" || asset.type === selectedAssetType)
                    .map((asset) => (
                      <Card
                        key={asset.symbol}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedAsset?.symbol === asset.symbol ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => handleAssetSelect(asset)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-sm">{asset.symbol}</h3>
                              <p className="text-xs text-muted-foreground">{asset.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">{asset.price}</p>
                              <p
                                className={`text-xs ${
                                  asset.change.startsWith("+") ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {asset.change}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Analysis Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAsset && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-4">
                    <h3 className="font-medium text-sm">Selected Asset</h3>
                    <p className="text-lg font-bold">{selectedAsset.symbol}</p>
                    <p className="text-sm text-muted-foreground">{selectedAsset.name}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {analysisTypes.map((analysis) => {
                    const Icon = analysis.icon
                    const isSelected = selectedAnalysis === analysis.id

                    return (
                      <Card
                        key={analysis.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => setSelectedAnalysis(analysis.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-sm mb-1">{analysis.name}</h3>
                              <p className="text-xs text-muted-foreground">{analysis.description}</p>
                            </div>
                            {isSelected && <Badge variant="secondary">Selected</Badge>}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Button
                  onClick={handleStartAnalysis}
                  disabled={!selectedAsset || !selectedAnalysis}
                  className="w-full"
                  size="lg"
                >
                  Start Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
