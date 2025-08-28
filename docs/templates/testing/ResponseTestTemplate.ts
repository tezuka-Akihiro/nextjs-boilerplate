/**
 * AI滑走路 - Response層テストテンプレート
 * 
 * テスト対象: Response層
 * モック対象: なし（純粋関数のため）
 * テスト戦略: レスポンス生成ロジックとフォーマット統一のテスト
 * 
 * 責務:
 * - レスポンス形式統一のテスト
 * - エラーハンドリング統一のテスト
 * - ステータスコード管理のテスト
 * - メッセージ生成ロジックのテスト
 * 
 * 禁止項目:
 * - ビジネスロジックのテスト（Controller層で実施）
 * - データアクセスのテスト（Resource層で実施）
 * - HTTP通信のテスト（API層で実施）
 * - 外部サービス連携のテスト
 */

import { SampleResponse } from '../../../src/backend/responses/SampleResponse'
import { AuthResponse } from '../../../src/backend/responses/AuthResponse'
import { PaginatedResponse } from '../../../src/backend/responses/PaginatedResponse'
import { FileResponse } from '../../../src/backend/responses/FileResponse'
import { ResponseUtils } from '../../../src/backend/responses/ResponseUtils'
import { ApiResponse, ErrorResponse, ValidationError } from '../../../src/shared/types'

describe('SampleResponseTest', () => {
  // ===== テストデータ定義 =====
  const mockSampleData = {
    id: '1',
    name: 'Test Sample',
    description: 'Test Description',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockValidationErrors: ValidationError[] = [
    { field: 'name', message: 'Name is required' },
    { field: 'email', message: 'Invalid email format' }
  ]

  // ===== success メソッドテスト =====
  describe('success', () => {
    describe('正常系', () => {
      it('should create success response with data and default message', () => {
        // Act
        const result = SampleResponse.success(mockSampleData)

        // Assert
        expect(result).toEqual({
          success: true,
          data: mockSampleData,
          message: 'Operation completed successfully'
        })
        expect(result.success).toBe(true)
        expect(result.data).toBe(mockSampleData)
        expect(result.message).toBeTruthy()
      })

      it('should create success response with custom message', () => {
        // Arrange
        const customMessage = 'Custom success message'

        // Act
        const result = SampleResponse.success(mockSampleData, customMessage)

        // Assert
        expect(result).toEqual({
          success: true,
          data: mockSampleData,
          message: customMessage
        })
        expect(result.message).toBe(customMessage)
      })

      it('should handle null data', () => {
        // Act
        const result = SampleResponse.success(null)

        // Assert
        expect(result.success).toBe(true)
        expect(result.data).toBeNull()
        expect(result.message).toBeTruthy()
      })

      it('should handle array data', () => {
        // Arrange
        const arrayData = [mockSampleData, { ...mockSampleData, id: '2' }]

        // Act
        const result = SampleResponse.success(arrayData)

        // Assert
        expect(result.success).toBe(true)
        expect(result.data).toEqual(arrayData)
        expect(Array.isArray(result.data)).toBe(true)
      })

      it('should handle complex nested data', () => {
        // Arrange
        const complexData = {
          sample: mockSampleData,
          metadata: { total: 100, page: 1 },
          relations: [{ id: 'rel1', type: 'child' }]
        }

        // Act
        const result = SampleResponse.success(complexData)

        // Assert
        expect(result.success).toBe(true)
        expect(result.data).toEqual(complexData)
        expect(result.data.sample).toBe(mockSampleData)
      })
    })

    describe('型安全性テスト', () => {
      it('should preserve type information', () => {
        // Act
        const result = SampleResponse.success(mockSampleData)

        // Assert - TypeScriptコンパイル時にも検証される
        expect(typeof result.success).toBe('boolean')
        expect(typeof result.message).toBe('string')
        expect(result.data).toBeDefined()
      })
    })
  })

  // ===== created メソッドテスト =====
  describe('created', () => {
    describe('正常系', () => {
      it('should create creation success response with default message', () => {
        // Act
        const result = SampleResponse.created(mockSampleData)

        // Assert
        expect(result).toEqual({
          success: true,
          data: mockSampleData,
          message: 'Resource created successfully'
        })
      })

      it('should create creation success response with custom message', () => {
        // Arrange
        const customMessage = 'Sample created with special handling'

        // Act
        const result = SampleResponse.created(mockSampleData, customMessage)

        // Assert
        expect(result.message).toBe(customMessage)
      })
    })
  })

  // ===== updated メソッドテスト =====
  describe('updated', () => {
    describe('正常系', () => {
      it('should create update success response', () => {
        // Arrange
        const updatedData = { ...mockSampleData, name: 'Updated Name' }

        // Act
        const result = SampleResponse.updated(updatedData)

        // Assert
        expect(result).toEqual({
          success: true,
          data: updatedData,
          message: 'Resource updated successfully'
        })
      })
    })
  })

  // ===== deleted メソッドテスト =====
  describe('deleted', () => {
    describe('正常系', () => {
      it('should create delete success response with null data', () => {
        // Act
        const result = SampleResponse.deleted()

        // Assert
        expect(result).toEqual({
          success: true,
          data: null,
          message: 'Resource deleted successfully'
        })
        expect(result.data).toBeNull()
      })

      it('should create delete success response with custom message', () => {
        // Arrange
        const customMessage = 'Sample permanently removed'

        // Act
        const result = SampleResponse.deleted(customMessage)

        // Assert
        expect(result.message).toBe(customMessage)
      })
    })
  })

  // ===== error メソッドテスト =====
  describe('error', () => {
    describe('正常系', () => {
      it('should create error response with message only', () => {
        // Arrange
        const errorMessage = 'Something went wrong'

        // Act
        const result = SampleResponse.error(errorMessage)

        // Assert
        expect(result).toEqual({
          success: false,
          error: errorMessage
        })
        expect(result.success).toBe(false)
        expect(result.details).toBeUndefined()
      })

      it('should create error response with details', () => {
        // Arrange
        const errorMessage = 'Validation failed'

        // Act
        const result = SampleResponse.error(errorMessage, mockValidationErrors)

        // Assert
        expect(result).toEqual({
          success: false,
          error: errorMessage,
          details: mockValidationErrors
        })
        expect(result.details).toEqual(mockValidationErrors)
      })

      it('should handle empty error message', () => {
        // Act
        const result = SampleResponse.error('')

        // Assert
        expect(result.success).toBe(false)
        expect(result.error).toBe('')
      })
    })
  })

  // ===== validationError メソッドテスト =====
  describe('validationError', () => {
    describe('正常系', () => {
      it('should create validation error response', () => {
        // Act
        const result = SampleResponse.validationError(mockValidationErrors)

        // Assert
        expect(result).toEqual({
          success: false,
          error: 'Validation failed',
          details: mockValidationErrors
        })
      })

      it('should handle single validation error', () => {
        // Arrange
        const singleError = [{ field: 'name', message: 'Name is required' }]

        // Act
        const result = SampleResponse.validationError(singleError)

        // Assert
        expect(result.details).toHaveLength(1)
        expect(result.details![0]).toEqual(singleError[0])
      })

      it('should handle empty validation errors array', () => {
        // Act
        const result = SampleResponse.validationError([])

        // Assert
        expect(result.success).toBe(false)
        expect(result.details).toEqual([])
      })
    })
  })

  // ===== 各種エラーレスポンステスト =====
  describe('Error Response Methods', () => {
    describe('unauthorized', () => {
      it('should create unauthorized error with default message', () => {
        // Act
        const result = SampleResponse.unauthorized()

        // Assert
        expect(result).toEqual({
          success: false,
          error: 'Authentication required'
        })
      })

      it('should create unauthorized error with custom message', () => {
        // Arrange
        const customMessage = 'Invalid API key'

        // Act
        const result = SampleResponse.unauthorized(customMessage)

        // Assert
        expect(result.error).toBe(customMessage)
      })
    })

    describe('forbidden', () => {
      it('should create forbidden error with default message', () => {
        // Act
        const result = SampleResponse.forbidden()

        // Assert
        expect(result).toEqual({
          success: false,
          error: 'Access forbidden'
        })
      })
    })

    describe('notFound', () => {
      it('should create not found error with default message', () => {
        // Act
        const result = SampleResponse.notFound()

        // Assert
        expect(result).toEqual({
          success: false,
          error: 'Resource not found'
        })
      })

      it('should create not found error with resource name', () => {
        // Arrange
        const resourceName = 'Sample'

        // Act
        const result = SampleResponse.notFound(resourceName)

        // Assert
        expect(result.error).toBe('Sample not found')
      })
    })

    describe('conflict', () => {
      it('should create conflict error', () => {
        // Act
        const result = SampleResponse.conflict()

        // Assert
        expect(result).toEqual({
          success: false,
          error: 'Resource conflict detected'
        })
      })
    })

    describe('serverError', () => {
      it('should create server error', () => {
        // Act
        const result = SampleResponse.serverError()

        // Assert
        expect(result).toEqual({
          success: false,
          error: 'Internal server error'
        })
      })
    })

    describe('rateLimited', () => {
      it('should create rate limit error', () => {
        // Act
        const result = SampleResponse.rateLimited()

        // Assert
        expect(result).toEqual({
          success: false,
          error: 'Rate limit exceeded'
        })
      })
    })

    describe('serviceUnavailable', () => {
      it('should create service unavailable error', () => {
        // Act
        const result = SampleResponse.serviceUnavailable()

        // Assert
        expect(result).toEqual({
          success: false,
          error: 'Service temporarily unavailable'
        })
      })
    })
  })

  // ===== 一貫性テスト =====
  describe('Consistency Tests', () => {
    it('should maintain consistent success response structure', () => {
      // Arrange
      const methods = [
        () => SampleResponse.success(mockSampleData),
        () => SampleResponse.created(mockSampleData),
        () => SampleResponse.updated(mockSampleData),
        () => SampleResponse.deleted()
      ]

      // Act & Assert
      methods.forEach(method => {
        const result = method()
        expect(result).toHaveProperty('success', true)
        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('message')
        expect(typeof result.success).toBe('boolean')
        expect(typeof result.message).toBe('string')
      })
    })

    it('should maintain consistent error response structure', () => {
      // Arrange
      const methods = [
        () => SampleResponse.error('Test error'),
        () => SampleResponse.validationError(mockValidationErrors),
        () => SampleResponse.unauthorized(),
        () => SampleResponse.forbidden(),
        () => SampleResponse.notFound(),
        () => SampleResponse.conflict(),
        () => SampleResponse.serverError(),
        () => SampleResponse.rateLimited(),
        () => SampleResponse.serviceUnavailable()
      ]

      // Act & Assert
      methods.forEach(method => {
        const result = method()
        expect(result).toHaveProperty('success', false)
        expect(result).toHaveProperty('error')
        expect(typeof result.success).toBe('boolean')
        expect(typeof result.error).toBe('string')
      })
    })
  })
})

// ===== AuthResponse テスト =====
describe('AuthResponseTest', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User'
  }

  const mockToken = 'jwt.token.here'

  describe('loginSuccess', () => {
    it('should create login success response', () => {
      // Act
      const result = AuthResponse.loginSuccess(mockUser, mockToken)

      // Assert
      expect(result).toEqual({
        success: true,
        data: { user: mockUser, token: mockToken },
        message: 'Login successful'
      })
      expect(result.data.user).toBe(mockUser)
      expect(result.data.token).toBe(mockToken)
    })
  })

  describe('registrationSuccess', () => {
    it('should create registration success response', () => {
      // Act
      const result = AuthResponse.registrationSuccess(mockUser)

      // Assert
      expect(result).toEqual({
        success: true,
        data: mockUser,
        message: 'User registration completed successfully'
      })
    })
  })

  describe('logoutSuccess', () => {
    it('should create logout success response', () => {
      // Act
      const result = AuthResponse.logoutSuccess()

      // Assert
      expect(result).toEqual({
        success: true,
        data: null,
        message: 'Logout successful'
      })
    })
  })

  describe('passwordResetSuccess', () => {
    it('should create password reset success response', () => {
      // Act
      const result = AuthResponse.passwordResetSuccess()

      // Assert
      expect(result).toEqual({
        success: true,
        data: null,
        message: 'Password reset email sent successfully'
      })
    })
  })

  describe('Authentication Error Responses', () => {
    it('should create invalid credentials error', () => {
      // Act
      const result = AuthResponse.invalidCredentials()

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Invalid email or password'
      })
    })

    it('should create account disabled error', () => {
      // Act
      const result = AuthResponse.accountDisabled()

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Account has been disabled'
      })
    })

    it('should create email not verified error', () => {
      // Act
      const result = AuthResponse.emailNotVerified()

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Email verification required'
      })
    })
  })
})

// ===== PaginatedResponse テスト =====
describe('PaginatedResponseTest', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ]

  const mockPagination = {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3,
    hasNext: true,
    hasPrev: false
  }

  describe('success', () => {
    it('should create paginated success response', () => {
      // Act
      const result = PaginatedResponse.success(mockItems, mockPagination)

      // Assert
      expect(result).toEqual({
        success: true,
        data: {
          items: mockItems,
          pagination: mockPagination
        },
        message: 'Data retrieved successfully'
      })
      expect(result.data.items).toBe(mockItems)
      expect(result.data.pagination).toBe(mockPagination)
    })

    it('should handle complex pagination metadata', () => {
      // Arrange
      const complexPagination = {
        ...mockPagination,
        page: 2,
        hasPrev: true,
        hasNext: false
      }

      // Act
      const result = PaginatedResponse.success(mockItems, complexPagination)

      // Assert
      expect(result.data.pagination.page).toBe(2)
      expect(result.data.pagination.hasPrev).toBe(true)
      expect(result.data.pagination.hasNext).toBe(false)
    })
  })

  describe('empty', () => {
    it('should create empty result response', () => {
      // Act
      const result = PaginatedResponse.empty()

      // Assert
      expect(result).toEqual({
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
      })
      expect(result.data.items).toEqual([])
      expect(result.data.pagination.total).toBe(0)
    })
  })
})

// ===== FileResponse テスト =====
describe('FileResponseTest', () => {
  const mockFileInfo = {
    id: 'file123',
    name: 'test-file.pdf',
    size: 1024000,
    url: 'https://storage.example.com/files/test-file.pdf',
    mimeType: 'application/pdf'
  }

  describe('uploadSuccess', () => {
    it('should create file upload success response', () => {
      // Act
      const result = FileResponse.uploadSuccess(mockFileInfo)

      // Assert
      expect(result).toEqual({
        success: true,
        data: mockFileInfo,
        message: 'File uploaded successfully'
      })
    })
  })

  describe('deleteSuccess', () => {
    it('should create file delete success response', () => {
      // Act
      const result = FileResponse.deleteSuccess()

      // Assert
      expect(result).toEqual({
        success: true,
        data: null,
        message: 'File deleted successfully'
      })
    })
  })

  describe('File Error Responses', () => {
    it('should create file too large error', () => {
      // Arrange
      const maxSize = '10MB'

      // Act
      const result = FileResponse.fileTooLarge(maxSize)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'File size exceeds limit of 10MB'
      })
    })

    it('should create unsupported file type error', () => {
      // Arrange
      const allowedTypes = ['jpg', 'png', 'gif']

      // Act
      const result = FileResponse.unsupportedFileType(allowedTypes)

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Unsupported file type. Allowed types: jpg, png, gif'
      })
    })
  })
})

// ===== ResponseUtils テスト =====
describe('ResponseUtilsTest', () => {
  const mockResponse = {
    success: true,
    data: { id: '1', name: 'Test' },
    message: 'Test message'
  }

  describe('withTimestamp', () => {
    it('should add timestamp and request ID to response', () => {
      // Arrange
      const beforeTimestamp = new Date().toISOString()

      // Act
      const result = ResponseUtils.withTimestamp(mockResponse)

      // Assert
      const afterTimestamp = new Date().toISOString()
      
      expect(result).toEqual({
        ...mockResponse,
        timestamp: expect.any(String),
        requestId: expect.any(String)
      })
      
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(result.requestId).toMatch(/^req_\d+_[a-z0-9]+$/)
      expect(result.timestamp).toBeGreaterThanOrEqual(beforeTimestamp)
      expect(result.timestamp).toBeLessThanOrEqual(afterTimestamp)
    })

    it('should generate unique request IDs', () => {
      // Act
      const result1 = ResponseUtils.withTimestamp(mockResponse)
      const result2 = ResponseUtils.withTimestamp(mockResponse)

      // Assert
      expect(result1.requestId).not.toBe(result2.requestId)
    })

    it('should preserve original response properties', () => {
      // Act
      const result = ResponseUtils.withTimestamp(mockResponse)

      // Assert
      expect(result.success).toBe(mockResponse.success)
      expect(result.data).toBe(mockResponse.data)
      expect(result.message).toBe(mockResponse.message)
    })
  })

  describe('generateRequestId', () => {
    it('should generate valid request ID format', () => {
      // Act - プライベートメソッドのため、withTimestampを通してテスト
      const result = ResponseUtils.withTimestamp(mockResponse)

      // Assert
      expect(result.requestId).toMatch(/^req_\d+_[a-z0-9]{9}$/)
    })
  })
})

// ===== エッジケースとエラーハンドリングテスト =====
describe('Edge Cases and Error Handling', () => {
  describe('Null and Undefined Handling', () => {
    it('should handle null data in success response', () => {
      // Act
      const result = SampleResponse.success(null)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })

    it('should handle undefined message in success response', () => {
      // Act
      const result = SampleResponse.success(mockSampleData, undefined)

      // Assert
      expect(result.message).toBe('Operation completed successfully')
    })
  })

  describe('Large Data Handling', () => {
    it('should handle large arrays', () => {
      // Arrange
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))

      // Act
      const result = SampleResponse.success(largeArray)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1000)
    })

    it('should handle deeply nested objects', () => {
      // Arrange
      const deepObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                data: 'deep data'
              }
            }
          }
        }
      }

      // Act
      const result = SampleResponse.success(deepObject)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.level1.level2.level3.level4.data).toBe('deep data')
    })
  })

  describe('Special Characters Handling', () => {
    it('should handle special characters in error messages', () => {
      // Arrange
      const errorWithSpecialChars = 'Error: "Something" went wrong! @#$%^&*()'

      // Act
      const result = SampleResponse.error(errorWithSpecialChars)

      // Assert
      expect(result.error).toBe(errorWithSpecialChars)
    })

    it('should handle unicode characters', () => {
      // Arrange
      const unicodeMessage = 'エラーが発生しました 🚨'

      // Act
      const result = SampleResponse.error(unicodeMessage)

      // Assert
      expect(result.error).toBe(unicodeMessage)
    })
  })

  describe('Performance Tests', () => {
    it('should create responses quickly', () => {
      // Arrange
      const startTime = performance.now()

      // Act
      for (let i = 0; i < 1000; i++) {
        SampleResponse.success({ id: i, name: `Item ${i}` })
      }
      const endTime = performance.now()

      // Assert
      expect(endTime - startTime).toBeLessThan(100) // 100ms以内
    })
  })
})

// ===== ヘルパー関数とユーティリティ =====
/**
 * レスポンステストデータファクトリー
 */
const ResponseTestDataFactory = {
  createSuccessResponse: <T>(data: T, message?: string) => ({
    success: true as const,
    data,
    message: message || 'Operation completed successfully'
  }),

  createErrorResponse: (error: string, details?: any) => ({
    success: false as const,
    error,
    details
  }),

  createUser: (overrides = {}) => ({
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    ...overrides
  }),

  createValidationErrors: (fieldErrors: Array<{ field: string; message: string }>) => 
    fieldErrors.map(({ field, message }) => ({ field, message })),

  createPaginationInfo: (overrides = {}) => ({
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10,
    hasNext: true,
    hasPrev: false,
    ...overrides
  })
}

/**
 * レスポンス構造検証ヘルパー
 */
const ResponseStructureValidator = {
  validateSuccessResponse: (response: any) => {
    expect(response).toHaveProperty('success', true)
    expect(response).toHaveProperty('data')
    expect(response).toHaveProperty('message')
    expect(typeof response.message).toBe('string')
  },

  validateErrorResponse: (response: any) => {
    expect(response).toHaveProperty('success', false)
    expect(response).toHaveProperty('error')
    expect(typeof response.error).toBe('string')
  },

  validatePaginatedResponse: (response: any) => {
    ResponseStructureValidator.validateSuccessResponse(response)
    expect(response.data).toHaveProperty('items')
    expect(response.data).toHaveProperty('pagination')
    expect(Array.isArray(response.data.items)).toBe(true)
    expect(typeof response.data.pagination).toBe('object')
  }
}

/**
 * レスポンスアサーションヘルパー
 */
const ResponseAssertionHelper = {
  expectSuccessWithData: (response: any, expectedData: any) => {
    ResponseStructureValidator.validateSuccessResponse(response)
    expect(response.data).toEqual(expectedData)
  },

  expectErrorWithMessage: (response: any, expectedMessage: string) => {
    ResponseStructureValidator.validateErrorResponse(response)
    expect(response.error).toBe(expectedMessage)
  },

  expectValidationErrors: (response: any, expectedErrors: ValidationError[]) => {
    ResponseStructureValidator.validateErrorResponse(response)
    expect(response.details).toEqual(expectedErrors)
  }
}

/* 
使用例とベストプラクティス:

1. Response層テストの焦点
   - レスポンス形式の一貫性
   - エラーメッセージの適切性
   - データ構造の正確性
   - タイムスタンプ・ID生成の確認

2. テスト戦略
   - 純粋関数のため外部モック不要
   - 入力に対する出力の検証
   - エッジケースの網羅
   - パフォーマンスの確認

3. テストケース設計
   - 正常系: 各メソッドの基本動作
   - 異常系: Null/undefined/特殊文字
   - 一貫性: レスポンス構造の統一
   - パフォーマンス: 大量データ処理

4. アサーション
   - レスポンス構造の正確性
   - データ保持の確認
   - メッセージ内容の検証
   - 型安全性の確保

5. 命名規則
   - ファイル名: {Response名}Test.ts
   - テストケース: should + レスポンス形式の期待結果
   - グループ化: メソッド → 正常系/異常系/エッジケース
*/