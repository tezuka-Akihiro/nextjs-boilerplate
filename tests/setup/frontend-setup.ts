/**
 * フロントエンドテスト用セットアップ
 * 
 * React Testing Library + Vitest + Next.js の統合設定
 */

import '@testing-library/jest-dom/vitest'
import { vi, beforeAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// ===== Next.js モック =====

// Next.js Router mock
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  notFound: vi.fn(),
  redirect: vi.fn(),
}))

// Next.js Image mock
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Next.js Link mock
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// ===== DOM API モック =====

// ResizeObserver mock
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// IntersectionObserver mock
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// scrollTo mock
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// getComputedStyle mock
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue(''),
  })),
})

// ===== Web APIs モック =====

// fetch mock (Supabase等のAPI呼び出し用)
global.fetch = vi.fn()

// localStorage mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// sessionStorage mock
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
})

// ===== 環境変数設定 =====

// テスト環境用の環境変数
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_ENV = 'test'

// Supabase テスト設定
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-key'
process.env.SUPABASE_SECRET_KEY = 'test-secret'

// ===== グローバル設定 =====

// コンソール警告の抑制（テスト実行時の不要なログを削減）
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

console.warn = (...args) => {
  const warningMessage = args[0]
  
  // React の開発時警告を抑制
  if (
    typeof warningMessage === 'string' &&
    (warningMessage.includes('Warning: ReactDOM.render') ||
     warningMessage.includes('Warning: componentWillMount') ||
     warningMessage.includes('Warning: validateDOMNesting'))
  ) {
    return
  }
  
  originalConsoleWarn.apply(console, args)
}

console.error = (...args) => {
  const errorMessage = args[0]
  
  // 不要なエラーログを抑制
  if (
    typeof errorMessage === 'string' &&
    (errorMessage.includes('Error: Not implemented') ||
     errorMessage.includes('Error: Uncaught [TypeError]'))
  ) {
    return
  }
  
  originalConsoleError.apply(console, args)
}

// ===== テスト完了後のクリーンアップ =====

afterEach(() => {
  // React Testing Library のクリーンアップ
  cleanup()
  
  // モックのリセット
  vi.clearAllMocks()
  
  // localStorage / sessionStorage のクリア
  localStorageMock.clear()
})

// ===== タイムアウト設定 =====

// テスト全体のデフォルトタイムアウト
beforeAll(() => {
  vi.setConfig({ testTimeout: 10000 })
})

// ===== Custom matchers 拡張 =====

// 将来的にカスタムマッチャーを追加する場合
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      // カスタムマッチャーの型定義をここに追加
      // toHaveAccessibleName(): T
      // toHaveVisibleText(): T
    }
  }
}

export {
  // テストで使用するユーティリティをエクスポート
  localStorageMock,
}