/**
 * AI滑走路 - Response層テンプレート
 * 
 * 責務:
 * - レスポンス形式統一
 * - エラーハンドリングの統一
 * - API出力形式の標準化
 * - ステータスコードの管理
 * 
 * 依存関係:
 *  許可: 型定義のみ
 * 禁止: Controllerへの直接依存
 * 禁止: Taskへの直接依存
 * 禁止: Resourceへの直接依存
 * 禁止: APIへの直接依存
 * 禁止: 他のResponseへの直接依存
 * 
 * 配置例:
 * - ファイル名: {機能名}Response.ts (例: AuthResponse.ts)
 * - クラス名: ファイル名と同一
 * - メソッド名: success, error, notFound等の定型
 * 
 * 禁止項目:
 * - ビジネスロジックの実装
 * - データ取得処理の実装
 * - 外部サービスへの通信
 * - 個別のレスポンス生成
 */

import { ApiResponse, ErrorResponse, ValidationError } from '@/types'

export class SampleResponse {
  /**
   * 成功レスポンス
   * Responseの責務：統一された成功レスポンスの生成
   */
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Operation completed successfully'
    }
  }

  /**
   * 作成成功
   * Responseの責務：新規作成時の成功レスポンス
   */
  static created<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Resource created successfully'
    }
  }

  /**
   * 更新成功
   * Responseの責務：更新時の成功レスポンス
   */
  static updated<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Resource updated successfully'
    }
  }

  /**
   * 削除成功
   * Responseの責務：削除時の成功レスポンス
   */
  static deleted(message?: string): ApiResponse<null> {
    return {
      success: true,
      data: null,
      message: message || 'Resource deleted successfully'
    }
  }

  /**
   * 一般エラー
   * Responseの責務：統一されたエラーレスポンスの生成
   */
  static error(error: string, details?: ValidationError[]): ErrorResponse {
    return {
      success: false,
      error,
      details
    }
  }

  /**
   * バリデーションエラー
   * Responseの責務：入力検証エラーの生成
   */
  static validationError(errors: ValidationError[]): ErrorResponse {
    return {
      success: false,
      error: 'Validation failed',
      details: errors
    }
  }

  /**
   * 認証エラー
   * Responseの責務：認証不正の生成
   */
  static unauthorized(message?: string): ErrorResponse {
    return {
      success: false,
      error: message || 'Authentication required'
    }
  }

  /**
   * 権限エラー
   * Responseの責務：権限不足の生成
   */
  static forbidden(message?: string): ErrorResponse {
    return {
      success: false,
      error: message || 'Access forbidden'
    }
  }

  /**
   * リソース未発見エラー
   * Responseの責務：404エラーの生成
   */
  static notFound(resource?: string): ErrorResponse {
    return {
      success: false,
      error: resource ? `${resource} not found` : 'Resource not found'
    }
  }

  /**
   * 競合エラー
   * Responseの責務：409エラーの生成
   */
  static conflict(message?: string): ErrorResponse {
    return {
      success: false,
      error: message || 'Resource conflict detected'
    }
  }

  /**
   * サーバエラー
   * Responseの責務：500エラーの生成
   */
  static serverError(message?: string): ErrorResponse {
    return {
      success: false,
      error: message || 'Internal server error'
    }
  }

  /**
   * レート制限エラー
   * Responseの責務：429エラーの生成
   */
  static rateLimited(message?: string): ErrorResponse {
    return {
      success: false,
      error: message || 'Rate limit exceeded'
    }
  }

  /**
   * サービス利用不可エラー
   * Responseの責務：503エラーの生成
   */
  static serviceUnavailable(message?: string): ErrorResponse {
    return {
      success: false,
      error: message || 'Service temporarily unavailable'
    }
  }
}

/**
 * 認証Response例
 * Responseの責務：認証系専用の統合レスポンス
 */
export class AuthResponse {
  /**
   * ログイン成功
   * Responseの責務：認証成功の生成
   */
  static loginSuccess(user: any, token: string): ApiResponse<{user: any, token: string}> {
    return {
      success: true,
      data: { user, token },
      message: 'Login successful'
    }
  }

  /**
   * 登録成功
   * Responseの責務：ユーザー登録の生成
   */
  static registrationSuccess(user: any): ApiResponse<any> {
    return {
      success: true,
      data: user,
      message: 'User registration completed successfully'
    }
  }

  /**
   * ログアウト成功
   * Responseの責務：ログアウトの生成
   */
  static logoutSuccess(): ApiResponse<null> {
    return {
      success: true,
      data: null,
      message: 'Logout successful'
    }
  }

  /**
   * パスワードリセット成功
   * Responseの責務：パスワードリセットの生成
   */
  static passwordResetSuccess(): ApiResponse<null> {
    return {
      success: true,
      data: null,
      message: 'Password reset email sent successfully'
    }
  }

  /**
   * 認証情報不正エラー
   * Responseの責務：認証不正の生成
   */
  static invalidCredentials(): ErrorResponse {
    return {
      success: false,
      error: 'Invalid email or password'
    }
  }

  /**
   * アカウント無効エラー
   * Responseの責務：無効アカウントの生成
   */
  static accountDisabled(): ErrorResponse {
    return {
      success: false,
      error: 'Account has been disabled'
    }
  }

  /**
   * メール未確認エラー
   * Responseの責務：メール未確認の生成
   */
  static emailNotVerified(): ErrorResponse {
    return {
      success: false,
      error: 'Email verification required'
    }
  }
}

/**
 * ページネーション Response例
 * Responseの責務：ページネーション用の統合レスポンス
 */
export class PaginatedResponse {
  /**
   * ページ化成功レスポンス
   * Responseの責務：ページネーション付きの統一レスポンス
   */
  static success<T>(
    items: T[],
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  ): ApiResponse<{
    items: T[]
    pagination: typeof pagination
  }> {
    return {
      success: true,
      data: {
        items,
        pagination
      },
      message: 'Data retrieved successfully'
    }
  }

  /**
   * 空の結果
   * Responseの責務：検索結果なしの生成
   */
  static empty(): ApiResponse<{
    items: any[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    return {
      success: true,
      data: {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      },
      message: 'No results found'
    }
  }
}

/* 
禁止項目例 - 次のような処理は絶対にNG:

import { SampleController } from '@/controllers/SampleController'  // 禁止: Controllerへの直接依存
import { SampleTask } from '@/tasks/SampleTask'  // 禁止: Taskへの直接依存
import { SampleResource } from '@/resources/SampleResource'  // 禁止: Resourceへの直接依存

export class BadResponse {
  static async badMethod() {
    // 禁止: ビジネスロジックの実装
    if (userData.isPremium && userData.hasActiveSubscription) {
      return this.premiumUserSuccess()
    }
    
    // 禁止: データ取得処理の実装
    const transformedData = inputData.map(item => ({
      ...item,
      calculatedValue: item.price * item.quantity
    }))
    
    // 禁止: 外部サービスへの通信
    const externalData = await fetch('https://api.example.com/data')
    
    // 禁止: 個別のレスポンス生成
    localStorage.setItem('responseData', JSON.stringify(data))
  }
}
*/

/**
 * 共通型定義のインターフェイス（参考）
 */
export interface StandardApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  timestamp?: string
  requestId?: string
}

export interface StandardErrorResponse {
  success: false
  error: string
  details?: ValidationError[]
  timestamp?: string
  requestId?: string
}

/**
 * レスポンスユーティリティ
 * Responseの責務：統一形式のレスポンス生成
 */
export class ResponseUtils {
  /**
   * タイムスタンプ付与
   * Responseの責務：ログ用タイムスタンプ追加
   */
  static withTimestamp<T>(response: ApiResponse<T>): StandardApiResponse<T> {
    return {
      ...response,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    }
  }

  /**
   * リクエストID生成
   * Responseの責務：トレーサビリティID生成
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}