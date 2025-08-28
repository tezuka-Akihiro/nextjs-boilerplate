/**
 * UserResource 統合テスト
 * 
 * テスト戦略: 実際のテストデータベース使用
 * 対象: src/resources/UserResource.ts
 */

import { UserResource } from '@resources/UserResource'
import { UserType, CreateUserInput, UpdateUserInput } from '@shared/types'
import { TestSupabaseClient } from '../utils/supabase-test-client'
import { UserFactory } from '../factories/user.factory'
import { testConfig } from '../../config/test.config'

describe('UserResource Integration Tests', () => {
  let userResource: UserResource
  let testClient: any

  beforeAll(async () => {
    testClient = TestSupabaseClient.getInstance()
    userResource = new UserResource(testClient)
    
    // テストユーザーとして認証
    await TestSupabaseClient.authenticateTestUser()
  })

  beforeEach(async () => {
    // 各テスト前にUserテーブルをクリーンアップ
    await testClient.from('users').delete().neq('id', '')
    
    // ベースとなるテストユーザーを作成
    await testClient.from('users').insert({
      id: testConfig.auth.testUserId,
      email: testConfig.auth.testUserEmail,
      name: 'Test User',
      nickname: 'testuser',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  })

  afterAll(async () => {
    // テスト終了後のクリーンアップ
    await TestSupabaseClient.cleanup()
  })

  describe('findById', () => {
    it('should find existing user by id', async () => {
      const createdUser = await UserFactory.create({
        email: 'findbyid@example.com',
        name: 'Find By ID User'
      })

      const result = await userResource.findById(createdUser.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(createdUser.id)
      expect(result!.email).toBe('findbyid@example.com')
      expect(result!.name).toBe('Find By ID User')
    })

    it('should return null for non-existent user', async () => {
      const result = await userResource.findById('non-existent-id')

      expect(result).toBeNull()
    })

    it('should handle UUID format validation', async () => {
      await expect(userResource.findById('invalid-uuid'))
        .rejects
        .toThrow('Invalid UUID format')
    })
  })

  describe('findByEmail', () => {
    it('should find existing user by email', async () => {
      const createdUser = await UserFactory.create({
        email: 'unique@example.com',
        name: 'Unique Email User'
      })

      const result = await userResource.findByEmail('unique@example.com')

      expect(result).not.toBeNull()
      expect(result!.id).toBe(createdUser.id)
      expect(result!.email).toBe('unique@example.com')
    })

    it('should return null for non-existent email', async () => {
      const result = await userResource.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })

    it('should be case insensitive', async () => {
      await UserFactory.create({
        email: 'case@example.com',
        name: 'Case Test User'
      })

      const result = await userResource.findByEmail('CASE@EXAMPLE.COM')

      expect(result).not.toBeNull()
      expect(result!.email).toBe('case@example.com')
    })
  })

  describe('findMany', () => {
    beforeEach(async () => {
      // テスト用のユーザーを複数作成
      await UserFactory.createMany(5, { name: 'Batch User' })
      await UserFactory.create({ name: 'Active User', status: 'active' })
      await UserFactory.create({ name: 'Inactive User', status: 'inactive' })
    })

    it('should return all users with default settings', async () => {
      const result = await userResource.findMany({})

      expect(result.length).toBeGreaterThan(5)
      expect(result.every(user => user.id && user.email && user.name)).toBe(true)
    })

    it('should apply limit filter', async () => {
      const result = await userResource.findMany({ limit: 3 })

      expect(result.length).toBe(3)
    })

    it('should apply status filter', async () => {
      const result = await userResource.findMany({ status: 'active' })

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('Active User')
    })

    it('should apply pagination', async () => {
      const firstPage = await userResource.findMany({ limit: 2, offset: 0 })
      const secondPage = await userResource.findMany({ limit: 2, offset: 2 })

      expect(firstPage.length).toBe(2)
      expect(secondPage.length).toBe(2)
      expect(firstPage[0].id).not.toBe(secondPage[0].id)
    })

    it('should return results in correct order (newest first)', async () => {
      const result = await userResource.findMany({ limit: 3 })

      // created_at の降順でソートされているかチェック
      for (let i = 0; i < result.length - 1; i++) {
        const current = new Date(result[i].created_at)
        const next = new Date(result[i + 1].created_at)
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime())
      }
    })
  })

  describe('create', () => {
    it('should create user with valid data', async () => {
      const createData: CreateUserInput = {
        email: 'create@example.com',
        name: 'Create Test User',
        nickname: 'createtest'
      }

      const result = await userResource.create(createData)

      expect(result.id).toBeDefined()
      expect(result.email).toBe('create@example.com')
      expect(result.name).toBe('Create Test User')
      expect(result.nickname).toBe('createtest')
      expect(result.created_at).toBeDefined()
      expect(result.updated_at).toBeDefined()

      // データベースに実際に保存されているか確認
      const savedUser = await userResource.findById(result.id)
      expect(savedUser).not.toBeNull()
      expect(savedUser!.email).toBe('create@example.com')
    })

    it('should enforce unique email constraint', async () => {
      const createData: CreateUserInput = {
        email: 'duplicate@example.com',
        name: 'First User',
        nickname: 'first'
      }

      await userResource.create(createData)

      // 同じメールアドレスで再度作成を試行
      const duplicateData: CreateUserInput = {
        email: 'duplicate@example.com',
        name: 'Second User',
        nickname: 'second'
      }

      await expect(userResource.create(duplicateData))
        .rejects
        .toThrow('Email already exists')
    })

    it('should enforce required fields', async () => {
      const invalidData = {
        email: 'test@example.com'
        // name と nickname が欠落
      } as CreateUserInput

      await expect(userResource.create(invalidData))
        .rejects
        .toThrow()
    })

    it('should validate email format', async () => {
      const invalidData: CreateUserInput = {
        email: 'invalid-email-format',
        name: 'Test User',
        nickname: 'test'
      }

      await expect(userResource.create(invalidData))
        .rejects
        .toThrow('Invalid email format')
    })

    it('should set timestamps correctly', async () => {
      const beforeCreate = new Date()
      
      const result = await userResource.create({
        email: 'timestamp@example.com',
        name: 'Timestamp User',
        nickname: 'timestamp'
      })
      
      const afterCreate = new Date()

      const createdAt = new Date(result.created_at)
      const updatedAt = new Date(result.updated_at)

      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime())
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime())
      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime())
      expect(updatedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime())
    })
  })

  describe('update', () => {
    let existingUser: UserType

    beforeEach(async () => {
      existingUser = await UserFactory.create({
        email: 'update@example.com',
        name: 'Original Name',
        nickname: 'original'
      })
    })

    it('should update user with valid data', async () => {
      const updateData: UpdateUserInput = {
        name: 'Updated Name',
        nickname: 'updated'
      }

      const result = await userResource.update(existingUser.id, updateData)

      expect(result.id).toBe(existingUser.id)
      expect(result.name).toBe('Updated Name')
      expect(result.nickname).toBe('updated')
      expect(result.email).toBe(existingUser.email) // 変更されない
      expect(new Date(result.updated_at).getTime())
        .toBeGreaterThan(new Date(existingUser.updated_at).getTime())
    })

    it('should allow partial updates', async () => {
      const updateData: UpdateUserInput = {
        name: 'Only Name Updated'
      }

      const result = await userResource.update(existingUser.id, updateData)

      expect(result.name).toBe('Only Name Updated')
      expect(result.nickname).toBe(existingUser.nickname) // 変更されない
      expect(result.email).toBe(existingUser.email) // 変更されない
    })

    it('should fail for non-existent user', async () => {
      const updateData: UpdateUserInput = {
        name: 'New Name'
      }

      await expect(userResource.update('non-existent-id', updateData))
        .rejects
        .toThrow('User not found')
    })

    it('should validate email uniqueness on update', async () => {
      const anotherUser = await UserFactory.create({
        email: 'another@example.com',
        name: 'Another User'
      })

      const updateData: UpdateUserInput = {
        email: 'another@example.com' // 既存のメールアドレス
      }

      await expect(userResource.update(existingUser.id, updateData))
        .rejects
        .toThrow('Email already exists')
    })

    it('should update timestamp correctly', async () => {
      const originalUpdatedAt = new Date(existingUser.updated_at)
      
      // 少し待ってからアップデート（タイムスタンプの違いを確実にするため）
      await new Promise(resolve => setTimeout(resolve, 10))

      const result = await userResource.update(existingUser.id, {
        name: 'Timestamp Test'
      })

      const newUpdatedAt = new Date(result.updated_at)
      expect(newUpdatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })
  })

  describe('delete', () => {
    let existingUser: UserType

    beforeEach(async () => {
      existingUser = await UserFactory.create({
        email: 'delete@example.com',
        name: 'Delete Test User'
      })
    })

    it('should delete existing user', async () => {
      const result = await userResource.delete(existingUser.id)

      expect(result).toBe(true)

      // 削除されたことを確認
      const deletedUser = await userResource.findById(existingUser.id)
      expect(deletedUser).toBeNull()
    })

    it('should not throw error for non-existent user', async () => {
      const result = await userResource.delete('non-existent-id')

      expect(result).toBe(true) // Supabaseは存在しないレコードの削除でもエラーにならない
    })
  })

  describe('count', () => {
    beforeEach(async () => {
      // テスト用データを作成
      await UserFactory.createMany(3, { status: 'active' })
      await UserFactory.createMany(2, { status: 'inactive' })
    })

    it('should count all users with no filters', async () => {
      const result = await userResource.count({})

      expect(result).toBeGreaterThanOrEqual(6) // 5つ作成 + 初期のテストユーザー
    })

    it('should count users with status filter', async () => {
      const activeCount = await userResource.count({ status: 'active' })
      const inactiveCount = await userResource.count({ status: 'inactive' })

      expect(activeCount).toBe(3)
      expect(inactiveCount).toBe(2)
    })
  })

  describe('bulkCreate', () => {
    it('should create multiple users', async () => {
      const usersData: CreateUserInput[] = [
        { email: 'bulk1@example.com', name: 'Bulk User 1', nickname: 'bulk1' },
        { email: 'bulk2@example.com', name: 'Bulk User 2', nickname: 'bulk2' },
        { email: 'bulk3@example.com', name: 'Bulk User 3', nickname: 'bulk3' }
      ]

      const result = await userResource.bulkCreate(usersData)

      expect(result).toHaveLength(3)
      expect(result.every(user => user.id && user.created_at && user.updated_at)).toBe(true)

      // 各ユーザーが実際に保存されているか確認
      for (const user of result) {
        const savedUser = await userResource.findById(user.id)
        expect(savedUser).not.toBeNull()
      }
    })

    it('should handle empty array', async () => {
      const result = await userResource.bulkCreate([])

      expect(result).toEqual([])
    })

    it('should enforce constraints in bulk operation', async () => {
      const usersData: CreateUserInput[] = [
        { email: 'valid@example.com', name: 'Valid User', nickname: 'valid' },
        { email: 'duplicate@example.com', name: 'First', nickname: 'first' },
        { email: 'duplicate@example.com', name: 'Second', nickname: 'second' } // 重複
      ]

      await expect(userResource.bulkCreate(usersData))
        .rejects
        .toThrow()
    })
  })

  describe('concurrent operations', () => {
    it('should handle concurrent findById operations', async () => {
      const user = await UserFactory.create({
        email: 'concurrent@example.com',
        name: 'Concurrent User'
      })

      const promises = Array.from({ length: 10 }, () => 
        userResource.findById(user.id)
      )

      const results = await Promise.all(promises)

      expect(results).toHaveLength(10)
      expect(results.every(result => result?.id === user.id)).toBe(true)
    })

    it('should handle concurrent create operations', async () => {
      const createPromises = Array.from({ length: 5 }, (_, i) => 
        userResource.create({
          email: `concurrent${i}@example.com`,
          name: `Concurrent User ${i}`,
          nickname: `concurrent${i}`
        })
      )

      const results = await Promise.all(createPromises)

      expect(results).toHaveLength(5)
      expect(new Set(results.map(r => r.id)).size).toBe(5) // 全て異なるID
      expect(new Set(results.map(r => r.email)).size).toBe(5) // 全て異なるメール
    })
  })

  describe('transaction behavior', () => {
    it('should maintain data consistency during errors', async () => {
      const initialCount = await userResource.count({})

      try {
        await userResource.create({
          email: 'invalid-email-format', // バリデーションエラー
          name: 'Test User',
          nickname: 'test'
        })
      } catch (error) {
        // エラーが発生することを期待
      }

      const finalCount = await userResource.count({})
      expect(finalCount).toBe(initialCount) // カウントが変わっていない
    })
  })
})