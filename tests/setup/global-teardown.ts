/**
 * Jest Global Teardown
 * 全テスト終了後のクリーンアップ
 */

export default async function globalTeardown(): Promise<void> {
  console.log('🧹 Cleaning up test environment...')
  
  // テストデータのクリーンアップ（将来的にテストDB使用時）
  // await cleanupTestDatabase()
  
  console.log('✅ Test environment cleanup complete')
}