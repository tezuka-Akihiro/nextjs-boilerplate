# RLS（Row Level Security）ポリシー

## 概要

Supabaseの行レベルセキュリティ（RLS）ポリシーを管理するディレクトリです。
テーブル単位でアクセス制御を実装し、セキュアなデータアクセスを実現します。

## ファイル命名規則

```
{テーブル名}_policies.sql
```

**例**:
- `users_policies.sql` - usersテーブルのRLSポリシー
- `profiles_policies.sql` - profilesテーブルのRLSポリシー
- `audit_logs_policies.sql` - audit_logsテーブルのRLSポリシー

## RLSポリシー基本構造

```sql
-- テーブル名: users
-- RLSポリシー定義
-- 作成日: 2024-01-01

-- RLS有効化確認
DO $$
BEGIN
    IF NOT (SELECT row_security FROM pg_tables WHERE tablename = 'users') THEN
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 既存ポリシー削除（再適用時）
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;

-- SELECT ポリシー
CREATE POLICY "users_select_policy" ON users
    FOR SELECT
    USING (
        auth.uid()::UUID = auth_id OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid()::UUID 
            AND status = 'admin'
        )
    );

-- INSERT ポリシー
CREATE POLICY "users_insert_policy" ON users
    FOR INSERT
    WITH CHECK (auth.uid()::UUID = auth_id);

-- UPDATE ポリシー
CREATE POLICY "users_update_policy" ON users
    FOR UPDATE
    USING (auth.uid()::UUID = auth_id)
    WITH CHECK (auth.uid()::UUID = auth_id);

-- DELETE ポリシー
CREATE POLICY "users_delete_policy" ON users
    FOR DELETE
    USING (
        auth.uid()::UUID = auth_id OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid()::UUID 
            AND status = 'admin'
        )
    );
```

## ポリシーパターン

### 1. 自分のデータのみアクセス
```sql
-- ユーザーは自分のプロフィールのみアクセス可能
CREATE POLICY "profiles_own_data" ON profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = profiles.user_id 
            AND users.auth_id = auth.uid()::UUID
        )
    );
```

### 2. 管理者権限
```sql
-- 管理者は全データアクセス可能
CREATE POLICY "admin_full_access" ON users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid()::UUID 
            AND status = 'admin'
        ) OR
        auth.uid()::UUID = auth_id
    );
```

### 3. 読み取り専用
```sql
-- パブリックデータは読み取りのみ
CREATE POLICY "public_read_only" ON public_content
    FOR SELECT
    USING (status = 'published');
```

### 4. 時間制限
```sql
-- 作成から24時間以内のみ編集可能
CREATE POLICY "edit_time_limit" ON posts
    FOR UPDATE
    USING (
        created_by = auth.uid()::UUID AND
        created_at > NOW() - INTERVAL '24 hours'
    );
```

### 5. 階層アクセス
```sql
-- 組織階層に基づくアクセス制御
CREATE POLICY "organization_hierarchy" ON documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations uo
            JOIN organization_hierarchy oh ON uo.org_id = oh.parent_id
            WHERE uo.user_id = auth.uid()::UUID
            AND oh.child_id = documents.org_id
        )
    );
```

## テーブル別ポリシー例

### users_policies.sql
```sql
-- ユーザーテーブルのRLSポリシー

-- RLS有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 自分の情報は全操作可能
CREATE POLICY "users_own_data" ON users
    FOR ALL
    USING (auth.uid()::UUID = auth_id);

-- 管理者は全ユーザーにアクセス可能
CREATE POLICY "users_admin_access" ON users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid()::UUID 
            AND status = 'admin'
        )
    );

-- 一般ユーザーは他のアクティブユーザーの基本情報のみ参照可能
CREATE POLICY "users_public_read" ON users
    FOR SELECT
    USING (
        status = 'active' AND
        auth.uid() IS NOT NULL
    );
```

### profiles_policies.sql
```sql
-- プロフィールテーブルのRLSポリシー

-- RLS有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 自分のプロフィールは全操作可能
CREATE POLICY "profiles_own_data" ON profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = profiles.user_id 
            AND users.auth_id = auth.uid()::UUID
        )
    );

-- 他のユーザーのプロフィールは参照のみ
CREATE POLICY "profiles_public_read" ON profiles
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = profiles.user_id 
            AND users.status = 'active'
        )
    );
```

### audit_logs_policies.sql
```sql
-- 監査ログテーブルのRLSポリシー

-- RLS有効化
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 自分の操作ログのみ参照可能
CREATE POLICY "audit_logs_own_logs" ON audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = audit_logs.user_id 
            AND users.auth_id = auth.uid()::UUID
        )
    );

-- 管理者は全ログにアクセス可能
CREATE POLICY "audit_logs_admin_access" ON audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid()::UUID 
            AND status = 'admin'
        )
    );

-- システムによる自動挿入のみ許可
CREATE POLICY "audit_logs_system_insert" ON audit_logs
    FOR INSERT
    WITH CHECK (true); -- トリガー経由のみ想定
```

## セキュリティベストプラクティス

### 1. 最小権限の原則
```sql
-- 必要最小限のアクセス権限のみ付与
CREATE POLICY "minimal_access" ON sensitive_data
    FOR SELECT
    USING (
        owner_id = auth.uid()::UUID AND
        status = 'active' AND
        expires_at > NOW()
    );
```

### 2. 多層防御
```sql
-- アプリケーション層とDB層の両方で制御
CREATE POLICY "defense_in_depth" ON financial_data
    FOR SELECT
    USING (
        -- DB層での制御
        owner_id = auth.uid()::UUID AND
        -- アプリケーション層での追加検証が必要
        verification_status = 'verified'
    );
```

### 3. 監査ログ
```sql
-- 重要な操作は全て記録
CREATE POLICY "audit_all_changes" ON critical_data
    FOR ALL
    USING (
        -- 操作ログ記録後のみ許可
        EXISTS (
            SELECT 1 FROM audit_logs 
            WHERE resource_id = critical_data.id 
            AND created_at > NOW() - INTERVAL '1 minute'
        ) OR
        owner_id = auth.uid()::UUID
    );
```

## テスト方法

### 1. ポリシーテスト
```sql
-- テストユーザーでのアクセス確認
SET LOCAL "request.jwt.claims" TO '{"sub": "test-user-id"}';

-- 正常なアクセス
SELECT * FROM users WHERE auth_id = 'test-user-id'; -- 成功すべき

-- 不正なアクセス
SELECT * FROM users WHERE auth_id != 'test-user-id'; -- 失敗すべき
```

### 2. 自動テスト
```sql
-- RLSテスト関数
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE(test_name TEXT, result BOOLEAN, message TEXT) AS $$
BEGIN
    -- テストケース1: 自分のデータアクセス
    RETURN QUERY
    SELECT 
        'Own data access'::TEXT,
        EXISTS(SELECT 1 FROM users WHERE auth_id = auth.uid()::UUID),
        'User can access own data'::TEXT;
    
    -- テストケース2: 他人のデータアクセス
    RETURN QUERY
    SELECT 
        'Others data access'::TEXT,
        NOT EXISTS(SELECT 1 FROM users WHERE auth_id != auth.uid()::UUID),
        'User cannot access others data'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 運用監視

### 1. ポリシー違反検出
```sql
-- ポリシー違反ログ
CREATE TABLE policy_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    table_name TEXT,
    operation TEXT,
    attempted_at TIMESTAMPTZ DEFAULT NOW(),
    details JSONB
);
```

### 2. パフォーマンス監視
```sql
-- 重いポリシーの検出
SELECT 
    schemaname,
    tablename,
    policyname,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size
FROM pg_policies
WHERE qual LIKE '%EXISTS%' -- EXISTS句を使用するポリシー
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 関連ドキュメント

- [スキーマ定義](../schema.md)
- [マイグレーション](../migrations/README.md)
- [初期データ](../seeds/README.md)

---

**重要**: RLSポリシーはセキュリティの要です。変更前には必ず十分なテストを実施し、セキュリティレビューを受けてください。