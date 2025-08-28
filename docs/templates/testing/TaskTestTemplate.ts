/**
 * AI滑走路 - Task層テストテンプレート
 * 
 * テスト対象: Task層
 * モック対象: Resource層
 * テスト戦略: Resourceをモック化して単一処理の実行ロジックをテスト
 * 
 * 責務:
 * - 単一処理の実行ロジックテスト
 * - 入力値検証と加工処理のテスト
 * - ビジネスルール適用のテスト
 * - Resourceとの仲介処理テスト
 * 
 * 禁止項目:
 * - Controller層のオーケストレーションテスト
 * - API層のHTTP処理テスト
 * - 複数Taskの連携テスト（Controller層で実施）
 * - UI/プレゼンテーション層のテスト
 */

import { SampleTask } from '../../../src/backend/tasks/SampleTask'
import { CreateSampleTask } from '../../../src/backend/tasks/CreateSampleTask'
import { UpdateSampleTask } from '../../../src/backend/tasks/UpdateSampleTask'
import { ValidateSampleTask } from '../../../src/backend/tasks/ValidateSampleTask'
import { SampleResource } from '../../../src/backend/resources/SampleResource'
import { ValidationResource } from '../../../src/backend/resources/ValidationResource'
import { SampleType, CreateSampleInput, UpdateSampleInput } from '../../../src/shared/types'

// ===== モック設定 =====
// 許可された依存: Resource層のみをモック化
jest.mock('../../../src/backend/resources/SampleResource')
jest.mock('../../../src/backend/resources/ValidationResource')

const MockedSampleResource = SampleResource as jest.MockedClass<typeof SampleResource>
const MockedValidationResource = ValidationResource as jest.MockedClass<typeof ValidationResource>

describe('SampleTaskTest', () => {
  let sampleTask: SampleTask
  let mockSampleResource: jest.Mocked<SampleResource>
  let mockValidationResource: jest.Mocked<ValidationResource>

  // ===== セットアップ・クリーンアップ =====
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks()

    // Resourceインスタンスのモック作成
    mockSampleResource = new MockedSampleResource() as jest.Mocked<SampleResource>
    mockValidationResource = new MockedValidationResource() as jest.Mocked<ValidationResource>

    // Resourceクラスのコンストラクタモック設定
    MockedSampleResource.mockImplementation(() => mockSampleResource)
    MockedValidationResource.mockImplementation(() => mockValidationResource)

    // Taskインスタンス作成
    sampleTask = new SampleTask()
  })

  afterEach(() => {
    // テスト後のクリーンアップ
    jest.restoreAllMocks()
  })

  // ===== テストデータ定義 =====
  const mockSampleInput = {
    id: '1',
    name: 'Test Sample',
    email: 'test@example.com',
    score: 85,
    mustBeUnique: true,
    requiresExternalValidation: false
  }

  const mockSampleData: SampleType = {
    id: '1',
    name: 'Test Sample',
    description: 'Test Description',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockResourceResult = {
    id: '1',
    name: 'Test Sample',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z'
  }

  // ===== execute メソッドテスト =====
  describe('execute', () => {
    describe('正常系', () => {
      it('should execute task with valid input and return processed result', async () => {
        // Arrange
        mockSampleResource.findById.mockResolvedValue(null) // 重複なし
        mockSampleResource.performOperation.mockResolvedValue(mockResourceResult)

        // Act
        const result = await sampleTask.execute(mockSampleInput)

        // Assert
        expect(result).toEqual({
          id: '1',
          name: 'Test Sample',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: expect.any(String)
        })

        // Taskの責務: Resourceへの適切な委譲確認
        expect(mockSampleResource.performOperation).toHaveBeenCalledWith(mockSampleInput)
        expect(mockSampleResource.findById).toHaveBeenCalledWith('1')
      })

      it('should handle business rules correctly', async () => {
        // Arrange
        const inputWithExternalValidation = {
          ...mockSampleInput,
          requiresExternalValidation: true
        }
        mockSampleResource.findById.mockResolvedValue(null)
        mockValidationResource.validateExternal.mockResolvedValue(true)
        mockSampleResource.performOperation.mockResolvedValue(mockResourceResult)

        // Act
        const result = await sampleTask.execute(inputWithExternalValidation)

        // Assert
        expect(result).toBeDefined()
        expect(mockValidationResource.validateExternal).toHaveBeenCalledWith('Test Sample')
        expect(mockSampleResource.performOperation).toHaveBeenCalled()
      })

      it('should normalize and process result correctly', async () => {
        // Arrange
        const rawResult = {
          id: '1',
          name: '  Test Sample  ', // 前後にスペース
          status: null, // デフォルト値が必要
          created_at: '2024-01-01T00:00:00Z'
        }
        mockSampleResource.findById.mockResolvedValue(null)
        mockSampleResource.performOperation.mockResolvedValue(rawResult)

        // Act
        const result = await sampleTask.execute(mockSampleInput)

        // Assert
        expect(result.name).toBe('Test Sample') // スペースがトリムされている
        expect(result.status).toBe('active') // デフォルト値が設定されている
        expect(result.updatedAt).toBeTruthy() // 現在時刻が設定されている
      })
    })

    describe('異常系', () => {
      it('should reject when required input is missing', async () => {
        // Arrange
        const invalidInput = { ...mockSampleInput, id: '' }

        // Act & Assert
        await expect(sampleTask.execute(invalidInput))
          .rejects
          .toThrow('ID is required')

        // Taskの責務: 適切な入力検証
        expect(mockSampleResource.performOperation).not.toHaveBeenCalled()
      })

      it('should reject when business rules are violated', async () => {
        // Arrange
        const existingRecord = { id: '1', name: 'Existing' }
        mockSampleResource.findById.mockResolvedValue(existingRecord)

        // Act & Assert
        await expect(sampleTask.execute(mockSampleInput))
          .rejects
          .toThrow('Record with this ID already exists')

        expect(mockSampleResource.findById).toHaveBeenCalledWith('1')
        expect(mockSampleResource.performOperation).not.toHaveBeenCalled()
      })

      it('should reject when external validation fails', async () => {
        // Arrange
        const inputWithExternalValidation = {
          ...mockSampleInput,
          requiresExternalValidation: true
        }
        mockSampleResource.findById.mockResolvedValue(null)
        mockValidationResource.validateExternal.mockResolvedValue(false)

        // Act & Assert
        await expect(sampleTask.execute(inputWithExternalValidation))
          .rejects
          .toThrow('External validation failed')

        expect(mockValidationResource.validateExternal).toHaveBeenCalled()
        expect(mockSampleResource.performOperation).not.toHaveBeenCalled()
      })

      it('should handle resource operation failure', async () => {
        // Arrange
        mockSampleResource.findById.mockResolvedValue(null)
        mockSampleResource.performOperation.mockRejectedValue(
          new Error('Database operation failed')
        )

        // Act & Assert
        await expect(sampleTask.execute(mockSampleInput))
          .rejects
          .toThrow('Database operation failed')

        expect(mockSampleResource.performOperation).toHaveBeenCalled()
      })
    })
  })

  // ===== 入力検証テスト =====
  describe('Input Validation', () => {
    describe('Required Fields', () => {
      it('should validate required ID field', async () => {
        // Arrange
        const inputWithoutId = { ...mockSampleInput, id: null as any }

        // Act & Assert
        await expect(sampleTask.execute(inputWithoutId))
          .rejects
          .toThrow('ID is required')
      })

      it('should validate required name field', async () => {
        // Arrange
        const inputWithoutName = { ...mockSampleInput, name: '' }

        // Act & Assert
        await expect(sampleTask.execute(inputWithoutName))
          .rejects
          .toThrow('Name is required')
      })
    })

    describe('Type Validation', () => {
      it('should validate name type', async () => {
        // Arrange
        const inputWithWrongType = { ...mockSampleInput, name: 123 as any }

        // Act & Assert
        await expect(sampleTask.execute(inputWithWrongType))
          .rejects
          .toThrow('Name must be a string')
      })

      it('should validate score range', async () => {
        // Arrange
        const inputWithInvalidScore = { ...mockSampleInput, score: 150 }

        // Act & Assert
        await expect(sampleTask.execute(inputWithInvalidScore))
          .rejects
          .toThrow('Score must be between 0 and 100')
      })
    })

    describe('Format Validation', () => {
      it('should validate email format', async () => {
        // Arrange
        const inputWithInvalidEmail = { ...mockSampleInput, email: 'invalid-email' }

        // Act & Assert
        await expect(sampleTask.execute(inputWithInvalidEmail))
          .rejects
          .toThrow('Invalid email format')
      })

      it('should validate text length', async () => {
        // Arrange
        const inputWithLongName = { 
          ...mockSampleInput, 
          name: 'a'.repeat(101) // 100文字制限を超える
        }

        // Act & Assert
        await expect(sampleTask.execute(inputWithLongName))
          .rejects
          .toThrow('Name must be 100 characters or less')
      })
    })

    describe('Optional Fields', () => {
      it('should handle optional email field', async () => {
        // Arrange
        const inputWithoutEmail = { ...mockSampleInput, email: undefined }
        mockSampleResource.findById.mockResolvedValue(null)
        mockSampleResource.performOperation.mockResolvedValue(mockResourceResult)

        // Act
        const result = await sampleTask.execute(inputWithoutEmail)

        // Assert
        expect(result).toBeDefined()
        expect(mockSampleResource.performOperation).toHaveBeenCalled()
      })

      it('should handle optional score field', async () => {
        // Arrange
        const inputWithoutScore = { ...mockSampleInput, score: undefined }
        mockSampleResource.findById.mockResolvedValue(null)
        mockSampleResource.performOperation.mockResolvedValue(mockResourceResult)

        // Act
        const result = await sampleTask.execute(inputWithoutScore)

        // Assert
        expect(result).toBeDefined()
      })
    })
  })

  // ===== ビジネスルールテスト =====
  describe('Business Rules', () => {
    describe('Uniqueness Check', () => {
      it('should allow when record does not exist', async () => {
        // Arrange
        mockSampleResource.findById.mockResolvedValue(null)
        mockSampleResource.performOperation.mockResolvedValue(mockResourceResult)

        // Act
        const result = await sampleTask.execute(mockSampleInput)

        // Assert
        expect(result).toBeDefined()
        expect(mockSampleResource.findById).toHaveBeenCalledWith('1')
      })

      it('should reject when uniqueness is required and record exists', async () => {
        // Arrange
        const existingRecord = { id: '1', name: 'Existing' }
        mockSampleResource.findById.mockResolvedValue(existingRecord)

        // Act & Assert
        await expect(sampleTask.execute(mockSampleInput))
          .rejects
          .toThrow('Record with this ID already exists')
      })

      it('should allow duplicate when uniqueness is not required', async () => {
        // Arrange
        const inputAllowingDuplicates = { ...mockSampleInput, mustBeUnique: false }
        const existingRecord = { id: '1', name: 'Existing' }
        mockSampleResource.findById.mockResolvedValue(existingRecord)
        mockSampleResource.performOperation.mockResolvedValue(mockResourceResult)

        // Act
        const result = await sampleTask.execute(inputAllowingDuplicates)

        // Assert
        expect(result).toBeDefined()
        expect(mockSampleResource.performOperation).toHaveBeenCalled()
      })
    })

    describe('External Validation', () => {
      it('should skip external validation when not required', async () => {
        // Arrange
        const inputWithoutExternalValidation = {
          ...mockSampleInput,
          requiresExternalValidation: false
        }
        mockSampleResource.findById.mockResolvedValue(null)
        mockSampleResource.performOperation.mockResolvedValue(mockResourceResult)

        // Act
        await sampleTask.execute(inputWithoutExternalValidation)

        // Assert
        expect(mockValidationResource.validateExternal).not.toHaveBeenCalled()
      })

      it('should perform external validation when required', async () => {
        // Arrange
        const inputWithExternalValidation = {
          ...mockSampleInput,
          requiresExternalValidation: true
        }
        mockSampleResource.findById.mockResolvedValue(null)
        mockValidationResource.validateExternal.mockResolvedValue(true)
        mockSampleResource.performOperation.mockResolvedValue(mockResourceResult)

        // Act
        await sampleTask.execute(inputWithExternalValidation)

        // Assert
        expect(mockValidationResource.validateExternal).toHaveBeenCalledWith('Test Sample')
      })
    })
  })

  // ===== エラーハンドリングテスト =====
  describe('Error Handling', () => {
    it('should handle resource connection errors', async () => {
      // Arrange
      mockSampleResource.findById.mockRejectedValue(new Error('Connection timeout'))

      // Act & Assert
      await expect(sampleTask.execute(mockSampleInput))
        .rejects
        .toThrow('Connection timeout')
    })

    it('should handle validation service errors', async () => {
      // Arrange
      const inputWithExternalValidation = {
        ...mockSampleInput,
        requiresExternalValidation: true
      }
      mockSampleResource.findById.mockResolvedValue(null)
      mockValidationResource.validateExternal.mockRejectedValue(
        new Error('Validation service unavailable')
      )

      // Act & Assert
      await expect(sampleTask.execute(inputWithExternalValidation))
        .rejects
        .toThrow('Validation service unavailable')
    })

    it('should provide meaningful error messages', async () => {
      // Arrange
      const inputWithInvalidData = { ...mockSampleInput, name: '' }

      // Act & Assert
      await expect(sampleTask.execute(inputWithInvalidData))
        .rejects
        .toThrow('Name is required')
    })
  })
})

// ===== CreateSampleTask 専用テスト =====
describe('CreateSampleTaskTest', () => {
  let createSampleTask: CreateSampleTask
  let mockSampleResource: jest.Mocked<SampleResource>

  beforeEach(() => {
    jest.clearAllMocks()
    mockSampleResource = new MockedSampleResource() as jest.Mocked<SampleResource>
    MockedSampleResource.mockImplementation(() => mockSampleResource)
    createSampleTask = new CreateSampleTask()
  })

  const mockCreateInput: CreateSampleInput = {
    name: 'New Sample',
    description: 'New Description',
    category: 'A'
  }

  const mockCreatedSample: SampleType = {
    id: '1',
    name: 'New Sample',
    description: 'New Description',
    category: 'A',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  describe('execute', () => {
    describe('正常系', () => {
      it('should create sample with valid data', async () => {
        // Arrange
        mockSampleResource.findByName.mockResolvedValue(null) // 重複なし
        mockSampleResource.create.mockResolvedValue(mockCreatedSample)

        // Act
        const result = await createSampleTask.execute(mockCreateInput)

        // Assert
        expect(result).toEqual(mockCreatedSample)
        expect(mockSampleResource.findByName).toHaveBeenCalledWith('New Sample')
        expect(mockSampleResource.create).toHaveBeenCalledWith(mockCreateInput)
      })

      it('should validate category values', async () => {
        // Arrange
        const inputWithValidCategory = { ...mockCreateInput, category: 'B' }
        mockSampleResource.findByName.mockResolvedValue(null)
        mockSampleResource.create.mockResolvedValue({
          ...mockCreatedSample,
          category: 'B'
        })

        // Act
        const result = await createSampleTask.execute(inputWithValidCategory)

        // Assert
        expect(result.category).toBe('B')
      })
    })

    describe('異常系', () => {
      it('should reject invalid category', async () => {
        // Arrange
        const inputWithInvalidCategory = { ...mockCreateInput, category: 'Z' as any }

        // Act & Assert
        await expect(createSampleTask.execute(inputWithInvalidCategory))
          .rejects
          .toThrow('Invalid category. Must be A, B, or C')

        expect(mockSampleResource.create).not.toHaveBeenCalled()
      })

      it('should reject duplicate name', async () => {
        // Arrange
        const existingSample = { ...mockCreatedSample, name: 'New Sample' }
        mockSampleResource.findByName.mockResolvedValue(existingSample)

        // Act & Assert
        await expect(createSampleTask.execute(mockCreateInput))
          .rejects
          .toThrow('Sample with this name already exists')

        expect(mockSampleResource.create).not.toHaveBeenCalled()
      })

      it('should validate required fields', async () => {
        // Arrange
        const invalidInput = { name: '', description: 'Test' } as CreateSampleInput

        // Act & Assert
        await expect(createSampleTask.execute(invalidInput))
          .rejects
          .toThrow('Name is required')
      })
    })
  })
})

// ===== ValidateSampleTask 専用テスト =====
describe('ValidateSampleTaskTest', () => {
  let validateSampleTask: ValidateSampleTask
  let mockValidationResource: jest.Mocked<ValidationResource>
  let mockSampleResource: jest.Mocked<SampleResource>

  beforeEach(() => {
    jest.clearAllMocks()
    mockValidationResource = new MockedValidationResource() as jest.Mocked<ValidationResource>
    mockSampleResource = new MockedSampleResource() as jest.Mocked<SampleResource>
    MockedValidationResource.mockImplementation(() => mockValidationResource)
    MockedSampleResource.mockImplementation(() => mockSampleResource)
    validateSampleTask = new ValidateSampleTask()
  })

  const validationInput = {
    name: 'Test Sample',
    checkExternal: true,
    checkDuplicate: true
  }

  describe('execute', () => {
    describe('正常系', () => {
      it('should return valid result when all validations pass', async () => {
        // Arrange
        mockValidationResource.validateExternal.mockResolvedValue({
          valid: true,
          message: 'Valid'
        })
        mockSampleResource.findByName.mockResolvedValue(null)

        // Act
        const result = await validateSampleTask.execute(validationInput)

        // Assert
        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
        expect(mockValidationResource.validateExternal).toHaveBeenCalledWith('Test Sample')
        expect(mockSampleResource.findByName).toHaveBeenCalledWith('Test Sample')
      })

      it('should skip optional validations when not requested', async () => {
        // Arrange
        const basicValidationInput = {
          name: 'Test Sample',
          checkExternal: false,
          checkDuplicate: false
        }

        // Act
        const result = await validateSampleTask.execute(basicValidationInput)

        // Assert
        expect(result.valid).toBe(true)
        expect(mockValidationResource.validateExternal).not.toHaveBeenCalled()
        expect(mockSampleResource.findByName).not.toHaveBeenCalled()
      })
    })

    describe('異常系', () => {
      it('should collect all validation errors', async () => {
        // Arrange
        const invalidInput = { name: '', checkExternal: true, checkDuplicate: true }
        mockValidationResource.validateExternal.mockResolvedValue({
          valid: false,
          message: 'External validation failed'
        })
        const existingSample = { id: '1', name: 'Existing' }
        mockSampleResource.findByName.mockResolvedValue(existingSample)

        // Act
        const result = await validateSampleTask.execute(invalidInput)

        // Assert
        expect(result.valid).toBe(false)
        expect(result.errors).toContain('Name is required')
        expect(result.errors).toContain('External validation failed')
        expect(result.errors).toContain('Name already exists')
      })

      it('should handle external validation service errors', async () => {
        // Arrange
        mockValidationResource.validateExternal.mockRejectedValue(
          new Error('Service unavailable')
        )

        // Act & Assert
        await expect(validateSampleTask.execute(validationInput))
          .rejects
          .toThrow('Service unavailable')
      })
    })
  })
})

// ===== ヘルパー関数とユーティリティ =====
/**
 * テストデータファクトリー
 */
const TaskTestDataFactory = {
  createValidInput: (overrides = {}) => ({
    id: '1',
    name: 'Test Sample',
    email: 'test@example.com',
    score: 85,
    mustBeUnique: true,
    requiresExternalValidation: false,
    ...overrides
  }),

  createInvalidInput: (invalidField: string) => {
    const base = TaskTestDataFactory.createValidInput()
    switch (invalidField) {
      case 'id':
        return { ...base, id: '' }
      case 'name':
        return { ...base, name: '' }
      case 'email':
        return { ...base, email: 'invalid-email' }
      case 'score':
        return { ...base, score: 150 }
      default:
        return base
    }
  },

  createResourceResult: (overrides = {}) => ({
    id: '1',
    name: 'Test Sample',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides
  })
}

/**
 * アサーションヘルパー
 */
const TaskAssertionHelper = {
  expectValidationError: (error: any, expectedMessage: string) => {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain(expectedMessage)
  },

  expectResourceCalled: (mockResource: any, method: string, ...args: any[]) => {
    expect(mockResource[method]).toHaveBeenCalledWith(...args)
  },

  expectResourceNotCalled: (mockResource: any, method: string) => {
    expect(mockResource[method]).not.toHaveBeenCalled()
  }
}

/* 
使用例とベストプラクティス:

1. Task層テストの焦点
   - 単一処理の実行ロジック
   - 入力検証の網羅的テスト
   - ビジネスルールの適用確認
   - Resourceとの適切な連携

2. モック戦略
   - Resource層の完全モック化
   - 下位層のみ依存
   - 上位層は関与しない

3. テストケース設計
   - 入力バリデーション: 必須/任意/形式/範囲
   - ビジネスルール: 条件分岐の全パターン
   - エラーハンドリング: Resource障害時の動作

4. アサーション
   - 処理結果の正確性
   - Resource呼び出しパターン
   - エラーメッセージの適切性
   - データ変換の正確性

5. 命名規則
   - ファイル名: {Task名}Test.ts
   - テストケース: should + 処理観点の期待結果
   - グループ化: メソッド → 正常系/異常系/バリデーション
*/