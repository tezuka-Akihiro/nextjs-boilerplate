# テスト実行ガイド

## 概要

本プロジェクトのテスト実行方法と運用ガイドです。
TDD（テスト駆動開発）に基づき、品質の高いコードを維持するためのテスト戦略を定義しています。

## テストの種類

### 1. 単体テスト（Unit Test）
- **対象**: 個別の関数・クラス・コンポーネント
- **フレームワーク**: Vitest + Testing Library
- **実行コマンド**: `npm run test:unit`

### 2. 統合テスト（Integration Test）
- **対象**: 複数モジュール間の連携
- **フレームワーク**: Vitest + Supertest
- **実行コマンド**: `npm run test:integration`

### 3. E2Eテスト（End-to-End Test）
- **対象**: ユーザーシナリオベースのテスト
- **フレームワーク**: Playwright
- **実行コマンド**: `npm run test:e2e`

## テスト実行コマンド

### 基本コマンド
```bash
# 全テスト実行
npm run test

# テスト種別実行
npm run test:unit           # 単体テスト
npm run test:integration    # 統合テスト
npm run test:e2e           # E2Eテスト

# カバレッジレポート付き実行
npm run test:coverage

# 監視モード
npm run test:watch

# 特定ファイルのテスト
npm run test -- user.test.ts

# 特定パターンのテスト
npm run test -- --grep "User"
```

### CI/CD用コマンド
```bash
# CI環境用（並列実行）
npm run test:ci

# プリコミットテスト
npm run test:pre-commit

# デプロイ前テスト
npm run test:pre-deploy
```

## テスト環境設定

### 1. 環境変数
```bash
# テスト用環境変数（.env.test）
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
NEXT_PUBLIC_API_URL=http://localhost:3001/api
TEST_TIMEOUT=30000
```

### 2. テストデータベース
```bash
# テストDB初期化
npm run db:test:reset

# テストデータ投入
npm run db:test:seed

# テストDB削除
npm run db:test:drop
```

### 3. モック設定
```bash
# モックサーバー起動
npm run mock:start

# モック設定リセット
npm run mock:reset
```

## テスト戦略

### 1. バックエンドテスト

#### API層テスト
```bash
# APIエンドポイントのテスト
npm run test tests/backend/api/

# 特定のAPIテスト
npm run test tests/backend/api/users.test.ts
```

#### Controller層テスト
```bash
# ビジネスロジックのテスト
npm run test tests/backend/controllers/

# 特定のControllerテスト
npm run test tests/backend/controllers/UserController.test.ts
```

#### Task層テスト
```bash
# タスク処理のテスト
npm run test tests/backend/tasks/

# 特定のTaskテスト
npm run test tests/backend/tasks/UserTask.test.ts
```

#### Resource層テスト
```bash
# データアクセスのテスト
npm run test tests/backend/resources/

# 特定のResourceテスト
npm run test tests/backend/resources/UserResource.test.ts
```

### 2. フロントエンドテスト

#### コンポーネントテスト
```bash
# React コンポーネントのテスト
npm run test tests/frontend/components/

# 特定のコンポーネントテスト
npm run test tests/frontend/components/Button.test.tsx
```

#### ページテスト
```bash
# ページコンポーネントのテスト
npm run test tests/frontend/pages/

# 特定のページテスト
npm run test tests/frontend/pages/Home.test.tsx
```

### 3. 統合テスト
```bash
# API統合テスト
npm run test:integration

# データベース統合テスト
npm run test:integration:db

# 外部サービス統合テスト
npm run test:integration:external
```

## テストカバレッジ

### カバレッジ目標
- **全体**: 80%以上
- **バックエンド**: 90%以上
- **フロントエンド**: 75%以上
- **新規コード**: 95%以上

### カバレッジレポート
```bash
# カバレッジレポート生成
npm run test:coverage

# HTMLレポート表示
npm run coverage:open

# カバレッジしきい値チェック
npm run coverage:check
```

## テストデータ管理

### 1. フィクスチャ（固定データ）
```bash
# フィクスチャディレクトリ
tests/fixtures/
├── users.json          # ユーザーテストデータ
├── posts.json          # 投稿テストデータ
└── settings.json       # 設定テストデータ
```

### 2. ファクトリ（動的データ生成）
```bash
# ファクトリディレクトリ
tests/factories/
├── user.factory.ts     # ユーザーデータ生成
├── post.factory.ts     # 投稿データ生成
└── index.ts            # ファクトリ統合
```

### 3. モック（外部依存）
```bash
# モックディレクトリ
tests/mocks/
├── api.mock.ts         # API モック
├── database.mock.ts    # データベースモック
└── services.mock.ts    # 外部サービスモック
```

## パフォーマンステスト

### 1. 負荷テスト
```bash
# API負荷テスト
npm run test:load

# データベース負荷テスト
npm run test:db-load

# フロントエンド負荷テスト
npm run test:frontend-load
```

### 2. パフォーマンス監視
```bash
# パフォーマンステスト実行
npm run test:performance

# メモリ使用量テスト
npm run test:memory

# レスポンス時間テスト
npm run test:response-time
```

## CI/CDパイプライン

### 1. プルリクエスト時
```yaml
# .github/workflows/test.yml
name: Test
on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test:ci
      - name: Upload coverage
        run: npm run coverage:upload
```

### 2. デプロイ前
```bash
# デプロイ前チェック
npm run test:pre-deploy
npm run test:e2e:production
npm run test:smoke
```

## トラブルシューティング

### 1. よくある問題

#### テストタイムアウト
```bash
# タイムアウト時間の延長
npm run test -- --timeout 60000
```

#### データベース接続エラー
```bash
# テストDB状態確認
npm run db:test:status

# テストDB再起動
npm run db:test:restart
```

#### モック設定エラー
```bash
# モック設定確認
npm run mock:status

# モック設定リセット
npm run mock:reset
```

### 2. デバッグ方法

#### テストデバッグモード
```bash
# デバッグモードでテスト実行
npm run test:debug

# 特定テストのデバッグ
npm run test:debug -- user.test.ts
```

#### ログ出力
```bash
# 詳細ログ付きテスト
npm run test -- --verbose

# デバッグログ有効化
DEBUG=* npm run test
```

## テストベストプラクティス

### 1. テスト命名
- **AAA パターン**: Arrange, Act, Assert
- **説明的な名前**: `should_return_error_when_user_not_found`
- **日本語OK**: `ユーザーが見つからない場合はエラーを返す`

### 2. テストの独立性
- テスト間でデータを共有しない
- 各テストで必要なデータを準備
- テスト実行順序に依存しない

### 3. モックの適切な使用
- 外部依存はモック化
- データベースアクセスは統合テストで検証
- モックは最小限に留める

## 継続的品質改善

### 1. テストメトリクス監視
- カバレッジ率の推移
- テスト実行時間の監視
- フレーク率（不安定なテスト）の管理

### 2. テスト改善
- 定期的なテストレビュー
- テストリファクタリング
- テストパフォーマンス最適化

## 関連ドキュメント

- [API仕様書](../architecture/api-specification.md)
- [データベース設計](../database/README.md)
- [デプロイメント戦略](../deployment/strategy.md)

---

**重要**: テストは品質保証の要です。新機能開発時は必ずテストを先に書き（TDD）、継続的にテストを実行して品質を維持してください。