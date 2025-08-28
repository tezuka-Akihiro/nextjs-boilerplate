/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@shared/types/database'

/**
 * テスト専用Supabaseクライアント
 * - テスト環境変数を使用
 * - 認証セッションを無効化
 * - Service Role権限で動作
 */
class TestSupabaseClient {
  private static instance: SupabaseClient<Database> | null = null
  
  static getInstance(): SupabaseClient<Database> {
    if (!this.instance) {
      const supabaseUrl = process.env.TEST_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
      const serviceKey = process.env.TEST_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY!
      
      this.instance = createClient<Database>(
        supabaseUrl,
        serviceKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
          },
          db: {
            schema: 'public'
          }
        }
      )
    }
    return this.instance
  }
  
  /**
   * テスト用データのクリーンアップ
   * - テスト関連データを削除
   * - シードデータを再投入
   */
  static async cleanup() {
    const client = this.getInstance()
    
    try {
      // テストデータのクリーンアップ（test%パターンのデータ）
      await client.from('users').delete().like('email', 'test%@example.com')
      await client.from('girlfriend_get_posts').delete().like('title', 'Test%')
      await client.from('activities').delete().like('title', 'Test%')
      
      console.log('Test data cleanup completed')
    } catch (error) {
      console.warn('Test data cleanup failed:', error)
    }
  }
  
  /**
   * テスト用シードデータの投入
   */
  static async seedTestData() {
    const client = this.getInstance()
    const testUserId = process.env.TEST_USER_ID || '00000000-0000-0000-0000-000000000001'
    const testUserEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    const testUserName = process.env.TEST_USER_NAME || 'Test User'
    
    try {
      // テスト用ユーザー作成
      const { data: existingUser } = await client
        .from('users')
        .select('id')
        .eq('id', testUserId)
        .single()
      
      if (!existingUser) {
        await client.from('users').insert([{
          id: testUserId,
          email: testUserEmail,
          name: testUserName,
          nickname: 'TestNick',
          girlfriend_goal_months: 6,
          habit_item: 'テスト用習慣化項目',
          experience: 0,
          level: 1,
          relationship_status: 'single',
          is_public: true
        }])
      }
      
      console.log('Test seed data inserted')
    } catch (error) {
      console.warn('Test seed data insertion failed:', error)
    }
  }
  
  /**
   * テスト用認証セッション設定
   * @param userId - 認証するユーザーID
   */
  static async authenticateTestUser(userId?: string) {
    const client = this.getInstance()
    const targetUserId = userId || process.env.TEST_USER_ID || '00000000-0000-0000-0000-000000000001'
    const testUserEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    
    // テスト環境では認証を無効化しているため、
    // 必要に応じて手動でuser contextを設定
    return {
      user: {
        id: targetUserId,
        email: testUserEmail,
        aud: 'authenticated',
        role: 'authenticated'
      }
    }
  }
  
  /**
   * データベース接続確認
   */
  static async checkConnection(): Promise<boolean> {
    try {
      const client = this.getInstance()
      const { data, error } = await client.from('users').select('count', { count: 'exact', head: true })
      
      if (error) {
        console.error('Database connection check failed:', error.message)
        return false
      }
      
      console.log('Database connection check passed')
      return true
    } catch (error) {
      console.error('Database connection check error:', error)
      return false
    }
  }
  
  /**
   * インスタンスのリセット（テスト間でのクリーンな状態確保）
   */
  static reset() {
    this.instance = null
  }
}

export { TestSupabaseClient }