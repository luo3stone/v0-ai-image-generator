import { NextRequest, NextResponse } from 'next/server'

// 检查服务器端的 API key 配置（从环境变量）
export async function GET() {
  try {
    const apiKey = process.env.DASHSCOPE_API_KEY
    const apiUrl = process.env.DASHSCOPE_API_URL

    return NextResponse.json({
      configured: !!(apiKey && apiUrl),
      hasKey: !!apiKey,
      hasUrl: !!apiUrl,
      isServerSide: true // 标记这是服务器端配置
    })
  } catch (error) {
    console.error('Check config error:', error)
    return NextResponse.json(
      { error: '检查配置失败' },
      { status: 500 }
    )
  }
}

// 验证 API key 是否有效
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

    // 验证 API key 格式（基本验证）
    if (!apiKey.trim().startsWith('sk-')) {
      return NextResponse.json(
        { error: 'API Key 格式不正确，应以 sk- 开头' },
        { status: 400 }
      )
    }

    // 这里可以选择性地测试 API key 是否有效
    // 但为了简化，我们只做格式验证
    return NextResponse.json({
      success: true,
      message: 'API Key 格式验证通过，已保存到本地'
    })
  } catch (error) {
    console.error('Validate config error:', error)
    return NextResponse.json(
      { error: '验证配置失败' },
      { status: 500 }
    )
  }
}
