/**
 * テスト環境変数セットアップ
 */

// 環境変数の設定
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-publishable-key'
process.env.SUPABASE_SECRET_KEY = 'test-secret-key'

// テスト用設定
process.env.NEXT_PUBLIC_APP_ENV = 'test'
process.env.NEXT_PUBLIC_DEBUG_MODE = 'true'
process.env.SKIP_ENV_VALIDATION = 'true'