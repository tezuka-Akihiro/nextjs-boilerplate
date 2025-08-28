/**
 * BaseController ユニットテスト
 * AI滑走路4層アーキテクチャ準拠
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BaseController } from '@controllers/BaseController'
import { BaseResponse } from '@responses/BaseResponse'

// テスト用BaseController実装
class TestController extends BaseController {
  async testExecuteTask<T>(taskFunction: () => Promise<T>) {
    return this.executeTask(taskFunction)
  }

  testHandleError(error: unknown) {
    return this.handleError(error)
  }

  testValidateFields(fields: Record<string, unknown>) {
    return this.validateFields(fields)
  }
}

describe('BaseController', () => {
  let controller: TestController

  beforeEach(() => {
    controller = new TestController()
    vi.clearAllMocks()
  })

  describe('executeTask', () => {
    describe('正常系', () => {
      it('should return success response when task succeeds', async () => {
        const mockTaskResult = { id: '1', name: 'Test Result' }
        const taskFunction = vi.fn().mockResolvedValue(mockTaskResult)

        const result = await controller.testExecuteTask(taskFunction)

        expect(result.success).toBe(true)
        expect(result.data).toEqual(mockTaskResult)
        expect(taskFunction).toHaveBeenCalledTimes(1)
      })

      it('should handle async task functions', async () => {
        const mockTaskResult = 'Async Result'
        const asyncTask = vi.fn(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
          return mockTaskResult
        })

        const result = await controller.testExecuteTask(asyncTask)

        expect(result.success).toBe(true)
        expect(result.data).toBe(mockTaskResult)
      })
    })

    describe('異常系', () => {
      it('should handle task errors gracefully', async () => {
        const errorMessage = 'Task execution failed'
        const failingTask = vi.fn().mockRejectedValue(new Error(errorMessage))

        const result = await controller.testExecuteTask(failingTask)

        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
        expect(result.error?.message).toBe(errorMessage)
      })
    })
  })

  describe('handleError', () => {
    describe('認証エラー', () => {
      it('should return unauthorized response for authentication error', () => {
        const authError = new Error('Authentication required')
        
        const result = controller.testHandleError(authError)

        expect(result.success).toBe(false)
        expect(result.error?.type).toBe('PERMISSION_ERROR')
        expect(result.error?.code).toBe('UNAUTHORIZED')
        expect(result.error?.statusCode).toBe(401)
      })
    })

    describe('リソースエラー', () => {
      it('should return not found response for resource error', () => {
        const resourceError = new Error('Resource not found')
        
        const result = controller.testHandleError(resourceError)

        expect(result.success).toBe(false)
        expect(result.error?.type).toBe('SYSTEM_ERROR')
        expect(result.error?.code).toBe('NOT_FOUND')
        expect(result.error?.statusCode).toBe(404)
      })
    })

    describe('権限エラー', () => {
      it('should return forbidden response for permission error', () => {
        const permissionError = new Error('Forbidden')
        
        const result = controller.testHandleError(permissionError)

        expect(result.success).toBe(false)
        expect(result.error?.type).toBe('PERMISSION_ERROR')
        expect(result.error?.code).toBe('FORBIDDEN')
        expect(result.error?.statusCode).toBe(403)
      })
    })

    describe('一般エラー', () => {
      it('should return error response for general error', () => {
        const generalError = new Error('Something went wrong')
        
        const result = controller.testHandleError(generalError)

        expect(result.success).toBe(false)
        expect(result.error?.message).toBe('Something went wrong')
      })

      it('should return server error for unknown error', () => {
        const unknownError = { someUnknownProperty: 'value' }
        
        const result = controller.testHandleError(unknownError)

        expect(result.success).toBe(false)
        expect(result.error?.type).toBe('SYSTEM_ERROR')
        expect(result.error?.code).toBe('INTERNAL_ERROR')
        expect(result.error?.statusCode).toBe(500)
      })
    })
  })

  describe('validateFields', () => {
    describe('正常系', () => {
      it('should return empty array for valid fields', () => {
        const validFields = {
          name: 'Test Name',
          email: 'test@example.com',
          age: 25
        }

        const errors = controller.testValidateFields(validFields)

        expect(errors).toEqual([])
      })

      it('should accept zero values as valid', () => {
        const fieldsWithZero = {
          count: 0,
          score: 0
        }

        const errors = controller.testValidateFields(fieldsWithZero)

        expect(errors).toEqual([])
      })

      it('should accept false values as valid', () => {
        const fieldsWithFalse = {
          isActive: false,
          hasPermission: false
        }

        const errors = controller.testValidateFields(fieldsWithFalse)

        expect(errors).toEqual([])
      })
    })

    describe('異常系', () => {
      it('should return validation errors for empty fields', () => {
        const invalidFields = {
          name: '',
          email: null,
          description: undefined
        }

        const errors = controller.testValidateFields(invalidFields)

        expect(errors).toHaveLength(3)
        expect(errors[0]).toEqual({
          field: 'name',
          message: 'name is required'
        })
        expect(errors[1]).toEqual({
          field: 'email',
          message: 'email is required'
        })
        expect(errors[2]).toEqual({
          field: 'description',
          message: 'description is required'
        })
      })

      it('should handle mixed valid and invalid fields', () => {
        const mixedFields = {
          validField: 'Valid Value',
          emptyField: '',
          nullField: null,
          validNumber: 42
        }

        const errors = controller.testValidateFields(mixedFields)

        expect(errors).toHaveLength(2)
        expect(errors.some(e => e.field === 'emptyField')).toBe(true)
        expect(errors.some(e => e.field === 'nullField')).toBe(true)
        expect(errors.some(e => e.field === 'validField')).toBe(false)
        expect(errors.some(e => e.field === 'validNumber')).toBe(false)
      })
    })
  })

  describe('統合テスト', () => {
    it('should handle complete workflow with validation and execution', async () => {
      const mockData = { name: 'Test', email: 'test@example.com' }
      const validationErrors = controller.testValidateFields(mockData)
      
      expect(validationErrors).toEqual([])
      
      const taskResult = await controller.testExecuteTask(async () => {
        return { ...mockData, id: '1' }
      })
      
      expect(taskResult.success).toBe(true)
      expect(taskResult.data).toEqual({ ...mockData, id: '1' })
    })

    it('should fail workflow when validation fails', async () => {
      const invalidData = { name: '', email: null }
      const validationErrors = controller.testValidateFields(invalidData)
      
      expect(validationErrors).toHaveLength(2)
      
      // バリデーションエラーがあるため、実際のタスクは実行されない想定
    })
  })
})