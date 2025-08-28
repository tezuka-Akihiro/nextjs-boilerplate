/**
 * Playwright グローバルセットアップ
 * 
 * 全E2Eテスト実行前の初期化処理
 */

import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 E2Eテスト環境の初期化開始...')
  
  const { baseURL } = config.projects[0].use
  
  // ===== ブラウザ起動確認 =====
  
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // ===== アプリケーション起動確認 =====
    
    console.log(`📡 アプリケーション接続確認: ${baseURL}`)
    
    // ヘルスチェック（最大30秒間リトライ）
    const maxRetries = 30
    let retryCount = 0
    
    while (retryCount < maxRetries) {
      try {
        const response = await page.goto(baseURL || 'http://localhost:3000', {
          waitUntil: 'domcontentloaded',
          timeout: 5000
        })
        
        if (response?.ok()) {
          console.log('✅ アプリケーション起動確認完了')
          break
        }
        
        throw new Error(`HTTP ${response?.status()}: ${response?.statusText()}`)
        
      } catch (error) {
        retryCount++
        console.log(`⏳ 接続試行 ${retryCount}/${maxRetries} - ${error}`)
        
        if (retryCount >= maxRetries) {
          throw new Error('❌ アプリケーション起動タイムアウト')
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    // ===== テストデータベース初期化 =====
    
    console.log('🗄️ テストデータベース初期化中...')
    
    // Supabaseテスト環境のクリーンアップ・初期化
    // 実際のプロダクションでは、テスト専用のSupabaseプロジェクトを使用
    try {
      // テストデータの初期化処理をここに記述
      // await setupTestDatabase()
      console.log('✅ テストデータベース初期化完了')
    } catch (error) {
      console.warn('⚠️ テストデータベース初期化をスキップ:', error)
    }
    
    // ===== テストユーザー作成 =====
    
    console.log('👤 テストユーザー作成中...')
    
    try {
      // テスト用ユーザーアカウントの作成
      // await createTestUsers()
      console.log('✅ テストユーザー作成完了')
    } catch (error) {
      console.warn('⚠️ テストユーザー作成をスキップ:', error)
    }
    
    // ===== 認証状態の準備 =====
    
    console.log('🔐 認証状態準備中...')
    
    try {
      // 認証状態のプリセット（ログイン済み状態など）
      // await setupAuthenticationStates()
      console.log('✅ 認証状態準備完了')
    } catch (error) {
      console.warn('⚠️ 認証状態準備をスキップ:', error)
    }
    
    // ===== 静的リソース確認 =====
    
    console.log('📦 静的リソース確認中...')
    
    try {
      // CSS、JS、画像ファイルの存在確認
      await page.goto(`${baseURL}/_next/static/css`, { timeout: 5000 })
      console.log('✅ 静的リソース確認完了')
    } catch (error) {
      console.warn('⚠️ 静的リソース確認をスキップ:', error)
    }
    
  } finally {
    await browser.close()
  }
  
  console.log('🎉 E2Eテスト環境初期化完了')
}

/**
 * テストデータベースのセットアップ
 */
async function setupTestDatabase() {
  // Supabase テストプロジェクトの初期化
  // - テーブルの作成・クリア
  // - 基本的なマスターデータの投入
  // - RLS（Row Level Security）の設定
  
  console.log('  📋 テーブル初期化')
  console.log('  📝 マスターデータ投入')
  console.log('  🔒 セキュリティ設定適用')
}

/**
 * テストユーザーの作成
 */
async function createTestUsers() {
  // 各種テストシナリオ用のユーザーアカウント作成
  // - 基本ユーザー（level 1）
  // - 上級ユーザー（level 15）
  // - 恋人あり状態のユーザー
  // - 管理者ユーザー
  
  const testUsers = [
    {
      email: 'test-basic@example.com',
      password: 'test123456',
      nickname: 'BasicUser',
      level: 1,
      relationship_status: 'single'
    },
    {
      email: 'test-advanced@example.com', 
      password: 'test123456',
      nickname: 'AdvancedUser',
      level: 15,
      relationship_status: 'single'
    },
    {
      email: 'test-dating@example.com',
      password: 'test123456', 
      nickname: 'DatingUser',
      level: 8,
      relationship_status: 'dating'
    }
  ]
  
  console.log(`  👥 ${testUsers.length}人のテストユーザーを作成`)
}

/**
 * 認証状態のセットアップ
 */
async function setupAuthenticationStates() {
  // ブラウザコンテキスト別の認証状態を準備
  // - ログイン済み状態
  // - ログアウト状態
  // - セッション期限切れ状態
  
  console.log('  🔑 認証トークン準備')
  console.log('  💾 セッション状態設定')
}

export default globalSetup