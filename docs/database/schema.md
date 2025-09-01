# データベーススキーマ定義

## 概要

本プロジェクトのデータベーススキーマを定義します。
Supabase（PostgreSQL）を使用し、RLS（行レベルセキュリティ）を活用したセキュアな設計となっています。

## 基本設定

### 拡張機能
```sql
-- UUID生成
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 暗号化機能
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 日時関連
CREATE EXTENSION IF NOT EXISTS "btree_gin";
```

### 共通型定義
```sql
-- カスタム型
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE log_level AS ENUM ('info', 'warning', 'error', 'critical');
```

## テーブル設計

### 1. users（ユーザー基本情報）

**概要**: Supabase Authと連携するユーザー基本情報

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL, -- Supabase Auth ID
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status user_status DEFAULT 'active',
  
  -- インデックス
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- インデックス
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- RLS有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 2. profiles（ユーザープロフィール）

**概要**: ユーザーの詳細情報・設定

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'ja',
  theme VARCHAR(20) DEFAULT 'system',
  notifications JSONB DEFAULT '{"email": true, "push": true}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 制約
  CONSTRAINT profiles_user_id_unique UNIQUE (user_id),
  CONSTRAINT profiles_display_name_length CHECK (LENGTH(display_name) >= 1),
  CONSTRAINT profiles_bio_length CHECK (LENGTH(bio) <= 500)
);

-- インデックス
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_display_name ON profiles(display_name);

-- RLS有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 3. audit_logs（監査ログ）

**概要**: システム操作の監査ログ

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  level log_level DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- インデックス用制約
  CONSTRAINT audit_logs_action_not_empty CHECK (LENGTH(action) > 0),
  CONSTRAINT audit_logs_resource_type_not_empty CHECK (LENGTH(resource_type) > 0)
);

-- インデックス
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_level ON audit_logs(level);

-- RLS有効化
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

## トリガー関数

### 1. 更新日時自動更新
```sql
-- 更新日時自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガー設定
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. 監査ログ自動記録
```sql
-- 監査ログ記録関数
CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
        VALUES (NEW.id, 'CREATE', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
        VALUES (NEW.id, 'UPDATE', TG_TABLE_NAME, NEW.id, 
                jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
        VALUES (OLD.id, 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- トリガー設定
CREATE TRIGGER log_users_changes
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION log_user_changes();

CREATE TRIGGER log_profiles_changes
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_user_changes();
```

## データ関連性

```
users (1) ←→ (1) profiles
users (1) ←→ (N) audit_logs
```

## インデックス戦略

### 主要クエリパターン
1. **ユーザー検索**: email, auth_id
2. **プロフィール取得**: user_id
3. **監査ログ検索**: user_id, action, created_at

### パフォーマンス考慮
- 複合インデックスの順序は選択性の高い順
- 部分インデックスの活用（status = 'active' など）
- JSONB列のGINインデックス

## セキュリティ考慮事項

### 1. データ暗号化
- 機密データは暗号化して格納
- Supabaseの暗号化機能を活用

### 2. RLS（Row Level Security）
- 全テーブルでRLS有効化
- ユーザーは自分のデータのみアクセス可能
- 管理者権限の適切な制御

### 3. 監査ログ
- 重要な操作は全て記録
- 改竄防止のための制御

## 運用考慮事項

### 1. パーティショニング
```sql
-- 監査ログのパーティショニング（月次）
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 2. データ保持期間
- 監査ログ：3年間保持
- 一般データ：無期限（削除要求時のみ削除）

### 3. バックアップ戦略
- 日次自動バックアップ
- 重要変更前の手動バックアップ

## 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|----------|
| v1.0.0    | 2024-01-01 | 初版作成 |

---

**注意**: スキーマ変更は必ずマイグレーションファイルを作成し、適切なテストを実施してから本番環境に適用してください。