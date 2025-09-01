# データベースマイグレーション

## 概要

データベーススキーマの変更履歴を管理するマイグレーションファイルを格納するディレクトリです。

## ファイル命名規則

```
{YYYYMMDD_HHMMSS}_{変更内容}.sql
```

**例**:
- `20240101_120000_create_users_table.sql`
- `20240102_090000_add_profile_settings.sql`
- `20240103_150000_create_audit_logs.sql`

## マイグレーションファイル構造

```sql
-- マイグレーション: {変更内容}
-- 作成日: {YYYY-MM-DD}
-- 作成者: {作成者名}

-- 変更前の確認
DO $$
BEGIN
    -- 前提条件のチェック
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE EXCEPTION 'users table does not exist';
    END IF;
END $$;

-- 変更実行
BEGIN;

-- DDL文
CREATE TABLE example (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_example_created_at ON example(created_at);

-- RLS設定
ALTER TABLE example ENABLE ROW LEVEL SECURITY;

COMMIT;

-- 変更後の確認
DO $$
BEGIN
    -- 変更結果の検証
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'example') THEN
        RAISE EXCEPTION 'Migration failed: example table was not created';
    END IF;
END $$;
```

## マイグレーション実行手順

### 1. 開発環境での検証
```bash
# 1. マイグレーションファイル作成
touch migrations/20240101_120000_create_example.sql

# 2. ローカルテスト
psql -f migrations/20240101_120000_create_example.sql

# 3. 動作確認
npm run test:database
```

### 2. ステージング環境での確認
```bash
# Supabase CLI使用例
supabase db push --include-all
supabase db test
```

### 3. 本番環境への適用
```bash
# 本番適用前バックアップ
supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql

# 本番適用
supabase db push --environment production
```

## ロールバック手順

各マイグレーションファイルには対応するロールバックSQLを含める：

```sql
-- ロールバック用SQL（コメントアウト状態で保持）
/*
-- ROLLBACK: create_example
DROP TABLE IF EXISTS example CASCADE;
DROP INDEX IF EXISTS idx_example_created_at;
*/
```

## マイグレーション管理テーブル

```sql
-- マイグレーション履歴管理
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    applied_by VARCHAR(255) DEFAULT current_user
);
```

## 注意事項

### 1. 安全なマイグレーション
- **データ損失に注意**: DROP文は慎重に
- **バックアップ必須**: 本番適用前は必ずバックアップ
- **段階的適用**: 大きな変更は複数回に分割

### 2. パフォーマンス考慮
- **インデックス作成**: `CONCURRENTLY`オプション使用
- **大量データ**: バッチ処理で分割実行
- **ロック回避**: ALTER TABLE時の注意

### 3. テスト必須項目
- スキーマ変更の検証
- データ整合性の確認
- アプリケーションの動作確認
- RLSポリシーの動作確認

## マイグレーション例

### テーブル作成
```sql
-- 20240101_120000_create_users.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### カラム追加
```sql
-- 20240102_090000_add_user_status.sql
ALTER TABLE users 
ADD COLUMN status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

CREATE INDEX idx_users_status ON users(status);
```

### インデックス追加
```sql
-- 20240103_150000_add_performance_indexes.sql
CREATE INDEX CONCURRENTLY idx_users_email_active 
ON users(email) WHERE status = 'active';
```

## 関連ドキュメント

- [スキーマ定義](../schema.md)
- [RLSポリシー](../policies/README.md)
- [初期データ](../seeds/README.md)

---

**重要**: マイグレーションは不可逆的な操作です。必ず十分なテストを実施し、バックアップを取得してから本番環境に適用してください。