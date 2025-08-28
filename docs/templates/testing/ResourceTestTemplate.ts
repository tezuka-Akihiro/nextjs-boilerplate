/**
 * AI滑走路 - Resource層テストテンプレート
 * 
 * テスト対象: Resource層
 * モック対象: 外部サービス（Supabase、API、ファイルシステム等）
 * テスト戦略: 外部サービスをモック化してデータアクセス層のロジックをテスト
 * 
 * 責務:
 * - データベース操作のテスト
 * - 外部API通信のテスト
 * - ファイル操作のテスト
 * - エラーハンドリングとリトライ処理のテスト
 * 
 * 禁止項目:
 * - Task層のビジネスロジックテスト
 * - Controller層のオーケストレーションテスト
 * - UI/プレゼンテーション層のテスト
 * - 複雑なビジネスルール検証（Task層で実施）
 */

import { SampleResource } from '../../../src/backend/resources/SampleResource'
import { ExternalApiResource } from '../../../src/backend/resources/ExternalApiResource'
import { FileSystemResource } from '../../../src/backend/resources/FileSystemResource'
import { SampleType, CreateSampleInput, UpdateSampleInput } from '../../../src/shared/types'
import { createClient } from '@supabase/supabase-js'

// ===== モック設定 =====
// 許可された依存: 外部サービス（Supabase、API、FS等）をモック化
jest.mock('@supabase/supabase-js')
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

// Fetch APIのモック
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('SampleResourceTest', () => {
  let sampleResource: SampleResource
  let mockSupabaseClient: any

  // ===== セットアップ・クリーンアップ =====
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks()

    // Supabaseクライアントのモック作成
    mockSupabaseClient = {
      from: jest.fn(),
      auth: {
        getUser: jest.fn()
      }
    }

    // モックファクトリー関数
    const createMockQuery = (data: any = null, error: any = null) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data, error }),
      limit: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: data ? [data] : [], error }),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockResolvedValue({ error }),
      range: jest.fn().mockReturnThis()
    })

    mockSupabaseClient.from.mockImplementation(() => createMockQuery())
    mockCreateClient.mockReturnValue(mockSupabaseClient)

    // Resourceインスタンス作成
    sampleResource = new SampleResource(mockSupabaseClient)
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
    category: 'A',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockCreateInput: CreateSampleInput = {
    name: 'New Sample',
    description: 'New Description',
    category: 'B'
  }

  const mockUpdateInput: UpdateSampleInput = {
    name: 'Updated Sample',
    description: 'Updated Description'
  }

  const mockAuthUser = {
    id: 'user123',
    email: 'test@example.com'
  }

  // ===== findById テスト =====
  describe('findById', () => {
    describe('正常系', () => {
      it('should return sample data when record exists', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: mockSampleData, 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.findById('1')

        // Assert
        expect(result).toEqual(mockSampleData)
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('samples')
        expect(mockQuery.select).toHaveBeenCalledWith('*')
        expect(mockQuery.eq).toHaveBeenCalledWith('id', '1')
        expect(mockQuery.single).toHaveBeenCalled()
      })

      it('should return null when record not found (PGRST116)', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { code: 'PGRST116' } 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.findById('999')

        // Assert
        expect(result).toBeNull()
        expect(mockQuery.eq).toHaveBeenCalledWith('id', '999')
      })
    })

    describe('異常系', () => {
      it('should handle database connection error', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { 
              code: 'CONNECTION_ERROR', 
              message: 'Database connection failed' 
            } 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.findById('1'))
          .rejects
          .toThrow('Database error in SampleResource.findById')
      })

      it('should handle invalid UUID format', async () => {
        // Arrange
        const invalidId = 'invalid-uuid'

        // Act & Assert
        await expect(sampleResource.findById(invalidId))
          .rejects
          .toThrow('Invalid UUID format')
      })

      it('should handle network timeout', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockRejectedValue(new Error('Network timeout'))
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.findById('1'))
          .rejects
          .toThrow('Network timeout')
      })
    })
  })

  // ===== findMany テスト =====
  describe('findMany', () => {
    describe('正常系', () => {
      it('should return filtered samples with pagination', async () => {
        // Arrange
        const expectedSamples = [mockSampleData, { ...mockSampleData, id: '2' }]
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          range: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ 
            data: expectedSamples, 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.findMany({
          category: 'A',
          status: 'active',
          limit: 10,
          offset: 0
        })

        // Assert
        expect(result).toEqual(expectedSamples)
        expect(mockQuery.select).toHaveBeenCalledWith('*')
        expect(mockQuery.eq).toHaveBeenCalledWith('category', 'A')
        expect(mockQuery.eq).toHaveBeenCalledWith('status', 'active')
        expect(mockQuery.limit).toHaveBeenCalledWith(10)
        expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false })
      })

      it('should handle empty filters', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ 
            data: [mockSampleData], 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.findMany({})

        // Assert
        expect(result).toEqual([mockSampleData])
        expect(mockQuery.select).toHaveBeenCalledWith('*')
      })

      it('should return empty array when no records found', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ 
            data: [], 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.findMany({})

        // Assert
        expect(result).toEqual([])
      })
    })

    describe('異常系', () => {
      it('should handle query execution error', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Query execution failed' } 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.findMany({}))
          .rejects
          .toThrow('Database error in SampleResource.findMany')
      })
    })
  })

  // ===== create テスト =====
  describe('create', () => {
    describe('正常系', () => {
      it('should create sample with authenticated user', async () => {
        // Arrange
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: mockAuthUser },
          error: null
        })

        const expectedResult = {
          ...mockCreateInput,
          id: '1',
          user_id: 'user123',
          created_at: expect.any(String),
          updated_at: expect.any(String)
        }

        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: expectedResult, 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.create(mockCreateInput)

        // Assert
        expect(result).toEqual(expectedResult)
        expect(mockQuery.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            ...mockCreateInput,
            user_id: 'user123',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        )
      })

      it('should handle optional fields correctly', async () => {
        // Arrange
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: mockAuthUser },
          error: null
        })

        const inputWithOptionalFields = {
          ...mockCreateInput,
          metadata: { key: 'value' },
          tags: ['tag1', 'tag2']
        }

        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: inputWithOptionalFields, 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.create(inputWithOptionalFields as any)

        // Assert
        expect(result).toEqual(inputWithOptionalFields)
        expect(mockQuery.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: { key: 'value' },
            tags: ['tag1', 'tag2']
          })
        )
      })
    })

    describe('異常系', () => {
      it('should handle authentication failure', async () => {
        // Arrange
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: null },
          error: { message: 'Not authenticated' }
        })

        // Act & Assert
        await expect(sampleResource.create(mockCreateInput))
          .rejects
          .toThrow('Authentication required')
      })

      it('should handle duplicate key constraint violation', async () => {
        // Arrange
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: mockAuthUser },
          error: null
        })

        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { 
              code: '23505', 
              message: 'duplicate key value violates unique constraint' 
            } 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.create(mockCreateInput))
          .rejects
          .toThrow('Email already exists')
      })

      it('should handle database connection failure', async () => {
        // Arrange
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: mockAuthUser },
          error: null
        })

        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockRejectedValue(new Error('Connection lost'))
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.create(mockCreateInput))
          .rejects
          .toThrow('Connection lost')
      })
    })
  })

  // ===== update テスト =====
  describe('update', () => {
    describe('正常系', () => {
      it('should update sample with timestamp', async () => {
        // Arrange
        const expectedResult = {
          ...mockSampleData,
          ...mockUpdateInput,
          updated_at: expect.any(String)
        }

        const mockQuery = {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: expectedResult, 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.update('1', mockUpdateInput)

        // Assert
        expect(result).toEqual(expectedResult)
        expect(mockQuery.update).toHaveBeenCalledWith(
          expect.objectContaining({
            ...mockUpdateInput,
            updated_at: expect.any(String)
          })
        )
        expect(mockQuery.eq).toHaveBeenCalledWith('id', '1')
      })

      it('should handle partial updates', async () => {
        // Arrange
        const partialUpdate = { name: 'Only Name Updated' }
        const expectedResult = {
          ...mockSampleData,
          ...partialUpdate,
          updated_at: expect.any(String)
        }

        const mockQuery = {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: expectedResult, 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.update('1', partialUpdate)

        // Assert
        expect(result.name).toBe('Only Name Updated')
        expect(result.description).toBe(mockSampleData.description) // 変更されない
      })
    })

    describe('異常系', () => {
      it('should handle non-existent record', async () => {
        // Arrange
        const mockQuery = {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { code: 'PGRST116' } 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.update('999', mockUpdateInput))
          .rejects
          .toThrow('User not found')
      })

      it('should handle constraint violations', async () => {
        // Arrange
        const mockQuery = {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { 
              code: '23503', 
              message: 'foreign key constraint violation' 
            } 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.update('1', mockUpdateInput))
          .rejects
          .toThrow('Foreign key constraint violation')
      })
    })
  })

  // ===== delete テスト =====
  describe('delete', () => {
    describe('正常系', () => {
      it('should delete sample successfully', async () => {
        // Arrange
        const mockQuery = {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.delete('1')

        // Assert
        expect(result).toBe(true)
        expect(mockQuery.delete).toHaveBeenCalled()
        expect(mockQuery.eq).toHaveBeenCalledWith('id', '1')
      })

      it('should return true even for non-existent records', async () => {
        // Arrange - Supabaseは存在しないレコードの削除でもエラーにならない
        const mockQuery = {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.delete('999')

        // Assert
        expect(result).toBe(true)
      })
    })

    describe('異常系', () => {
      it('should handle foreign key constraint violation', async () => {
        // Arrange
        const mockQuery = {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ 
            error: { 
              code: '23503', 
              message: 'Foreign key constraint violation' 
            } 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.delete('1'))
          .rejects
          .toThrow('Cannot delete user: referenced by other records')
      })
    })
  })

  // ===== count テスト =====
  describe('count', () => {
    describe('正常系', () => {
      it('should return correct count with filters', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis()
        }
        mockQuery.select.mockResolvedValue({ count: 42, error: null })
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.count({ 
          category: 'A', 
          status: 'active' 
        })

        // Assert
        expect(result).toBe(42)
        expect(mockQuery.select).toHaveBeenCalledWith('*', { count: 'exact', head: true })
        expect(mockQuery.eq).toHaveBeenCalledWith('category', 'A')
        expect(mockQuery.eq).toHaveBeenCalledWith('status', 'active')
      })

      it('should return 0 when count is null', async () => {
        // Arrange
        const mockQuery = {
          select: jest.fn().mockResolvedValue({ count: null, error: null })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.count({})

        // Assert
        expect(result).toBe(0)
      })
    })
  })

  // ===== bulkCreate テスト =====
  describe('bulkCreate', () => {
    describe('正常系', () => {
      it('should create multiple samples', async () => {
        // Arrange
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: mockAuthUser },
          error: null
        })

        const inputItems = [
          { name: 'Sample 1', description: 'Desc 1' },
          { name: 'Sample 2', description: 'Desc 2' }
        ]

        const expectedResults = inputItems.map((item, index) => ({
          id: `${index + 1}`,
          ...item,
          user_id: 'user123',
          created_at: expect.any(String),
          updated_at: expect.any(String)
        }))

        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ 
            data: expectedResults, 
            error: null 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act
        const result = await sampleResource.bulkCreate(inputItems as any)

        // Assert
        expect(result).toEqual(expectedResults)
        expect(mockQuery.insert).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Sample 1',
              user_id: 'user123'
            }),
            expect.objectContaining({
              name: 'Sample 2',
              user_id: 'user123'
            })
          ])
        )
      })

      it('should handle empty array', async () => {
        // Act
        const result = await sampleResource.bulkCreate([])

        // Assert
        expect(result).toEqual([])
        expect(mockSupabaseClient.from).not.toHaveBeenCalled()
      })
    })

    describe('異常系', () => {
      it('should handle bulk constraint violations', async () => {
        // Arrange
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: mockAuthUser },
          error: null
        })

        const inputItems = [
          { name: 'Sample 1', description: 'Desc 1' },
          { name: 'Sample 1', description: 'Duplicate' } // 重複名
        ]

        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { 
              code: '23505', 
              message: 'duplicate key value violates unique constraint' 
            } 
          })
        }
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        // Act & Assert
        await expect(sampleResource.bulkCreate(inputItems as any))
          .rejects
          .toThrow('Database error in SampleResource.bulkCreate')
      })
    })
  })

  // ===== エラーハンドリングテスト =====
  describe('Error Handling', () => {
    it('should provide context in error messages', async () => {
      // Arrange
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: null, 
          error: { 
            code: 'UNKNOWN_ERROR', 
            message: 'Unexpected database error' 
          } 
        })
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      // Act & Assert
      await expect(sampleResource.findById('1'))
        .rejects
        .toThrow('Database error in SampleResource.findById')
    })

    it('should handle network timeouts gracefully', async () => {
      // Arrange
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockImplementation(() => 
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), 50)
          )
        )
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      // Act & Assert
      await expect(sampleResource.findById('1'))
        .rejects
        .toThrow('Network timeout')
    })
  })

  // ===== パフォーマンステスト =====
  describe('Performance', () => {
    it('should complete operations within acceptable time', async () => {
      // Arrange
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: mockSampleData, 
          error: null 
        })
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)
      const startTime = Date.now()

      // Act
      await sampleResource.findById('1')
      const endTime = Date.now()

      // Assert
      expect(endTime - startTime).toBeLessThan(100) // 100ms以内
    })

    it('should handle concurrent requests', async () => {
      // Arrange
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: mockSampleData, 
          error: null 
        })
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      // Act
      const promises = Array.from({ length: 10 }, () => 
        sampleResource.findById('1')
      )
      const results = await Promise.all(promises)

      // Assert
      expect(results).toHaveLength(10)
      expect(results.every(result => result?.id === '1')).toBe(true)
    })
  })
})

// ===== ExternalApiResource テスト =====
describe('ExternalApiResourceTest', () => {
  let externalApiResource: ExternalApiResource

  beforeEach(() => {
    jest.clearAllMocks()
    
    // 環境変数のモック
    process.env.EXTERNAL_API_URL = 'https://api.example.com'
    process.env.EXTERNAL_API_KEY = 'test-api-key'
    
    externalApiResource = new ExternalApiResource()
  })

  describe('fetchExternalData', () => {
    describe('正常系', () => {
      it('should fetch data from external API', async () => {
        // Arrange
        const mockResponseData = { id: '1', data: 'external data' }
        mockFetch.mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(mockResponseData)
        } as any)

        // Act
        const result = await externalApiResource.fetchExternalData('users', { 
          limit: 10 
        })

        // Assert
        expect(result).toEqual(mockResponseData)
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/users?limit=10',
          expect.objectContaining({
            headers: {
              'Authorization': 'Bearer test-api-key',
              'Content-Type': 'application/json'
            }
          })
        )
      })
    })

    describe('異常系', () => {
      it('should handle API error responses', async () => {
        // Arrange
        mockFetch.mockResolvedValue({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        } as any)

        // Act & Assert
        await expect(externalApiResource.fetchExternalData('invalid'))
          .rejects
          .toThrow('External API error: 404 Not Found')
      })

      it('should handle network errors', async () => {
        // Arrange
        mockFetch.mockRejectedValue(new Error('Network error'))

        // Act & Assert
        await expect(externalApiResource.fetchExternalData('users'))
          .rejects
          .toThrow('Failed to fetch external data: Network error')
      })
    })
  })
})

// ===== FileSystemResource テスト =====
describe('FileSystemResourceTest', () => {
  let fileSystemResource: FileSystemResource
  let mockSupabaseStorage: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockSupabaseStorage = {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest.fn()
    }

    const mockSupabaseClient = {
      storage: mockSupabaseStorage
    }

    fileSystemResource = new FileSystemResource(mockSupabaseClient as any)
  })

  describe('uploadFile', () => {
    describe('正常系', () => {
      it('should upload file and return public URL', async () => {
        // Arrange
        const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })
        const mockPublicUrl = 'https://storage.example.com/bucket/test.txt'
        
        mockSupabaseStorage.upload.mockResolvedValue({ 
          data: { path: 'test.txt' }, 
          error: null 
        })
        mockSupabaseStorage.getPublicUrl.mockReturnValue({ 
          data: { publicUrl: mockPublicUrl } 
        })

        // Act
        const result = await fileSystemResource.uploadFile('bucket', 'test.txt', mockFile)

        // Assert
        expect(result).toBe(mockPublicUrl)
        expect(mockSupabaseStorage.from).toHaveBeenCalledWith('bucket')
        expect(mockSupabaseStorage.upload).toHaveBeenCalledWith('test.txt', mockFile, {
          upsert: false
        })
        expect(mockSupabaseStorage.getPublicUrl).toHaveBeenCalledWith('test.txt')
      })
    })

    describe('異常系', () => {
      it('should handle upload failure', async () => {
        // Arrange
        const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })
        mockSupabaseStorage.upload.mockResolvedValue({ 
          data: null, 
          error: { message: 'Upload failed' } 
        })

        // Act & Assert
        await expect(fileSystemResource.uploadFile('bucket', 'test.txt', mockFile))
          .rejects
          .toThrow('File upload failed: Upload failed')
      })
    })
  })

  describe('deleteFile', () => {
    describe('正常系', () => {
      it('should delete file successfully', async () => {
        // Arrange
        mockSupabaseStorage.remove.mockResolvedValue({ error: null })

        // Act
        const result = await fileSystemResource.deleteFile('bucket', 'test.txt')

        // Assert
        expect(result).toBe(true)
        expect(mockSupabaseStorage.remove).toHaveBeenCalledWith(['test.txt'])
      })
    })

    describe('異常系', () => {
      it('should handle delete failure', async () => {
        // Arrange
        mockSupabaseStorage.remove.mockResolvedValue({ 
          error: { message: 'Delete failed' } 
        })

        // Act & Assert
        await expect(fileSystemResource.deleteFile('bucket', 'test.txt'))
          .rejects
          .toThrow('File deletion failed: Delete failed')
      })
    })
  })
})

// ===== ヘルパー関数とユーティリティ =====
/**
 * Supabaseレスポンスモックファクトリー
 */
const SupabaseResponseFactory = {
  success: (data: any) => ({ data, error: null }),
  
  error: (code: string, message: string) => ({ 
    data: null, 
    error: { code, message } 
  }),
  
  notFound: () => ({ 
    data: null, 
    error: { code: 'PGRST116' } 
  }),
  
  constraintViolation: (constraint: string) => ({ 
    data: null, 
    error: { 
      code: '23505', 
      message: `duplicate key value violates unique constraint "${constraint}"` 
    } 
  })
}

/**
 * テストデータファクトリー
 */
const ResourceTestDataFactory = {
  createSample: (overrides = {}) => ({
    id: '1',
    name: 'Test Sample',
    description: 'Test Description',
    category: 'A',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }),

  createInput: (overrides = {}) => ({
    name: 'New Sample',
    description: 'New Description',
    category: 'B',
    ...overrides
  }),

  createAuthUser: (overrides = {}) => ({
    id: 'user123',
    email: 'test@example.com',
    ...overrides
  })
}

/**
 * アサーションヘルパー
 */
const ResourceAssertionHelper = {
  expectSupabaseCall: (mockClient: any, table: string, method: string, ...args: any[]) => {
    expect(mockClient.from).toHaveBeenCalledWith(table)
    // より詳細なアサーションは実際の実装に合わせて追加
  },

  expectErrorWithCode: (error: any, expectedCode: string) => {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain(expectedCode)
  }
}

/* 
使用例とベストプラクティス:

1. Resource層テストの焦点
   - データアクセス処理の正確性
   - 外部サービスとの適切な連携
   - エラーハンドリングの網羅性
   - パフォーマンスの確認

2. モック戦略
   - Supabaseクライアントの完全モック
   - Fetch APIのモック
   - ファイルシステムAPIのモック
   - 環境変数のモック

3. テストケース設計
   - CRUD操作: 全パターンの網羅
   - エラーケース: 各種DB/ネットワークエラー
   - 制約違反: ユニーク制約、外部キー制約
   - パフォーマンス: 応答時間、並行処理

4. アサーション
   - 戻り値の正確性
   - 外部サービス呼び出しパラメータ
   - エラーメッセージの適切性
   - 副作用の確認

5. 命名規則
   - ファイル名: {Resource名}Test.ts
   - テストケース: should + データアクセス観点の期待結果
   - グループ化: メソッド → 正常系/異常系/制約
*/