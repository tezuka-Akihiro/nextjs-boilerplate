/**
 * フロントエンドテスト用ユーティリティ関数
 * 
 * 共通的に使用されるテストヘルパー関数を提供
 */

import { render, RenderOptions, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'

// ===== レンダリングヘルパー =====

/**
 * カスタムレンダー関数
 * 将来的にProviderのラッピングを簡単にするため
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions & {
    withRouter?: boolean
    withTheme?: boolean
    initialRoute?: string
  } = {}
) {
  const { withRouter = false, withTheme = false, ...renderOptions } = options

  function Wrapper({ children }: { children: ReactNode }) {
    // 将来的にRouter Provider, Theme Provider等をラップ
    // if (withRouter) {
    //   children = <RouterProvider>{children}</RouterProvider>
    // }
    // if (withTheme) {
    //   children = <ThemeProvider>{children}</ThemeProvider>
    // }
    return <>{children}</>
  }

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// ===== DOM要素検索ヘルパー =====

/**
 * data-testid による要素検索
 */
export function getByTestId(testId: string) {
  return screen.getByTestId(testId)
}

export function queryByTestId(testId: string) {
  return screen.queryByTestId(testId)
}

export function findByTestId(testId: string) {
  return screen.findByTestId(testId)
}

/**
 * ロール + 名前による要素検索
 */
export function getButton(name: string | RegExp) {
  return screen.getByRole('button', { name })
}

export function getLink(name: string | RegExp) {
  return screen.getByRole('link', { name })
}

export function getTextbox(name: string | RegExp) {
  return screen.getByRole('textbox', { name })
}

export function getCheckbox(name: string | RegExp) {
  return screen.getByRole('checkbox', { name })
}

export function getRadio(name: string | RegExp) {
  return screen.getByRole('radio', { name })
}

export function getSelect(name: string | RegExp) {
  return screen.getByRole('combobox', { name })
}

// ===== 非同期ヘルパー =====

/**
 * 要素の表示を待機
 */
export async function waitForElementToBeVisible(testId: string, timeout = 5000) {
  return waitFor(() => {
    const element = screen.getByTestId(testId)
    expect(element).toBeVisible()
    return element
  }, { timeout })
}

/**
 * 要素の削除を待機
 */
export async function waitForElementToBeRemoved(testId: string, timeout = 5000) {
  return waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
  }, { timeout })
}

/**
 * テキストの表示を待機
 */
export async function waitForText(text: string | RegExp, timeout = 5000) {
  return waitFor(() => {
    expect(screen.getByText(text)).toBeInTheDocument()
  }, { timeout })
}

/**
 * API レスポンスを待機
 */
export async function waitForApiCall(url: string, timeout = 5000) {
  return waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(url),
      expect.any(Object)
    )
  }, { timeout })
}

// ===== ユーザーインタラクションヘルパー =====

/**
 * フォーム入力ヘルパー
 */
export async function typeIntoInput(
  input: HTMLElement,
  text: string,
  options: { clear?: boolean } = {}
) {
  const user = userEvent.setup()
  if (options.clear !== false) {
    await user.clear(input)
  }
  await user.type(input, text)
}

/**
 * セレクトボックス選択ヘルパー
 */
export async function selectOption(select: HTMLElement, optionText: string) {
  const user = userEvent.setup()
  await user.selectOptions(select, optionText)
}

/**
 * ファイルアップロードヘルパー
 */
export async function uploadFile(input: HTMLElement, file: File) {
  const user = userEvent.setup()
  await user.upload(input, file)
}

/**
 * クリックヘルパー
 */
export async function clickElement(element: HTMLElement) {
  const user = userEvent.setup()
  await user.click(element)
}

/**
 * ダブルクリックヘルパー
 */
export async function doubleClickElement(element: HTMLElement) {
  const user = userEvent.setup()
  await user.dblClick(element)
}

/**
 * ホバーヘルパー
 */
export async function hoverElement(element: HTMLElement) {
  const user = userEvent.setup()
  await user.hover(element)
}

/**
 * キーボード操作ヘルパー
 */
export async function pressKey(key: string) {
  const user = userEvent.setup()
  await user.keyboard(key)
}

// ===== アサーションヘルパー =====

/**
 * 要素の表示状態確認
 */
export function expectToBeVisible(element: HTMLElement) {
  expect(element).toBeVisible()
}

export function expectToBeHidden(element: HTMLElement) {
  expect(element).not.toBeVisible()
}

/**
 * CSS クラス確認
 */
export function expectToHaveClasses(element: HTMLElement, ...classNames: string[]) {
  classNames.forEach(className => {
    expect(element).toHaveClass(className)
  })
}

/**
 * 属性確認
 */
export function expectToHaveAttributes(
  element: HTMLElement,
  attributes: Record<string, string>
) {
  Object.entries(attributes).forEach(([attr, value]) => {
    expect(element).toHaveAttribute(attr, value)
  })
}

/**
 * ARIA 属性確認
 */
export function expectToHaveAriaAttributes(
  element: HTMLElement,
  ariaAttributes: Record<string, string>
) {
  Object.entries(ariaAttributes).forEach(([attr, value]) => {
    expect(element).toHaveAttribute(`aria-${attr}`, value)
  })
}

/**
 * 無効状態確認
 */
export function expectToBeDisabled(element: HTMLElement) {
  expect(element).toBeDisabled()
}

export function expectToBeEnabled(element: HTMLElement) {
  expect(element).toBeEnabled()
}

// ===== モックヘルパー =====

/**
 * fetch モック設定
 */
export function mockFetch(responses: Record<string, any>) {
  global.fetch = vi.fn().mockImplementation((url) => {
    const urlString = url.toString()
    const matchedResponse = Object.entries(responses).find(([pattern]) =>
      urlString.includes(pattern)
    )
    
    if (matchedResponse) {
      return Promise.resolve({
        ok: true,
        json: async () => matchedResponse[1],
        text: async () => JSON.stringify(matchedResponse[1]),
      } as Response)
    }
    
    return Promise.resolve({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    } as Response)
  })
}

/**
 * localStorage モック
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length
    }
  }
}

/**
 * IntersectionObserver モック
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  
  global.IntersectionObserver = mockIntersectionObserver
  return mockIntersectionObserver
}

/**
 * ResizeObserver モック
 */
export function mockResizeObserver() {
  const mockResizeObserver = vi.fn()
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  
  global.ResizeObserver = mockResizeObserver
  return mockResizeObserver
}

// ===== テストデータ生成ヘルパー =====

/**
 * ランダムな文字列生成
 */
export function generateRandomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * ランダムなメールアドレス生成
 */
export function generateRandomEmail(): string {
  return `test-${generateRandomString()}@example.com`
}

/**
 * ランダムなユーザーデータ生成
 */
export function generateUserData() {
  return {
    id: generateRandomString(),
    email: generateRandomEmail(),
    name: `Test User ${generateRandomString(4)}`,
    nickname: `user${generateRandomString(4)}`,
  }
}

/**
 * ファイルオブジェクト生成
 */
export function createMockFile(
  name = 'test.txt',
  content = 'test content',
  type = 'text/plain'
): File {
  return new File([content], name, { type })
}

/**
 * 画像ファイルオブジェクト生成
 */
export function createMockImageFile(
  name = 'test.png',
  width = 100,
  height = 100
): File {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], name, { type: 'image/png' }))
    })
  }) as any
}

// ===== デバッグヘルパー =====

/**
 * DOM ツリーをコンソールに出力
 */
export function debugDOM() {
  screen.debug()
}

/**
 * 特定の要素をデバッグ出力
 */
export function debugElement(element: HTMLElement) {
  screen.debug(element)
}

/**
 * テスト実行時間計測
 */
export function measureTestTime<T>(testFn: () => T | Promise<T>): Promise<{ result: T; time: number }> {
  const startTime = performance.now()
  const result = testFn()
  
  if (result instanceof Promise) {
    return result.then(res => ({
      result: res,
      time: performance.now() - startTime
    }))
  }
  
  return Promise.resolve({
    result,
    time: performance.now() - startTime
  })
}

// ===== 便利なエクスポート =====

export {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react'

export { userEvent }