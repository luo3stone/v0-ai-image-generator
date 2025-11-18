'use client'

import { useState } from 'react'
import { Sparkles, Download, Loader2, ImageIcon } from 'lucide-react'
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
import type { ImageSize, GenerationResult, DualGenerationResult } from '@/lib/types'

interface ImageGeneratorProps {
  mode: 'normal'
  onHistoryUpdate?: () => void
}

export function ImageGenerator({ mode, onHistoryUpdate }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState<ImageSize>('1024x1024')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<DualGenerationResult | null>(null)
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
    setGeneratedImages(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, mode }),
      })

      if (!response.ok) {
        throw new Error('生成失败')
      }

      const data = await response.json()

      const result: DualGenerationResult = {
        id: Date.now().toString(),
        prompt,
        images: data.images,
        mode: data.mode,
        createdAt: Date.now(),
      }

      setGeneratedImages(result)

      // 分别保存两个结果到历史记录
      data.images.forEach((image: any, index: number) => {
        const historyResult: GenerationResult = {
          id: `${result.id}-${index + 1}`,
          prompt,
          imageUrl: image.imageUrl,
          size: image.size,
          mode: mode,
          createdAt: result.createdAt,
        }
        historyStorage.addResult(historyResult)
      })

      onHistoryUpdate?.()

      toast({
        title: '生成成功',
        description: `已生成两张${size === '900x500' ? '公众号封面' : '图片'}`,
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

  const handleDownload = (imageUrl: string, suffix: string) => {
    if (!generatedImages) return

    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `ai-image-${generatedImages.id}-${suffix}.png`
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
            placeholder="例如：科技感蓝色背景、简约的 AI 大脑图标，现代风格"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isGenerating}
          />
        </div>

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
              <SelectItem value="900x500">公众号封面 (900×500)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p>🎯 每次生成将同时输出两张图片：</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>两张图片均为 {size === '900x500' ? '900×500' : size} 尺寸</li>
            <li>同一提示词，不同的生成结果</li>
            <li>公众号封面会自动添加适配优化</li>
          </ul>
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              生成两张图片
            </>
          )}
        </Button>
      </div>

      {generatedImages && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className={`relative bg-muted ${size === '900x500' ? 'aspect-[16/9]' : 'aspect-[1/1]'}`}>
                  <img
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`图片 ${index + 1}：${generatedImages.prompt}`}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                    size === '900x500'
                      ? 'bg-orange-500/80 text-white'
                      : 'bg-primary/80 text-primary-foreground'
                  }`}>
                    {size === '900x500' ? '封面图' : '图片'} {index + 1}
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-1">
                      {size === '900x500' ? (
                        <Sparkles className="h-3 w-3" />
                      ) : (
                        <ImageIcon className="h-3 w-3" />
                      )}
                      {size === '900x500' ? '公众号封面' : '图片'} ({image.size})
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{generatedImages.prompt}</p>
                  </div>
                  <Button
                    onClick={() => handleDownload(image.imageUrl, `image-${index + 1}`)}
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    下载图片 {index + 1}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* 提示信息 */}
          <div className="rounded-lg border bg-muted/50 p-3 text-sm">
            <p className="text-muted-foreground">
              💡 <strong>使用建议：</strong>
              {size === '900x500'
                ? '这两张封面图都优化用于微信公众号，选择您更喜欢的一张使用。'
                : '这两张图片可用于社交媒体配图、文章插图、海报设计等多种场景。'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
