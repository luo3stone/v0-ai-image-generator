import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const ENV_PATH = path.join(process.cwd(), '.env.local')

// 检查 API key 是否已配置
export async function GET() {
  try {
    const apiKey = process.env.DASHSCOPE_API_KEY
    const apiUrl = process.env.DASHSCOPE_API_URL

    return NextResponse.json({
      configured: !!(apiKey && apiUrl),
      hasKey: !!apiKey,
      hasUrl: !!apiUrl
    })
  } catch (error) {
    console.error('Check config error:', error)
    return NextResponse.json(
      { error: '检查配置失败' },
      { status: 500 }
    )
  }
}

// 保存 API key 到 .env.local
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey } = body

    if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
      return NextResponse.json(
        { error: '请提供有效的 API Key' },
        { status: 400 }
      )
    }

    // 读取现有的 .env.local 文件
    let envContent = ''
    try {
      envContent = await fs.readFile(ENV_PATH, 'utf-8')
    } catch (error) {
      // 文件不存在，创建新文件
      console.log('.env.local not found, creating new file')
    }

    // 更新或添加 API key
    const lines = envContent.split('\n')
    let keyFound = false
    const newLines = lines.map(line => {
      if (line.startsWith('DASHSCOPE_API_KEY=')) {
        keyFound = true
        return `DASHSCOPE_API_KEY=${apiKey.trim()}`
      }
      return line
    })

    if (!keyFound) {
      newLines.push(`DASHSCOPE_API_KEY=${apiKey.trim()}`)
    }

    // 确保有 API URL
    const hasUrl = newLines.some(line => line.startsWith('DASHSCOPE_API_URL='))
    if (!hasUrl) {
      newLines.push('DASHSCOPE_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation')
    }

    // 写入文件
    await fs.writeFile(ENV_PATH, newLines.join('\n'), 'utf-8')

    // 更新当前进程的环境变量（需要重启 Next.js dev server 才能生效）
    process.env.DASHSCOPE_API_KEY = apiKey.trim()

    return NextResponse.json({
      success: true,
      message: 'API Key 已保存，请刷新页面以应用更改'
    })
  } catch (error) {
    console.error('Save config error:', error)
    return NextResponse.json(
      { error: '保存配置失败' },
      { status: 500 }
    )
  }
}
