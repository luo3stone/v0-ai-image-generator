'use client'

import { useState } from 'react'
import { Sparkles, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { historyStorage } from '@/lib/storage'
import type { ImageSize, GenerationResult } from '@/lib/types'

interface ImageGeneratorProps {
  mode: 'normal' | 'cover'
  onHistoryUpdate?: () => void
}

export function ImageGenerator({ mode, onHistoryUpdate }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState<ImageSize>(mode === 'cover' ? '900x500' : '1024x1024')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<GenerationResult | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: '请输入提示词',
        description: '请描述您想要生成的图片内容',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      // 模拟 API 调用
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, mode }),
      })

      if (!response.ok) {
        throw new Error('生成失败')
      }

      const data = await response.json()

      const result: GenerationResult = {
        id: Date.now().toString(),
        prompt,
        imageUrl: data.imageUrl,
        size,
        mode,
        createdAt: Date.now(),
      }

      setGeneratedImage(result)
      historyStorage.addResult(result)
      onHistoryUpdate?.()

      toast({
        title: '生成成功',
        description: '图片已生成，可以下载使用',
      })
    } catch (error) {
      toast({
        title: '生成失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.href = generatedImage.imageUrl
    link.download = `ai-image-${generatedImage.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: '下载成功',
      description: '图片已保存到本地',
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">描述您想要的图片</Label>
          <Textarea
            id="prompt"
            placeholder={
              mode === 'cover'
                ? '例如：科技感蓝色背景、简约的 AI 大脑图标，适合公众号封面'
                : '例如：一只可爱的猫咪坐在窗台上，阳光洒在身上，温馨的氛围'
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isGenerating}
          />
        </div>

        {mode === 'normal' && (
          <div className="space-y-2">
            <Label htmlFor="size">图片尺寸</Label>
            <Select value={size} onValueChange={(value) => setSize(value as ImageSize)} disabled={isGenerating}>
              <SelectTrigger id="size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1024x1024">正方形 (1024×1024)</SelectItem>
                <SelectItem value="1792x1024">横向 (1792×1024)</SelectItem>
                <SelectItem value="1024x1792">纵向 (1024×1792)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {mode === 'cover' && (
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p>封面图尺寸已自动设置为 900×500 (公众号推荐尺寸)</p>
          </div>
        )}

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              生成图片
            </>
          )}
        </Button>
      </div>

      {generatedImage && (
        <Card className="overflow-hidden">
          <div className="aspect-[2/1] relative bg-muted">
            <img
              src={generatedImage.imageUrl || "/placeholder.svg"}
              alt={generatedImage.prompt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">生成的图片</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{generatedImage.prompt}</p>
            </div>
            <Button onClick={handleDownload} className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              下载图片
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
