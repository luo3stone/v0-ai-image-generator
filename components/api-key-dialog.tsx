'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface ApiKeyDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ApiKeyDialog({ open, onClose, onSuccess }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: '请输入 API Key',
        description: '阿里云 DashScope API Key 不能为空',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '保存失败')
      }

      toast({
        title: '保存成功',
        description: data.message || 'API Key 已保存',
      })

      onSuccess()
      setApiKey('')
    } catch (error) {
      toast({
        title: '保存失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>配置阿里云 API Key</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>检测到未配置 API Key，请输入您的阿里云百炼 DashScope API Key 以使用图片生成功能。</p>
            <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
              <p className="font-medium text-foreground">如何获取 API Key：</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>访问 <a href="https://dashscope.console.aliyun.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">阿里云百炼控制台</a></li>
                <li>登录您的阿里云账号</li>
                <li>在 API Keys 页面创建或获取您的 API Key</li>
              </ol>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="apiKey">API Key</Label>
          <Textarea
            id="apiKey"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="min-h-[80px] resize-none font-mono text-sm"
            disabled={isSaving}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isSaving}>
            稍后配置
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存配置'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
