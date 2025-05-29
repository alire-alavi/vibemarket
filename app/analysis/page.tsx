"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Search, TrendingUp, BarChart3, Brain, Target, ArrowRight, ArrowLeft, Shield } from "lucide-react"
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
  { name: "Bitcoin", symbol: "BTC", id: "bitcoin", type: "crypto", price: "$42,350", change: "+2.3%" },
  { name: "Ethereum", symbol: "ETH", id: "ethereum", type: "crypto", price: "$2,420", change: "+5.7%" },
  { name: "Tether", symbol: "USDT", id: "tether", type: "crypto", price: "$1.00", change: "0.0%" },
  { name: "XRP", symbol: "XRP", id: "ripple", type: "crypto", price: "$0.50", change: "+1.2%" },
  { name: "BNB", symbol: "BNB", id: "binancecoin", type: "crypto", price: "$300.00", change: "-0.5%" },
  { name: "Solana", symbol: "SOL", id: "solana", type: "crypto", price: "$20.00", change: "+3.1%" },
  { name: "USD Coin", symbol: "USDC", id: "usd-coin", type: "crypto", price: "$1.00", change: "0.0%" },
  { name: "Dogecoin", symbol: "DOGE", id: "dogecoin", type: "crypto", price: "$0.07", change: "+0.8%" },
  { name: "Cardano", symbol: "ADA", id: "cardano", type: "crypto", price: "$0.35", change: "-1.2%" },
  { name: "TRON", symbol: "TRX", id: "tron", type: "crypto", price: "$0.08", change: "+0.5%" },
  { name: "Sui", symbol: "SUI", id: "sui", type: "crypto", price: "$0.10", change: "-0.3%" },
  { name: "Hyperliquid", symbol: "HYPE", id: "hyperliquid", type: "crypto", price: "$0.50", change: "+2.0%" },
  { name: "Chainlink", symbol: "LINK", id: "chainlink", type: "crypto", price: "$7.50", change: "+1.5%" },
  { name: "Avalanche", symbol: "AVAX", id: "avalanche-2", type: "crypto", price: "$15.00", change: "-0.8%" },
  { name: "Stellar", symbol: "XLM", id: "stellar", type: "crypto", price: "$0.12", change: "+0.9%" },
  { name: "Toncoin", symbol: "TON", id: "the-open-network", type: "crypto", price: "$2.00", change: "+1.1%" },
  { name: "Shiba Inu", symbol: "SHIB", id: "shiba-inu", type: "crypto", price: "$0.00001", change: "+0.3%" },
  { name: "UNUS SED LEO", symbol: "LEO", id: "leo-token", type: "crypto", price: "$4.00", change: "-0.2%" },
  { name: "Bitcoin Cash", symbol: "BCH", id: "bitcoin-cash", type: "crypto", price: "$120.00", change: "+1.8%" },
  { name: "Hedera", symbol: "HBAR", id: "hedera-hashgraph", type: "crypto", price: "$0.05", change: "+0.6%" },
  { name: "Litecoin", symbol: "LTC", id: "litecoin", type: "crypto", price: "$90.00", change: "-0.4%" },
  { name: "Polkadot", symbol: "DOT", id: "polkadot", type: "crypto", price: "$5.00", change: "+0.7%" },
  { name: "Monero", symbol: "XMR", id: "monero", type: "crypto", price: "$150.00", change: "+1.0%" },
  { name: "Bitget Token", symbol: "BGB", id: "bitget-token", type: "crypto", price: "$0.20", change: "+0.5%" },
  { name: "Pepe", symbol: "PEPE", id: "pepe", type: "crypto", price: "$0.000001", change: "+0.2%" },
];

const riskToleranceOptions = [
  { id: "low", name: "Low", description: "Conservative approach, minimal risk" },
  { id: "medium", name: "Medium", description: "Balanced risk-reward strategy" },
  { id: "high", name: "High", description: "Aggressive approach, higher potential returns" },
]

const timeHorizonOptions = [
  { id: "short-term", name: "Short-term", description: "Days to weeks" },
  { id: "mid-term", name: "Mid-term", description: "Weeks to months" },
  { id: "long-term", name: "Long-term", description: "Months to years" },
]

const dataRequestFlags = [
  { id: "fetch_current_price", name: "Current Price", description: "Real-time price data", defaultValue: true },
  { id: "fetch_historical_data", name: "Historical Data", description: "Price history and trends", defaultValue: true },
  {
    id: "fetch_fundamental_data",
    name: "Fundamental Data",
    description: "Financial metrics and ratios",
    defaultValue: true,
  },
  { id: "fetch_news", name: "News & Events", description: "Latest news and market events", defaultValue: true },
  {
    id: "fetch_economic_indicator",
    name: "Economic Indicators",
    description: "Macro economic data",
    defaultValue: false,
  },
  { id: "fetch_emotions", name: "Sentiment Data", description: "Social sentiment and emotions", defaultValue: true },
]

export default function AnalysisPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssetType, setSelectedAssetType] = useState("all")
  const [searchResults, setSearchResults] = useState(popularAssets)

  // Form data state
  const [formData, setFormData] = useState({
    selectedAsset: null as (typeof popularAssets)[0] | null,
    riskTolerance: "",
    timeHorizon: "",
    analysisType: "",
    dataFlags: {
      fetch_current_price: true,
      fetch_historical_data: true,
      fetch_fundamental_data: true,
      fetch_news: true,
      fetch_economic_indicator: false,
      fetch_emotions: true,
    },
  })

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
    setFormData((prev) => ({ ...prev, selectedAsset: asset }))
  }

  const handleDataFlagChange = (flagId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dataFlags: { ...prev.dataFlags, [flagId]: checked },
    }))
  }

  const handleStartAnalysis = async () => {
    const analysisData = {
      ticker: formData.selectedAsset?.id || "",
      risk_tolerance: formData.riskTolerance,
      time_horizon: formData.timeHorizon,
      analysis_type: formData.analysisType,
      data_request_flags: {
        fetch_current_price: formData.dataFlags.fetch_current_price,
        fetch_historical_data: formData.dataFlags.fetch_historical_data,
        fetch_fundamental_data: formData.dataFlags.fetch_fundamental_data,
        fetch_news: formData.dataFlags.fetch_news,
        fetch_economic_indicator: formData.dataFlags.fetch_economic_indicator,
        fetch_emotions: formData.dataFlags.fetch_emotions,
      },
    };

    try {
      const response = await performAnalysis(analysisData);
      console.log("Analysis response:", response);
      // Optionally redirect or update UI based on response
    } catch (error) {
      console.error("Failed to perform analysis:", error);
    }
  };

  const canProceedToStep2 = formData?.selectedAsset !== null
  const canProceedToStep3 = canProceedToStep2 && formData.riskTolerance && formData.timeHorizon
  const canStartAnalysis = canProceedToStep3 && formData.analysisType

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 4 && <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="w-5 h-5" />
          <span>Step 1: Select Asset</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Asset Type Filter */}
        <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by asset type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
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

        {/* Selected Asset Display */}
        {formData.selectedAsset && (
          <div className="p-3 bg-blue-50 rounded-lg mb-4">
            <h3 className="font-medium text-sm">Selected Asset</h3>
            <p className="text-lg font-bold">{formData.selectedAsset.symbol}</p>
            <p className="text-sm text-muted-foreground">{formData.selectedAsset.name}</p>
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {searchResults
            .filter((asset) => selectedAssetType === "all" || asset.type === selectedAssetType)
            .map((asset) => (
              <Card
                key={asset.symbol}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.selectedAsset?.symbol === asset.symbol ? "ring-2 ring-blue-500 bg-blue-50" : ""
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
                      <p className={`text-xs ${asset.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                        {asset.change}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2} className="w-full" size="lg">
          Continue to Risk & Time Settings
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Step 2: Risk Tolerance & Time Horizon</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Tolerance */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Risk Tolerance</Label>
          <RadioGroup
            value={formData.riskTolerance}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, riskTolerance: value }))}
          >
            {riskToleranceOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`risk-${option.id}`} />
                <Label htmlFor={`risk-${option.id}`} className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Time Horizon */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Time Horizon</Label>
          <RadioGroup
            value={formData.timeHorizon}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, timeHorizon: value }))}
          >
            {timeHorizonOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`time-${option.id}`} />
                <Label htmlFor={`time-${option.id}`} className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3} className="flex-1" size="lg">
            Continue to Analysis Type
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Step 3: Analysis Type</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {analysisTypes.map((analysis) => {
            const Icon = analysis.icon
            const isSelected = formData.analysisType === analysis.id

            return (
              <Card
                key={analysis.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, analysisType: analysis.id }))}
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

        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => setCurrentStep(4)} disabled={!formData.analysisType} className="flex-1" size="lg">
            Continue to Data Options
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Step 4: Data Sources</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Select data sources to include in your analysis:</Label>
          {dataRequestFlags.map((flag) => (
            <div key={flag.id} className="flex items-start space-x-3">
              <Checkbox
                id={flag.id}
                checked={formData.dataFlags[flag.id as keyof typeof formData.dataFlags]}
                onCheckedChange={(checked) => handleDataFlagChange(flag.id, checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor={flag.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {flag.name}
                </Label>
                <p className="text-xs text-muted-foreground">{flag.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <h3 className="font-medium text-sm">Analysis Summary</h3>
          <div className="text-xs space-y-1">
            <p>
              <span className="font-medium">Asset:</span> {formData.selectedAsset?.symbol} (
              {formData.selectedAsset?.name})
            </p>
            <p>
              <span className="font-medium">Risk Tolerance:</span> {formData.riskTolerance}
            </p>
            <p>
              <span className="font-medium">Time Horizon:</span> {formData.timeHorizon}
            </p>
            <p>
              <span className="font-medium">Analysis Type:</span>{" "}
              {analysisTypes.find((a) => a.id === formData.analysisType)?.name}
            </p>
            <p>
              <span className="font-medium">Data Sources:</span>{" "}
              {Object.values(formData.dataFlags).filter(Boolean).length} selected
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleStartAnalysis} disabled={!canStartAnalysis} className="flex-1" size="lg">
            Start Analysis
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

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
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Vibe Market</h1>
            <p className="text-muted-foreground">Configure your personalized market analysis in 4 simple steps</p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </div>
  )
}
