/**
 * Supabase モック実装
 * 統合テスト・ユニットテストでの依存関係分離
 */

import { vi } from 'vitest'
import type { Database } from '@shared/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface MockSupabaseResponse<T = any> {
  data: T | null
  error: any | null
  status?: number
  statusText?: string
}

export interface MockSupabaseSelect {
  select(columns?: string): MockSupabaseQueryBuilder
}

export interface MockSupabaseQueryBuilder {
  eq(column: string, value: any): MockSupabaseQueryBuilder
  neq(column: string, value: any): MockSupabaseQueryBuilder
  like(column: string, pattern: string): MockSupabaseQueryBuilder
  ilike(column: string, pattern: string): MockSupabaseQueryBuilder
  gt(column: string, value: any): MockSupabaseQueryBuilder
  lt(column: string, value: any): MockSupabaseQueryBuilder
  gte(column: string, value: any): MockSupabaseQueryBuilder
  lte(column: string, value: any): MockSupabaseQueryBuilder
  in(column: string, values: any[]): MockSupabaseQueryBuilder
  order(column: string, options?: { ascending?: boolean }): MockSupabaseQueryBuilder
  limit(count: number): MockSupabaseQueryBuilder
  range(from: number, to: number): MockSupabaseQueryBuilder
  single(): Promise<MockSupabaseResponse>
  maybeSingle(): Promise<MockSupabaseResponse>
  insert(values: any): MockSupabaseInsertBuilder
  update(values: any): MockSupabaseUpdateBuilder
  delete(): MockSupabaseDeleteBuilder
  then(onResolve?: (value: MockSupabaseResponse) => any): Promise<any>
}

export interface MockSupabaseInsertBuilder {
  select(columns?: string): MockSupabaseQueryBuilder
  single(): Promise<MockSupabaseResponse>
  then(onResolve?: (value: MockSupabaseResponse) => any): Promise<any>
}

export interface MockSupabaseUpdateBuilder {
  eq(column: string, value: any): MockSupabaseQueryBuilder
  select(columns?: string): MockSupabaseQueryBuilder
  single(): Promise<MockSupabaseResponse>
  then(onResolve?: (value: MockSupabaseResponse) => any): Promise<any>
}

export interface MockSupabaseDeleteBuilder {
  eq(column: string, value: any): MockSupabaseQueryBuilder
  neq(column: string, value: any): MockSupabaseQueryBuilder
  like(column: string, pattern: string): MockSupabaseQueryBuilder
  then(onResolve?: (value: MockSupabaseResponse) => any): Promise<any>
}

/**
 * モックデータストア
 */
class MockDataStore {
  private data: Map<string, any[]> = new Map()
  
  constructor() {
    // 初期データ
    this.data.set('users', [
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'test@example.com',
        name: 'Test User',
        nickname: 'TestNick',
        girlfriend_goal_months: 6,
        habit_item: 'テスト用習慣化項目',
        experience: 0,
        level: 1,
        relationship_status: 'single',
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    this.data.set('girlfriend_get_posts', [])
    this.data.set('activities', [])
  }
  
  getTable(tableName: string): any[] {
    return this.data.get(tableName) || []
  }
  
  setTable(tableName: string, data: any[]): void {
    this.data.set(tableName, data)
  }
  
  insertIntoTable(tableName: string, record: any): any {
    const table = this.getTable(tableName)
    const newRecord = { 
      ...record, 
      id: record.id || this.generateId(),
      created_at: record.created_at || new Date().toISOString(),
      updated_at: record.updated_at || new Date().toISOString()
    }
    table.push(newRecord)
    return newRecord
  }
  
  updateInTable(tableName: string, filters: any, updates: any): any[] {
    const table = this.getTable(tableName)
    const updated: any[] = []
    
    for (const record of table) {
      if (this.matchesFilters(record, filters)) {
        Object.assign(record, updates, { updated_at: new Date().toISOString() })
        updated.push(record)
      }
    }
    
    return updated
  }
  
  deleteFromTable(tableName: string, filters: any): boolean {
    const table = this.getTable(tableName)
    const initialLength = table.length
    const filteredTable = table.filter(record => !this.matchesFilters(record, filters))
    this.setTable(tableName, filteredTable)
    return filteredTable.length < initialLength
  }
  
  queryTable(tableName: string, options: {
    filters?: any
    select?: string[]
    order?: { column: string, ascending: boolean }
    limit?: number
    range?: { from: number, to: number }
    single?: boolean
  } = {}): any[] {
    let results = this.getTable(tableName)
    
    // フィルタリング
    if (options.filters) {
      results = results.filter(record => this.matchesFilters(record, options.filters))
    }
    
    // ソート
    if (options.order) {
      results.sort((a, b) => {
        const aVal = a[options.order!.column]
        const bVal = b[options.order!.column]
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        return options.order!.ascending ? comparison : -comparison
      })
    }
    
    // セレクト
    if (options.select) {
      results = results.map(record => {
        const selected: any = {}
        options.select!.forEach(col => {
          if (col === '*') {
            Object.assign(selected, record)
          } else {
            selected[col] = record[col]
          }
        })
        return selected
      })
    }
    
    // 範囲指定
    if (options.range) {
      results = results.slice(options.range.from, options.range.to + 1)
    }
    
    // 制限
    if (options.limit) {
      results = results.slice(0, options.limit)
    }
    
    return results
  }
  
  private matchesFilters(record: any, filters: any): boolean {
    for (const [key, condition] of Object.entries(filters)) {
      if (!this.matchesCondition(record[key], condition)) {
        return false
      }
    }
    return true
  }
  
  private matchesCondition(value: any, condition: any): boolean {
    if (typeof condition === 'object' && condition !== null) {
      const operator = Object.keys(condition)[0]
      const operand = condition[operator]
      
      switch (operator) {
        case 'eq': return value === operand
        case 'neq': return value !== operand
        case 'like': return String(value).includes(operand.replace('%', ''))
        case 'ilike': return String(value).toLowerCase().includes(operand.replace('%', '').toLowerCase())
        case 'gt': return value > operand
        case 'lt': return value < operand
        case 'gte': return value >= operand
        case 'lte': return value <= operand
        case 'in': return operand.includes(value)
        default: return value === condition
      }
    }
    return value === condition
  }
  
  private generateId(): string {
    return 'mock-' + Math.random().toString(36).substr(2, 9)
  }
  
  clear(): void {
    this.data.clear()
  }
  
  reset(): void {
    this.clear()
    // 初期データを再設定
    this.constructor()
  }
}

export const mockDataStore = new MockDataStore()

/**
 * モックQueryBuilder
 */
class MockQueryBuilder implements MockSupabaseQueryBuilder {
  private tableName: string
  private filters: any = {}
  private selectColumns: string[] = ['*']
  private orderBy: { column: string, ascending: boolean } | null = null
  private limitCount: number | null = null
  private rangeValues: { from: number, to: number } | null = null
  private isSingle = false
  
  constructor(tableName: string) {
    this.tableName = tableName
  }
  
  eq(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { eq: value }
    return this
  }
  
  neq(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { neq: value }
    return this
  }
  
  like(column: string, pattern: string): MockSupabaseQueryBuilder {
    this.filters[column] = { like: pattern }
    return this
  }
  
  ilike(column: string, pattern: string): MockSupabaseQueryBuilder {
    this.filters[column] = { ilike: pattern }
    return this
  }
  
  gt(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { gt: value }
    return this
  }
  
  lt(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { lt: value }
    return this
  }
  
  gte(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { gte: value }
    return this
  }
  
  lte(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { lte: value }
    return this
  }
  
  in(column: string, values: any[]): MockSupabaseQueryBuilder {
    this.filters[column] = { in: values }
    return this
  }
  
  order(column: string, options: { ascending?: boolean } = {}): MockSupabaseQueryBuilder {
    this.orderBy = { column, ascending: options.ascending !== false }
    return this
  }
  
  limit(count: number): MockSupabaseQueryBuilder {
    this.limitCount = count
    return this
  }
  
  range(from: number, to: number): MockSupabaseQueryBuilder {
    this.rangeValues = { from, to }
    return this
  }
  
  select(columns?: string): MockSupabaseQueryBuilder {
    this.selectColumns = columns ? columns.split(',').map(c => c.trim()) : ['*']
    return this
  }
  
  single(): Promise<MockSupabaseResponse> {
    this.isSingle = true
    return this.executeQuery()
  }
  
  maybeSingle(): Promise<MockSupabaseResponse> {
    this.isSingle = true
    return this.executeQuery()
  }
  
  insert(values: any): MockSupabaseInsertBuilder {
    return new MockInsertBuilder(this.tableName, values)
  }
  
  update(values: any): MockSupabaseUpdateBuilder {
    return new MockUpdateBuilder(this.tableName, values, this.filters)
  }
  
  delete(): MockSupabaseDeleteBuilder {
    return new MockDeleteBuilder(this.tableName, this.filters)
  }
  
  async then(onResolve?: (value: MockSupabaseResponse) => any): Promise<any> {
    const result = await this.executeQuery()
    return onResolve ? onResolve(result) : result
  }
  
  private async executeQuery(): Promise<MockSupabaseResponse> {
    try {
      const results = mockDataStore.queryTable(this.tableName, {
        filters: this.filters,
        select: this.selectColumns,
        order: this.orderBy || undefined,
        limit: this.limitCount || undefined,
        range: this.rangeValues || undefined,
        single: this.isSingle
      })
      
      return {
        data: this.isSingle ? (results[0] || null) : results,
        error: null,
        status: 200,
        statusText: 'OK'
      }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
        status: 500,
        statusText: 'Internal Server Error'
      }
    }
  }
}

class MockInsertBuilder implements MockSupabaseInsertBuilder {
  private tableName: string
  private values: any
  private selectColumns: string[] = ['*']
  
  constructor(tableName: string, values: any) {
    this.tableName = tableName
    this.values = values
  }
  
  select(columns?: string): MockSupabaseQueryBuilder {
    this.selectColumns = columns ? columns.split(',').map(c => c.trim()) : ['*']
    return this as any
  }
  
  async single(): Promise<MockSupabaseResponse> {
    return this.executeInsert()
  }
  
  async then(onResolve?: (value: MockSupabaseResponse) => any): Promise<any> {
    const result = await this.executeInsert()
    return onResolve ? onResolve(result) : result
  }
  
  private async executeInsert(): Promise<MockSupabaseResponse> {
    try {
      if (Array.isArray(this.values)) {
        const results = this.values.map(value => mockDataStore.insertIntoTable(this.tableName, value))
        return {
          data: results,
          error: null,
          status: 201,
          statusText: 'Created'
        }
      } else {
        const result = mockDataStore.insertIntoTable(this.tableName, this.values)
        return {
          data: result,
          error: null,
          status: 201,
          statusText: 'Created'
        }
      }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
        status: 500,
        statusText: 'Internal Server Error'
      }
    }
  }
}

class MockUpdateBuilder implements MockSupabaseUpdateBuilder {
  private tableName: string
  private values: any
  private filters: any
  private selectColumns: string[] = ['*']
  
  constructor(tableName: string, values: any, filters: any = {}) {
    this.tableName = tableName
    this.values = values
    this.filters = filters
  }
  
  eq(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { eq: value }
    return this as any
  }
  
  select(columns?: string): MockSupabaseQueryBuilder {
    this.selectColumns = columns ? columns.split(',').map(c => c.trim()) : ['*']
    return this as any
  }
  
  async single(): Promise<MockSupabaseResponse> {
    return this.executeUpdate()
  }
  
  async then(onResolve?: (value: MockSupabaseResponse) => any): Promise<any> {
    const result = await this.executeUpdate()
    return onResolve ? onResolve(result) : result
  }
  
  private async executeUpdate(): Promise<MockSupabaseResponse> {
    try {
      const results = mockDataStore.updateInTable(this.tableName, this.filters, this.values)
      return {
        data: results.length === 1 ? results[0] : results,
        error: null,
        status: 200,
        statusText: 'OK'
      }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
        status: 500,
        statusText: 'Internal Server Error'
      }
    }
  }
}

class MockDeleteBuilder implements MockSupabaseDeleteBuilder {
  private tableName: string
  private filters: any
  
  constructor(tableName: string, filters: any = {}) {
    this.tableName = tableName
    this.filters = filters
  }
  
  eq(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { eq: value }
    return this as any
  }
  
  neq(column: string, value: any): MockSupabaseQueryBuilder {
    this.filters[column] = { neq: value }
    return this as any
  }
  
  like(column: string, pattern: string): MockSupabaseQueryBuilder {
    this.filters[column] = { like: pattern }
    return this as any
  }
  
  async then(onResolve?: (value: MockSupabaseResponse) => any): Promise<any> {
    const result = await this.executeDelete()
    return onResolve ? onResolve(result) : result
  }
  
  private async executeDelete(): Promise<MockSupabaseResponse> {
    try {
      const success = mockDataStore.deleteFromTable(this.tableName, this.filters)
      return {
        data: null,
        error: null,
        status: success ? 204 : 404,
        statusText: success ? 'No Content' : 'Not Found'
      }
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
        status: 500,
        statusText: 'Internal Server Error'
      }
    }
  }
}

/**
 * メインのSupabaseクライアントモック
 */
export const createMockSupabaseClient = (): SupabaseClient<Database> => {
  const mockClient = {
    from: (tableName: string) => new MockQueryBuilder(tableName),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
        list: vi.fn().mockResolvedValue({ data: [], error: null }),
      })
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null })
    },
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
      unsubscribe: vi.fn()
    }),
    removeChannel: vi.fn(),
    getChannels: vi.fn().mockReturnValue([])
  } as any
  
  return mockClient
}

/**
 * モックのリセット・設定ユーティリティ
 */
export const mockUtils = {
  reset: () => mockDataStore.reset(),
  clear: () => mockDataStore.clear(),
  setTableData: (tableName: string, data: any[]) => mockDataStore.setTable(tableName, data),
  getTableData: (tableName: string) => mockDataStore.getTable(tableName),
  insertRecord: (tableName: string, record: any) => mockDataStore.insertIntoTable(tableName, record)
}