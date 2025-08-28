/**
 * E2Eテスト用ベースクラス
 * 
 * Playwright を使用したエンドツーエンドテストの共通パターンを提供
 */

import { test, expect, Page, BrowserContext, Locator } from '@playwright/test'

/**
 * E2Eテスト用の認証情報
 */
export interface TestCredentials {
  email: string
  password: string
  nickname?: string
}

/**
 * E2Eテスト用のページオプション
 */
export interface E2ETestOptions {
  authenticated?: boolean
  experiencePoints?: number
  relationshipStatus?: 'single' | 'dating' | 'married'
  mockData?: Record<string, any>
}

/**
 * E2Eテストのベースクラス
 */
export abstract class E2ETestBase {
  protected page: Page
  protected context: BrowserContext

  /**
   * テストユーザーの認証情報
   */
  protected static readonly TEST_USERS: Record<string, TestCredentials> = {
    basic: {
      email: 'test-basic@example.com',
      password: 'test123456',
      nickname: 'BasicUser'
    },
    advanced: {
      email: 'test-advanced@example.com',
      password: 'test123456',
      nickname: 'AdvancedUser'
    },
    dating: {
      email: 'test-dating@example.com',
      password: 'test123456',
      nickname: 'DatingUser'
    }
  }

  /**
   * ページ要素のセレクター
   */
  protected static readonly SELECTORS = {
    // ===== 認証ページ =====
    auth: {
      emailInput: '[data-testid="email-input"]',
      passwordInput: '[data-testid="password-input"]',
      loginButton: '[data-testid="login-button"]',
      signupButton: '[data-testid="signup-button"]',
      logoutButton: '[data-testid="logout-button"]',
      errorMessage: '[data-testid="error-message"]',
    },

    // ===== ナビゲーション =====
    navigation: {
      homeLink: '[data-testid="nav-home"]',
      profileLink: '[data-testid="nav-profile"]',
      settingsLink: '[data-testid="nav-settings"]',
      mobileMenuButton: '[data-testid="mobile-menu-button"]',
    },

    // ===== ダッシュボード =====
    dashboard: {
      welcomeMessage: '[data-testid="welcome-message"]',
      experienceDisplay: '[data-testid="experience-display"]',
      xpGauge: '[data-testid="xp-gauge"]',
      postButton: '[data-testid="post-button"]',
      activityFeed: '[data-testid="activity-feed"]',
    },

    // ===== 投稿機能 =====
    post: {
      contentTextarea: '[data-testid="post-content"]',
      categorySelect: '[data-testid="post-category"]',
      submitButton: '[data-testid="post-submit"]',
      cancelButton: '[data-testid="post-cancel"]',
      imageUpload: '[data-testid="image-upload"]',
    },

    // ===== 彼女GET投稿機能 =====
    girlfriendPost: {
      confirmDialog: '[data-testid="girlfriend-confirm-dialog"]',
      marriageDeadlineSlider: '[data-testid="marriage-deadline-slider"]',
      confirmButton: '[data-testid="girlfriend-confirm-button"]',
      celebrationAnimation: '[data-testid="celebration-animation"]',
    },

    // ===== 共通UI要素 =====
    common: {
      loadingSpinner: '[data-testid="loading-spinner"]',
      toast: '[data-testid="toast"]',
      modal: '[data-testid="modal"]',
      closeButton: '[data-testid="close-button"]',
    }
  }

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
  }

  // ===== 認証関連ヘルパー =====

  /**
   * ユーザーログイン
   */
  protected async login(userType: keyof typeof E2ETestBase.TEST_USERS = 'basic') {
    const credentials = E2ETestBase.TEST_USERS[userType]
    
    await this.page.goto('/auth/signin')
    await this.page.fill(E2ETestBase.SELECTORS.auth.emailInput, credentials.email)
    await this.page.fill(E2ETestBase.SELECTORS.auth.passwordInput, credentials.password)
    await this.page.click(E2ETestBase.SELECTORS.auth.loginButton)
    
    // ログイン成功の確認（ダッシュボードへのリダイレクト）
    await this.page.waitForURL('/dashboard')
    await expect(this.page.locator(E2ETestBase.SELECTORS.dashboard.welcomeMessage)).toBeVisible()
  }

  /**
   * ユーザーログアウト
   */
  protected async logout() {
    await this.page.click(E2ETestBase.SELECTORS.auth.logoutButton)
    await this.page.waitForURL('/auth/signin')
  }

  /**
   * 認証状態の確認
   */
  protected async expectToBeAuthenticated() {
    await expect(this.page.locator(E2ETestBase.SELECTORS.auth.logoutButton)).toBeVisible()
  }

  protected async expectToBeUnauthenticated() {
    await expect(this.page.locator(E2ETestBase.SELECTORS.auth.loginButton)).toBeVisible()
  }

  // ===== ナビゲーションヘルパー =====

  /**
   * ページ遷移
   */
  protected async navigateTo(path: string) {
    await this.page.goto(path)
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * ナビゲーションリンククリック
   */
  protected async clickNavigation(linkName: keyof typeof E2ETestBase.SELECTORS.navigation) {
    await this.page.click(E2ETestBase.SELECTORS.navigation[linkName])
  }

  // ===== UI操作ヘルパー =====

  /**
   * 要素の表示待機
   */
  protected async waitForElement(selector: string, timeout = 5000): Promise<Locator> {
    await this.page.waitForSelector(selector, { timeout })
    return this.page.locator(selector)
  }

  /**
   * 要素の非表示待機
   */
  protected async waitForElementToBeHidden(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout })
  }

  /**
   * テキスト入力
   */
  protected async fillText(selector: string, text: string) {
    await this.page.fill(selector, text)
  }

  /**
   * ファイルアップロード
   */
  protected async uploadFile(selector: string, filePath: string) {
    await this.page.setInputFiles(selector, filePath)
  }

  /**
   * セレクトボックス選択
   */
  protected async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value)
  }

  /**
   * スクロール操作
   */
  protected async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded()
  }

  protected async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0))
  }

  protected async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  }

  // ===== アサーションヘルパー =====

  /**
   * ページタイトルの確認
   */
  protected async expectPageTitle(title: string) {
    await expect(this.page).toHaveTitle(title)
  }

  /**
   * URL の確認
   */
  protected async expectCurrentUrl(url: string) {
    await expect(this.page).toHaveURL(url)
  }

  /**
   * 要素の表示確認
   */
  protected async expectElementToBeVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible()
  }

  protected async expectElementToBeHidden(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden()
  }

  /**
   * テキスト内容の確認
   */
  protected async expectElementToHaveText(selector: string, text: string | RegExp) {
    await expect(this.page.locator(selector)).toHaveText(text)
  }

  protected async expectElementToContainText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text)
  }

  /**
   * 属性の確認
   */
  protected async expectElementToHaveAttribute(selector: string, attr: string, value?: string) {
    if (value !== undefined) {
      await expect(this.page.locator(selector)).toHaveAttribute(attr, value)
    } else {
      await expect(this.page.locator(selector)).toHaveAttribute(attr)
    }
  }

  /**
   * CSS クラスの確認
   */
  protected async expectElementToHaveClass(selector: string, className: string) {
    await expect(this.page.locator(selector)).toHaveClass(new RegExp(className))
  }

  // ===== 通信・状態確認ヘルパー =====

  /**
   * API呼び出しの確認
   */
  protected async expectApiCall(url: string | RegExp, method = 'GET') {
    const response = await this.page.waitForResponse(resp => 
      resp.url().match(url) !== null && resp.request().method() === method
    )
    expect(response.ok()).toBeTruthy()
    return response
  }

  /**
   * ローディング状態の確認
   */
  protected async expectLoadingState() {
    await this.expectElementToBeVisible(E2ETestBase.SELECTORS.common.loadingSpinner)
  }

  protected async expectLoadingToComplete() {
    await this.waitForElementToBeHidden(E2ETestBase.SELECTORS.common.loadingSpinner)
  }

  /**
   * Toast メッセージの確認
   */
  protected async expectToastMessage(message: string) {
    await this.expectElementToBeVisible(E2ETestBase.SELECTORS.common.toast)
    await this.expectElementToContainText(E2ETestBase.SELECTORS.common.toast, message)
  }

  // ===== スクリーンショット・デバッグヘルパー =====

  /**
   * スクリーンショット撮影
   */
  protected async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` })
  }

  /**
   * 要素のスクリーンショット撮影
   */
  protected async takeElementScreenshot(selector: string, name: string) {
    await this.page.locator(selector).screenshot({ path: `test-results/screenshots/${name}.png` })
  }

  /**
   * ページ情報のデバッグ出力
   */
  protected async debugPageInfo() {
    console.log('=== Page Debug Info ===')
    console.log('URL:', this.page.url())
    console.log('Title:', await this.page.title())
    console.log('Viewport:', this.page.viewportSize())
  }

  // ===== 共通テストパターン =====

  /**
   * 基本的なページ読み込みテスト
   */
  protected async testBasicPageLoad(path: string, expectedTitle?: string) {
    await this.navigateTo(path)
    
    if (expectedTitle) {
      await this.expectPageTitle(expectedTitle)
    }
    
    // JavaScript エラーがないことを確認
    this.page.on('pageerror', error => {
      throw new Error(`Page error: ${error.message}`)
    })
  }

  /**
   * レスポンシブテスト
   */
  protected async testResponsiveLayout(path: string) {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1440, height: 900, name: 'Desktop' },
    ]

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport)
      await this.navigateTo(path)
      await this.takeScreenshot(`${path.replace('/', '')}-${viewport.name.toLowerCase()}`)
    }
  }

  /**
   * アクセシビリティテスト
   */
  protected async testAccessibility() {
    // キーボードナビゲーション
    await this.page.keyboard.press('Tab')
    
    // フォーカス可能な要素の確認
    const focusableElements = await this.page.locator('[tabindex], button, input, select, textarea, a[href]').count()
    expect(focusableElements).toBeGreaterThan(0)
  }
}

export { test, expect }