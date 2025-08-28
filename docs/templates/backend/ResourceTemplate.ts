/**
 * AI滑走路 - Resource層テンプレート
 * 
 * 責務:
 * - データ・ファイル・外部APIとの仲介
 * - 外部サービスとの通信
 * - ストレージ操作の実装
 * - データの取得・保存
 * 
 * 依存関係:
 *  許可: 外部サービス（Supabase、API、FS等）のみ
 * 禁止: Taskへの直接依存
 * 禁止: Controllerへの直接依存（通信除く）
 * 禁止: APIへの直接依存（通信除く）
 * 禁止: 他のResourceへの直接依存
 * 
 * 配置例:
 * - ファイル名: {リソース名}Resource.ts (例: UserResource.ts)
 * - クラス名: ファイル名と同一
 * - メソッド名: CRUD操作 (create, findById, update, delete等)
 * 
 * 禁止項目:
 * - ビジネスロジックの実装
 * - 複雑な処理の実装
 * - データベース操作以外の複雑な処理の実装
 * - 他のResourceとの連携処理
 */

import { BaseResource } from './BaseResource'
import { SampleType, CreateSampleInput, UpdateSampleInput } from '@/types'

export class SampleResource extends BaseResource {
  private tableName = 'samples'

  /**
   * IDによる単一データ取得
   * Resourceの責務：基本的なデータ取得操作
   */
  async findById(id: string): Promise<SampleType | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // データが存在しない場合
        }
        this.handleDatabaseError(error, 'SampleResource.findById')
      }

      return data
    } catch (error) {
      this.handleDatabaseError(error, 'SampleResource.findById')
    }
  }

  /**
   * 名前による検索
   * Resourceの責務：特定条件でのデータ検索
   */
  async findByName(name: string): Promise<SampleType | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('name', name)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        this.handleDatabaseError(error, 'SampleResource.findByName')
      }

      return data
    } catch (error) {
      this.handleDatabaseError(error, 'SampleResource.findByName')
    }
  }

  /**
   * 条件付き複数データ取得
   * Resourceの責務：複数レコードでの条件検索
   */
  async findMany(filters: {
    category?: string
    status?: string
    limit?: number
    offset?: number
  }): Promise<SampleType[]> {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*')

      // 条件フィルタの適用
      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      // ページネーション
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      // ソート
      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        this.handleDatabaseError(error, 'SampleResource.findMany')
      }

      return data || []
    } catch (error) {
      this.handleDatabaseError(error, 'SampleResource.findMany')
    }
  }

  /**
   * データ作成
   * Resourceの責務：新規データの保存
   */
  async create(createData: CreateSampleInput): Promise<SampleType> {
    try {
      // 認証が必要な場合の現在ユーザー取得確認
      const user = await this.requireAuthentication()

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert({
          ...createData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        this.handleDatabaseError(error, 'SampleResource.create')
      }

      return data
    } catch (error) {
      this.handleDatabaseError(error, 'SampleResource.create')
    }
  }

  /**
   * データ更新
   * Resourceの責務：既存データの更新
   */
  async update(id: string, updateData: UpdateSampleInput): Promise<SampleType> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        this.handleDatabaseError(error, 'SampleResource.update')
      }

      return data
    } catch (error) {
      this.handleDatabaseError(error, 'SampleResource.update')
    }
  }

  /**
   * データ削除
   * Resourceの責務：データの削除
   */
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) {
        this.handleDatabaseError(error, 'SampleResource.delete')
      }

      return true
    } catch (error) {
      this.handleDatabaseError(error, 'SampleResource.delete')
    }
  }

  /**
   * データ件数取得
   * Resourceの責務：統計の実装
   */
  async count(filters: { category?: string; status?: string }): Promise<number> {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      const { count, error } = await query

      if (error) {
        this.handleDatabaseError(error, 'SampleResource.count')
      }

      return count || 0
    } catch (error) {
      this.handleDatabaseError(error, 'SampleResource.count')
    }
  }

  /**
   * 一括作成
   * Resourceの責務：複数データの一括保存
   */
  async bulkCreate(items: CreateSampleInput[]): Promise<SampleType[]> {
    try {
      const user = await this.requireAuthentication()
      const now = new Date().toISOString()

      const insertData = items.map(item => ({
        ...item,
        user_id: user.id,
        created_at: now,
        updated_at: now
      }))

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(insertData)
        .select()

      if (error) {
        this.handleDatabaseError(error, 'SampleResource.bulkCreate')
      }

      return data || []
    } catch (error) {
      this.handleDatabaseError(error, 'SampleResource.bulkCreate')
    }
  }
}

/**
 * 外部API通信Resource例
 * Resourceの責務：外部サービスとの通信
 */
export class ExternalApiResource extends BaseResource {
  private apiBaseUrl = process.env.EXTERNAL_API_URL!
  private apiKey = process.env.EXTERNAL_API_KEY!

  /**
   * 外部APIからのデータ取得
   * Resourceの責務：外部サービスとの通信
   */
  async fetchExternalData(endpoint: string, params?: Record<string, any>): Promise<any> {
    try {
      const url = new URL(`${this.apiBaseUrl}/${endpoint}`)
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value))
        })
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10秒タイムアウト
      })

      if (!response.ok) {
        throw new Error(`External API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('External API error:', error)
      throw new Error(`Failed to fetch external data: ${error.message}`)
    }
  }

  /**
   * 外部APIへの投稿
   * Resourceの責務：外部サービスへの投稿
   */
  async postToExternalApi(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        timeout: 10000
      })

      if (!response.ok) {
        throw new Error(`External API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('External API error:', error)
      throw new Error(`Failed to post to external API: ${error.message}`)
    }
  }
}

/**
 * ファイル操作Resource例
 * Resourceの責務：ファイルストレージの操作
 */
export class FileSystemResource extends BaseResource {
  /**
   * ファイルアップロード
   * Resourceの責務：ファイルストレージへの保存
   */
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: false
        })

      if (error) {
        throw new Error(`File upload failed: ${error.message}`)
      }

      // 公開URL取得
      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      return publicUrl
    } catch (error) {
      console.error('File upload error:', error)
      throw new Error(`Failed to upload file: ${error.message}`)
    }
  }

  /**
   * ファイル削除
   * Resourceの責務：ストレージからの削除
   */
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        throw new Error(`File deletion failed: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error('File deletion error:', error)
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }
}

/* 
禁止項目例 - 次のような処理は絶対にNG:

import { SampleTask } from '@/tasks/SampleTask'  // 禁止: Taskへの直接依存
import { SampleController } from '@/controllers/SampleController'  // 禁止: Controllerへの直接依存（通信除く）
import { OtherResource } from '@/resources/OtherResource'  // 禁止: 他への直接依存

export class BadResource extends BaseResource {
  async badMethod() {
    // 禁止: ビジネスロジックの実装
    if (data.type === 'premium' && data.subscriptionExpired) {
      return this.handlePremiumUserLogic()
    }
    
    // 禁止: 複雑な処理の実装
    const complexCalculation = data.items.reduce((acc, item) => {
      return acc + (item.price * item.quantity * TAX_RATE)
    }, 0)
    
    // 禁止: データベース操作以外の複雑な処理の実装
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format')
    }
    
    // 禁止: 他のResourceとの連携処理
    const relatedData = await new OtherResource().getSomeData()
  }
}
*/