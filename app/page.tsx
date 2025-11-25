'use client'

import { useState, useEffect } from 'react'
import { Sparkles, History, ImageIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageGenerator } from '@/components/image-generator'
import { HistoryPanel } from '@/components/history-panel'
import { ApiKeyDialog } from '@/components/api-key-dialog'

export default function Home() {
  const [historyRefresh, setHistoryRefresh] = useState(0)
  const [activeTab, setActiveTab] = useState('generate')
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(true)

  const handleHistoryUpdate = () => {
    setHistoryRefresh((prev) => prev + 1)
  }

  const checkApiKey = async () => {
    try {
      const response = await fetch('/api/config')
      const data = await response.json()

      if (!data.configured) {
        setIsApiKeyConfigured(false)
        setShowApiKeyDialog(true)
      } else {
        setIsApiKeyConfigured(true)
      }
    } catch (error) {
      console.error('Failed to check API key:', error)
    }
  }

  useEffect(() => {
    checkApiKey()
  }, [])

  const handleApiKeySuccess = () => {
    setShowApiKeyDialog(false)
    // 提示用户刷新页面
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const handleApiKeyClose = () => {
    setShowApiKeyDialog(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <ApiKeyDialog
        open={showApiKeyDialog}
        onClose={handleApiKeyClose}
        onSuccess={handleApiKeySuccess}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="rounded-lg bg-primary p-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            AI 图片生成助手
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            每次生成同时输出两张图片，支持多种尺寸，包含公众号封面专用尺寸，为内容创作提供更丰富的选择
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="generate" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">图片生成</span>
              <span className="sm:hidden">生成</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">历史记录</span>
              <span className="sm:hidden">历史</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI 图片生成</CardTitle>
                  <CardDescription>输入提示词生成两张不同风格的 AI 图片</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageGenerator
                    mode="normal"
                    onHistoryUpdate={handleHistoryUpdate}
                    isApiKeyConfigured={isApiKeyConfigured}
                    onShowApiKeyDialog={() => setShowApiKeyDialog(true)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>使用说明</CardTitle>
                  <CardDescription>如何获得更好的生成效果</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">🎯 核心功能</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li><strong>双图生成：</strong>每次提示同时输出两张图片</li>
                      <li><strong>多种尺寸：</strong>支持正方形、横向、纵向、公众号封面</li>
                      <li><strong>智能适配：</strong>封面图自动添加公众号优化描述</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">💡 提示词建议</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>描述要具体，包含主体、风格、色调</li>
                      <li>例如：「简约科技风格，蓝色渐变背景，几何装饰」</li>
                      <li>封面图会自动添加适配优化提示</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">📐 尺寸说明</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li><strong>正方形 (1024×1024)：</strong>适合社交媒体头像、Instagram</li>
                      <li><strong>横向 (1792×1024)：</strong>适合网站 Banner、横屏展示</li>
                      <li><strong>纵向 (1024×1792)：</strong>适合手机壁纸、竖屏内容</li>
                      <li><strong>公众号封面 (900×500)：</strong>完美适配微信公众号封面</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>历史记录</CardTitle>
                <CardDescription>
                  最近生成的图片记录，自动保存最近 20 条
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HistoryPanel
                  refreshTrigger={historyRefresh}
                  onRegenerate={(prompt) => {
                    // 可以在这里实现重新生成的逻辑
                    setActiveTab('normal')
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>所有图片由 AI 生成，可商用且无侵权风险</p>
        </div>
      </div>
    </div>
  )
}
