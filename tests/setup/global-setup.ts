/**
 * Jest Global Setup
 * 全テスト開始前の共通セットアップ
 */

export default async function globalSetup(): Promise<void> {
  console.log('🧪 Setting up test environment...')
  
  // タイムゾーン設定
  process.env.TZ = 'UTC'
  
  // テスト用データベース接続設定（将来的にテストDB使用時）
  // await setupTestDatabase()
  
  console.log('✅ Test environment setup complete')
}