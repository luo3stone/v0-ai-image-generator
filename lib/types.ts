export type ImageSize = '1024x1024' | '1792x1024' | '1024x1792' | '900x500'

export interface GenerationRequest {
  prompt: string
  size: ImageSize
  mode: 'normal' | 'cover'
}

export interface GenerationResult {
  id: string
  prompt: string
  imageUrl: string
  size: ImageSize
  mode: 'normal' | 'cover'
  createdAt: number
}

export interface GenerationHistory {
  results: GenerationResult[]
}
