/**
 * BaseResponse ユニットテスト
 * AI滑走路4層アーキテクチャ準拠
 */

import { describe, it, expect } from 'vitest'
import { BaseResponse } from '@responses/BaseResponse'
import { ValidationError } from '@shared/types'

describe('BaseResponse', () => {
  describe('success', () => {
    it('should create success response with data', () => {
      const data = { id: '1', name: 'Test Data' }
      
      const response = BaseResponse.success(data)

      expect(response.success).toBe(true)
      expect(response.data).toEqual(data)
      expect(response.message).toBeUndefined()
    })

    it('should create success response with data and message', () => {
      const data = { id: '1', name: 'Test Data' }
      const message = 'Operation completed successfully'
      
      const response = BaseResponse.success(data, message)

      expect(response.success).toBe(true)
      expect(response.data).toEqual(data)
      expect(response.message).toBe(message)
    })

    it('should handle null data', () => {
      const response = BaseResponse.success(null)

      expect(response.success).toBe(true)
      expect(response.data).toBeNull()
    })

    it('should handle undefined data', () => {
      const response = BaseResponse.success(undefined)

      expect(response.success).toBe(true)
      expect(response.data).toBeUndefined()
    })

    it('should handle array data', () => {
      const data = [{ id: '1' }, { id: '2' }]
      
      const response = BaseResponse.success(data)

      expect(response.success).toBe(true)
      expect(response.data).toEqual(data)
      expect(Array.isArray(response.data)).toBe(true)
    })

    it('should handle primitive data types', () => {
      const stringData = 'test string'
      const numberData = 42
      const booleanData = true

      expect(BaseResponse.success(stringData).data).toBe(stringData)
      expect(BaseResponse.success(numberData).data).toBe(numberData)
      expect(BaseResponse.success(booleanData).data).toBe(booleanData)
    })
  })

  describe('error', () => {
    it('should create error response with message', () => {
      const errorMessage = 'Something went wrong'
      
      const response = BaseResponse.error(errorMessage)

      expect(response.success).toBe(false)
      expect(response.error).toBeDefined()
      expect(response.error.type).toBe('SYSTEM_ERROR')
      expect(response.error.message).toBe(errorMessage)
      expect(response.error.code).toBe('GENERAL_ERROR')
    })

    it('should handle empty error message', () => {
      const response = BaseResponse.error('')

      expect(response.success).toBe(false)
      expect(response.error.message).toBe('')
    })
  })

  describe('validationError', () => {
    it('should create validation error response', () => {
      const validationErrors: ValidationError[] = [
        { field: 'email', message: 'Email is required' },
        { field: 'name', message: 'Name must be at least 2 characters' }
      ]
      
      const response = BaseResponse.validationError(validationErrors)

      expect(response.success).toBe(false)
      expect(response.error.type).toBe('VALIDATION_ERROR')
      expect(response.error.message).toBe('Validation failed')
      expect(response.error.code).toBe('VALIDATION_FAILED')
      expect(response.error.fields).toEqual(validationErrors)
    })

    it('should handle empty validation errors array', () => {
      const response = BaseResponse.validationError([])

      expect(response.success).toBe(false)
      expect(response.error.fields).toEqual([])
    })

    it('should handle single validation error', () => {
      const singleError: ValidationError[] = [
        { field: 'password', message: 'Password is too weak' }
      ]
      
      const response = BaseResponse.validationError(singleError)

      expect(response.error.fields).toHaveLength(1)
      expect(response.error.fields![0]).toEqual(singleError[0])
    })
  })

  describe('notFound', () => {
    it('should create not found response with default resource', () => {
      const response = BaseResponse.notFound()

      expect(response.success).toBe(false)
      expect(response.error.type).toBe('SYSTEM_ERROR')
      expect(response.error.message).toBe('Resource not found')
      expect(response.error.code).toBe('NOT_FOUND')
      expect(response.error.statusCode).toBe(404)
    })

    it('should create not found response with custom resource', () => {
      const customResource = 'User'
      
      const response = BaseResponse.notFound(customResource)

      expect(response.error.message).toBe('User not found')
    })
  })

  describe('unauthorized', () => {
    it('should create unauthorized response', () => {
      const response = BaseResponse.unauthorized()

      expect(response.success).toBe(false)
      expect(response.error.type).toBe('PERMISSION_ERROR')
      expect(response.error.message).toBe('Unauthorized')
      expect(response.error.code).toBe('UNAUTHORIZED')
      expect(response.error.statusCode).toBe(401)
    })
  })

  describe('forbidden', () => {
    it('should create forbidden response', () => {
      const response = BaseResponse.forbidden()

      expect(response.success).toBe(false)
      expect(response.error.type).toBe('PERMISSION_ERROR')
      expect(response.error.message).toBe('Forbidden')
      expect(response.error.code).toBe('FORBIDDEN')
      expect(response.error.statusCode).toBe(403)
    })
  })

  describe('serverError', () => {
    it('should create server error response', () => {
      const response = BaseResponse.serverError()

      expect(response.success).toBe(false)
      expect(response.error.type).toBe('SYSTEM_ERROR')
      expect(response.error.message).toBe('Internal server error')
      expect(response.error.code).toBe('INTERNAL_ERROR')
      expect(response.error.statusCode).toBe(500)
    })
  })

  describe('レスポンス構造の一貫性', () => {
    it('should maintain consistent structure across all success responses', () => {
      const responses = [
        BaseResponse.success({ data: 'test' }),
        BaseResponse.success('string'),
        BaseResponse.success(null),
        BaseResponse.success([1, 2, 3], 'Array data')
      ]

      responses.forEach(response => {
        expect(response).toHaveProperty('success', true)
        expect(response).toHaveProperty('data')
        if (response.message) {
          expect(typeof response.message).toBe('string')
        }
      })
    })

    it('should maintain consistent structure across all error responses', () => {
      const responses = [
        BaseResponse.error('General error'),
        BaseResponse.validationError([]),
        BaseResponse.notFound(),
        BaseResponse.unauthorized(),
        BaseResponse.forbidden(),
        BaseResponse.serverError()
      ]

      responses.forEach(response => {
        expect(response).toHaveProperty('success', false)
        expect(response).toHaveProperty('error')
        expect(response.error).toHaveProperty('type')
        expect(response.error).toHaveProperty('message')
        expect(response.error).toHaveProperty('code')
      })
    })
  })

  describe('型安全性', () => {
    it('should maintain type safety for generic data types', () => {
      interface User {
        id: string
        name: string
        email: string
      }

      const userData: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }

      const response = BaseResponse.success(userData)

      // TypeScriptコンパイラレベルでの型チェック
      expect(response.data?.id).toBe('1')
      expect(response.data?.name).toBe('Test User')
      expect(response.data?.email).toBe('test@example.com')
    })

    it('should handle complex nested data structures', () => {
      const complexData = {
        user: {
          id: '1',
          profile: {
            name: 'Test',
            settings: {
              theme: 'dark',
              notifications: true
            }
          }
        },
        metadata: {
          createdAt: new Date().toISOString(),
          tags: ['test', 'user']
        }
      }

      const response = BaseResponse.success(complexData)

      expect(response.data?.user.profile.settings.theme).toBe('dark')
      expect(response.data?.metadata.tags).toContain('test')
    })
  })
})