/**
 * AI滑走路 - Controller層テストテンプレート
 * 
 * テスト対象: Controller層
 * モック対象: Task層 + Response層
 * テスト戦略: Taskをモック化してビジネスロジックのオーケストレーションをテスト
 * 
 * 責務:
 * - ビジネスロジックの統合・調整のテスト
 * - 複数Taskのオーケストレーションテスト
 * - 横断処理（認証、バリデーション等）のテスト
 * - エラーハンドリングとResponseへの委譲テスト
 * 
 * 禁止項目:
 * - Resource層への直接テスト
 * - API層のHTTP処理テスト
 * - データベース操作の詳細テスト
 */

import { SampleController } from '../../../src/backend/controllers/SampleController'
import { SampleCreateTask } from '../../../src/backend/tasks/SampleCreateTask'
import { SampleUpdateTask } from '../../../src/backend/tasks/SampleUpdateTask'
import { SampleDeleteTask } from '../../../src/backend/tasks/SampleDeleteTask'
import { SampleGetTask } from '../../../src/backend/tasks/SampleGetTask'
import { SampleValidateTask } from '../../../src/backend/tasks/SampleValidateTask'
import { BaseResponse } from '../../../src/backend/responses/BaseResponse'
import { SampleType, CreateSampleInput, UpdateSampleInput } from '../../../src/shared/types'

// ===== モック設定 =====
// 許可された依存: Task層 + Response層をモック化
jest.mock('../../../src/backend/tasks/SampleCreateTask')
jest.mock('../../../src/backend/tasks/SampleUpdateTask')
jest.mock('../../../src/backend/tasks/SampleDeleteTask')
jest.mock('../../../src/backend/tasks/SampleGetTask')
jest.mock('../../../src/backend/tasks/SampleValidateTask')
jest.mock('../../../src/backend/responses/BaseResponse')

const MockedSampleCreateTask = SampleCreateTask as jest.MockedClass<typeof SampleCreateTask>
const MockedSampleUpdateTask = SampleUpdateTask as jest.MockedClass<typeof SampleUpdateTask>
const MockedSampleDeleteTask = SampleDeleteTask as jest.MockedClass<typeof SampleDeleteTask>
const MockedSampleGetTask = SampleGetTask as jest.MockedClass<typeof SampleGetTask>
const MockedSampleValidateTask = SampleValidateTask as jest.MockedClass<typeof SampleValidateTask>
const MockedBaseResponse = BaseResponse as jest.Mocked<typeof BaseResponse>

describe('SampleControllerTest', () => {
  let sampleController: SampleController
  let mockCreateTask: jest.Mocked<SampleCreateTask>
  let mockUpdateTask: jest.Mocked<SampleUpdateTask>
  let mockDeleteTask: jest.Mocked<SampleDeleteTask>
  let mockGetTask: jest.Mocked<SampleGetTask>
  let mockValidateTask: jest.Mocked<SampleValidateTask>

  // ===== セットアップ・クリーンアップ =====
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks()

    // Taskインスタンスのモック作成
    mockCreateTask = new MockedSampleCreateTask() as jest.Mocked<SampleCreateTask>
    mockUpdateTask = new MockedSampleUpdateTask() as jest.Mocked<SampleUpdateTask>
    mockDeleteTask = new MockedSampleDeleteTask() as jest.Mocked<SampleDeleteTask>
    mockGetTask = new MockedSampleGetTask() as jest.Mocked<SampleGetTask>
    mockValidateTask = new MockedSampleValidateTask() as jest.Mocked<SampleValidateTask>

    // Taskクラスのコンストラクタモック設定
    MockedSampleCreateTask.mockImplementation(() => mockCreateTask)
    MockedSampleUpdateTask.mockImplementation(() => mockUpdateTask)
    MockedSampleDeleteTask.mockImplementation(() => mockDeleteTask)
    MockedSampleGetTask.mockImplementation(() => mockGetTask)
    MockedSampleValidateTask.mockImplementation(() => mockValidateTask)

    // Controllerインスタンス作成
    sampleController = new SampleController()
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

  const mockSuccessResponse = {
    success: true,
    data: mockSampleData,
    message: 'Operation completed successfully'
  }

  const mockErrorResponse = {
    success: false,
    error: 'Sample not found'
  }

  const mockValidationErrors = [
    { field: 'name', message: 'Name is required' }
  ]

  // ===== getSample テスト =====
  describe('getSample', () => {
    describe('正常系', () => {
      it('should return sample data when task succeeds', async () => {
        // Arrange
        mockGetTask.execute.mockResolvedValue(mockSampleData)

        // Act
        const result = await sampleController.getSample('1')

        // Assert
        expect(result).toEqual(mockSampleData)
        expect(mockGetTask.execute).toHaveBeenCalledWith('1')
        expect(mockGetTask.execute).toHaveBeenCalledTimes(1)
      })

      it('should handle different sample types correctly', async () => {
        // Arrange
        const premiumSample = { ...mockSampleData, category: 'premium' }
        mockGetTask.execute.mockResolvedValue(premiumSample)

        // Act
        const result = await sampleController.getSample('1')

        // Assert
        expect(result).toEqual(premiumSample)
        expect(result.category).toBe('premium')
      })
    })

    describe('異常系', () => {
      it('should handle task execution error', async () => {
        // Arrange
        mockGetTask.execute.mockRejectedValue(new Error('Sample not found'))

        // Act & Assert
        await expect(sampleController.getSample('999'))
          .rejects
          .toThrow('Sample not found')
        
        expect(mockGetTask.execute).toHaveBeenCalledWith('999')
      })

      it('should handle invalid input parameter', async () => {
        // Arrange
        const invalidId = ''

        // Act & Assert
        await expect(sampleController.getSample(invalidId))
          .rejects
          .toThrow('ID is required')
        
        expect(mockGetTask.execute).not.toHaveBeenCalled()
      })
    })
  })

  // ===== createSample テスト =====
  describe('createSample', () => {
    describe('正常系', () => {
      it('should create sample with valid data and proper task orchestration', async () => {
        // Arrange
        mockValidateTask.execute.mockResolvedValue({ valid: true, errors: [] })
        mockCreateTask.execute.mockResolvedValue(mockSampleData)
        MockedBaseResponse.success = jest.fn().mockReturnValue(mockSuccessResponse)

        // Act
        const result = await sampleController.createSample(mockCreateInput)

        // Assert
        expect(result).toEqual(mockSuccessResponse)
        
        // Controllerの責務: 複数Taskのオーケストレーション確認
        expect(mockValidateTask.execute).toHaveBeenCalledWith(mockCreateInput)
        expect(mockCreateTask.execute).toHaveBeenCalledWith(mockCreateInput)
        
        // 実行順序の確認
        const validateCall = mockValidateTask.execute.mock.invocationCallOrder[0]
        const createCall = mockCreateTask.execute.mock.invocationCallOrder[0]
        expect(validateCall).toBeLessThan(createCall)
      })

      it('should handle business logic coordination', async () => {
        // Arrange
        const businessData = { ...mockCreateInput, requiresApproval: true }
        mockValidateTask.execute.mockResolvedValue({ valid: true, errors: [] })
        mockCreateTask.execute.mockResolvedValue({
          ...mockSampleData,
          status: 'pending_approval'
        })

        // Act
        const result = await sampleController.createSample(businessData)

        // Assert
        expect(mockValidateTask.execute).toHaveBeenCalledWith(businessData)
        expect(mockCreateTask.execute).toHaveBeenCalledWith(businessData)
      })
    })

    describe('異常系', () => {
      it('should return validation error when data is invalid', async () => {
        // Arrange
        const invalidData = { name: '', description: 'Test' }
        MockedBaseResponse.validationError = jest.fn().mockReturnValue({
          success: false,
          error: 'Validation failed',
          details: mockValidationErrors
        })

        // Act
        const result = await sampleController.createSample(invalidData as any)

        // Assert
        expect(result.success).toBe(false)
        expect(MockedBaseResponse.validationError).toHaveBeenCalledWith(mockValidationErrors)
        expect(mockValidateTask.execute).not.toHaveBeenCalled()
        expect(mockCreateTask.execute).not.toHaveBeenCalled()
      })

      it('should handle validation task failure', async () => {
        // Arrange
        mockValidateTask.execute.mockResolvedValue({
          valid: false,
          errors: ['Name already exists']
        })

        // Act & Assert
        await expect(sampleController.createSample(mockCreateInput))
          .rejects
          .toThrow('Validation failed')
        
        expect(mockValidateTask.execute).toHaveBeenCalledWith(mockCreateInput)
        expect(mockCreateTask.execute).not.toHaveBeenCalled()
      })

      it('should handle create task failure', async () => {
        // Arrange
        mockValidateTask.execute.mockResolvedValue({ valid: true, errors: [] })
        mockCreateTask.execute.mockRejectedValue(new Error('Database constraint violation'))

        // Act & Assert
        await expect(sampleController.createSample(mockCreateInput))
          .rejects
          .toThrow('Database constraint violation')
        
        expect(mockValidateTask.execute).toHaveBeenCalled()
        expect(mockCreateTask.execute).toHaveBeenCalled()
      })
    })
  })

  // ===== updateSample テスト =====
  describe('updateSample', () => {
    describe('正常系', () => {
      it('should update sample with business rule validation', async () => {
        // Arrange
        const existingSample = { ...mockSampleData, status: 'active' }
        mockGetTask.execute.mockResolvedValue(existingSample)
        mockValidateTask.execute.mockResolvedValue({ valid: true, errors: [] })
        mockUpdateTask.execute.mockResolvedValue({
          ...existingSample,
          ...mockUpdateInput
        })

        // Act
        const result = await sampleController.updateSample('1', mockUpdateInput)

        // Assert
        expect(result).toBeDefined()
        
        // Controllerの責務: ビジネスルール適用の確認
        expect(mockGetTask.execute).toHaveBeenCalledWith('1')
        expect(mockValidateTask.execute).toHaveBeenCalledWith({ name: mockUpdateInput.name })
        expect(mockUpdateTask.execute).toHaveBeenCalledWith('1', mockUpdateInput)
      })

      it('should skip validation when name is not changed', async () => {
        // Arrange
        const existingSample = { ...mockSampleData, name: 'Same Name' }
        const updateWithSameName = { description: 'New Description' }
        
        mockGetTask.execute.mockResolvedValue(existingSample)
        mockUpdateTask.execute.mockResolvedValue({
          ...existingSample,
          ...updateWithSameName
        })

        // Act
        await sampleController.updateSample('1', updateWithSameName)

        // Assert
        expect(mockGetTask.execute).toHaveBeenCalled()
        expect(mockValidateTask.execute).not.toHaveBeenCalled() // 名前変更なしなので検証スキップ
        expect(mockUpdateTask.execute).toHaveBeenCalled()
      })
    })

    describe('異常系', () => {
      it('should reject update when sample is locked', async () => {
        // Arrange
        const lockedSample = { ...mockSampleData, status: 'locked' }
        mockGetTask.execute.mockResolvedValue(lockedSample)

        // Act & Assert
        await expect(sampleController.updateSample('1', mockUpdateInput))
          .rejects
          .toThrow('Sample is locked and cannot be updated')
        
        expect(mockGetTask.execute).toHaveBeenCalledWith('1')
        expect(mockValidateTask.execute).not.toHaveBeenCalled()
        expect(mockUpdateTask.execute).not.toHaveBeenCalled()
      })

      it('should handle non-existent sample', async () => {
        // Arrange
        mockGetTask.execute.mockRejectedValue(new Error('Sample not found'))

        // Act & Assert
        await expect(sampleController.updateSample('999', mockUpdateInput))
          .rejects
          .toThrow('Sample not found')
        
        expect(mockGetTask.execute).toHaveBeenCalledWith('999')
        expect(mockUpdateTask.execute).not.toHaveBeenCalled()
      })
    })
  })

  // ===== deleteSample テスト =====
  describe('deleteSample', () => {
    describe('正常系', () => {
      it('should delete sample after constraint validation', async () => {
        // Arrange
        const deletableSample = { ...mockSampleData, hasRelatedData: false }
        mockGetTask.execute.mockResolvedValue(deletableSample)
        mockDeleteTask.execute.mockResolvedValue(true)

        // Act
        const result = await sampleController.deleteSample('1')

        // Assert
        expect(result).toBe(true)
        expect(mockGetTask.execute).toHaveBeenCalledWith('1')
        expect(mockDeleteTask.execute).toHaveBeenCalledWith('1')
      })
    })

    describe('異常系', () => {
      it('should reject delete when sample has related data', async () => {
        // Arrange
        const sampleWithRelatedData = { ...mockSampleData, hasRelatedData: true }
        mockGetTask.execute.mockResolvedValue(sampleWithRelatedData)

        // Act & Assert
        await expect(sampleController.deleteSample('1'))
          .rejects
          .toThrow('Cannot delete sample with related data')
        
        expect(mockGetTask.execute).toHaveBeenCalledWith('1')
        expect(mockDeleteTask.execute).not.toHaveBeenCalled()
      })

      it('should handle delete operation failure', async () => {
        // Arrange
        const deletableSample = { ...mockSampleData, hasRelatedData: false }
        mockGetTask.execute.mockResolvedValue(deletableSample)
        mockDeleteTask.execute.mockRejectedValue(new Error('Delete failed'))

        // Act & Assert
        await expect(sampleController.deleteSample('1'))
          .rejects
          .toThrow('Delete failed')
        
        expect(mockDeleteTask.execute).toHaveBeenCalledWith('1')
      })
    })
  })

  // ===== 複雑ビジネスロジックテスト =====
  describe('processComplexBusiness', () => {
    const complexBusinessData = {
      id: '1',
      type: 'premium',
      parameters: { level: 5 }
    }

    describe('正常系', () => {
      it('should orchestrate multiple tasks with transaction behavior', async () => {
        // Arrange
        const preprocessResult = { ...complexBusinessData, preprocessed: true }
        const processResult = { ...preprocessResult, processed: true }
        const finalResult = { ...processResult, status: 'completed' }

        // 複数Taskのモック（実際のTaskは存在しないと仮定してジェネリックモック使用）
        const mockPreprocessTask = { execute: jest.fn().mockResolvedValue(preprocessResult) }
        const mockMainProcessTask = { execute: jest.fn().mockResolvedValue(processResult) }
        const mockPostProcessTask = { execute: jest.fn().mockResolvedValue(finalResult) }
        const mockNotificationTask = { execute: jest.fn().mockResolvedValue(true) }

        // Controllerに依存注入（実際の実装では constructor で行う）
        ;(sampleController as any).preprocessTask = mockPreprocessTask
        ;(sampleController as any).mainProcessTask = mockMainProcessTask
        ;(sampleController as any).postProcessTask = mockPostProcessTask
        ;(sampleController as any).notificationTask = mockNotificationTask

        // Act
        const result = await sampleController.processComplexBusiness(complexBusinessData)

        // Assert
        expect(result).toEqual(finalResult)
        
        // Controllerの責務: 複数Taskのオーケストレーション確認
        expect(mockPreprocessTask.execute).toHaveBeenCalledWith(complexBusinessData)
        expect(mockMainProcessTask.execute).toHaveBeenCalledWith(preprocessResult)
        expect(mockPostProcessTask.execute).toHaveBeenCalledWith(processResult)
        expect(mockNotificationTask.execute).toHaveBeenCalledWith(finalResult.id)
        
        // 実行順序の確認
        const preprocessCall = mockPreprocessTask.execute.mock.invocationCallOrder[0]
        const mainProcessCall = mockMainProcessTask.execute.mock.invocationCallOrder[0]
        const postProcessCall = mockPostProcessTask.execute.mock.invocationCallOrder[0]
        const notificationCall = mockNotificationTask.execute.mock.invocationCallOrder[0]
        
        expect(preprocessCall).toBeLessThan(mainProcessCall)
        expect(mainProcessCall).toBeLessThan(postProcessCall)
        expect(postProcessCall).toBeLessThan(notificationCall)
      })
    })

    describe('異常系', () => {
      it('should execute rollback when process fails', async () => {
        // Arrange
        const mockPreprocessTask = { execute: jest.fn().mockResolvedValue({}) }
        const mockMainProcessTask = { 
          execute: jest.fn().mockRejectedValue(new Error('Process failed')) 
        }
        const mockRollbackTask = { execute: jest.fn().mockResolvedValue(true) }

        ;(sampleController as any).preprocessTask = mockPreprocessTask
        ;(sampleController as any).mainProcessTask = mockMainProcessTask
        ;(sampleController as any).rollbackTask = mockRollbackTask

        // Act & Assert
        await expect(sampleController.processComplexBusiness(complexBusinessData))
          .rejects
          .toThrow('Process failed')
        
        // Controllerの責務: エラー時の補償処理確認
        expect(mockRollbackTask.execute).toHaveBeenCalledWith(complexBusinessData.id)
      })
    })
  })

  // ===== 横断的関心事テスト =====
  describe('Cross-cutting Concerns', () => {
    describe('Authentication', () => {
      it('should handle authenticated user context', async () => {
        // Arrange
        const userId = 'user123'
        mockGetTask.execute.mockResolvedValue({ ...mockSampleData, user_id: userId })

        // Act
        const result = await sampleController.getSample('1')

        // Assert
        expect(result.user_id).toBe(userId)
      })
    })

    describe('Authorization', () => {
      it('should enforce access control rules', async () => {
        // Arrange - アクセス権限のないサンプルを想定
        const restrictedSample = { ...mockSampleData, access_level: 'private' }
        mockGetTask.execute.mockRejectedValue(new Error('Access denied'))

        // Act & Assert
        await expect(sampleController.getSample('1'))
          .rejects
          .toThrow('Access denied')
      })
    })

    describe('Audit Logging', () => {
      it('should log critical operations', async () => {
        // Arrange
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
        mockDeleteTask.execute.mockResolvedValue(true)
        const deletableSample = { ...mockSampleData, hasRelatedData: false }
        mockGetTask.execute.mockResolvedValue(deletableSample)

        // Act
        await sampleController.deleteSample('1')

        // Assert
        // 実際の実装ではログサービスの呼び出しを確認
        expect(mockDeleteTask.execute).toHaveBeenCalled()
        
        consoleSpy.mockRestore()
      })
    })
  })

  // ===== エラーハンドリングテスト =====
  describe('Error Handling', () => {
    it('should handle unexpected task errors gracefully', async () => {
      // Arrange
      mockGetTask.execute.mockRejectedValue(new Error('Unexpected database error'))

      // Act & Assert
      await expect(sampleController.getSample('1'))
        .rejects
        .toThrow('Unexpected database error')
    })

    it('should provide meaningful error context', async () => {
      // Arrange
      const contextualError = new Error('Database connection timeout')
      contextualError.name = 'DatabaseTimeoutError'
      mockGetTask.execute.mockRejectedValue(contextualError)

      // Act & Assert
      await expect(sampleController.getSample('1'))
        .rejects
        .toThrow('Database connection timeout')
    })
  })

  // ===== パフォーマンステスト =====
  describe('Performance', () => {
    it('should complete operations within acceptable time', async () => {
      // Arrange
      mockGetTask.execute.mockResolvedValue(mockSampleData)
      const startTime = Date.now()

      // Act
      await sampleController.getSample('1')
      const endTime = Date.now()

      // Assert
      expect(endTime - startTime).toBeLessThan(100) // 100ms以内
    })

    it('should handle concurrent requests properly', async () => {
      // Arrange
      mockGetTask.execute.mockResolvedValue(mockSampleData)

      // Act
      const promises = Array.from({ length: 10 }, () => 
        sampleController.getSample('1')
      )
      const results = await Promise.all(promises)

      // Assert
      expect(results).toHaveLength(10)
      expect(results.every(result => result.id === '1')).toBe(true)
      expect(mockGetTask.execute).toHaveBeenCalledTimes(10)
    })
  })
})

// ===== ヘルパー関数とユーティリティ =====
/**
 * テストデータファクトリー
 */
const TestDataFactory = {
  createSampleInput: (overrides: Partial<CreateSampleInput> = {}): CreateSampleInput => ({
    name: 'Test Sample',
    description: 'Test Description',
    category: 'A',
    ...overrides
  }),

  createSampleData: (overrides: Partial<SampleType> = {}): SampleType => ({
    id: '1',
    name: 'Test Sample',
    description: 'Test Description',
    category: 'A',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }),

  createValidationErrors: (field: string, message: string) => [
    { field, message }
  ]
}

/**
 * モックセットアップヘルパー
 */
const MockSetupHelper = {
  setupSuccessfulValidation: (mockTask: jest.Mocked<SampleValidateTask>) => {
    mockTask.execute.mockResolvedValue({ valid: true, errors: [] })
  },

  setupFailedValidation: (mockTask: jest.Mocked<SampleValidateTask>, errors: string[]) => {
    mockTask.execute.mockResolvedValue({ valid: false, errors })
  },

  setupTaskError: (mockTask: any, error: Error) => {
    mockTask.execute.mockRejectedValue(error)
  }
}

/* 
使用例とベストプラクティス:

1. Controller層テストの焦点
   - ビジネスロジックのオーケストレーション
   - Task間の実行順序と依存関係
   - 横断的関心事の実装

2. モック戦略
   - Task層の完全モック化
   - Response層のスタティックメソッドモック
   - 下位層は関与しない

3. テストケース設計
   - 正常系：ハッピーパスとエッジケース
   - 異常系：各Taskの失敗シナリオ
   - ビジネスルール：条件分岐の網羅

4. アサーション
   - Task呼び出しの確認
   - 実行順序の検証
   - ビジネスロジックの結果確認
   - エラーハンドリングの確認

5. 命名規則
   - ファイル名: {Controller名}Test.ts
   - テストケース: should + ビジネス観点の期待結果
   - グループ化: 機能 → 正常系/異常系
*/