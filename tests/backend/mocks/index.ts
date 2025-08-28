/**
 * モック関連のエクスポート
 * テストファイルから簡単にアクセスできるように統合
 */

// Supabase モック
export {
  createMockSupabaseClient,
  mockDataStore,
  mockUtils,
  type MockSupabaseResponse,
  type MockSupabaseQueryBuilder,
  type MockSupabaseSelect
} from './supabase.mock'

// UserResource モック
export {
  createMockUserResource,
  setupUserResourceMock,
  customizeUserResourceMock,
  createErrorMockUserResource,
  createLargeDataMockUserResource,
  mockUserData
} from './user-resource.mock'

// 共通モックユーティリティ
export const mockHelpers = {
  /**
   * 全てのモックをリセット
   */
  resetAllMocks: () => {
    mockUtils.reset()
  },
  
  /**
   * テスト用の固定日時を取得
   */
  getFixedDate: (offset: number = 0) => {
    return new Date('2024-01-01T00:00:00.000Z').getTime() + offset
  },
  
  /**
   * ランダムなUUID形式の文字列を生成
   */
  generateMockId: () => {
    return 'mock-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now()
  },
  
  /**
   * テスト用のEmailアドレスを生成
   */
  generateTestEmail: (prefix: string = 'test') => {
    return `${prefix}-${Date.now()}@example.com`
  },
  
  /**
   * 遅延を発生させる（非同期処理のテスト用）
   */
  delay: (ms: number = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  
  /**
   * ランダムな文字列を生成
   */
  randomString: (length: number = 10) => {
    return Math.random().toString(36).substring(2, 2 + length)
  }
}

export default {
  createMockSupabaseClient,
  createMockUserResource,
  setupUserResourceMock,
  mockHelpers,
  mockUtils
}