/**
 * テスト設定ファイル
 * 
 * 統合テスト・ユニットテスト共通設定
 */

export const testConfig = {
  // 認証設定
  auth: {
    testUserId: process.env.TEST_USER_ID || '00000000-0000-0000-0000-000000000001',
    testUserEmail: process.env.TEST_USER_EMAIL || 'test@example.com',
    testUserName: process.env.TEST_USER_NAME || 'Test User',
    testUserNickname: 'TestNick'
  },
  
  // データベース設定
  database: {
    testTablePrefix: 'test_',
    cleanupPattern: 'test%@example.com',
    maxRetries: 3,
    retryDelay: 1000
  },
  
  // テストタイムアウト
  timeouts: {
    integration: 10000,
    unit: 5000,
    setup: 30000
  },
  
  // モック設定
  mocks: {
    enableNetworkMocks: true,
    enableSupabaseMocks: false, // 統合テストでは実際のDBを使用
    mockDataSize: 100
  },
  
  // カバレッジ設定
  coverage: {
    threshold: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    },
    exclude: [
      'node_modules/**',
      'tests/**',
      'docs/**',
      '**/*.d.ts',
      '**/*.config.*'
    ]
  }
}

export default testConfig