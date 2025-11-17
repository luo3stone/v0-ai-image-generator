'use client'

import { useState, useEffect } from 'react'
import { Trash2, Download, RotateCw, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { historyStorage } from '@/lib/storage'
import type { GenerationResult } from '@/lib/types'

interface HistoryPanelProps {
  refreshTrigger?: number
  onRegenerate?: (prompt: string, size: string) => void
}

export function HistoryPanel({ refreshTrigger, onRegenerate }: HistoryPanelProps) {
  const [history, setHistory] = useState<GenerationResult[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadHistory()
  }, [refreshTrigger])

  const loadHistory = () => {
    const data = historyStorage.getHistory()
    setHistory(data)
  }

  const handleDelete = (id: string) => {
    historyStorage.deleteResult(id)
    loadHistory()
    toast({
      title: '已删除',
      description: '历史记录已删除',
    })
  }

  const handleClearAll = () => {
    historyStorage.clearHistory()
    loadHistory()
    toast({
      title: '已清空',
      description: '所有历史记录已清空',
    })
  }

  const handleDownload = (result: GenerationResult) => {
    const link = document.createElement('a')
    link.href = result.imageUrl
    link.download = `ai-image-${result.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: '下载成功',
      description: '图片已保存到本地',
    })
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">暂无历史记录</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          生成的图片将自动保存在这里，最多保存 20 条记录
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">历史记录 ({history.length})</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              清空全部
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认清空历史记录？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作将删除所有历史记录，且无法恢复。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll}>确认清空</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((result) => (
          <Card key={result.id} className="overflow-hidden group">
            <div className="aspect-video relative bg-muted">
              <img
                src={result.imageUrl || "/placeholder.svg"}
                alt={result.prompt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 space-y-2">
              <p className="text-sm line-clamp-2 min-h-[2.5rem]">{result.prompt}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{result.size}</span>
                <span>·</span>
                <span>{new Date(result.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(result)}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onRegenerate?.(result.prompt, result.size)}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除？</AlertDialogTitle>
                      <AlertDialogDescription>
                        此操作将删除该历史记录，且无法恢复。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(result.id)}>
                        确认删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
