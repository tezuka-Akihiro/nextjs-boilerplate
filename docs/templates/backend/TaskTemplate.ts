/**
 * AI滑走路 - Task層テンプレート
 * 
 * 責務:
 * - 単一処理の実行
 * - 入力値検証と加工処理
 * - 検証とビジネスルール適用
 * - Resourceとの仲介処理
 * 
 * 依存関係:
 *  許可: 複数Resourceのみ
 * 禁止: Controllerへの直接依存
 * 禁止: APIへの直接依存（通信除く）
 * 禁止: 他のTaskへの直接依存
 * 
 * 配置例:
 * - ファイル名: {処理名}Task.ts (例: ValidateUserTask.ts, CreateUserTask.ts)
 * - クラス名: ファイル名と同一
 * - メソッド名: execute (統一)
 * 
 * 禁止項目:
 * - 複数の異なる処理
 * - 他のTaskとの連携処理
 * - 複雑な条件分岐をControllerで実装すべき処理
 * - UI/プレゼンテーション層への直接アクセス
 */

import { BaseTask } from './BaseTask'
import { SampleResource } from '@/resources/SampleResource'
import { ValidationResource } from '@/resources/ValidationResource'
import { SampleType } from '@/types'

export class SampleTask extends BaseTask {
  // 許可された依存: Resourceのみ
  private sampleResource: SampleResource
  private validationResource: ValidationResource

  constructor() {
    super()
    // Taskの責務：Resourceの依存注入
    this.sampleResource = new SampleResource()
    this.validationResource = new ValidationResource()
  }

  /**
   * 実行処理
   * Taskの責務：単一処理の実行
   * 
   * @param input 入力データ
   * @returns 処理結果
   */
  async execute(input: SampleTaskInput): Promise<SampleType> {
    // Taskの責務：入力検証
    this.validateInput(input)
    
    // Taskの責務：ビジネスルールの適用
    await this.applyBusinessRules(input)
    
    // 許可された処理: Resourceへの委譲
    const result = await this.sampleResource.performOperation(input)
    
    // Taskの責務：結果の後処理
    return this.postProcessResult(result)
  }

  /**
   * 入力検証
   * Taskの責務：データの整合性確認
   */
  private validateInput(input: SampleTaskInput): void {
    // 必須項目検証
    this.validateRequired(input.id, 'id')
    this.validateRequired(input.name, 'name')
    
    // 型検証
    if (typeof input.name !== 'string') {
      throw new Error('Name must be a string')
    }
    
    // 長さ制限検証
    this.validateTextLength(input.name, 'name', 100)
    
    // 形式検証（オプション）
    if (input.email) {
      this.validateEmail(input.email)
    }
    
    if (input.score && (input.score < 0 || input.score > 100)) {
      throw new Error('Score must be between 0 and 100')
    }
  }

  /**
   * ビジネスルール適用
   * Taskの責務：特定の業務制約
   */
  private async applyBusinessRules(input: SampleTaskInput): Promise<void> {
    // 許可された処理: Resourceでの存在確認
    const existingRecord = await this.sampleResource.findById(input.id)
    
    if (existingRecord && input.mustBeUnique) {
      throw new Error('Record with this ID already exists')
    }
    
    // 外部バリデーション実行（必要に応じて）
    if (input.requiresExternalValidation) {
      const isValid = await this.validationResource.validateExternal(input.name)
      if (!isValid) {
        throw new Error('External validation failed')
      }
    }
  }

  /**
   * 結果後処理
   * Taskの責務：データの正規化と返却
   */
  private postProcessResult(result: any): SampleType {
    // データ形式の正規化
    return {
      id: result.id,
      name: result.name.trim(),
      status: result.status || 'active',
      createdAt: result.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

/**
 * 作成Task例
 * Taskの責務：単一の作成処理
 */
export class CreateSampleTask extends BaseTask {
  private sampleResource: SampleResource

  constructor() {
    super()
    this.sampleResource = new SampleResource()
  }

  async execute(createData: CreateSampleInput): Promise<SampleType> {
    // 作成の検証
    this.validateCreateInput(createData)
    
    // 重複確認
    await this.checkDuplication(createData)
    
    // 許可された処理: Resourceでの作成
    return await this.sampleResource.create(createData)
  }

  private validateCreateInput(input: CreateSampleInput): void {
    this.validateRequired(input.name, 'name')
    this.validateRequired(input.description, 'description')
    
    if (input.category && !['A', 'B', 'C'].includes(input.category)) {
      throw new Error('Invalid category. Must be A, B, or C')
    }
  }

  private async checkDuplication(input: CreateSampleInput): Promise<void> {
    const existing = await this.sampleResource.findByName(input.name)
    if (existing) {
      throw new Error('Sample with this name already exists')
    }
  }
}

/**
 * 更新Task例
 * Taskの責務：単一の更新処理
 */
export class UpdateSampleTask extends BaseTask {
  private sampleResource: SampleResource

  constructor() {
    super()
    this.sampleResource = new SampleResource()
  }

  async execute(id: string, updateData: UpdateSampleInput): Promise<SampleType> {
    // 更新の検証
    this.validateUpdateInput(updateData)
    
    // 存在確認
    await this.ensureExists(id)
    
    // 許可された処理: Resourceでの更新
    return await this.sampleResource.update(id, updateData)
  }

  private validateUpdateInput(input: UpdateSampleInput): void {
    // 部分的なデータでの確認のみ必要
    if (input.name !== undefined) {
      this.validateTextLength(input.name, 'name', 100)
    }
    
    if (input.email !== undefined) {
      this.validateEmail(input.email)
    }
  }

  private async ensureExists(id: string): Promise<void> {
    const existing = await this.sampleResource.findById(id)
    if (!existing) {
      throw new Error('Sample not found')
    }
  }
}

/**
 * バリデーションTask例
 * Taskの責務：複雑検証処理
 */
export class ValidateSampleTask extends BaseTask {
  private validationResource: ValidationResource
  private sampleResource: SampleResource

  constructor() {
    super()
    this.validationResource = new ValidationResource()
    this.sampleResource = new SampleResource()
  }

  async execute(validationData: ValidationInput): Promise<ValidationResult> {
    const errors: string[] = []
    
    // 基本検証
    try {
      this.validateRequired(validationData.name, 'name')
      this.validateTextLength(validationData.name, 'name', 100)
    } catch (error) {
      errors.push(error.message)
    }
    
    // 外部検証
    if (validationData.checkExternal) {
      const externalResult = await this.validationResource.validateExternal(validationData.name)
      if (!externalResult.valid) {
        errors.push(externalResult.message)
      }
    }
    
    // 重複検証
    if (validationData.checkDuplicate) {
      const duplicate = await this.sampleResource.findByName(validationData.name)
      if (duplicate) {
        errors.push('Name already exists')
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

/* 
禁止項目例 - 次のような処理は絶対にNG:

import { SampleController } from '@/controllers/SampleController'  // 禁止: Controllerへの直接依存
import { SampleApi } from '@/api/SampleApi'  // 禁止: APIへの直接依存（通信除く）
import { OtherTask } from '@/tasks/OtherTask'  // 禁止: 他への直接依存

export class BadTask extends BaseTask {
  async execute() {
    // 禁止: 複数の異なる処理
    const user = await this.createUser()
    const profile = await this.createProfile()
    const notification = await this.sendNotification()
    
    // 禁止: 複雑な条件分岐をControllerで実装すべき処理
    if (user.type === 'premium') {
      if (user.hasSubscription) {
        // 複雑ビジネスロジック
      }
    }
    
    // 禁止: UI/プレゼンテーション層への直接アクセス
    window.alert('Task completed')
    document.getElementById('result').innerHTML = result
  }
}
*/

/**
 * 共通型定義のインターフェイス（参考）
 */
interface SampleTaskInput {
  id: string
  name: string
  email?: string
  score?: number
  mustBeUnique?: boolean
  requiresExternalValidation?: boolean
}

interface CreateSampleInput {
  name: string
  description: string
  category?: string
}

interface UpdateSampleInput {
  name?: string
  description?: string
  email?: string
}

interface ValidationInput {
  name: string
  checkExternal?: boolean
  checkDuplicate?: boolean
}

interface ValidationResult {
  valid: boolean
  errors: string[]
}