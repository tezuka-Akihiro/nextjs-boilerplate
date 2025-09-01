# API仕様書

## 概要

このドキュメントでは、本プロジェクトのAPI仕様について定義します。
AI滑走路4層アーキテクチャに基づいたREST APIエンドポイントの仕様を記載しています。

## 基本情報

- **ベースURL**: `/api/v1`
- **データ形式**: JSON
- **文字エンコーディング**: UTF-8
- **認証方式**: Bearer Token（JWT）

## 共通レスポンス形式

### 成功レスポンス
```json
{
  "success": true,
  "data": {
    // 実際のデータ
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "v1"
  }
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {}
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "v1"
  }
}
```

## HTTPステータスコード

- `200` - OK：成功
- `201` - Created：リソース作成成功
- `400` - Bad Request：リクエストエラー
- `401` - Unauthorized：認証エラー
- `403` - Forbidden：認可エラー
- `404` - Not Found：リソースが見つからない
- `422` - Unprocessable Entity：バリデーションエラー
- `500` - Internal Server Error：サーバーエラー

## APIエンドポイント

### 認証API

#### POST /api/v1/auth/login
ユーザーログイン

**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

#### POST /api/v1/auth/logout
ユーザーログアウト

**ヘッダー**
```
Authorization: Bearer {token}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "message": "ログアウトしました"
  }
}
```

### ユーザーAPI

#### GET /api/v1/users/profile
ユーザープロフィール取得

**ヘッダー**
```
Authorization: Bearer {token}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/v1/users/profile
ユーザープロフィール更新

**ヘッダー**
```
Authorization: Bearer {token}
```

**リクエスト**
```json
{
  "name": "New User Name",
  "email": "new@example.com"
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "new@example.com",
    "name": "New User Name",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

## バリデーションルール

### 共通ルール
- 必須フィールドの空文字チェック
- 文字列長制限チェック
- 形式チェック（メール、URL等）

### ユーザー関連
- **email**: メール形式、最大255文字
- **password**: 最小8文字、英数字記号組み合わせ
- **name**: 最大100文字

## エラーコード一覧

### 認証・認可エラー
- `AUTH_INVALID_CREDENTIALS`: 認証情報が無効
- `AUTH_TOKEN_EXPIRED`: トークンの有効期限切れ
- `AUTH_ACCESS_DENIED`: アクセス権限なし

### バリデーションエラー
- `VALIDATION_REQUIRED`: 必須フィールドが未入力
- `VALIDATION_FORMAT`: 形式が無効
- `VALIDATION_LENGTH`: 文字数制限違反

### システムエラー
- `SYSTEM_DATABASE_ERROR`: データベースエラー
- `SYSTEM_INTERNAL_ERROR`: 内部サーバーエラー

## レート制限

- **一般API**: 1000リクエスト/時間
- **認証API**: 100リクエスト/時間

制限に達した場合は HTTP 429 を返却します。

## 使用例

```bash
# ログイン
curl -X POST /api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# プロフィール取得
curl -X GET /api/v1/users/profile \
  -H "Authorization: Bearer {token}"
```

## 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|----------|
| v1.0.0    | 2024-01-01 | 初版作成 |

---

**注意**: このAPI仕様書は開発中のものです。実装に応じて随時更新してください。