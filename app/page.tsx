'use client'

import { useState } from 'react'
import { Sparkles, History, ImageIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageGenerator } from '@/components/image-generator'
import { HistoryPanel } from '@/components/history-panel'

export default function Home() {
  const [historyRefresh, setHistoryRefresh] = useState(0)
  const [activeTab, setActiveTab] = useState('normal')

  const handleHistoryUpdate = () => {
    setHistoryRefresh((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
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
            为公众号创作者提供简单、稳定、无侵权风险的 AI 封面图和文中插图生成工具
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="normal" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">常规生成</span>
              <span className="sm:hidden">常规</span>
            </TabsTrigger>
            <TabsTrigger value="cover" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">公众号封面</span>
              <span className="sm:hidden">封面</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">历史记录</span>
              <span className="sm:hidden">历史</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="normal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>常规图片生成</CardTitle>
                  <CardDescription>输入提示词生成自定义尺寸的 AI 图片</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageGenerator mode="normal" onHistoryUpdate={handleHistoryUpdate} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>使用说明</CardTitle>
                  <CardDescription>如何获得更好的生成效果</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">💡 提示词建议</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>描述要具体，包含主体、风格、色调</li>
                      <li>例如：「简约科技风格，蓝色渐变背景」</li>
                      <li>避免模糊的描述，如「好看的图片」</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">📐 尺寸选择</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>正方形：适合社交媒体头像、Instagram</li>
                      <li>横向：适合网站 Banner、横屏展示</li>
                      <li>纵向：适合手机壁纸、竖屏内容</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">⚡ 生成建议</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>首次生成约需 5-15 秒</li>
                      <li>可多次调整提示词优化结果</li>
                      <li>历史记录自动保存最近 20 次</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cover" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>公众号封面图生成</CardTitle>
                  <CardDescription>
                    自动适配公众号推荐尺寸 (900×500)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageGenerator mode="cover" onHistoryUpdate={handleHistoryUpdate} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>封面图模板建议</CardTitle>
                  <CardDescription>常见风格参考</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border bg-card">
                      <h4 className="font-medium text-sm mb-1">🎨 科技风</h4>
                      <p className="text-xs text-muted-foreground">
                        蓝色渐变背景，几何线条装饰，科技感芯片图案，简约现代
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border bg-card">
                      <h4 className="font-medium text-sm mb-1">✏️ 手绘风</h4>
                      <p className="text-xs text-muted-foreground">
                        水彩插画风格，温暖色调，可爱卡通元素，轻松活泼
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border bg-card">
                      <h4 className="font-medium text-sm mb-1">🎯 简约风</h4>
                      <p className="text-xs text-muted-foreground">
                        纯色或渐变背景，极简图标，大标题空间，专业商务
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border bg-card">
                      <h4 className="font-medium text-sm mb-1">🌈 渐变风</h4>
                      <p className="text-xs text-muted-foreground">
                        多彩渐变色，流动曲线，现代时尚，视觉冲击力强
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      💡 提示：封面图应该简洁明了，避免过于复杂的元素，确保文字可读性
                    </p>
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
