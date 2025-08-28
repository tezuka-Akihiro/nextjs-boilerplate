/**
 * E2Eテストのサンプル
 * 
 * Playwright を使用した基本的なE2Eテストの例
 */

import { test, expect } from '@playwright/test'
import { E2ETestBase } from './base/E2ETestBase'
import { userFixtures, postFixtures, apiResponseFixtures } from './fixtures/e2e-fixtures'

class ExampleE2ETest extends E2ETestBase {
  
  /**
   * ホームページのテスト
   */
  async testHomePage() {
    await this.testBasicPageLoad('/', 'projectname - 男磨きSNS')
    await this.expectElementToBeVisible('[data-testid="hero-section"]')
    await this.expectElementToContainText('[data-testid="app-title"]', 'projectname')
  }

  /**
   * 認証フローのテスト
   */
  async testAuthenticationFlow() {
    // ログインページへ移動
    await this.navigateTo('/auth/signin')
    await this.expectPageTitle('ログイン - projectname')

    // 無効な認証情報でのログイン試行
    await this.fillText('[data-testid="email-input"]', 'invalid@example.com')
    await this.fillText('[data-testid="password-input"]', 'wrongpassword')
    await this.page.click('[data-testid="login-button"]')
    
    // エラーメッセージの確認
    await this.expectElementToBeVisible('[data-testid="error-message"]')
    await this.expectElementToContainText('[data-testid="error-message"]', 'メールアドレスまたはパスワードが正しくありません')

    // 正しい認証情報でのログイン
    await this.fillText('[data-testid="email-input"]', userFixtures.basicUser.email)
    await this.fillText('[data-testid="password-input"]', userFixtures.basicUser.password)
    await this.page.click('[data-testid="login-button"]')

    // ダッシュボードへのリダイレクト確認
    await this.expectCurrentUrl('/dashboard')
    await this.expectToBeAuthenticated()
  }

  /**
   * ダッシュボードのテスト
   */
  async testDashboard() {
    // ログイン状態でダッシュボードへ
    await this.login('basic')
    
    // 基本要素の表示確認
    await this.expectElementToBeVisible('[data-testid="welcome-message"]')
    await this.expectElementToContainText('[data-testid="welcome-message"]', userFixtures.basicUser.nickname)
    
    // 経験値の表示確認
    await this.expectElementToBeVisible('[data-testid="experience-display"]')
    await this.expectElementToBeVisible('[data-testid="xp-gauge"]')
    
    // 投稿ボタンの確認
    await this.expectElementToBeVisible('[data-testid="post-button"]')
  }

  /**
   * 投稿機能のテスト
   */
  async testPostCreation() {
    await this.login('basic')
    
    // 投稿ボタンクリック
    await this.page.click('[data-testid="post-button"]')
    
    // 投稿フォームの表示確認
    await this.expectElementToBeVisible('[data-testid="post-content"]')
    await this.expectElementToBeVisible('[data-testid="post-category"]')
    
    // 投稿内容入力
    await this.fillText('[data-testid="post-content"]', postFixtures.basicPost.content)
    await this.selectOption('[data-testid="post-category"]', postFixtures.basicPost.category)
    
    // 投稿送信
    await this.page.click('[data-testid="post-submit"]')
    
    // 成功メッセージの確認
    await this.expectToastMessage('投稿が完了しました')
    
    // ダッシュボードに戻ることを確認
    await this.expectCurrentUrl('/dashboard')
  }
}

// ===== テストケース =====

test.describe('ホームページ', () => {
  test('基本的な表示要素を確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    await testRunner.testHomePage()
  })

  test('レスポンシブ表示を確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    await testRunner.testResponsiveLayout('/')
  })
})

test.describe('認証機能', () => {
  test('ログインフローを確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    await testRunner.testAuthenticationFlow()
  })

  test('ログアウト機能を確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    
    // ログイン
    await testRunner.login('basic')
    await testRunner.expectToBeAuthenticated()
    
    // ログアウト
    await testRunner.logout()
    await testRunner.expectToBeUnauthenticated()
  })
})

test.describe('ダッシュボード', () => {
  test('基本要素の表示を確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    await testRunner.testDashboard()
  })

  test('ナビゲーション機能を確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    
    await testRunner.login('basic')
    
    // プロフィールページへの遷移
    await testRunner.clickNavigation('profileLink')
    await testRunner.expectCurrentUrl('/profile')
    
    // 設定ページへの遷移
    await testRunner.clickNavigation('settingsLink')
    await testRunner.expectCurrentUrl('/settings')
    
    // ホームへの遷移
    await testRunner.clickNavigation('homeLink')
    await testRunner.expectCurrentUrl('/dashboard')
  })
})

test.describe('投稿機能', () => {
  test('基本的な投稿作成を確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    await testRunner.testPostCreation()
  })

  test('投稿バリデーションを確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    
    await testRunner.login('basic')
    await testRunner.page.click('[data-testid="post-button"]')
    
    // 空の投稿で送信
    await testRunner.page.click('[data-testid="post-submit"]')
    
    // エラーメッセージの確認
    await testRunner.expectElementToBeVisible('[data-testid="error-message"]')
    await testRunner.expectElementToContainText('[data-testid="error-message"]', '投稿内容を入力してください')
  })

  test('投稿キャンセルを確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    
    await testRunner.login('basic')
    await testRunner.page.click('[data-testid="post-button"]')
    
    // キャンセルボタンクリック
    await testRunner.page.click('[data-testid="post-cancel"]')
    
    // ダッシュボードに戻ることを確認
    await testRunner.expectCurrentUrl('/dashboard')
  })
})

test.describe('アクセシビリティ', () => {
  test('キーボードナビゲーションを確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    
    await testRunner.navigateTo('/')
    await testRunner.testAccessibility()
  })

  test('スクリーンリーダー対応を確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    
    await testRunner.navigateTo('/')
    
    // ARIA ラベルの確認
    const button = await testRunner.page.locator('[data-testid="login-button"]')
    await testRunner.expectElementToHaveAttribute('[data-testid="login-button"]', 'aria-label')
    
    // 見出しの階層確認
    const headings = await testRunner.page.locator('h1, h2, h3, h4, h5, h6').count()
    expect(headings).toBeGreaterThan(0)
  })
})

test.describe('パフォーマンス', () => {
  test('ページ読み込み時間を確認', async ({ page, context }) => {
    const testRunner = new ExampleE2ETest(page, context)
    
    const startTime = Date.now()
    await testRunner.navigateTo('/')
    await testRunner.expectElementToBeVisible('[data-testid="hero-section"]')
    const loadTime = Date.now() - startTime
    
    // 3秒以内での読み込みを期待
    expect(loadTime).toBeLessThan(3000)
  })
})