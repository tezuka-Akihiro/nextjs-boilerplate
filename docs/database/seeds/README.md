# 初期データ（Seeds）

## 概要

開発・テスト・デモ用の初期データを管理するディレクトリです。
環境別に適切な初期データを投入し、開発効率を向上させます。

## ファイル命名規則

```
{テーブル名}_seed.sql
```

**例**:
- `users_seed.sql` - ユーザーの初期データ
- `profiles_seed.sql` - プロフィールの初期データ
- `master_data_seed.sql` - マスターデータ

## 環境別データ戦略

### 1. 開発環境（Development）
```sql
-- 開発用テストデータ
-- 多様なパターンのデータを含む
-- デバッグ・動作確認用
```

### 2. テスト環境（Testing）
```sql
-- テスト用データ
-- 自動テストで使用
-- 予測可能なデータセット
```

### 3. ステージング環境（Staging）
```sql
-- 本番類似データ
-- 性能テスト用
-- 本番データの匿名化版
```

### 4. 本番環境（Production）
```sql
-- 最小限の初期データ
-- マスターデータのみ
-- システム管理者アカウント
```

## ファイル構造例

```sql
-- users_seed.sql
-- 開発用ユーザーデータ
-- 作成日: 2024-01-01

-- セーフティチェック
DO $$
BEGIN
    IF (SELECT current_database()) = 'production' THEN
        RAISE EXCEPTION 'Development seeds cannot be run in production';
    END IF;
END $$;

-- 既存データクリア（開発環境のみ）
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- 初期データ投入
BEGIN;

-- 管理者ユーザー
INSERT INTO users (id, auth_id, email, status) VALUES 
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin@example.com', 'active'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'user1@example.com', 'active'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'user2@example.com', 'active');

-- テスト用ユーザー
INSERT INTO users (auth_id, email, status)
SELECT 
    uuid_generate_v4(),
    'test' || generate_series(1, 100) || '@example.com',
    CASE 
        WHEN generate_series(1, 100) % 10 = 0 THEN 'inactive'
        ELSE 'active'
    END;

COMMIT;

-- データ確認
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE status = 'active') as active_users,
    COUNT(*) FILTER (WHERE status = 'inactive') as inactive_users
FROM users;
```

## 実行方法

### 1. 全環境対応スクリプト
```bash
#!/bin/bash
# seed.sh

ENVIRONMENT=${1:-development}

case $ENVIRONMENT in
  development)
    echo "Loading development seeds..."
    psql -f seeds/users_seed.sql
    psql -f seeds/profiles_seed.sql
    ;;
  test)
    echo "Loading test seeds..."
    psql -f seeds/test_users_seed.sql
    ;;
  staging)
    echo "Loading staging seeds..."
    psql -f seeds/staging_seed.sql
    ;;
  production)
    echo "Loading production seeds..."
    psql -f seeds/production_seed.sql
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac
```

### 2. Supabase CLI使用
```bash
# 開発環境
supabase db seed

# カスタムシード実行
supabase db reset --seed-sql seeds/custom_seed.sql
```

## データ生成パターン

### 1. 固定データ
```sql
-- マスターデータ・設定データ
INSERT INTO settings (key, value) VALUES 
    ('app_version', '1.0.0'),
    ('maintenance_mode', 'false'),
    ('max_upload_size', '10MB');
```

### 2. ランダムデータ
```sql
-- ランダムなテストデータ
INSERT INTO posts (user_id, title, content)
SELECT 
    (SELECT id FROM users ORDER BY random() LIMIT 1),
    'Post ' || generate_series(1, 1000),
    'Content for post ' || generate_series(1, 1000);
```

### 3. 階層データ
```sql
-- カテゴリ階層データ
WITH RECURSIVE category_tree AS (
    -- 親カテゴリ
    SELECT 
        uuid_generate_v4() as id,
        'Category ' || generate_series(1, 5) as name,
        NULL::UUID as parent_id,
        1 as level
    
    UNION ALL
    
    -- 子カテゴリ
    SELECT 
        uuid_generate_v4(),
        ct.name || '-' || generate_series(1, 3),
        ct.id,
        ct.level + 1
    FROM category_tree ct
    WHERE ct.level < 3
)
INSERT INTO categories (id, name, parent_id)
SELECT id, name, parent_id FROM category_tree;
```

## 環境別シードファイル例

### development_seed.sql
```sql
-- 開発環境用：豊富なテストデータ
-- パスワード: password123（開発専用）

-- 管理者
INSERT INTO users (email, password_hash) VALUES 
    ('admin@dev.local', '$2b$10$...');

-- 一般ユーザー（多様なパターン）
INSERT INTO users (email, password_hash, status) 
SELECT 
    'user' || i || '@dev.local',
    '$2b$10$...',
    CASE 
        WHEN i % 10 = 0 THEN 'inactive'
        WHEN i % 20 = 0 THEN 'suspended'
        ELSE 'active'
    END
FROM generate_series(1, 500) i;
```

### test_seed.sql
```sql
-- テスト環境用：予測可能なデータ
-- 自動テストで使用

-- 固定ユーザー（IDも固定）
INSERT INTO users (id, email, password_hash) VALUES 
    ('test-user-1', 'test1@example.com', '$2b$10$...'),
    ('test-user-2', 'test2@example.com', '$2b$10$...'),
    ('test-admin', 'admin@example.com', '$2b$10$...');
```

### production_seed.sql
```sql
-- 本番環境用：最小限のデータ
-- セキュリティチェック強化

-- 環境確認
DO $$
BEGIN
    IF (SELECT current_database()) != 'production' THEN
        RAISE EXCEPTION 'Production seeds must run in production database only';
    END IF;
END $$;

-- システム管理者のみ
INSERT INTO users (email, password_hash, role) VALUES 
    ('system-admin@company.com', '$2b$10$...', 'system_admin');
```

## 安全性考慮事項

### 1. 環境チェック
- 本番環境での開発用シード実行防止
- データベース名・環境変数による確認

### 2. データクリア
- 開発環境のみTRUNCATE許可
- 本番環境では追加のみ

### 3. 機密情報
- パスワード：ハッシュ化必須
- 個人情報：ダミーデータ使用
- APIキー：環境変数から取得

## メンテナンス

### 1. データ更新
```sql
-- 既存シードデータの更新
UPDATE users 
SET updated_at = NOW() 
WHERE email LIKE '%@dev.local';
```

### 2. データクリーンアップ
```sql
-- 古いテストデータの削除
DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '30 days';
```

## 関連ドキュメント

- [スキーマ定義](../schema.md)
- [マイグレーション](../migrations/README.md)
- [RLSポリシー](../policies/README.md)

---

**注意**: シードデータは環境に応じて適切に管理し、本番環境には機密情報を含めないよう注意してください。