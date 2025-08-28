/**
 * ユーザー Factory クラス
 * 
 * テスト用のユーザーデータを動的に生成
 */

import { TestSupabaseClient } from '../utils/supabase-test-client'
import { UserType, CreateUserInput } from '@shared/types'
import { v4 as uuidv4 } from 'uuid'

export class UserFactory {
  private static counter = 1

  /**
   * 単一のユーザーを作成
   */
  static async create(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const client = TestSupabaseClient.getInstance()
    
    const userData: CreateUserInput = {
      email: `test${this.counter}@example.com`,
      name: `Test User ${this.counter}`,
      nickname: `testuser${this.counter}`,
      status: 'active',
      bio: null,
      profile_image_url: null,
      resolution_statement: null,
      resolution_deadline: null,
      experience_points: 0,
      level: 1,
      ...overrides
    }
    
    this.counter++
    
    const { data, error } = await client
      .from('users')
      .insert({
        id: uuidv4(),
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
      
    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }
    
    return data
  }

  /**
   * 複数のユーザーを一括作成
   */
  static async createMany(count: number, overrides: Partial<CreateUserInput> = {}): Promise<UserType[]> {
    const promises = Array.from({ length: count }, (_, i) => 
      this.create({ 
        ...overrides, 
        email: `test${this.counter + i}@example.com`,
        name: `Test User ${this.counter + i}`,
        nickname: `testuser${this.counter + i}`
      })
    )
    
    this.counter += count
    return Promise.all(promises)
  }

  /**
   * アクティブユーザーを作成
   */
  static async createActive(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    return this.create({
      status: 'active',
      ...overrides
    })
  }

  /**
   * 非アクティブユーザーを作成
   */
  static async createInactive(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    return this.create({
      status: 'inactive',
      ...overrides
    })
  }

  /**
   * プレミアムユーザーを作成（高い経験値とレベル）
   */
  static async createPremium(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    return this.create({
      name: `Premium User ${this.counter}`,
      experience_points: 1000 + Math.floor(Math.random() * 2000),
      level: 5 + Math.floor(Math.random() * 5),
      bio: 'Premium user with advanced features',
      profile_image_url: 'https://example.com/premium-avatar.jpg',
      ...overrides
    })
  }

  /**
   * 目標設定済みユーザーを作成
   */
  static async createWithResolution(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const resolutions = [
      '毎日運動する',
      '月10冊本を読む',
      'プログラミングスキルを向上させる',
      '健康的な食事を心がける',
      '新しい言語を学ぶ'
    ]
    
    const randomResolution = resolutions[Math.floor(Math.random() * resolutions.length)]
    const deadline = new Date()
    deadline.setMonth(deadline.getMonth() + 6) // 6ヶ月後
    
    return this.create({
      resolution_statement: randomResolution,
      resolution_deadline: deadline.toISOString(),
      ...overrides
    })
  }

  /**
   * 期限切れの目標を持つユーザーを作成
   */
  static async createWithExpiredResolution(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const pastDate = new Date()
    pastDate.setMonth(pastDate.getMonth() - 1) // 1ヶ月前
    
    return this.create({
      resolution_statement: '期限切れの目標',
      resolution_deadline: pastDate.toISOString(),
      ...overrides
    })
  }

  /**
   * 特定のレベルのユーザーを作成
   */
  static async createWithLevel(level: number, overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const baseExperience = (level - 1) * 100 // レベル1あたり100経験値と仮定
    const experiencePoints = baseExperience + Math.floor(Math.random() * 100)
    
    return this.create({
      level,
      experience_points: experiencePoints,
      ...overrides
    })
  }

  /**
   * 特定の経験値を持つユーザーを作成
   */
  static async createWithExperience(experiencePoints: number, overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const level = Math.floor(experiencePoints / 100) + 1 // 100経験値でレベルアップと仮定
    
    return this.create({
      experience_points: experiencePoints,
      level,
      ...overrides
    })
  }

  /**
   * プロフィール画像付きユーザーを作成
   */
  static async createWithProfileImage(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const imageUrls = [
      'https://example.com/avatar1.jpg',
      'https://example.com/avatar2.png',
      'https://example.com/avatar3.gif'
    ]
    
    const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)]
    
    return this.create({
      profile_image_url: randomImageUrl,
      ...overrides
    })
  }

  /**
   * 長い自己紹介を持つユーザーを作成
   */
  static async createWithLongBio(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const longBio = 'これは非常に長い自己紹介文です。'.repeat(20)
    
    return this.create({
      bio: longBio,
      ...overrides
    })
  }

  /**
   * ランダムなデータでユーザーを作成
   */
  static async createRandom(overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const randomData: Partial<CreateUserInput> = {
      status: Math.random() > 0.2 ? 'active' : 'inactive', // 80%の確率でactive
      experience_points: Math.floor(Math.random() * 2000),
      level: Math.floor(Math.random() * 10) + 1,
      bio: Math.random() > 0.5 ? `ランダムな自己紹介 ${Math.floor(Math.random() * 1000)}` : null,
      profile_image_url: Math.random() > 0.7 ? 'https://example.com/random-avatar.jpg' : null
    }
    
    if (Math.random() > 0.6) {
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + Math.floor(Math.random() * 12))
      randomData.resolution_statement = 'ランダムな目標'
      randomData.resolution_deadline = futureDate.toISOString()
    }
    
    return this.create({
      ...randomData,
      ...overrides
    })
  }

  /**
   * バッチ処理用の大量ユーザー作成
   */
  static async createBatch(
    count: number, 
    batchSize: number = 50,
    overrides: Partial<CreateUserInput> = {}
  ): Promise<UserType[]> {
    const results: UserType[] = []
    
    for (let i = 0; i < count; i += batchSize) {
      const remainingCount = Math.min(batchSize, count - i)
      const batch = await this.createMany(remainingCount, overrides)
      results.push(...batch)
      
      // バッチ間で少し待機（データベース負荷軽減）
      if (i + batchSize < count) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return results
  }

  /**
   * 特定のメールドメインでユーザーを作成
   */
  static async createWithDomain(domain: string, overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    return this.create({
      email: `test${this.counter}@${domain}`,
      ...overrides
    })
  }

  /**
   * 特定の作成日時でユーザーを作成
   */
  static async createWithDate(createdAt: Date, overrides: Partial<CreateUserInput> = {}): Promise<UserType> {
    const client = TestSupabaseClient.getInstance()
    
    const userData: CreateUserInput = {
      email: `test${this.counter}@example.com`,
      name: `Test User ${this.counter}`,
      nickname: `testuser${this.counter}`,
      status: 'active',
      experience_points: 0,
      level: 1,
      ...overrides
    }
    
    this.counter++
    
    const { data, error } = await client
      .from('users')
      .insert({
        id: uuidv4(),
        ...userData,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString()
      })
      .select()
      .single()
      
    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }
    
    return data
  }

  /**
   * テスト用ユーザーのクリーンアップ
   */
  static async cleanup(): Promise<void> {
    const client = TestSupabaseClient.getInstance()
    await client.from('users').delete().like('email', 'test%@example.com')
    this.counter = 1 // カウンターリセット
  }

  /**
   * カウンターをリセット
   */
  static resetCounter(): void {
    this.counter = 1
  }

  /**
   * 現在のカウンター値を取得
   */
  static getCurrentCounter(): number {
    return this.counter
  }
}