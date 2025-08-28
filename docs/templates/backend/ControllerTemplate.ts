/**
 * AI滑走路 - Controller層テンプレート
 * 
 * 責務:
 * - ビジネスロジックの統合・調整
 * - 複数Taskのオーケストレーション
 * - 横断処理の実装
 * - エラーハンドリングとResponseへの委譲
 * 
 * 依存関係:
 *  許可: 複数Task + Response層
 * 禁止: Resourceへの直接依存
 * 禁止: APIへの直接依存
 * 禁止: 他のControllerへの直接依存
 * 
 * 配置例:
 * - ファイル名: {機能名}Controller.ts (例: AuthController.ts)
 * - クラス名: ファイル名と同一
 * - メソッド名: {動詞}{対象} (例: createUser, getUserById)
 * 
 * 禁止項目:
 * - データベースへの直接アクセス
 * - 外部APIへの直接通信
 * - ファイル処理への直接アクセス
 * - 単純なTaskへの丸投げ実装
 */

import { BaseController } from './BaseController'
import { SampleCreateTask } from '@/tasks/SampleCreateTask'
import { SampleUpdateTask } from '@/tasks/SampleUpdateTask'
import { SampleDeleteTask } from '@/tasks/SampleDeleteTask'
import { SampleGetTask } from '@/tasks/SampleGetTask'
import { SampleValidateTask } from '@/tasks/SampleValidateTask'
import { BaseResponse } from '@/responses/BaseResponse'
import { ApiResponse, ErrorResponse, SampleType } from '@/types'

export class SampleController extends BaseController {
  // 許可された依存: Taskのみ
  private sampleCreateTask: SampleCreateTask
  private sampleUpdateTask: SampleUpdateTask
  private sampleDeleteTask: SampleDeleteTask
  private sampleGetTask: SampleGetTask
  private sampleValidateTask: SampleValidateTask

  constructor() {
    super()
    // Controllerの責務：Taskの依存注入
    this.sampleCreateTask = new SampleCreateTask()
    this.sampleUpdateTask = new SampleUpdateTask()
    this.sampleDeleteTask = new SampleDeleteTask()
    this.sampleGetTask = new SampleGetTask()
    this.sampleValidateTask = new SampleValidateTask()
  }

  /**
   * データ取得
   * Controllerの責務：単一Taskへの処理委譲
   */
  async getSample(id: string): Promise<ApiResponse<SampleType> | ErrorResponse> {
    return this.executeTask(async () => {
      // 許可された処理: Taskへの委譲
      return await this.sampleGetTask.execute(id)
    })
  }

  /**
   * データ作成
   * Controllerの責務：複数Taskのオーケストレーション
   */
  async createSample(
    sampleData: Partial<SampleType>
  ): Promise<ApiResponse<SampleType> | ErrorResponse> {
    // Controllerの責務：事前検証
    const validationErrors = this.validateFields({
      name: sampleData.name,
      description: sampleData.description
    })

    if (validationErrors.length > 0) {
      return BaseResponse.validationError(validationErrors)
    }

    return this.executeTask(async () => {
      // Controllerの責務：複数Taskの順次実行
      
      // Step 1: 検証実行
      await this.sampleValidateTask.execute(sampleData)
      
      // Step 2: 作成実行
      const newSample = await this.sampleCreateTask.execute(sampleData)
      
      // Step 3: 後続処理の実行（必要に応じて）
      // await this.additionalTask.execute(newSample.id)
      
      return newSample
    })
  }

  /**
   * データ更新
   * Controllerの責務：条件分岐付きビジネスロジック
   */
  async updateSample(
    id: string,
    updateData: Partial<SampleType>
  ): Promise<ApiResponse<SampleType> | ErrorResponse> {
    return this.executeTask(async () => {
      // Controllerの責務：事前確認
      const existingSample = await this.sampleGetTask.execute(id)
      
      // Controllerの責務：ビジネスルールの適用
      if (existingSample.status === 'locked') {
        throw new Error('Sample is locked and cannot be updated')
      }
      
      // Controllerの責務：条件付き実行処理
      if (updateData.name && updateData.name !== existingSample.name) {
        // 名前変更時の検証実行
        await this.sampleValidateTask.execute({ name: updateData.name })
      }
      
      // 許可された処理: Taskへの委譲
      return await this.sampleUpdateTask.execute(id, updateData)
    })
  }

  /**
   * データ削除
   * Controllerの責務：削除前条件確認の実装
   */
  async deleteSample(id: string): Promise<ApiResponse<boolean> | ErrorResponse> {
    return this.executeTask(async () => {
      // Controllerの責務：削除前の制約確認
      const sample = await this.sampleGetTask.execute(id)
      
      if (sample.hasRelatedData) {
        throw new Error('Cannot delete sample with related data')
      }
      
      // 許可された処理: Taskへの委譲
      return await this.sampleDeleteTask.execute(id)
    })
  }

  /**
   * 複雑ビジネスロジック例
   * Controllerの責務：複数Taskのオーケストレーションによる複雑処理
   */
  async processComplexBusiness(
    data: ComplexBusinessData
  ): Promise<ApiResponse<ProcessResult> | ErrorResponse> {
    return this.executeTask(async () => {
      // Controllerの責務：トランザクション的な複雑処理
      try {
        // Step 1: 前処理
        const preprocessed = await this.preprocessTask.execute(data)
        
        // Step 2: 主処理
        const processed = await this.mainProcessTask.execute(preprocessed)
        
        // Step 3: 後処理
        const result = await this.postProcessTask.execute(processed)
        
        // Step 4: 副次的な後続処理
        await this.notificationTask.execute(result.id)
        
        return result
      } catch (error) {
        // Controllerの責務：エラー時の補償処理
        await this.rollbackTask.execute(data.id)
        throw error
      }
    })
  }
}

/* 
禁止項目例 - 次のような処理は絶対にNG:

import { SampleResource } from '@/resources/SampleResource'  // 禁止: Resourceへの直接依存
import { SampleApi } from '@/api/SampleApi'  // 禁止: APIへの直接依存
import { OtherController } from '@/controllers/OtherController'  // 禁止: 他への直接依存

export class BadController extends BaseController {
  async badMethod() {
    // 禁止: データベースへの直接アクセス
    const { data } = await supabase.from('samples').select()
    
    // 禁止: 外部APIへの直接通信
    const response = await fetch('https://api.example.com/data')
    
    // 禁止: ファイル処理への直接アクセス
    const fs = require('fs')
    fs.writeFileSync('file.txt', 'data')
    
    // 禁止: 単純なTaskへの丸投げ実装
    return { id: '123', name: 'simple' }
  }
}
*/

/**
 * 共通型定義のインターフェイス（参考）
 */
interface ComplexBusinessData {
  id: string
  type: string
  parameters: Record<string, any>
}

interface ProcessResult {
  id: string
  status: string
  result: any
}