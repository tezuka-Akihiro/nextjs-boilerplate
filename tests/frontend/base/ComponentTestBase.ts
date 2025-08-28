/**
 * コンポーネントテスト用ベースクラス
 * 
 * 共通のテストパターンを提供し、一貫したテスト構造を実現
 */

import { render, screen, fireEvent, waitFor, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'

/**
 * テスト用のレンダリングオプション
 */
export interface TestRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // 将来的にProvider等のwrapperを追加する場合
  withRouter?: boolean
  withTheme?: boolean
  initialRoute?: string
}

/**
 * コンポーネントテストのベースクラス
 */
export abstract class ComponentTestBase {
  protected user = userEvent.setup()

  /**
   * コンポーネントをレンダリング
   */
  protected renderComponent(
    component: ReactElement,
    options: TestRenderOptions = {}
  ) {
    const { withRouter = false, withTheme = false, ...renderOptions } = options

    // 将来的にProviderのラッピングを追加
    let wrapper: ({ children }: { children: ReactNode }) => ReactElement | undefined

    if (withRouter || withTheme) {
      wrapper = ({ children }) => {
        // TODO: Router Provider, Theme Provider等をラップ
        return <>{children}</>
      }
    }

    return render(component, {
      wrapper,
      ...renderOptions,
    })
  }

  /**
   * 要素の表示待機
   */
  protected async waitForElement(
    selector: string | (() => HTMLElement | null),
    timeout = 5000
  ) {
    if (typeof selector === 'string') {
      return waitFor(() => screen.getByTestId(selector), { timeout })
    }
    return waitFor(selector, { timeout })
  }

  /**
   * 要素の非表示待機
   */
  protected async waitForElementToBeRemoved(
    selector: string | (() => HTMLElement | null),
    timeout = 5000
  ) {
    if (typeof selector === 'string') {
      return waitFor(() => {
        expect(screen.queryByTestId(selector)).not.toBeInTheDocument()
      }, { timeout })
    }
    return waitFor(() => {
      expect(selector()).not.toBeInTheDocument()
    }, { timeout })
  }

  /**
   * モック関数の作成
   */
  protected createMockFunction<T extends (...args: any[]) => any>(): T {
    return vi.fn() as T
  }

  /**
   * 非同期処理の待機
   */
  protected async waitForAsync(ms = 0) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * フォーム入力のヘルパー
   */
  protected async fillInput(labelOrTestId: string, value: string) {
    const input = screen.getByLabelText(labelOrTestId) || screen.getByTestId(labelOrTestId)
    await this.user.clear(input)
    await this.user.type(input, value)
  }

  /**
   * ボタンクリックのヘルパー
   */
  protected async clickButton(nameOrTestId: string) {
    const button = screen.getByRole('button', { name: nameOrTestId }) || 
                  screen.getByTestId(nameOrTestId)
    await this.user.click(button)
  }

  /**
   * 選択操作のヘルパー
   */
  protected async selectOption(selectElement: HTMLElement, optionText: string) {
    await this.user.selectOptions(selectElement, optionText)
  }

  /**
   * ファイルアップロードのヘルパー
   */
  protected async uploadFile(inputElement: HTMLElement, file: File) {
    await this.user.upload(inputElement, file)
  }

  /**
   * ホバー操作のヘルパー
   */
  protected async hoverElement(element: HTMLElement) {
    await this.user.hover(element)
  }

  /**
   * キーボード操作のヘルパー
   */
  protected async pressKey(key: string) {
    await this.user.keyboard(key)
  }

  /**
   * CSS クラスの存在確認
   */
  protected expectToHaveClass(element: HTMLElement, className: string) {
    expect(element).toHaveClass(className)
  }

  /**
   * スタイルの確認
   */
  protected expectToHaveStyle(element: HTMLElement, style: Record<string, any>) {
    expect(element).toHaveStyle(style)
  }

  /**
   * 属性の確認
   */
  protected expectToHaveAttribute(element: HTMLElement, attr: string, value?: string) {
    if (value !== undefined) {
      expect(element).toHaveAttribute(attr, value)
    } else {
      expect(element).toHaveAttribute(attr)
    }
  }

  /**
   * アクセシビリティの確認
   */
  protected expectToBeAccessible(element: HTMLElement) {
    // ARIA属性の基本的なチェック
    if (element.tagName === 'BUTTON') {
      expect(element).not.toHaveAttribute('aria-hidden', 'true')
    }
    if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) {
      // ラベルが設定されていることを確認
      expect(
        element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')
      ).toBe(true)
    }
  }

  /**
   * エラー状態の確認
   */
  protected expectToHaveErrorState(element: HTMLElement) {
    expect(element).toHaveAttribute('aria-invalid', 'true')
  }

  /**
   * 読み込み状態の確認
   */
  protected expectToHaveLoadingState(element: HTMLElement) {
    expect(element).toHaveAttribute('aria-busy', 'true') ||
    expect(element).toHaveAttribute('disabled')
  }

  /**
   * モック関数の呼び出し確認
   */
  protected expectMockToHaveBeenCalled(mockFn: any, times?: number) {
    if (times !== undefined) {
      expect(mockFn).toHaveBeenCalledTimes(times)
    } else {
      expect(mockFn).toHaveBeenCalled()
    }
  }

  /**
   * モック関数の引数確認
   */
  protected expectMockToHaveBeenCalledWith(mockFn: any, ...args: any[]) {
    expect(mockFn).toHaveBeenCalledWith(...args)
  }

  /**
   * テストデータの生成ヘルパー
   */
  protected generateTestId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 共通のテストケースパターン
   */
  protected describeComponentBehavior(componentName: string, testFn: () => void) {
    describe(`${componentName} Component`, testFn)
  }

  protected describeRenderingBehavior(testFn: () => void) {
    describe('Rendering', testFn)
  }

  protected describeStateBehavior(testFn: () => void) {
    describe('State Management', testFn)
  }

  protected describeEventBehavior(testFn: () => void) {
    describe('Event Handling', testFn)
  }

  protected describeAccessibilityBehavior(testFn: () => void) {
    describe('Accessibility', testFn)
  }

  protected describeResponsiveBehavior(testFn: () => void) {
    describe('Responsive Behavior', testFn)
  }

  /**
   * 共通のテストケース実行
   */
  protected testBasicRendering(component: ReactElement, expectedText: string) {
    it('should render without crashing', () => {
      this.renderComponent(component)
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    })
  }

  protected testClickInteraction(
    component: ReactElement,
    buttonSelector: string,
    mockFn: any
  ) {
    it('should handle click events', async () => {
      this.renderComponent(component)
      await this.clickButton(buttonSelector)
      this.expectMockToHaveBeenCalled(mockFn, 1)
    })
  }

  protected testDisabledState(component: ReactElement, buttonSelector: string) {
    it('should handle disabled state', () => {
      this.renderComponent(component)
      const button = screen.getByRole('button', { name: buttonSelector })
      expect(button).toBeDisabled()
    })
  }

  protected testLoadingState(component: ReactElement, loadingText: string) {
    it('should show loading state', () => {
      this.renderComponent(component)
      expect(screen.getByText(loadingText)).toBeInTheDocument()
    })
  }
}