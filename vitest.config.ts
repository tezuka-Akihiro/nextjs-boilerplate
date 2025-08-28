/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest-setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    testTimeout: 30000,
    env: {
      NODE_ENV: 'test'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'tests/**',
        'docs/**',
        '**/*.d.ts',
        '**/*.config.*',
        'src/app/**', // Next.js App Router
        '**/*.stories.*',
        '**/*.test.*',
        '**/*.spec.*',
        'coverage/**',
        'dist/**',
        '.next/**'
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80
        },
        // 層別カバレッジ設定
        'src/backend/resources/**': {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90
        },
        'src/backend/controllers/**': {
          statements: 85,
          branches: 75,
          functions: 85,
          lines: 85
        },
        'src/backend/tasks/**': {
          statements: 85,
          branches: 75,
          functions: 85,
          lines: 85
        }
      }
    }
  },
  resolve: {
    alias: {
      // ===== レガシー互換（段階的移行用） =====
      '@': path.resolve(__dirname, './src'),
      
      // ===== バックエンド層エイリアス =====
      '@backend': path.resolve(__dirname, './src/backend'),
      '@api': path.resolve(__dirname, './src/backend/api'),
      '@controllers': path.resolve(__dirname, './src/backend/controllers'),
      '@tasks': path.resolve(__dirname, './src/backend/tasks'),
      '@resources': path.resolve(__dirname, './src/backend/resources'),
      '@responses': path.resolve(__dirname, './src/backend/responses'),
      
      // ===== フロントエンド層エイリアス =====
      '@frontend': path.resolve(__dirname, './src/app'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@app': path.resolve(__dirname, './src/app'),
      
      // ===== 共通エイリアス =====
      '@shared': path.resolve(__dirname, './src/shared'),
      '@types': path.resolve(__dirname, './src/shared/types'),
      '@config': path.resolve(__dirname, './src/shared/config'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@utils': path.resolve(__dirname, './src/lib'),
      
      // ===== テスト用エイリアス =====
      '@tests': path.resolve(__dirname, './tests'),
      '@fixtures': path.resolve(__dirname, './tests/backend/fixtures'),
      '@factories': path.resolve(__dirname, './tests/backend/factories'),
      '@mocks': path.resolve(__dirname, './tests/backend/mocks'),
      '@templates': path.resolve(__dirname, './docs/templates'),
      
      // ===== 外部サービス用エイリアス =====
      '@services': path.resolve(__dirname, './src/services'),
      '@integrations': path.resolve(__dirname, './src/integrations'),
      '@external': path.resolve(__dirname, './src/external'),
      
      // ===== 監視・分析用エイリアス =====
      '@monitoring': path.resolve(__dirname, './src/monitoring'),
      '@analytics': path.resolve(__dirname, './src/analytics'),
    },
  },
})