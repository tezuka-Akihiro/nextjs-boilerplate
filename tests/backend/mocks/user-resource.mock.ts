/**
 * UserResource モック実装
 * ユニットテスト用の依存関係分離
 */

import { vi } from 'vitest'
import type { UserType, CreateUserInput, UpdateUserInput } from '@shared/types'
import { UserResource } from '@resources/UserResource'

/**
 * UserResourceモック用のテストデータ
 */
export const mockUserData: UserType[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'test@example.com',
    name: 'Test User',
    nickname: 'TestNick',
    bio: null,
    profile_image_url: null,
    girlfriend_goal_months: 6,
    habit_item: 'テスト用習慣化項目',
    resolution_deadline: null,
    experience_points: 0,
    level: 1,
    status: 'active',
    relationship_status: 'single',
    is_public: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'active@example.com',
    name: 'Active User',
    nickname: 'ActiveNick',
    bio: 'アクティブユーザーです',
    profile_image_url: 'https://example.com/avatar.jpg',
    resolution_statement: '毎日運動する',
    resolution_deadline: '2024-12-31T23:59:59.000Z',
    experience_points: 150,
    level: 2,
    status: 'active',
    relationship_status: 'single',
    is_public: true,
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'inactive@example.com',
    name: 'Inactive User',
    nickname: 'InactiveNick',
    bio: null,
    profile_image_url: null,
    resolution_statement: null,
    resolution_deadline: null,
    experience_points: 50,
    level: 1,
    status: 'inactive',
    relationship_status: 'single',
    is_public: false,
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  }
]

/**
 * UserResource モック実装
 */
export const createMockUserResource = () => {
  let mockData = [...mockUserData]
  let nextId = 4
  
  const generateId = () => `00000000-0000-0000-0000-00000000000${nextId++}`
  
  const mockUserResource = {
    // 基本CRUD操作
    findById: vi.fn().mockImplementation(async (id: string): Promise<UserType | null> => {
      if (id === 'invalid-uuid') {
        throw new Error('Invalid UUID format')
      }
      return mockData.find(user => user.id === id) || null
    }),
    
    findByEmail: vi.fn().mockImplementation(async (email: string): Promise<UserType | null> => {
      return mockData.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
    }),
    
    findMany: vi.fn().mockImplementation(async (options: {
      status?: string
      limit?: number
      offset?: number
    } = {}): Promise<UserType[]> => {
      let results = [...mockData]
      
      // ステータスフィルタ
      if (options.status) {
        results = results.filter(user => user.status === options.status)
      }
      
      // ソート（作成日降順）
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      // ページネーション
      const offset = options.offset || 0
      const limit = options.limit
      
      if (limit) {
        results = results.slice(offset, offset + limit)
      } else if (offset > 0) {
        results = results.slice(offset)
      }
      
      return results
    }),
    
    create: vi.fn().mockImplementation(async (userData: CreateUserInput): Promise<UserType> => {
      // バリデーション
      if (!userData.email || !userData.name || !userData.nickname) {
        throw new Error('Required fields are missing')
      }
      
      if (!userData.email.includes('@')) {
        throw new Error('Invalid email format')
      }
      
      // 重複チェック
      const existingUser = mockData.find(user => user.email === userData.email)
      if (existingUser) {
        throw new Error('Email already exists')
      }
      
      // 新しいユーザー作成
      const newUser: UserType = {
        id: generateId(),
        email: userData.email,
        name: userData.name,
        nickname: userData.nickname,
        bio: userData.bio || null,
        profile_image_url: userData.profile_image_url || null,
        resolution_statement: userData.resolution_statement || null,
        resolution_deadline: userData.resolution_deadline || null,
        experience_points: userData.experience_points || 0,
        level: userData.level || 1,
        status: userData.status || 'active',
        relationship_status: 'single',
        is_public: userData.is_public !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      mockData.push(newUser)
      return newUser
    }),
    
    update: vi.fn().mockImplementation(async (id: string, updates: UpdateUserInput): Promise<UserType> => {
      const userIndex = mockData.findIndex(user => user.id === id)
      
      if (userIndex === -1) {
        throw new Error('User not found')
      }
      
      // メール重複チェック（更新の場合）
      if (updates.email) {
        const existingUser = mockData.find(user => user.email === updates.email && user.id !== id)
        if (existingUser) {
          throw new Error('Email already exists')
        }
      }
      
      const updatedUser = {
        ...mockData[userIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      mockData[userIndex] = updatedUser
      return updatedUser
    }),
    
    delete: vi.fn().mockImplementation(async (id: string): Promise<boolean> => {
      const initialLength = mockData.length
      mockData = mockData.filter(user => user.id !== id)
      return true // Supabaseは存在しないレコードの削除でもエラーにならない
    }),
    
    // 追加メソッド
    count: vi.fn().mockImplementation(async (options: { status?: string } = {}): Promise<number> => {
      let filteredData = mockData
      
      if (options.status) {
        filteredData = mockData.filter(user => user.status === options.status)
      }
      
      return filteredData.length
    }),
    
    bulkCreate: vi.fn().mockImplementation(async (usersData: CreateUserInput[]): Promise<UserType[]> => {
      if (usersData.length === 0) {
        return []
      }
      
      // バリデーション
      for (const userData of usersData) {
        if (!userData.email || !userData.name || !userData.nickname) {
          throw new Error('Required fields are missing')
        }
        
        // 重複チェック
        const existingUser = mockData.find(user => user.email === userData.email)
        if (existingUser) {
          throw new Error('Email already exists')
        }
      }
      
      // 一括作成
      const createdUsers: UserType[] = []
      
      for (const userData of usersData) {
        const newUser: UserType = {
          id: generateId(),
          email: userData.email,
          name: userData.name,
          nickname: userData.nickname,
          bio: userData.bio || null,
          profile_image_url: userData.profile_image_url || null,
          resolution_statement: userData.resolution_statement || null,
          resolution_deadline: userData.resolution_deadline || null,
          experience_points: userData.experience_points || 0,
          level: userData.level || 1,
          status: userData.status || 'active',
          relationship_status: 'single',
          is_public: userData.is_public !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        mockData.push(newUser)
        createdUsers.push(newUser)
      }
      
      return createdUsers
    }),
    
    // ユーティリティメソッド
    _getMockData: () => [...mockData],
    _setMockData: (data: UserType[]) => { mockData = [...data] },
    _resetMockData: () => { 
      mockData = [...mockUserData]
      nextId = 4
    },
    _addMockUser: (user: UserType) => { mockData.push(user) },
    _clearMockData: () => { 
      mockData = []
      nextId = 1
    }
  }
  
  return mockUserResource
}

/**
 * UserResource のモック設定
 */
export const setupUserResourceMock = () => {
  const mockInstance = createMockUserResource()
  
  // UserResource クラスのモック化
  vi.mocked(UserResource).mockImplementation(() => mockInstance as any)
  
  return mockInstance
}

/**
 * 特定のメソッドのモック動作をカスタマイズ
 */
export const customizeUserResourceMock = (mockUserResource: any, customizations: {
  findById?: (id: string) => Promise<UserType | null>
  findByEmail?: (email: string) => Promise<UserType | null>
  create?: (userData: CreateUserInput) => Promise<UserType>
  update?: (id: string, updates: UpdateUserInput) => Promise<UserType>
  delete?: (id: string) => Promise<boolean>
  findMany?: (options: any) => Promise<UserType[]>
  count?: (options: any) => Promise<number>
  bulkCreate?: (usersData: CreateUserInput[]) => Promise<UserType[]>
}) => {
  Object.entries(customizations).forEach(([method, implementation]) => {
    mockUserResource[method].mockImplementation(implementation)
  })
  
  return mockUserResource
}

/**
 * エラーシナリオ用のモック
 */
export const createErrorMockUserResource = (errorType: 'database' | 'validation' | 'network') => {
  const mockUserResource = createMockUserResource()
  
  const errorMessage = {
    database: 'Database connection failed',
    validation: 'Validation error',
    network: 'Network error'
  }[errorType]
  
  // すべてのメソッドでエラーを投げる
  Object.keys(mockUserResource).forEach(key => {
    if (typeof mockUserResource[key] === 'function' && !key.startsWith('_')) {
      mockUserResource[key].mockRejectedValue(new Error(errorMessage))
    }
  })
  
  return mockUserResource
}

/**
 * パフォーマンステスト用のモック（大量データ）
 */
export const createLargeDataMockUserResource = (userCount: number = 1000) => {
  const largeDataSet: UserType[] = []
  
  for (let i = 1; i <= userCount; i++) {
    largeDataSet.push({
      id: `bulk-user-${i.toString().padStart(4, '0')}`,
      email: `bulk${i}@example.com`,
      name: `Bulk User ${i}`,
      nickname: `bulk${i}`,
      bio: i % 5 === 0 ? `Bio for bulk user ${i}` : null,
      profile_image_url: i % 10 === 0 ? `https://example.com/avatar${i}.jpg` : null,
      resolution_statement: i % 3 === 0 ? `Resolution ${i}` : null,
      resolution_deadline: i % 7 === 0 ? new Date(Date.now() + i * 86400000).toISOString() : null,
      experience_points: i * 10,
      level: Math.floor(i / 100) + 1,
      status: i % 20 === 0 ? 'inactive' : 'active',
      relationship_status: 'single',
      is_public: i % 4 !== 0,
      created_at: new Date(Date.now() - i * 3600000).toISOString(), // 1時間ずつ過去
      updated_at: new Date(Date.now() - i * 1800000).toISOString()  // 30分ずつ過去
    })
  }
  
  const mockUserResource = createMockUserResource()
  mockUserResource._setMockData(largeDataSet)
  
  return mockUserResource
}

export default {
  createMockUserResource,
  setupUserResourceMock,
  customizeUserResourceMock,
  createErrorMockUserResource,
  createLargeDataMockUserResource,
  mockUserData
}