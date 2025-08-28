/**
 * Vitest Setup File
 * テスト実行前の共通設定
 */

import { beforeAll, beforeEach, afterAll, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { TestSupabaseClient } from '@lib/supabase/test-client'

// テスト環境変数の設定（.env.testから読み込み）
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_ENV = 'test'
process.env.NEXT_PUBLIC_DEBUG_MODE = 'true'
process.env.SKIP_ENV_VALIDATION = 'true'

// テスト用Supabase設定（必須環境変数を設定）
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lwruehfcvjjcsruovjxd.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cnVlaGZjdmpqY3NydW92anhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2NTYyNjYsImV4cCI6MjA1MDIzMjI2Nn0.7fH7dmNraxTtlV6QO9vhWg_tjfhm2df8zp4qdVJ3M5U'
process.env.SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cnVlaGZjdmpqY3NydW92anhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY1NjI2NiwiZXhwIjoyMDUwMjMyMjY2fQ.xUPNym3A7lOslH7O5vtg1Q_Go1fMYI8c7v3YQHNq-40'

// テスト用環境変数
process.env.TEST_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.TEST_SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  
process.env.TEST_SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY

// テストユーザー設定
process.env.TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
process.env.TEST_USER_EMAIL = 'test@example.com'
process.env.TEST_USER_NAME = 'Test User'

// 外部サービス テスト用環境変数
process.env.RESEND_API_KEY = 'test_resend_api_key'
process.env.FROM_EMAIL = 'test@example.com'
process.env.SENTRY_DSN = 'https://test@sentry.io/test'
process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/test/webhook'
process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test_recaptcha_site_key'
process.env.RECAPTCHA_SECRET_KEY = 'test_recaptcha_secret_key'

// テスト用のタイムゾーン設定
process.env.TZ = 'UTC'

// Console警告の抑制（テスト時）
const originalConsoleWarn = console.warn
console.warn = (...args) => {
  const warningMessage = args[0]
  
  // Next.js やReactの開発時警告を抑制
  if (
    typeof warningMessage === 'string' &&
    (warningMessage.includes('Warning: ReactDOM.render') ||
     warningMessage.includes('Warning: componentWillMount'))
  ) {
    return
  }
  
  originalConsoleWarn.apply(console, args)
}

// Fetch API のモック
global.fetch = vi.fn()

// 外部サービスのモック設定
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ 
        data: { id: 'test-email-id' }, 
        error: null 
      })
    }
  }))
}))

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  withSentry: vi.fn((handler) => handler),
  init: vi.fn()
}))

vi.mock('react-google-recaptcha-v3', () => ({
  GoogleReCaptchaProvider: ({ children }: any) => children,
  useGoogleReCaptcha: vi.fn(() => ({
    executeRecaptcha: vi.fn().mockResolvedValue('test-recaptcha-token')
  }))
}))

// DOM API のモック
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})

// テスト実行前のデータベース初期化
beforeAll(async () => {
  try {
    // データベース接続確認
    const isConnected = await TestSupabaseClient.checkConnection()
    if (!isConnected) {
      console.warn('Test database connection failed. Some tests may fail.')
    }
    
    // テストデータの初期化
    await TestSupabaseClient.cleanup()
    await TestSupabaseClient.seedTestData()
    
    console.log('Test database initialized successfully')
  } catch (error) {
    console.warn('Test database initialization failed:', error)
  }
})

// 各テスト前のクリーンアップ
beforeEach(async () => {
  vi.clearAllMocks()
  
  // テストクライアントをリセット（接続の再確立）
  TestSupabaseClient.reset()
})

// テスト完了後のクリーンアップ
afterAll(async () => {
  try {
    await TestSupabaseClient.cleanup()
    console.log('Test cleanup completed')
  } catch (error) {
    console.warn('Test cleanup failed:', error)
  }
})