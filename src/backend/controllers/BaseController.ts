import { BaseResponse } from '@responses/BaseResponse'
import { ApiResponse, ErrorResponse, ValidationError } from '@shared/types'

export abstract class BaseController {
  protected async executeTask<T>(
    taskFunction: () => Promise<T>
  ): Promise<ApiResponse<T> | ErrorResponse> {
    try {
      const result = await taskFunction()
      return BaseResponse.success(result)
    } catch (error) {
      return this.handleError(error)
    }
  }

  protected handleError(error: unknown): ErrorResponse {
    console.error('Controller error:', error)

    if (error instanceof Error && error.message === 'Authentication required') {
      return BaseResponse.unauthorized()
    }

    if (error instanceof Error && error.message === 'Resource not found') {
      return BaseResponse.notFound()
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return BaseResponse.forbidden()
    }

    if (error instanceof Error && error.message) {
      return BaseResponse.error(error.message)
    }

    return BaseResponse.serverError()
  }

  protected validateFields(fields: Record<string, unknown>): ValidationError[] {
    const errors: ValidationError[] = []

    for (const [fieldName, value] of Object.entries(fields)) {
      if (value === null || value === undefined || value === '') {
        errors.push({
          field: fieldName,
          message: `${fieldName} is required`
        })
      }
    }

    return errors
  }
}