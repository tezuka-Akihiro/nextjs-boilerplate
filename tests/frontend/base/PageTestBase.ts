/**
 * ページテスト用ベースクラス
 * 
 * Next.js ページコンポーネントのテストパターンを提供
 */

import { render, screen, waitFor } from '@testing-library/react'
import { ReactElement } from 'react'
import { ComponentTestBase } from './ComponentTestBase'
import { vi } from 'vitest'

/**
 * ページテスト用のオプション
 */
export interface PageTestOptions {
  route?: string
  searchParams?: Record<string, string>
  params?: Record<string, string>
  withAuth?: boolean
  mockData?: Record<string, any>
}

/**
 * ページテストのベースクラス
 */
export abstract class PageTestBase extends ComponentTestBase {
  
  /**
   * ページコンポーネントをレンダリング
   */
  protected renderPage(
    PageComponent: ReactElement,
    options: PageTestOptions = {}
  ) {
    const {
      route = '/',
      searchParams = {},
      params = {},
      withAuth = false,
      mockData = {}
    } = options

    // Next.js router のモック設定
    this.mockNextRouter(route, searchParams, params)
    
    // 認証が必要な場合のモック設定
    if (withAuth) {
      this.mockAuthentication()
    }

    // API レスポンスのモック設定
    this.mockApiResponses(mockData)

    return this.renderComponent(PageComponent, { withRouter: true })
  }

  /**
   * Next.js Router のモック設定
   */
  private mockNextRouter(
    route: string,
    searchParams: Record<string, string>,
    params: Record<string, string>
  ) {
    const mockPush = vi.fn()
    const mockReplace = vi.fn()
    const mockBack = vi.fn()

    vi.mocked(require('next/navigation').useRouter).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    })

    vi.mocked(require('next/navigation').usePathname).mockReturnValue(route)
    
    vi.mocked(require('next/navigation').useSearchParams).mockReturnValue(
      new URLSearchParams(searchParams)
    )
    
    vi.mocked(require('next/navigation').useParams).mockReturnValue(params)

    return { mockPush, mockReplace, mockBack }
  }

  /**
   * 認証状態のモック設定
   */
  private mockAuthentication(isAuthenticated = true) {
    // Supabase Auth のモック
    const mockUser = isAuthenticated ? {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    } : null

    // 将来的にSupabase認証のモック実装
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    } as Response)
  }

  /**
   * API レスポンスのモック設定
   */
  private mockApiResponses(mockData: Record<string, any>) {
    Object.entries(mockData).forEach(([endpoint, data]) => {
      vi.mocked(global.fetch).mockImplementation((url) => {
        if (typeof url === 'string' && url.includes(endpoint)) {
          return Promise.resolve({
            ok: true,
            json: async () => data,
          } as Response)
        }
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: 'Not found' }),
        } as Response)
      })
    })
  }

  /**
   * ページの基本要素確認
   */
  protected async expectPageToLoad(title?: string) {
    if (title) {
      await waitFor(() => {
        expect(screen.getByText(title)).toBeInTheDocument()
      })
    }
  }

  /**
   * ナビゲーションのテスト
   */
  protected async testNavigation(
    linkText: string,
    expectedRoute: string,
    mockPush: any
  ) {
    const link = screen.getByText(linkText)
    await this.user.click(link)
    expect(mockPush).toHaveBeenCalledWith(expectedRoute)
  }

  /**
   * フォーム送信のテスト
   */
  protected async testFormSubmission(
    formData: Record<string, string>,
    submitButtonText: string,
    expectedApiCall?: string
  ) {
    // フォームフィールドに入力
    for (const [field, value] of Object.entries(formData)) {
      await this.fillInput(field, value)
    }

    // 送信ボタンクリック
    await this.clickButton(submitButtonText)

    // API呼び出しの確認
    if (expectedApiCall) {
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(expectedApiCall),
          expect.any(Object)
        )
      })
    }
  }

  /**
   * エラー状態のテスト
   */
  protected async testErrorState(errorMessage: string) {
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  }

  /**
   * ローディング状態のテスト
   */
  protected async testLoadingState(loadingText = 'Loading...') {
    expect(screen.getByText(loadingText)).toBeInTheDocument()
  }

  /**
   * レスポンシブ表示のテスト
   */
  protected testResponsiveLayout(breakpoint: 'mobile' | 'tablet' | 'desktop') {
    const viewports = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1440, height: 900 }
    }

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: viewports[breakpoint].width,
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: viewports[breakpoint].height,
    })

    // matchMedia のモック更新
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query.includes(`max-width: ${viewports[breakpoint].width}px`),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    // リサイズイベントを発火
    fireEvent(window, new Event('resize'))
  }

  /**
   * SEO要素のテスト
   */
  protected testSEOElements(expectedTitle?: string, expectedDescription?: string) {
    if (expectedTitle) {
      // Next.js の Head component のテスト
      expect(document.title).toContain(expectedTitle)
    }

    if (expectedDescription) {
      const metaDescription = document.querySelector('meta[name="description"]')
      expect(metaDescription?.getAttribute('content')).toContain(expectedDescription)
    }
  }

  /**
   * パフォーマンス指標のテスト
   */
  protected async testPagePerformance(maxLoadTime = 3000) {
    const startTime = performance.now()
    
    await waitFor(() => {
      expect(screen.getByTestId('page-content')).toBeInTheDocument()
    })
    
    const loadTime = performance.now() - startTime
    expect(loadTime).toBeLessThan(maxLoadTime)
  }

  /**
   * 共通のページテストパターン
   */
  protected describePageBehavior(pageName: string, testFn: () => void) {
    describe(`${pageName} Page`, testFn)
  }

  protected describePageRendering(testFn: () => void) {
    describe('Page Rendering', testFn)
  }

  protected describePageNavigation(testFn: () => void) {
    describe('Navigation', testFn)
  }

  protected describePageInteractions(testFn: () => void) {
    describe('User Interactions', testFn)
  }

  protected describePageResponsiveness(testFn: () => void) {
    describe('Responsive Layout', testFn)
  }

  protected describePageSEO(testFn: () => void) {
    describe('SEO Elements', testFn)
  }

  /**
   * 共通のページテストケース
   */
  protected testBasicPageLoad(PageComponent: ReactElement, pageTitle: string) {
    it('should load page without errors', async () => {
      this.renderPage(PageComponent)
      await this.expectPageToLoad(pageTitle)
    })
  }

  protected testPageNotFound(PageComponent: ReactElement) {
    it('should handle 404 state', async () => {
      this.mockApiResponses({
        '/api/': { error: 'Not found', status: 404 }
      })
      
      this.renderPage(PageComponent)
      await this.testErrorState('Page not found')
    })
  }

  protected testUnauthorizedAccess(PageComponent: ReactElement) {
    it('should redirect unauthorized users', async () => {
      const { mockPush } = this.mockNextRouter('/', {}, {})
      this.mockAuthentication(false)
      
      this.renderPage(PageComponent, { withAuth: true })
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/signin')
      })
    })
  }
}