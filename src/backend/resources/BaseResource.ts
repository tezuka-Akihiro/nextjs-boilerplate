import { supabase } from '@lib/supabase'
import { TestSupabaseClient } from '@lib/supabase/test-client'
import { User } from '@supabase/supabase-js'

export abstract class BaseResource {
  protected supabase = process.env.NODE_ENV === 'test' 
    ? TestSupabaseClient.getInstance() 
    : supabase

  protected async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  protected async requireAuthentication(): Promise<User> {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }
    return user
  }

  protected handleDatabaseError(error: unknown, context: string): never {
    console.error(`Database error in ${context}:`, error)
    
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string; message?: string }
      
      if (dbError.code === 'PGRST116') {
        throw new Error('Resource not found')
      }
      
      if (dbError.code === '23505') {
        throw new Error('Resource already exists')
      }
      
      if (dbError.code === '23503') {
        throw new Error('Referenced resource not found')
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Database operation failed: ${errorMessage}`)
  }
}