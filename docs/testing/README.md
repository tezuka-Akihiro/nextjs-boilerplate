# テスト戦略 - projectnameプロジェクト

## 🧪 テスト戦略概要

projectnameプロジェクトでは、AI滑走路4層アーキテクチャに対応したテスト戦略を採用し、品質の高いコードを維持します。

## テスト種別

### 1. ユニットテスト
- **対象**: 各層の個別クラス・メソッド
- **フレームワーク**: Jest
- **カバレッジ目標**: 80%以上

### 2. 統合テスト  
- **対象**: 層間連携・データベース連携
- **フレームワーク**: Jest + Supertest
- **実行環境**: テスト用データベース

### 3. E2Eテスト
- **対象**: ユーザーシナリオ全体
- **フレームワーク**: Playwright
- **実行環境**: ステージング環境

---

## 🗄️ バックエンドテスト戦略

### Resource層テスト
```typescript
// tests/unit/resources/UserResource.test.ts
describe('UserResource', () => {
  test('ユーザー取得が正常に動作する', async () => {
    const mockUser = { id: 'test-id', nickname: 'Test User' }
    jest.spyOn(supabase.from('users'), 'select').mockResolvedValue({
      data: mockUser,
      error: null
    })

    const result = await userResource.getById('test-id')
    
    expect(result.success).toBe(true)
    expect(result.data.nickname).toBe('Test User')
  })
})
```

### Task層テスト
```typescript
// tests/unit/tasks/CreateUserTask.test.ts
describe('CreateUserTask', () => {
  test('ユーザー作成が正常に動作する', async () => {
    const userData = {
      email: 'test@example.com',
      nickname: 'Test User',
      goal_months: 6
    }

    const result = await createUserTask.execute(userData)
    
    expect(result.success).toBe(true)
    expect(result.data.email).toBe(userData.email)
  })
})
```

### Controller層テスト
```typescript
// tests/unit/controllers/UserController.test.ts
describe('UserController', () => {
  test('ユーザー作成処理が正常に動作する', async () => {
    const mockTask = jest.fn().mockResolvedValue({
      success: true,
      data: { id: 'test-id' }
    })

    const result = await userController.createUser(userData)
    
    expect(result.success).toBe(true)
    expect(mockTask).toHaveBeenCalled()
  })
})
```

### API層テスト
```typescript
// tests/integration/api/UserApi.test.ts
describe('UserApi', () => {
  test('POST /api/users でユーザーが作成される', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        nickname: 'Test User'
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
  })
})
```

---

## 🎨 フロントエンドテスト戦略

### コンポーネントテスト
```typescript
// tests/components/UserProfile.test.tsx
import { render, screen } from '@testing-library/react'
import { UserProfile } from '@/components/UserProfile'

describe('UserProfile', () => {
  test('ユーザー情報が正しく表示される', () => {
    const mockUser = {
      nickname: 'Test User',
      experience: 100
    }

    render(<UserProfile user={mockUser} />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })
})
```

### カスタムフック テスト
```typescript
// tests/hooks/useUser.test.ts
import { renderHook } from '@testing-library/react'
import { useUser } from '@/hooks/useUser'

describe('useUser', () => {
  test('ユーザー情報が正しく取得される', async () => {
    const { result } = renderHook(() => useUser('test-id'))
    
    await waitFor(() => {
      expect(result.current.user).toBeDefined()
      expect(result.current.loading).toBe(false)
    })
  })
})
```

### SPA統合テスト
```typescript
// tests/integration/spa/RecordsSpa.test.tsx
describe('Records SPA', () => {
  test('セクション切り替えが正常に動作する', async () => {
    render(<RecordsSPA />)
    
    // 習慣記録セクションをクリック
    fireEvent.click(screen.getByText('習慣記録'))
    
    expect(screen.getByTestId('habit-record-section')).toBeVisible()
  })
})
```

---

## 🎭 E2Eテスト (Playwright)

### ユーザーシナリオテスト
```typescript
// tests/e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test'

test('ユーザー登録から記録投稿まで', async ({ page }) => {
  // 1. ユーザー登録
  await page.goto('/auth/register')
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'password123')
  await page.fill('[data-testid="nickname"]', 'Test User')
  await page.click('[data-testid="register-button"]')

  // 2. ダッシュボード確認
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('Test User')).toBeVisible()

  // 3. 習慣記録投稿
  await page.click('[data-testid="habit-record-button"]')
  await page.fill('[data-testid="habit-count"]', '1')
  await page.click('[data-testid="submit-record"]')

  // 4. 記録確認
  await expect(page.getByText('記録を保存しました')).toBeVisible()
})
```

---

## 🚀 テスト実行・管理

### package.json スクリプト
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=/unit/",
    "test:integration": "jest --testPathPattern=/integration/ --runInBand",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

### Jest設定
```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### CI/CD統合
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm run test:unit
      - name: Run integration tests
        run: npm run test:integration
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Playwright
        run: npx playwright install
      - name: Run E2E tests
        run: npm run test:e2e
```

---

## 🎯 品質メトリクス

### コードカバレッジ目標
- **ユニットテスト**: 80%以上
- **統合テスト**: 主要フロー100%
- **E2Eテスト**: クリティカルパス100%

### テスト実行頻度
- **ユニットテスト**: コミット毎
- **統合テスト**: PR作成時
- **E2Eテスト**: main/developブランチプッシュ時

### パフォーマンス目標
- **ユニットテスト**: 30秒以内
- **統合テスト**: 2分以内  
- **E2Eテスト**: 5分以内

この包括的なテスト戦略により、projectnameプロジェクトの品質と信頼性を確保します。