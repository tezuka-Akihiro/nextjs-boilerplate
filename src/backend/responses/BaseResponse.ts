import { ApiResponse, ErrorResponse, ValidationError } from '@shared/types'

export class BaseResponse {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message
    }
  }

  static error(error: string): ErrorResponse {
    return {
      success: false,
      error: {
        type: 'SYSTEM_ERROR',
        message: error,
        code: 'GENERAL_ERROR'
      }
    }
  }

  static validationError(errors: ValidationError[]): ErrorResponse {
    return {
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Validation failed',
        code: 'VALIDATION_FAILED',
        fields: errors
      }
    }
  }

  static notFound(resource: string = 'Resource'): ErrorResponse {
    return {
      success: false,
      error: {
        type: 'SYSTEM_ERROR',
        message: `${resource} not found`,
        code: 'NOT_FOUND',
        statusCode: 404
      }
    }
  }

  static unauthorized(): ErrorResponse {
    return {
      success: false,
      error: {
        type: 'PERMISSION_ERROR',
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
        statusCode: 401
      }
    }
  }

  static forbidden(): ErrorResponse {
    return {
      success: false,
      error: {
        type: 'PERMISSION_ERROR',
        message: 'Forbidden',
        code: 'FORBIDDEN',
        statusCode: 403
      }
    }
  }

  static serverError(): ErrorResponse {
    return {
      success: false,
      error: {
        type: 'SYSTEM_ERROR',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    }
  }

  static businessError(message: string, code: string, details?: Record<string, unknown>): ErrorResponse {
    return {
      success: false,
      error: {
        type: 'BUSINESS_ERROR',
        message,
        code,
        statusCode: 409,
        details
      }
    }
  }

  static systemError(message: string, code: string, details?: Record<string, unknown>): ErrorResponse {
    return {
      success: false,
      error: {
        type: 'SYSTEM_ERROR',
        message,
        code,
        statusCode: 500,
        details
      }
    }
  }
}