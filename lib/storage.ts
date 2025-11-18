import { GenerationResult, GenerationHistory } from './types'

const STORAGE_KEY = 'ai_image_history'
const MAX_HISTORY = 20

export const historyStorage = {
  // 获取历史记录
  getHistory: (): GenerationResult[] => {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []
      const history: GenerationHistory = JSON.parse(data)
      return history.results || []
    } catch (error) {
      console.error('Failed to get history:', error)
      return []
    }
  },

  // 添加新记录
  addResult: (result: GenerationResult): void => {
    if (typeof window === 'undefined') return
    try {
      const history = historyStorage.getHistory()
      const newHistory = [result, ...history].slice(0, MAX_HISTORY)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ results: newHistory }))
    } catch (error) {
      console.error('Failed to add result:', error)
    }
  },

  // 删除记录
  deleteResult: (id: string): void => {
    if (typeof window === 'undefined') return
    try {
      const history = historyStorage.getHistory()
      const newHistory = history.filter((item) => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ results: newHistory }))
    } catch (error) {
      console.error('Failed to delete result:', error)
    }
  },

  // 清空历史记录
  clearHistory: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  },
}
