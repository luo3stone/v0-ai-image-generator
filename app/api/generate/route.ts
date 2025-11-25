import { NextRequest, NextResponse } from 'next/server'

async function generateSingleImage(prompt: string, size: string, apiKey: string, apiUrl: string): Promise<string> {
  // 调用阿里云百炼API
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "qwen-image-plus",
      input: {
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      parameters: {
        negative_prompt: "",
        prompt_extend: true,
        watermark: false,
        size: size
      }
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('DashScope API error:', errorData)
    throw new Error(`阿里云百炼API调用失败: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  // 检查API响应 - 检查是否有错误
  if (data.code && data.code !== 200) {
    console.error('DashScope API response:', JSON.stringify(data, null, 2))
    throw new Error(`生成失败: ${data.message || data.code || '未知错误'}`)
  }

  // 获取图片URL - 根据实际API响应格式
  const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image

  if (!imageUrl) {
    console.error('No image URL found in response:', JSON.stringify(data, null, 2))
    throw new Error('未能获取生成的图片URL')
  }

  return imageUrl
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, size, mode } = body

    // 检查API密钥和URL
    const apiKey = process.env.DASHSCOPE_API_KEY
    const apiUrl = process.env.DASHSCOPE_API_URL

    if (!apiKey) {
      throw new Error('DASHSCOPE_API_KEY 环境变量未配置')
    }

    if (!apiUrl) {
      throw new Error('DASHSCOPE_API_URL 环境变量未配置')
    }

    let outputSize = "1328*1328" // 默认正方形
    let basePrompt = prompt

    if (mode === 'cover') {
      outputSize = "1664*928" // 对应 900x500
      basePrompt = `公众号封面图：${prompt}，适合公众号封面展示，简洁明了，具有视觉冲击力`
    } else {
      // 根据尺寸设置输出尺寸
      if (size === "1792x1024") {
        outputSize = "1664*928" // 横向
      } else if (size === "1024x1792") {
        outputSize = "928*1664" // 纵向
      }
    }

    // 并发生成两张相同尺寸的图片
    const [image1Url, image2Url] = await Promise.all([
      generateSingleImage(basePrompt, outputSize, apiKey, apiUrl),
      generateSingleImage(basePrompt, outputSize, apiKey, apiUrl)
    ])

    return NextResponse.json({
      images: [
        { imageUrl: image1Url, size: mode === 'cover' ? '900x500' : size },
        { imageUrl: image2Url, size: mode === 'cover' ? '900x500' : size }
      ],
      mode
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      {
        error: '生成失败，请稍后重试',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
