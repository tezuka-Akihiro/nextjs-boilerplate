/**
 * プロジェクト全体のパス定数定義
 * 
 * 責務:
 * - importパスの統一管理
 * - 相対パスの削減
 * - 型安全性の向上
 * - リファクタリング時の変更箇所最小化
 */

// ===== ベースパス定義 =====
export const BASE_PATHS = {
  // ソースコードルート
  SRC: 'src',
  
  // メインディレクトリ
  BACKEND: 'src/backend',
  FRONTEND: 'src/frontend', 
  SHARED: 'src/shared',
  
  // テスト関連
  TESTS: 'tests',
  DOCS: 'docs',
  
  // 設定ファイル
  CONFIG: 'config'
} as const

// ===== Backend層パス =====
export const BACKEND_PATHS = {
  // AI滑走路4層
  API: 'src/backend/api',
  CONTROLLERS: 'src/backend/controllers',
  TASKS: 'src/backend/tasks', 
  RESOURCES: 'src/backend/resources',
  RESPONSES: 'src/backend/responses',
  
  // ベースクラス
  BASE_API: 'src/backend/api/BaseApi',
  BASE_CONTROLLER: 'src/backend/controllers/BaseController',
  BASE_TASK: 'src/backend/tasks/BaseTask',
  BASE_RESOURCE: 'src/backend/resources/BaseResource',
  BASE_RESPONSE: 'src/backend/responses/BaseResponse'
} as const

// ===== Frontend層パス =====
export const FRONTEND_PATHS = {
  // Next.js App Router
  APP: 'src/app',
  COMPONENTS: 'src/components',
  HOOKS: 'src/hooks',
  
  // API Routes (Next.js)
  API_ROUTES: 'src/app/api',
  
  // ページ
  PAGES: 'src/app',
  LAYOUT: 'src/app/layout'
} as const

// ===== 共通パス =====
export const SHARED_PATHS = {
  // 型定義
  TYPES: 'src/shared/types',
  
  // ユーティリティ
  UTILS: 'src/lib/utils',
  CONFIG: 'src/shared/config',
  
  // 外部サービス設定
  SUPABASE: 'src/lib/supabase'
} as const

// ===== テストパス =====
export const TEST_PATHS = {
  // テストディレクトリ
  UNIT: 'tests/unit',
  INTEGRATION: 'tests/integration',
  E2E: 'tests/e2e',
  
  // テストユーティリティ
  FIXTURES: 'tests/fixtures',
  FACTORIES: 'tests/factories',
  MOCKS: 'tests/mocks',
  
  // テストテンプレート
  TEMPLATES: 'docs/templates'
} as const

// ===== TypeScript設定用パスマッピング（requirements-sync-checklist.md準拠）=====
export const TSCONFIG_PATHS = {
  // レガシー互換（段階的移行用）
  '@/*': ['src/*'],
  
  // 🎯 requirements-sync-checklist.md必須ファイル（最優先）
  '@types/*': [`${SHARED_PATHS.TYPES}/*`],     // database.ts, index.ts, gadget-terms.ts
  '@lib/*': ['src/lib/*'],                      // supabase.ts
  '@templates/*': [`${TEST_PATHS.TEMPLATES}/*`], // 5層テンプレート
  
  // AI滑走路4層（バックエンド）
  '@api/*': [`${BACKEND_PATHS.API}/*`],
  '@controllers/*': [`${BACKEND_PATHS.CONTROLLERS}/*`],
  '@tasks/*': [`${BACKEND_PATHS.TASKS}/*`],
  '@resources/*': [`${BACKEND_PATHS.RESOURCES}/*`],
  '@responses/*': [`${BACKEND_PATHS.RESPONSES}/*`],
  '@backend/*': [`${BACKEND_PATHS.API}/*`, `${BACKEND_PATHS.CONTROLLERS}/*`, `${BACKEND_PATHS.TASKS}/*`, `${BACKEND_PATHS.RESOURCES}/*`, `${BACKEND_PATHS.RESPONSES}/*`],
  
  // フロントエンド層
  '@app/*': [`${FRONTEND_PATHS.APP}/*`],
  '@components/*': [`${FRONTEND_PATHS.COMPONENTS}/*`],
  '@hooks/*': [`${FRONTEND_PATHS.HOOKS}/*`],
  '@frontend/*': [`${FRONTEND_PATHS.APP}/*`, `${FRONTEND_PATHS.COMPONENTS}/*`, `${FRONTEND_PATHS.HOOKS}/*`],
  
  // 共通・設定
  '@shared/*': [`${SHARED_PATHS.TYPES}/*`, `${SHARED_PATHS.CONFIG}/*`],
  '@config/*': [`${SHARED_PATHS.CONFIG}/*`],
  '@utils/*': ['src/lib/*'],
  
  // テスト用
  '@tests/*': [`${TEST_PATHS.UNIT}/*`, `${TEST_PATHS.INTEGRATION}/*`, `${TEST_PATHS.E2E}/*`],
  '@fixtures/*': [`${TEST_PATHS.FIXTURES}/*`],
  '@factories/*': [`${TEST_PATHS.FACTORIES}/*`],
  '@mocks/*': [`${TEST_PATHS.MOCKS}/*`]
} as const

// ===== ファイル命名パターン =====
export const FILE_PATTERNS = {
  // バックエンド
  API: (name: string) => `${name}Api.ts`,
  CONTROLLER: (name: string) => `${name}Controller.ts`, 
  TASK: (name: string) => `${name}Task.ts`,
  RESOURCE: (name: string) => `${name}Resource.ts`,
  RESPONSE: (name: string) => `${name}Response.ts`,
  
  // フロントエンド
  COMPONENT: (_name: string) => `${_name}.tsx`,
  HOOK: (_name: string) => `use${_name}.ts`,
  PAGE: () => `page.tsx`,
  LAYOUT: () => `layout.tsx`,
  
  // テスト
  UNIT_TEST: (name: string) => `${name}Test.ts`,
  INTEGRATION_TEST: (name: string) => `${name}.integration.test.ts`,
  E2E_TEST: (name: string) => `${name}.e2e.test.ts`,
  
  // 型定義
  TYPES: (name: string) => `${name}.ts`,
  INDEX: () => 'index.ts'
} as const

// ===== 頻出パスの短縮エイリアス（requirements-sync-checklist.md準拠）=====
export const COMMON_IMPORTS = {
  // 必須型定義ファイル
  DATABASE_TYPES: '@types/database',        // src/shared/types/database.ts
  SHARED_TYPES: '@types/index',            // src/shared/types/index.ts  
  GADGET_TERMS: '@types/gadget-terms',     // src/shared/types/gadget-terms.ts
  
  // ベースクラス（テンプレート対応）
  BASE_CONTROLLER: '@controllers/BaseController',
  BASE_TASK: '@tasks/BaseTask', 
  BASE_RESOURCE: '@resources/BaseResource',
  BASE_RESPONSE: '@responses/BaseResponse',
  
  // Supabase設定・型統合
  SUPABASE_CONFIG: '@lib/supabase',        // src/lib/supabase.ts
  UTILS: '@utils/utils',                   // src/lib/utils.ts
  
  // テンプレート（docs/templates/）
  API_TEMPLATE: '@templates/ApiTemplate',
  CONTROLLER_TEMPLATE: '@templates/ControllerTemplate',
  TASK_TEMPLATE: '@templates/TaskTemplate',
  RESOURCE_TEMPLATE: '@templates/ResourceTemplate',
  RESPONSE_TEMPLATE: '@templates/ResponseTemplate',
  
  // 外部ライブラリ
  NEXT_SERVER: 'next/server',
  SUPABASE_JS: '@supabase/supabase-js',
  REACT: 'react'
} as const

// ===== 環境別パス設定 =====
export const ENV_PATHS = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  },
  production: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  },
  test: {
    API_BASE_URL: 'http://localhost:3000/api',
    SUPABASE_URL: 'http://localhost:54321',
    SUPABASE_ANON_KEY: 'test-key'
  }
} as const

// ===== パス解決ヘルパー関数 =====
export const PathResolver = {
  /**
   * 相対パスから絶対パスに変換
   */
  toAbsolute: (relativePath: string): string => {
    if (relativePath.startsWith('./') || relativePath.startsWith('../')) {
      return relativePath.replace(/^\.\.?\//, 'src/')
    }
    return relativePath.startsWith('src/') ? relativePath : `src/${relativePath}`
  },
  
  /**
   * エイリアスパスに変換（requirements-sync-checklist.md準拠）
   */
  toAlias: (fullPath: string): string => {
    // requirements-sync-checklist.mdに基づくパスマッピング
    const pathMappings = {
      // 必須型定義ファイル
      'src/shared/types/database.ts': '@types/database',
      'src/shared/types/index.ts': '@types/index', 
      'src/shared/types/gadget-terms.ts': '@types/gadget-terms',
      'src/lib/supabase.ts': '@lib/supabase',
      'src/lib/utils.ts': '@utils/utils',
      
      // AI滑走路4層テンプレート
      'docs/templates/ApiTemplate.ts': '@templates/ApiTemplate',
      'docs/templates/ControllerTemplate.ts': '@templates/ControllerTemplate',
      'docs/templates/TaskTemplate.ts': '@templates/TaskTemplate',
      'docs/templates/ResourceTemplate.ts': '@templates/ResourceTemplate',
      'docs/templates/ResponseTemplate.ts': '@templates/ResponseTemplate',
      
      // ディレクトリレベルマッピング
      'src/backend/api/': '@api/',
      'src/backend/controllers/': '@controllers/',
      'src/backend/tasks/': '@tasks/',
      'src/backend/resources/': '@resources/',
      'src/backend/responses/': '@responses/',
      'src/backend/': '@backend/',
      'src/app/': '@app/',
      'src/components/': '@components/',
      'src/hooks/': '@hooks/',
      'src/shared/types/': '@types/',
      'src/shared/config/': '@config/',
      'src/shared/': '@shared/',
      'src/lib/': '@lib/',
      'tests/backend/fixtures/': '@fixtures/',
      'tests/backend/factories/': '@factories/',
      'tests/backend/mocks/': '@mocks/',
      'tests/': '@tests/',
      'docs/templates/': '@templates/',
      'src/': '@/'
    }
    
    for (const [srcPath, aliasPath] of Object.entries(pathMappings)) {
      if (fullPath.startsWith(srcPath)) {
        return fullPath.replace(srcPath, aliasPath)
      }
    }
    
    return fullPath
  },
  
  /**
   * レイヤー間の適切なimportパスを生成
   */
  getImportPath: (from: string, to: string): string => {
    // AI滑走路アーキテクチャの依存関係チェック
    const layerOrder = ['api', 'controllers', 'tasks', 'resources', 'responses']
    const fromLayer = layerOrder.find(layer => from.includes(`/${layer}/`))
    const toLayer = layerOrder.find(layer => to.includes(`/${layer}/`))
    
    if (fromLayer && toLayer) {
      const fromIndex = layerOrder.indexOf(fromLayer)
      const toIndex = layerOrder.indexOf(toLayer)
      
      // 上位層から下位層への依存は許可、同一層内も許可
      if (fromIndex <= toIndex) {
        return PathResolver.toAlias(to)
      } else {
        console.warn(`🚫 AI滑走路アーキテクチャ違反: ${fromLayer}層 -> ${toLayer}層`)
        console.warn(`   許可される依存: ${layerOrder.slice(0, fromIndex + 1).join(' -> ')}`)
        return PathResolver.toAlias(to) // 警告は出すが変換は行う
      }
    }
    
    return PathResolver.toAlias(to)
  },
  
  /**
   * ファイルの層を判定
   */
  getLayer: (filePath: string): string | null => {
    const layerPatterns = {
      'api': /\/api\//,
      'controllers': /\/controllers\//,
      'tasks': /\/tasks\//,
      'resources': /\/resources\//,
      'responses': /\/responses\//,
      'frontend': /\/app\/|\/components\/|\/hooks\//,
      'shared': /\/shared\/|\/lib\//,
      'tests': /\/tests\//
    }
    
    for (const [layer, pattern] of Object.entries(layerPatterns)) {
      if (pattern.test(filePath)) {
        return layer
      }
    }
    
    return null
  },
  
  /**
   * パス形式の検証
   */
  validatePath: (path: string): { valid: boolean; error?: string } => {
    if (!path || typeof path !== 'string') {
      return { valid: false, error: 'パスが空または文字列ではありません' }
    }
    
    if (path.includes('..')) {
      return { valid: false, error: '相対パス（..）は推奨されません' }
    }
    
    if (!path.startsWith('@') && !path.startsWith('./') && !path.startsWith('../') && !path.startsWith('src/')) {
      return { valid: false, error: 'エイリアスまたは適切な相対パスを使用してください' }
    }
    
    return { valid: true }
  }
} as const

// ===== 型定義 =====
export type BasePathsType = typeof BASE_PATHS
export type BackendPathsType = typeof BACKEND_PATHS  
export type FrontendPathsType = typeof FRONTEND_PATHS
export type SharedPathsType = typeof SHARED_PATHS
export type TestPathsType = typeof TEST_PATHS
export type FilePatternType = typeof FILE_PATTERNS
export type CommonImportsType = typeof COMMON_IMPORTS

// ===== デフォルトエクスポート（まとめて使用する場合） =====
export default {
  BASE_PATHS,
  BACKEND_PATHS,
  FRONTEND_PATHS, 
  SHARED_PATHS,
  TEST_PATHS,
  TSCONFIG_PATHS,
  FILE_PATTERNS,
  COMMON_IMPORTS,
  ENV_PATHS,
  PathResolver
} as const