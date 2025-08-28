/**
 * UserResource モック化ユニットテスト
 * 
 * テスト戦略: 完全モック使用
 * 対象: src/resources/UserResource.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockUserResource, mockUserData } from '../mocks/user-resource.mock'
import type { CreateUserInput, UpdateUserInput } from '@shared/types'

describe('UserResource (Mock)', () => {
  let mockUserResource: any
  
  beforeEach(() => {
    mockUserResource = createMockUserResource()
  })

  describe('findById', () => {
    it('should return user when found', async () => {
      const result = await mockUserResource.findById(mockUserData[0].id)
      
      expect(result).toEqual(mockUserData[0])
      expect(mockUserResource.findById).toHaveBeenCalledWith(mockUserData[0].id)
    })

    it('should return null when not found', async () => {
      const result = await mockUserResource.findById('non-existent-id')
      
      expect(result).toBeNull()
    })

    it('should throw error for invalid UUID', async () => {
      await expect(mockUserResource.findById('invalid-uuid'))
        .rejects
        .toThrow('Invalid UUID format')
    })
  })

  describe('findByEmail', () => {
    it('should return user when email exists', async () => {
      const result = await mockUserResource.findByEmail(mockUserData[0].email)
      
      expect(result).toEqual(mockUserData[0])
    })

    it('should return null when email not found', async () => {
      const result = await mockUserResource.findByEmail('nonexistent@example.com')
      
      expect(result).toBeNull()
    })

    it('should be case insensitive', async () => {
      const result = await mockUserResource.findByEmail(mockUserData[0].email.toUpperCase())
      
      expect(result).toEqual(mockUserData[0])
    })
  })

  describe('findMany', () => {
    it('should return all users with default options', async () => {
      const result = await mockUserResource.findMany({})
      
      expect(result).toHaveLength(mockUserData.length)
      expect(result[0].created_at).toBeDefined()
    })

    it('should apply status filter', async () => {
      const result = await mockUserResource.findMany({ status: 'active' })
      
      expect(result.every((user: any) => user.status === 'active')).toBe(true)
    })

    it('should apply limit', async () => {
      const result = await mockUserResource.findMany({ limit: 1 })
      
      expect(result).toHaveLength(1)
    })

    it('should apply pagination', async () => {
      const firstPage = await mockUserResource.findMany({ limit: 1, offset: 0 })
      const secondPage = await mockUserResource.findMany({ limit: 1, offset: 1 })
      
      expect(firstPage[0].id).not.toBe(secondPage[0].id)
    })
  })

  describe('create', () => {
    it('should create user with valid data', async () => {
      const createData: CreateUserInput = {
        email: 'new@example.com',
        name: 'New User',
        nickname: 'newuser'
      }

      const result = await mockUserResource.create(createData)

      expect(result.email).toBe(createData.email)
      expect(result.name).toBe(createData.name)
      expect(result.nickname).toBe(createData.nickname)
      expect(result.id).toBeDefined()
      expect(result.created_at).toBeDefined()
    })

    it('should throw error for missing required fields', async () => {
      const invalidData = { email: 'test@example.com' } as CreateUserInput

      await expect(mockUserResource.create(invalidData))
        .rejects
        .toThrow('Required fields are missing')
    })

    it('should throw error for invalid email format', async () => {
      const invalidData: CreateUserInput = {
        email: 'invalid-email',
        name: 'Test User',
        nickname: 'test'
      }

      await expect(mockUserResource.create(invalidData))
        .rejects
        .toThrow('Invalid email format')
    })

    it('should throw error for duplicate email', async () => {
      const duplicateData: CreateUserInput = {
        email: mockUserData[0].email,
        name: 'Duplicate User',
        nickname: 'duplicate'
      }

      await expect(mockUserResource.create(duplicateData))
        .rejects
        .toThrow('Email already exists')
    })
  })

  describe('update', () => {
    it('should update user with valid data', async () => {
      const updateData: UpdateUserInput = {
        name: 'Updated Name',
        nickname: 'updated'
      }

      const result = await mockUserResource.update(mockUserData[0].id, updateData)

      expect(result.name).toBe(updateData.name)
      expect(result.nickname).toBe(updateData.nickname)
      expect(result.email).toBe(mockUserData[0].email) // 変更されない
    })

    it('should allow partial updates', async () => {
      const updateData: UpdateUserInput = {
        name: 'Only Name Updated'
      }

      const result = await mockUserResource.update(mockUserData[0].id, updateData)

      expect(result.name).toBe(updateData.name)
      expect(result.nickname).toBe(mockUserData[0].nickname) // 変更されない
    })

    it('should throw error for non-existent user', async () => {
      const updateData: UpdateUserInput = {
        name: 'New Name'
      }

      await expect(mockUserResource.update('non-existent-id', updateData))
        .rejects
        .toThrow('User not found')
    })

    it('should validate email uniqueness on update', async () => {
      const updateData: UpdateUserInput = {
        email: mockUserData[1].email // 他のユーザーのメールアドレス
      }

      await expect(mockUserResource.update(mockUserData[0].id, updateData))
        .rejects
        .toThrow('Email already exists')
    })
  })

  describe('delete', () => {
    it('should delete existing user', async () => {
      const result = await mockUserResource.delete(mockUserData[0].id)

      expect(result).toBe(true)
    })

    it('should return true for non-existent user', async () => {
      const result = await mockUserResource.delete('non-existent-id')

      expect(result).toBe(true)
    })
  })

  describe('count', () => {
    it('should count all users with no filters', async () => {
      const result = await mockUserResource.count({})

      expect(result).toBe(mockUserData.length)
    })

    it('should count users with status filter', async () => {
      const activeCount = await mockUserResource.count({ status: 'active' })
      const expectedActiveCount = mockUserData.filter(user => user.status === 'active').length

      expect(activeCount).toBe(expectedActiveCount)
    })
  })

  describe('bulkCreate', () => {
    it('should create multiple users', async () => {
      const usersData: CreateUserInput[] = [
        { email: 'bulk1@example.com', name: 'Bulk User 1', nickname: 'bulk1' },
        { email: 'bulk2@example.com', name: 'Bulk User 2', nickname: 'bulk2' }
      ]

      const result = await mockUserResource.bulkCreate(usersData)

      expect(result).toHaveLength(2)
      expect(result[0].email).toBe(usersData[0].email)
      expect(result[1].email).toBe(usersData[1].email)
    })

    it('should handle empty array', async () => {
      const result = await mockUserResource.bulkCreate([])

      expect(result).toEqual([])
    })

    it('should enforce constraints in bulk operation', async () => {
      const usersData: CreateUserInput[] = [
        { email: 'valid@example.com', name: 'Valid User', nickname: 'valid' },
        { email: mockUserData[0].email, name: 'Duplicate', nickname: 'duplicate' } // 重複
      ]

      await expect(mockUserResource.bulkCreate(usersData))
        .rejects
        .toThrow()
    })
  })

  describe('mock utilities', () => {
    it('should provide access to mock data', () => {
      const mockData = mockUserResource._getMockData()
      
      expect(mockData).toEqual(expect.arrayContaining(mockUserData))
    })

    it('should allow setting mock data', () => {
      const newData = [mockUserData[0]]
      mockUserResource._setMockData(newData)
      
      const result = mockUserResource._getMockData()
      expect(result).toEqual(newData)
    })

    it('should allow resetting mock data', () => {
      mockUserResource._clearMockData()
      mockUserResource._resetMockData()
      
      const result = mockUserResource._getMockData()
      expect(result).toEqual(expect.arrayContaining(mockUserData))
    })
  })
})