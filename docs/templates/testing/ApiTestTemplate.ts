/**
 * AI滑走路 - API層テストテンプレート
 * 
 * テスト対象: API層 (Next.js App Router)
 * モック対象: Controller層
 * テスト戦略: Controllerをモック化してHTTPインターフェースのみをテスト
 * 
 * 責務:
 * - HTTPリクエスト/レスポンスの検証
 * - 基本バリデーションのテスト
 * - ステータスコードの確認
 * - Controllerへの適切な委譲の確認
 * 
 * 禁止項目:
 * - Task, Resource層への直接テスト
 * - ビジネスロジックのテスト（Controller層で実施）
 * - データベース操作のテスト
 */

import { NextRequest } from 'next/server'
import { GET, POST, PUT, DELETE } from '../../../src/frontend/app/api/sample/route'
import { SampleController } from '../../../src/backend/controllers/SampleController'
import { SampleType } from '../../../src/shared/types'

// ===== モック設定 =====
// 許可された依存: Controller層のみをモック化
jest.mock('../../../src/backend/controllers/SampleController')
const MockedSampleController = SampleController as jest.MockedClass<typeof SampleController>

describe('SampleApiTest', () => {
  let mockControllerInstance: jest.Mocked<SampleController>

  // ===== セットアップ・クリーンアップ =====
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks()
    
    // Controllerインスタンスのモック作成
    mockControllerInstance = new MockedSampleController() as jest.Mocked<SampleController>
    MockedSampleController.mockImplementation(() => mockControllerInstance)
  })

  afterEach(() => {
    // テスト後のクリーンアップ
    jest.restoreAllMocks()
  })

  // ===== テストデータ定義 =====
  const mockSampleData: SampleType = {
    id: '1',
    name: 'Test Sample',
    description: 'Test Description',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockSuccessResponse = {
    success: true,
    data: mockSampleData,
    message: 'Operation completed successfully'
  }

  const mockErrorResponse = {
    success: false,
    error: 'Sample not found'
  }

  const mockValidationErrorResponse = {
    success: false,
    error: 'Validation failed',
    details: [{ field: 'name', message: 'Name is required' }]
  }

  // ===== GET APIテスト =====
  describe('GET /api/sample', () => {
    describe('正常系', () => {
      it('should return sample data when valid id provided', async () => {
        // Arrange
        const url = 'http://localhost:3000/api/sample?id=1'
        const request = new NextRequest(url)
        mockControllerInstance.getSample.mockResolvedValue(mockSuccessResponse)

        // Act
        const response = await GET(request)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(200)
        expect(responseData).toEqual(mockSuccessResponse)
        expect(mockControllerInstance.getSample).toHaveBeenCalledWith('1')
        expect(mockControllerInstance.getSample).toHaveBeenCalledTimes(1)
      })

      it('should handle query parameters correctly', async () => {
        // Arrange
        const url = 'http://localhost:3000/api/sample?id=123&include=details'
        const request = new NextRequest(url)
        mockControllerInstance.getSample.mockResolvedValue(mockSuccessResponse)

        // Act
        const response = await GET(request)

        // Assert
        expect(response.status).toBe(200)
        expect(mockControllerInstance.getSample).toHaveBeenCalledWith('123')
      })
    })

    describe('異常系', () => {
      it('should return 400 when id parameter is missing', async () => {
        // Arrange
        const url = 'http://localhost:3000/api/sample'
        const request = new NextRequest(url)

        // Act
        const response = await GET(request)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(400)
        expect(responseData.success).toBe(false)
        expect(responseData.error).toBe('param1 is required')
        expect(mockControllerInstance.getSample).not.toHaveBeenCalled()
      })

      it('should return 400 when controller returns error', async () => {
        // Arrange
        const url = 'http://localhost:3000/api/sample?id=999'
        const request = new NextRequest(url)
        mockControllerInstance.getSample.mockResolvedValue(mockErrorResponse)

        // Act
        const response = await GET(request)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(400)
        expect(responseData).toEqual(mockErrorResponse)
      })

      it('should return 500 when controller throws exception', async () => {
        // Arrange
        const url = 'http://localhost:3000/api/sample?id=1'
        const request = new NextRequest(url)
        mockControllerInstance.getSample.mockRejectedValue(new Error('Database connection failed'))

        // Act
        const response = await GET(request)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(500)
        expect(responseData.success).toBe(false)
        expect(responseData.error).toBe('Internal server error')
      })
    })
  })

  // ===== POST APIテスト =====
  describe('POST /api/sample', () => {
    const validPostData = {
      name: 'New Sample',
      description: 'New Description'
    }

    describe('正常系', () => {
      it('should create sample with valid data', async () => {
        // Arrange
        const request = new NextRequest('http://localhost:3000/api/sample', {
          method: 'POST',
          body: JSON.stringify(validPostData),
          headers: { 'Content-Type': 'application/json' }
        })
        mockControllerInstance.createSample.mockResolvedValue({
          ...mockSuccessResponse,
          data: { ...mockSampleData, ...validPostData }
        })

        // Act
        const response = await POST(request)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(201)
        expect(responseData.success).toBe(true)
        expect(mockControllerInstance.createSample).toHaveBeenCalledWith(validPostData)
      })
    })

    describe('異常系', () => {
      it('should return 400 when request body is invalid JSON', async () => {
        // Arrange
        const request = new NextRequest('http://localhost:3000/api/sample', {
          method: 'POST',
          body: 'invalid json',
          headers: { 'Content-Type': 'application/json' }
        })

        // Act
        const response = await POST(request)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(400)
        expect(responseData.success).toBe(false)
        expect(responseData.error).toBe('Invalid request format')
        expect(mockControllerInstance.createSample).not.toHaveBeenCalled()
      })

      it('should return 400 when controller returns validation error', async () => {
        // Arrange
        const request = new NextRequest('http://localhost:3000/api/sample', {
          method: 'POST',
          body: JSON.stringify({ name: '' }),
          headers: { 'Content-Type': 'application/json' }
        })
        mockControllerInstance.createSample.mockResolvedValue(mockValidationErrorResponse)

        // Act
        const response = await POST(request)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(400)
        expect(responseData).toEqual(mockValidationErrorResponse)
      })
    })
  })

  // ===== PUT APIテスト =====
  describe('PUT /api/sample/[id]', () => {
    const updateData = {
      name: 'Updated Sample',
      description: 'Updated Description'
    }

    describe('正常系', () => {
      it('should update sample with valid data', async () => {
        // Arrange
        const request = new NextRequest('http://localhost:3000/api/sample/1', {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: { 'Content-Type': 'application/json' }
        })
        const params = { params: { id: '1' } }
        mockControllerInstance.updateSample.mockResolvedValue({
          ...mockSuccessResponse,
          data: { ...mockSampleData, ...updateData }
        })

        // Act
        const response = await PUT(request, params)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(200)
        expect(responseData.success).toBe(true)
        expect(mockControllerInstance.updateSample).toHaveBeenCalledWith('1', updateData)
      })
    })

    describe('異常系', () => {
      it('should return 400 when update fails', async () => {
        // Arrange
        const request = new NextRequest('http://localhost:3000/api/sample/999', {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: { 'Content-Type': 'application/json' }
        })
        const params = { params: { id: '999' } }
        mockControllerInstance.updateSample.mockResolvedValue(mockErrorResponse)

        // Act
        const response = await PUT(request, params)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(400)
        expect(responseData).toEqual(mockErrorResponse)
      })
    })
  })

  // ===== DELETE APIテスト =====
  describe('DELETE /api/sample/[id]', () => {
    describe('正常系', () => {
      it('should delete sample successfully', async () => {
        // Arrange
        const request = new NextRequest('http://localhost:3000/api/sample/1', {
          method: 'DELETE'
        })
        const params = { params: { id: '1' } }
        mockControllerInstance.deleteSample.mockResolvedValue({
          success: true,
          data: true,
          message: 'Sample deleted successfully'
        })

        // Act
        const response = await DELETE(request, params)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(200)
        expect(responseData.success).toBe(true)
        expect(mockControllerInstance.deleteSample).toHaveBeenCalledWith('1')
      })
    })

    describe('異常系', () => {
      it('should return 400 when delete fails', async () => {
        // Arrange
        const request = new NextRequest('http://localhost:3000/api/sample/999', {
          method: 'DELETE'
        })
        const params = { params: { id: '999' } }
        mockControllerInstance.deleteSample.mockResolvedValue(mockErrorResponse)

        // Act
        const response = await DELETE(request, params)
        const responseData = await response.json()

        // Assert
        expect(response.status).toBe(400)
        expect(responseData).toEqual(mockErrorResponse)
      })
    })
  })

  // ===== エラーハンドリングテスト =====
  describe('Error Handling', () => {
    it('should handle unexpected controller errors gracefully', async () => {
      // Arrange
      const url = 'http://localhost:3000/api/sample?id=1'
      const request = new NextRequest(url)
      mockControllerInstance.getSample.mockRejectedValue(new Error('Unexpected error'))

      // Act
      const response = await GET(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should handle controller timeout', async () => {
      // Arrange
      const url = 'http://localhost:3000/api/sample?id=1'
      const request = new NextRequest(url)
      mockControllerInstance.getSample.mockImplementation(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )

      // Act
      const response = await GET(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
    })
  })

  // ===== HTTPヘッダーテスト =====
  describe('HTTP Headers', () => {
    it('should set correct content-type header', async () => {
      // Arrange
      const url = 'http://localhost:3000/api/sample?id=1'
      const request = new NextRequest(url)
      mockControllerInstance.getSample.mockResolvedValue(mockSuccessResponse)

      // Act
      const response = await GET(request)

      // Assert
      expect(response.headers.get('content-type')).toContain('application/json')
    })

    it('should handle CORS headers if configured', async () => {
      // Arrange
      const url = 'http://localhost:3000/api/sample?id=1'
      const request = new NextRequest(url)
      mockControllerInstance.getSample.mockResolvedValue(mockSuccessResponse)

      // Act
      const response = await GET(request)

      // Assert
      expect(response.status).toBe(200)
      // CORS設定がある場合はここでヘッダーをテスト
    })
  })

  // ===== パフォーマンステスト =====
  describe('Performance', () => {
    it('should complete request within acceptable time', async () => {
      // Arrange
      const url = 'http://localhost:3000/api/sample?id=1'
      const request = new NextRequest(url)
      mockControllerInstance.getSample.mockResolvedValue(mockSuccessResponse)
      const startTime = Date.now()

      // Act
      await GET(request)
      const endTime = Date.now()

      // Assert
      expect(endTime - startTime).toBeLessThan(1000) // 1秒以内
    })
  })
})

// ===== ヘルパー関数 =====
/**
 * テスト用のNextRequestを作成
 */
function createTestRequest(
  url: string, 
  options: RequestInit = {}
): NextRequest {
  return new NextRequest(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
}

/**
 * レスポンスボディをJSONで取得
 */
async function getResponseJson(response: Response): Promise<any> {
  return await response.json()
}

/**
 * モックレスポンスファクトリー
 */
const MockResponseFactory = {
  success: (data: any, message?: string) => ({
    success: true,
    data,
    message: message || 'Operation completed successfully'
  }),

  error: (error: string, details?: any) => ({
    success: false,
    error,
    details
  }),

  validationError: (field: string, message: string) => ({
    success: false,
    error: 'Validation failed',
    details: [{ field, message }]
  })
}

/* 
使用例とベストプラクティス:

1. API層テストの焦点
   - HTTPインターフェースの検証
   - Controllerへの適切な委譲
   - エラーハンドリングの確認

2. テストデータの管理
   - MockResponseFactory使用
   - 一貫したテストデータ定義
   - 再利用可能なヘルパー関数

3. モック戦略
   - Controller層のみをモック
   - 下位層は関与しない
   - HTTP固有の処理にフォーカス

4. 命名規則
   - ファイル名: {Api名}Test.ts
   - テストケース: should + 動詞 + 期待結果
   - グループ化: HTTP動詞 → 正常系/異常系

5. アサーション
   - HTTPステータスコード確認
   - レスポンスボディ検証
   - モック呼び出し確認
   - パフォーマンス検証
*/