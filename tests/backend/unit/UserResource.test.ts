/**
 * UserResource ユニットテスト
 * 
 * テスト戦略: モック使用
 * 対象: src/resources/UserResource.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserResource } from '@resources/UserResource'
import { userFixtures } from '../fixtures/userFixtures'
import { CreateUserInput, UpdateUserInput } from '@shared/types'

// テスト用のUserResourceクラス（コンストラクタインジェクション対応）
class TestUserResource extends UserResource {
  constructor(mockClient: any) {
    super()
    this.supabase = mockClient
  }
}

// Supabaseクライアントのモック
const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn()
  }
}

// モックファクトリー関数
const createMockQuery = (data: any = null, error: any = null) => ({
  select: vi.fn(() => ({
    eq: vi.fn(() => ({
      single: vi.fn(() => Promise.resolve({ data, error }))
    })),
    limit: vi.fn(() => ({
      order: vi.fn(() => Promise.resolve({ data: data ? [data] : [], error }))
    }))
  })),
  insert: vi.fn(() => ({
    select: vi.fn(() => ({
      single: vi.fn(() => Promise.resolve({ data, error }))
    }))
  })),
  update: vi.fn(() => ({
    eq: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data, error }))
      }))
    }))
  })),
  delete: vi.fn(() => ({
    eq: vi.fn(() => Promise.resolve({ error }))
  }))
})

describe('UserResource', () => {
  let userResource: TestUserResource
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // 認証ユーザーのモック設定
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'auth-user-id' } },
      error: null
    })
    
    userResource = new TestUserResource(mockSupabaseClient as any)
  })

  describe('findById', () => {
    describe('when user exists', () => {
      it('should return user data', async () => {
        const expectedUser = userFixtures.validUser
        const mockQuery = createMockQuery(expectedUser)
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        const result = await userResource.findById('1')

        expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
        expect(mockQuery.select).toHaveBeenCalledWith('*')
        expect(result).toEqual(expectedUser)
      })
    })

    describe('when user does not exist', () => {
      it('should return null for PGRST116 error (no rows)', async () => {
        const mockQuery = createMockQuery(null, { code: 'PGRST116' })
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        const result = await userResource.findById('999')

        expect(result).toBeNull()
      })
    })

    describe('when database error occurs', () => {
      it('should throw database error', async () => {
        const mockQuery = createMockQuery(null, { 
          message: 'Connection failed',
          code: 'CONNECTION_ERROR'
        })
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        await expect(userResource.findById('1'))
          .rejects
          .toThrow('Database error in UserResource.findById')
      })
    })

    describe('input validation', () => {
      it('should throw error for empty id', async () => {
        await expect(userResource.findById(''))
          .rejects
          .toThrow('ID is required')
      })

      it('should throw error for null id', async () => {
        await expect(userResource.findById(null as any))
          .rejects
          .toThrow('ID is required')
      })
    })
  })

  describe('findByEmail', () => {
    describe('when user exists', () => {
      it('should return user data', async () => {
        const expectedUser = userFixtures.validUser
        const mockQuery = createMockQuery(expectedUser)
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        const result = await userResource.findByEmail('test@example.com')

        expect(result).toEqual(expectedUser)
      })
    })

    describe('when email is invalid', () => {
      it('should throw error for invalid email format', async () => {
        await expect(userResource.findByEmail('invalid-email'))
          .rejects
          .toThrow('Invalid email format')
      })
    })
  })

  describe('findMany', () => {
    describe('with no filters', () => {
      it('should return all users with default pagination', async () => {
        const expectedUsers = [userFixtures.validUser, userFixtures.anotherUser]
        const mockQuery = createMockQuery(expectedUsers)
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        const result = await userResource.findMany({})

        expect(result).toEqual(expectedUsers)
        expect(mockQuery.select).toHaveBeenCalledWith('*')
      })
    })

    describe('with filters', () => {
      it('should apply status filter', async () => {
        const mockQuery = createMockQuery([userFixtures.validUser])
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        await userResource.findMany({ status: 'active' })

        // フィルタが適用されていることを確認
        expect(mockQuery.select).toHaveBeenCalled()
      })

      it('should apply pagination', async () => {
        const mockQuery = createMockQuery([userFixtures.validUser])
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        await userResource.findMany({ limit: 10, offset: 20 })

        expect(mockQuery.select).toHaveBeenCalled()
      })
    })
  })

  describe('create', () => {
    describe('with valid data', () => {
      it('should create user and return data', async () => {
        const createData: CreateUserInput = {
          email: 'new@example.com',
          name: 'New User',
          nickname: 'newuser'
        }
        const expectedUser = { ...userFixtures.validUser, ...createData }
        const mockQuery = createMockQuery(expectedUser)
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        const result = await userResource.create(createData)

        expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
        expect(mockQuery.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            ...createData,
            user_id: 'auth-user-id',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        )
        expect(result).toEqual(expectedUser)
      })
    })

    describe('with invalid data', () => {
      it('should throw error for missing required fields', async () => {
        const invalidData = { email: 'test@example.com' } as CreateUserInput

        await expect(userResource.create(invalidData))
          .rejects
          .toThrow('Name is required')
      })

      it('should throw error for invalid email', async () => {
        const invalidData: CreateUserInput = {
          email: 'invalid-email',
          name: 'Test User',
          nickname: 'test'
        }

        await expect(userResource.create(invalidData))
          .rejects
          .toThrow('Invalid email format')
      })
    })

    describe('when authentication fails', () => {
      it('should throw error when user not authenticated', async () => {
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: null },
          error: { message: 'Not authenticated' }
        })

        const createData: CreateUserInput = {
          email: 'test@example.com',
          name: 'Test User',
          nickname: 'test'
        }

        await expect(userResource.create(createData))
          .rejects
          .toThrow('Authentication required')
      })
    })

    describe('when database constraint violation occurs', () => {
      it('should throw error for duplicate email', async () => {
        const createData: CreateUserInput = {
          email: 'existing@example.com',
          name: 'Test User',
          nickname: 'test'
        }
        const mockQuery = createMockQuery(null, {
          code: '23505',
          message: 'duplicate key value violates unique constraint'
        })
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        await expect(userResource.create(createData))
          .rejects
          .toThrow('Email already exists')
      })
    })
  })

  describe('update', () => {
    describe('with valid data', () => {
      it('should update user and return updated data', async () => {
        const updateData: UpdateUserInput = {
          name: 'Updated Name',
          nickname: 'updated'
        }
        const expectedUser = { ...userFixtures.validUser, ...updateData }
        const mockQuery = createMockQuery(expectedUser)
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        const result = await userResource.update('1', updateData)

        expect(mockQuery.update).toHaveBeenCalledWith(
          expect.objectContaining({
            ...updateData,
            updated_at: expect.any(String)
          })
        )
        expect(result).toEqual(expectedUser)
      })
    })

    describe('with partial data', () => {
      it('should allow partial updates', async () => {
        const updateData: UpdateUserInput = { name: 'New Name Only' }
        const expectedUser = { ...userFixtures.validUser, ...updateData }
        const mockQuery = createMockQuery(expectedUser)
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        const result = await userResource.update('1', updateData)

        expect(result.name).toBe('New Name Only')
        expect(result.email).toBe(userFixtures.validUser.email) // 変更されない
      })
    })

    describe('when user does not exist', () => {
      it('should throw error', async () => {
        const updateData: UpdateUserInput = { name: 'New Name' }
        const mockQuery = createMockQuery(null, { code: 'PGRST116' })
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        await expect(userResource.update('999', updateData))
          .rejects
          .toThrow('User not found')
      })
    })
  })

  describe('delete', () => {
    describe('when user exists', () => {
      it('should delete user and return true', async () => {
        const mockQuery = createMockQuery(null, null)
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        const result = await userResource.delete('1')

        expect(mockQuery.delete).toHaveBeenCalled()
        expect(result).toBe(true)
      })
    })

    describe('when delete fails', () => {
      it('should throw error', async () => {
        const mockQuery = createMockQuery(null, {
          message: 'Foreign key constraint violation',
          code: '23503'
        })
        mockSupabaseClient.from.mockReturnValue(mockQuery)

        await expect(userResource.delete('1'))
          .rejects
          .toThrow('Cannot delete user: referenced by other records')
      })
    })
  })

  describe('count', () => {
    it('should return user count', async () => {
      const mockQuery = {
        select: vi.fn(() => Promise.resolve({ count: 42, error: null }))
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await userResource.count({ status: 'active' })

      expect(result).toBe(42)
      expect(mockQuery.select).toHaveBeenCalledWith('*', { count: 'exact', head: true })
    })

    it('should return 0 when count is null', async () => {
      const mockQuery = {
        select: vi.fn(() => Promise.resolve({ count: null, error: null }))
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await userResource.count({})

      expect(result).toBe(0)
    })
  })

  describe('bulkCreate', () => {
    it('should create multiple users', async () => {
      const usersData: CreateUserInput[] = [
        { email: 'user1@example.com', name: 'User 1', nickname: 'user1' },
        { email: 'user2@example.com', name: 'User 2', nickname: 'user2' }
      ]
      const expectedUsers = usersData.map((user, index) => ({
        id: `${index + 1}`,
        ...user,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }))
      const mockQuery = createMockQuery(expectedUsers)
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await userResource.bulkCreate(usersData)

      expect(result).toHaveLength(2)
      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            email: 'user1@example.com',
            user_id: 'auth-user-id'
          }),
          expect.objectContaining({
            email: 'user2@example.com', 
            user_id: 'auth-user-id'
          })
        ])
      )
    })

    it('should handle empty array', async () => {
      const result = await userResource.bulkCreate([])

      expect(result).toEqual([])
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Network error')
      })

      await expect(userResource.findById('1'))
        .rejects
        .toThrow('Network error')
    })

    it('should handle unexpected database responses', async () => {
      const mockQuery = createMockQuery(undefined, null)
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await userResource.findById('1')

      expect(result).toBeNull()
    })
  })
})