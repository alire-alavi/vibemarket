"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Send, ArrowRight, TrendingUp, Target, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isStreaming?: boolean
  actionPlan?: any
}

const actionPlanTemplate = {
  asset: "BTC/USD",
  assetName: "Bitcoin",
  analysisType: "comprehensive",
  confidence: 85,
  timeframe: "1-2 weeks",
  riskLevel: "Medium",
  recommendation: "BUY",
  targetPrice: "$45,200",
  stopLoss: "$39,800",
  keyPoints: [
    "Strong bullish momentum with RSI showing oversold conditions",
    "Institutional adoption increasing with recent ETF approvals",
    "Support level at $40,000 holding strong",
    "Volume analysis indicates accumulation phase",
  ],
  risks: [
    "Regulatory uncertainty in key markets",
    "Potential market correction due to macro factors",
    "High volatility expected around Fed announcements",
  ],
  actionItems: [
    "Monitor price action around $42,500 resistance",
    "Set up alerts for volume spikes above 20% average",
    "Watch for institutional flow data",
    "Track social sentiment indicators",
  ],
}

const initialAnalysisMessage = `I'll analyze ${actionPlanTemplate.asset} (${actionPlanTemplate.assetName}) using comprehensive analysis methods. Let me examine the current market conditions, technical indicators, and sentiment data to create your personalized action plan.

Based on my analysis of multiple data sources including price action, volume patterns, social sentiment, and institutional flows, here's your comprehensive action plan:`

export default function ChatActionPlanPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [currentStreamingText, setCurrentStreamingText] = useState("")
  const [asset, setAsset] = useState("BTC/USD")
  const [assetName, setAssetName] = useState("Bitcoin")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showActionPlan, setShowActionPlan] = useState(false)

  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlAsset = urlParams.get("asset") || "BTC/USD"
    const urlAssetName = urlParams.get("assetName") || "Bitcoin"
    const analysisType = urlParams.get("analysisType") || "comprehensive"

    setAsset(urlAsset)
    setAssetName(urlAssetName)

    // Update template with URL params
    actionPlanTemplate.asset = urlAsset
    actionPlanTemplate.assetName = urlAssetName
    actionPlanTemplate.analysisType = analysisType

    // Start the AI conversation
    startAnalysis()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, currentStreamingText])

  const startAnalysis = () => {
    // Simulate word-by-word streaming
    const fullText = initialAnalysisMessage
    let currentIndex = 0

    const streamInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setCurrentStreamingText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(streamInterval)
        // Add the complete message
        const newMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: fullText,
          timestamp: new Date(),
          actionPlan: actionPlanTemplate,
        }
        setMessages([newMessage])
        setCurrentStreamingText("")
        setIsGenerating(false)
        setShowActionPlan(true)
      }
    }, 30) // Adjust speed here (lower = faster)
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsGenerating(true)

    // Simulate AI response with streaming
    setTimeout(() => {
      const responses = [
        "I understand you'd like to modify the analysis. Let me adjust the parameters based on your feedback and provide an updated recommendation.",
        "Based on your input, I'm recalculating the risk assessment and adjusting the target levels. The updated analysis shows...",
        "Great question! Let me explain that aspect in more detail and how it affects our overall strategy for this position.",
      ]

      const responseText = responses[Math.floor(Math.random() * responses.length)]
      let currentIndex = 0

      const streamInterval = setInterval(() => {
        if (currentIndex < responseText.length) {
          setCurrentStreamingText(responseText.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(streamInterval)
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: responseText,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiMessage])
          setCurrentStreamingText("")
          setIsGenerating(false)
        }
      }, 25)
    }, 1000)
  }

  const handleApproveAndCreateFeed = () => {
    const params = new URLSearchParams({
      asset: actionPlanTemplate.asset,
      assetName: actionPlanTemplate.assetName,
      plan: "approved",
    })
    window.location.href = `/analysis/feed?${params.toString()}`
  }

  const ActionPlanCard = ({ plan }: { plan: any }) => (
    <Card className="mt-4 border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Action Plan: {plan.asset}</span>
          </CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {plan.confidence}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Asset Info */}
        <div className="p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{plan.assetName}</h3>
            <Badge
              variant="secondary"
              className={plan.recommendation === "BUY" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
            >
              {plan.recommendation}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Timeframe:</span>
              <p className="font-medium">{plan.timeframe}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Risk Level:</span>
              <p className="font-medium">{plan.riskLevel}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Analysis:</span>
              <p className="font-medium capitalize">{plan.analysisType}</p>
            </div>
          </div>
        </div>

        {/* Targets */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Target Price</span>
            </div>
            <p className="text-lg font-bold text-green-600">{plan.targetPrice}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Stop Loss</span>
            </div>
            <p className="text-lg font-bold text-red-600">{plan.stopLoss}</p>
          </div>
        </div>

        {/* Key Points */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Key Analysis Points
            </h4>
            <ul className="space-y-1">
              {plan.keyPoints.map((point: string, index: number) => (
                <li key={index} className="text-sm flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
              Risk Factors
            </h4>
            <ul className="space-y-1">
              {plan.risks.map((risk: string, index: number) => (
                <li key={index} className="text-sm flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Action Items</h4>
            <ul className="space-y-1">
              {plan.actionItems.map((item: string, index: number) => (
                <li key={index} className="text-sm flex items-start space-x-2">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-3 border-t">
          <Button onClick={handleApproveAndCreateFeed} className="flex-1" size="lg">
            Approve & Create Feed
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="lg">
            Modify Plan
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
              <Badge variant="secondary">AI Analysis</Badge>
            </div>
            <Link href="/analysis">
              <Button variant="ghost">Back to Analysis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Brain className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">VibeMarket AI Assistant</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Analyzing {asset} ({assetName})
                  </p>
                </div>
                {isGenerating && (
                  <div className="flex items-center space-x-2 ml-auto">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Analyzing...</span>
                  </div>
                )}
              </div>
            </CardHeader>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        className={message.role === "user" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}
                      >
                        {message.role === "user" ? "U" : <Brain className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.actionPlan && showActionPlan && <ActionPlanCard plan={message.actionPlan} />}
                      <p className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}

                {/* Streaming Message */}
                {currentStreamingText && (
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Brain className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%]">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <p className="text-sm whitespace-pre-wrap">
                          {currentStreamingText}
                          <span className="animate-pulse">|</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="border-t p-4">
              <div className="flex space-x-3">
                <Textarea
                  placeholder="Ask me to refine the analysis, explain any part, or modify the action plan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="min-h-[60px] resize-none"
                  disabled={isGenerating}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="self-end"
                  disabled={isGenerating || !chatInput.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
