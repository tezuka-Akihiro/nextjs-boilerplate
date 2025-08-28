# projectname データベーススキーマ

## 📁 ファイル構成

機能別に分割された統合データベーススキーマです。

```
docs/database/
├── 01-base-schema.sql           # 基本テーブル（ユーザー・習慣化）
├── 02-posts-schema.sql          # 投稿関連テーブル
├── 03-seed-data.sql             # 初期データ・入力例
├── 99-database-views.sql        # ビュー・関数・トリガー
└── README.md                    # このファイル
```

## 🚀 実行順序

Supabaseで実行する際は、以下の順序で実行してください：

```sql
-- 1. 基本テーブルの作成
\i 01-base-schema.sql

-- 2. 投稿関連テーブルの作成
\i 02-posts-schema.sql

-- 3. 初期データの投入
\i 03-seed-data.sql

-- 4. ビュー・関数の作成
\i 99-database-views.sql
```

---

## 🧪 テストデータベース設定

### Supabase Local Development

**推奨: Supabase CLI使用**

```bash
# Supabase CLI インストール
npm install -g supabase

# プロジェクト初期化
supabase init

# ローカル環境起動
supabase start

# マイグレーション実行
supabase db reset
```

### CI/CD用GitHub Actions設定

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'          
      - name: Install dependencies
        run: npm ci        
      - name: Setup test database
        run: |
          npm run db:test:setup
          npm run db:test:migrate          
      - name: Run tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test_password@localhost:5432/test_db
```

### テスト用環境変数管理

```typescript
// config/test.config.ts
export const testConfig = {
  database: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://postgres:password@localhost:54321/postgres',
    supabase: {
      url: process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
      anonKey: process.env.TEST_SUPABASE_ANON_KEY || 'test-anon-key',
      serviceKey: process.env.TEST_SUPABASE_SERVICE_KEY || 'test-service-key'
    }
  },
  auth: {
    testUserId: '00000000-0000-0000-0000-000000000001',
    testUserEmail: 'test@example.com'
  }
}
```

### テスト用Factory Pattern

```typescript
// tests/factories/user.factory.ts
export class UserFactory {
  private static counter = 1
  
  static async create(overrides: Partial<UserType> = {}): Promise<UserType> {
    const client = TestSupabaseClient.getInstance()
    
    const userData = {
      email: `test${this.counter}@example.com`,
      name: `Test User ${this.counter}`,
      ...overrides
    }
    
    this.counter++
    
    const { data, error } = await client
      .from('users')
      .insert(userData)
      .select()
      .single()
      
    if (error) throw error
    return data
  }
}
```

### テスト実行管理

```json
{
  "scripts": {
    "test:setup": "supabase start",
    "test:teardown": "supabase stop",
    "test:unit": "jest --testPathPattern=/unit/",
    "test:integration": "jest --testPathPattern=/integration/ --runInBand",
    "test:db:reset": "supabase db reset",
    "test:db:seed": "supabase db seed"
  }
}
\i 99-database-views.sql
```

## 📊 主要テーブル

### 基本システム
- `users` - ユーザー情報（彼女GET機能拡張済み）
- `daily_counts` - 日次習慣記録

### 投稿システム
- `posts` - 投稿基本情報
- `post_types` - 投稿タイプ定義
- `self_investment_posts` - 自己投資投稿詳細
- `date_posts` - デート投稿詳細
- `habit_declaration_posts` - 習慣化宣言詳細
- `girlfriend_get_posts` - 彼女GET投稿詳細 ⭐NEW⭐

### 定型コメントシステム
- `preset_comments` - 定型コメント記録
- `preset_comment_types` - 定型コメント種類

### サポートテーブル
- `input_examples` - フォーム入力例

## 🔍 主要ビュー

- `user_stats` - ユーザー統計（カウントダウン・経験値等）
- `posts_with_details` - 投稿詳細（タイムライン用）
- `preset_comments_with_details` - 定型コメント詳細
- `daily_stats` - 日次統計
- `monthly_stats` - 月次統計

## 🛡️ セキュリティ

全テーブルでRow Level Security (RLS)が有効化されており、適切なポリシーが設定されています。

## 🔄 更新履歴

- v1.0: 基本スキーマ（ユーザー・習慣化）
- v2.0: 投稿システム・定型コメント機能追加
- v2.1: 彼女GET投稿機能追加
- v2.2: 機能別ファイル分割・統合