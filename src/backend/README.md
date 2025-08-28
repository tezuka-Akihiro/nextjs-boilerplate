# backend/README.md

## ドキュメント範囲
- このREADMEは `src/backend/` 配下のAI滑走路4層アーキテクチャの実装ルールを説明
- 範囲外：
  - docs/配下の抽象設計理論
  - フロントエンド実装（app/README.md参照）

## 上位参照
- [バックエンド実装ガイド](../../docs/guides/backend-implementation-guide.md)
- [テンプレート集](../../docs/templates/backend/)

## AI滑走路4層アーキテクチャ構成

### 層構成と依存方向
```
API → Controller → Task → Resource
     ↓
  Response
```

### ディレクトリ構造
```
src/backend/
├── README.md              # このファイル（実装ルール）
├── api/                   # API層（HTTPリクエスト受付）
│   ├── README.md         # API層の実装ルール
│   └── [機能名]/         # 機能別API定義
├── controllers/           # Controller層（ビジネスロジック統合）
│   ├── README.md         # Controller層の実装ルール
│   └── [機能名]/         # 機能別Controller
├── tasks/                 # Task層（単一処理実行）
│   ├── README.md         # Task層の実装ルール
│   └── [機能名]/         # 機能別Task
├── resources/             # Resource層（データアクセス）
│   ├── README.md         # Resource層の実装ルール
│   └── [機能名]/         # 機能別Resource
└── responses/             # Response層（レスポンス形式統一）
    ├── README.md         # Response層の実装ルール
    └── [機能名]/         # 機能別Response
```

### 各層の責務
- **API層**: HTTPリクエスト受付、基本バリデーション
- **Controller層**: ビジネスロジックの統合・調整（複数Task + Response層依存）
- **Task層**: 単一処理の実行（複数Resource層依存）
- **Resource層**: データ・ファイル・外部API等のリソース取得
- **Response層**: レスポンス形式統一、エラーハンドリング

## 実装時必須ルール

### 1. 階層違反の禁止
**禁止事項:**
- ❌ 階層飛び越し（API→Task、Controller→Resource等）
- ❌ 下位層から上位層への依存
- ❌ 複数クラスを1ファイルに配置

**許可事項:**
- ✅ 隣接層への依存のみ
- ✅ 同一階層内での複数利用（Controller→複数Task等）
- ✅ 1ファイル1クラス原則

### 2. 1ファイル1クラス原則
- 各ファイルには1つのクラスのみ配置
- ファイル名とクラス名は一致させる
- 複数クラスの同一ファイル配置禁止

### 3. 必須テンプレート参照
実装前に必ず対応するテンプレートを参照：
- **API層**: `docs/templates/backend/ApiTemplate.ts`
- **Controller層**: `docs/templates/backend/ControllerTemplate.ts`
- **Task層**: `docs/templates/backend/TaskTemplate.ts`
- **Resource層**: `docs/templates/backend/ResourceTemplate.ts`

### 4. 命名規則
- **ファイル名**: PascalCase + 層名
- **API**: `[機能名]Api.ts` (例: AuthApi.ts)
- **Controller**: `[機能名]Controller.ts` (例: AuthController.ts)
- **Task**: `[処理名]Task.ts` (例: ValidateUserTask.ts)
- **Resource**: `[リソース名]Resource.ts` (例: UserResource.ts)
- **Response**: `[機能名]Response.ts` (例: AuthResponse.ts)
- **クラス名**: ファイル名と同一
- **メソッド名**: camelCase

### 5. エラーハンドリング
#### エラー分類と対応方針
1. **バリデーションエラー** (400番台)
   - フォーム入力エラー、必須項目未入力、形式不正等
   - Response層でValidationErrorResponseを返却

2. **認証・認可エラー** (401/403番台)
   - ログイン必須、権限不足、セッション期限切れ等
   - Response層でAuthErrorResponseを返却

3. **ビジネスロジックエラー** (409番台)
   - relationship_status制約違反、重複投稿、状態不整合等
   - Response層でBusinessErrorResponseを返却

4. **システムエラー** (500番台)
   - DB接続エラー、外部API障害、予期しない例外等
   - Response層でSystemErrorResponseを返却

#### エラーログ戦略
- **Task層**: 処理失敗時の詳細ログ（デバッグ情報込み）
- **Controller層**: ビジネスロジック例外の要約ログ

## テスト実装
### TDD実践
- 各層ごとにテストファイルを作成
- テスト境界を明確に保つ
- モック作成を容易にする設計
- **実装はAITDD tsumiki のkairoコマンドやtddコマンドを用いることを厳守**

### Supabase活用
- 認証はSupabase Auth
- データベースはSupabase Database
- リアルタイム機能はSupabase Realtime

### API仕様書記載
各APIクラスの冒頭に以下形式でAPI仕様を記載:
```typescript
/**
 * @api {post} /auth/register ユーザー登録
 * @apiParam {string} email メールアドレス
 * @apiParam {string} password パスワード（8文字以上）
 * @apiParam {string} nickname 表示名（1-50文字）
 * @apiSuccess {object} user 作成されたユーザー情報
 * @apiError {object} error バリデーションエラー詳細
 */
export class AuthApi {
  // APIクラス冒頭に必ず仕様を記載
}
```

## 参照優先度
1. **このREADME** - 実装時必須参照
2. **各層のREADME** - 層固有のルール
3. **テンプレート** - 具体的な実装形式
4. **docs/guides/backend-implementation-guide.md** - 設計思想