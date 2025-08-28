# 環境設定・デプロイ戦略

## 概要

このプロジェクトは、開発効率とプロダクション品質を両立させるため、複数の環境とデプロイ戦略を採用しています。

## 環境構成

### 1. 開発環境 (Development)

- **用途**: 日常的な開発作業
- **URL**: http://localhost:3000
- **データベース**: ローカルPostgreSQL/Supabase
- **特徴**:
  - ホットリロード
  - 詳細なエラー表示
  - 開発ツール有効

#### セットアップ方法

```bash
# 自動セットアップ
npm run setup

# 手動セットアップ
npm ci
cp .env.example .env.local
# .env.localを編集して環境変数を設定
npm run dev
```

#### Docker環境

```bash
# Docker環境起動
npm run docker:dev

# サービス確認
# - アプリ: http://localhost:3000
# - pgAdmin: http://localhost:5050
# - RedisInsight: http://localhost:8001
```

### 2. ステージング環境 (Staging)

- **用途**: 本番環境のテスト
- **URL**: https://your-app-staging.vercel.app
- **データベース**: Supabase Staging
- **デプロイトリガー**: `develop`ブランチへのpush

---

## 🔐 GitHub Secrets設定

### 必須設定項目

#### Supabase関連
```
SUPABASE_URL
例: https://your-project-id.supabase.co

SUPABASE_ANON_KEY  
例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_SERVICE_ROLE_KEY
例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
⚠️ 管理者権限キー・本番環境のみ使用

SUPABASE_JWT_SECRET
例: your-jwt-secret-key-here
```

#### Vercel関連
```
VERCEL_TOKEN
例: your-vercel-token-here
説明: Vercel APIアクセス用トークン

VERCEL_ORG_ID
例: your-org-id-here
説明: Vercel組織ID

VERCEL_PROJECT_ID
例: your-project-id-here
説明: Vercelプロジェクト ID
```

#### 認証・セキュリティ
```
NEXTAUTH_SECRET
例: your-nextauth-secret-32-characters-long
説明: Next.js認証用シークレット（32文字以上推奨）

NEXTAUTH_URL
例: https://your-domain.vercel.app
説明: 本番環境URL
```

### 🎯 Vercel環境変数設定

#### 必須環境変数
```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 認証設定
NEXTAUTH_SECRET=your-nextauth-secret-32-characters-long
NEXTAUTH_URL=https://your-domain.vercel.app

# 本番環境フラグ
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
```

#### 環境別設定

**Production環境:**
```bash
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_API_MONITORING=true
VERCEL_ENV=production
```

**Preview環境（PRブランチ用）:**
```bash
NEXT_PUBLIC_APP_ENV=preview
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_API_MONITORING=true
VERCEL_ENV=preview
```

**Development環境:**
```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_API_MONITORING=false
VERCEL_ENV=development
```

### 📋 設定チェックリスト

#### GitHub Secrets設定確認
- [ ] `SUPABASE_URL` - Supabase プロジェクトURL
- [ ] `SUPABASE_ANON_KEY` - 公開キー  
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - サービスロールキー
- [ ] `SUPABASE_JWT_SECRET` - JWT シークレット
- [ ] `VERCEL_TOKEN` - Vercel APIトークン
- [ ] `VERCEL_ORG_ID` - Vercel 組織ID
- [ ] `VERCEL_PROJECT_ID` - Vercel プロジェクトID
- [ ] `NEXTAUTH_SECRET` - 認証シークレット
- [ ] `NEXTAUTH_URL` - 本番環境URL

#### Vercel環境変数設定確認
- [ ] Production環境に全必須変数設定済み
- [ ] Preview環境に開発用変数設定済み
- [ ] Development環境にローカル用変数設定済み
- [ ] 公開変数に `NEXT_PUBLIC_` プレフィックス付与
- [ ] 秘匿変数は非公開設定

### 🔧 設定コマンド例

#### GitHub CLI使用例
```bash
# GitHub Secretsを一括設定（GitHub CLI必要）
gh secret set SUPABASE_URL -b "https://your-project-id.supabase.co"
gh secret set SUPABASE_ANON_KEY -b "your-anon-key"
gh secret set SUPABASE_SERVICE_ROLE_KEY -b "your-service-role-key"
gh secret set NEXTAUTH_SECRET -b "your-nextauth-secret"
```

#### Vercel CLI使用例
```bash
# Vercel環境変数設定
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production  
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXTAUTH_SECRET production
```

### ⚠️ 重要な注意事項

1. **キーローテーション**: 定期的にキーを更新（3-6ヶ月推奨）
2. **権限最小化**: 必要最小限の権限のみ付与
3. **環境分離**: 本番・開発環境で異なるキー使用
4. **バックアップ**: キーのセキュアなバックアップ保管
5. **監査**: 定期的なアクセスログ確認
6. **漏洩対応**: キー漏洩時の即座の無効化・再発行手順準備

### 🚨 緊急時対応

#### キー漏洩時の対応手順
1. **即座の無効化**: Supabase・Vercel管理画面でキー無効化
2. **新キー発行**: 新しいキーを発行
3. **再設定**: GitHub Secrets・Vercel環境変数を更新
4. **再デプロイ**: 本番環境の即座の再デプロイ
5. **監査**: アクセスログの確認・影響範囲調査

### 3. 本番環境 (Production)

- **用途**: エンドユーザー向けサービス
- **URL**: https://your-app.vercel.app
- **データベース**: Supabase Production
- **デプロイトリガー**: `main`ブランチへのpush

## デプロイメント戦略

### GitFlow

```
main (本番)
├── develop (ステージング)
└── feature/* (機能開発)
```

### CI/CDパイプライン

#### 自動チェック（GitHub Actions）

1. **品質チェック**（`.github/workflows/quality-check.yml`）
   - TypeScript型チェック
   - ESLint + Prettier
   - セキュリティ監査（npm audit）
   - バンドル分析
   - AI滑走路4層アーキテクチャ準拠チェック
   - ドキュメント整合性確認

2. **テスト実行**
   - ユニットテスト
   - 統合テスト
   - カバレッジ計測

3. **デプロイメント**（`.github/workflows/deploy.yml`）
   - 本番ビルドテスト
   - プレビューデプロイ（PR）
   - 本番デプロイ（main merge）
   - ヘルスチェック・監視開始

#### デプロイフロー

```mermaid
graph LR
    A[PR作成] --> B[自動テスト]
    B --> C[Preview デプロイ]
    C --> D[レビュー]
    D --> E[develop マージ]
    E --> F[Staging デプロイ]
    F --> G[本番向けPR]
    G --> H[main マージ]
    H --> I[Production デプロイ]
```

## 環境変数管理

### ローカル環境

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_local_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_supabase_key
```

### Vercel環境

```bash
# Production環境
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Staging環境
vercel env add STAGING_SUPABASE_URL
vercel env add STAGING_SUPABASE_ANON_KEY
```

### GitHub Secrets

**必須シークレット**（本番デプロイ用）：

#### Supabase関連
- `SUPABASE_URL` - Supabase プロジェクトURL
- `SUPABASE_ANON_KEY` - 公開キー  
- `SUPABASE_SERVICE_ROLE_KEY` - サービスロールキー（本番のみ）
- `SUPABASE_JWT_SECRET` - JWT シークレット

#### Vercel関連
- `VERCEL_TOKEN` - Vercel APIトークン
- `VERCEL_ORG_ID` - Vercel 組織ID
- `VERCEL_PROJECT_ID` - Vercel プロジェクトID

#### 認証・セキュリティ
- `NEXTAUTH_SECRET` - 認証シークレット（32文字以上）
- `NEXTAUTH_URL` - 本番環境URL

#### 監視・外部サービス（オプション）
- `SLACK_WEBHOOK_URL` - エラー通知用
- `SENTRY_DSN` - エラー監視用

**詳細設定方法**: `docs/deployment/github-secrets-setup.md` 参照

## コード品質管理

### 自動化ツール

1. **Husky**: Git Hooks
2. **lint-staged**: ステージされたファイルのリント
3. **Prettier**: コードフォーマット
4. **ESLint**: コード品質チェック

### コミット時の自動チェック

```bash
# pre-commit hook で実行
npm run lint
npm run format
npm run type-check
```

## モニタリング・ログ

### 開発環境

- Next.js開発サーバーログ
- ブラウザコンソール

### 本番環境

- **Vercel Analytics**: ユーザー行動・パフォーマンス分析
- **Vercel Speed Insights**: Core Web Vitals監視
- **API監視**: カスタム監視ダッシュボード（`api_metrics`テーブル）
- **Vercel Functions Logs**: サーバーレス関数ログ
- **Supabase Logs**: データベース・認証ログ
- **Cron Jobs**: バックアップ・ヘルスチェック・メトリクス集計

## パフォーマンス最適化

### ビルド最適化

1. **Next.js設定**
   - `output: 'standalone'` で軽量化
   - 画像最適化有効
   - TypedRoutes使用

2. **Bundle分析**
   ```bash
   npm run analyze
   ```

### キャッシュ戦略

- **静的ファイル**: CDN
- **APIレスポンス**: Redis
- **画像**: Next.js Image Optimization

## 障害対応

### ロールバック手順

1. **即座のロールバック**
   ```bash
   vercel rollback [deployment-url]
   ```

2. **コードレベルのロールバック**
   ```bash
   git revert [commit-hash]
   git push origin main
   ```

### 緊急時の対応

1. Vercelダッシュボードから即座にロールバック
2. Supabaseダッシュボードでデータベース確認
3. GitHub Actionsで再デプロイ実行

## セキュリティ

### 本番環境

- **HTTPS強制**: Strict-Transport-Security設定
- **セキュリティヘッダー**: CSP・X-Frame-Options・X-XSS-Protection等（`vercel.json`設定）
- **環境変数管理**: GitHub Secrets + Vercel環境変数による秘匿情報保護
- **アクセス制御**: Supabase Row Level Security (RLS)
- **定期的なセキュリティ監査**: GitHub Actions依存関係スキャン
- **キーローテーション**: 3-6ヶ月での定期的なキー更新

### 開発環境

- 本番データの使用禁止
- ダミーデータでの開発
- `.env.local`のgit除外

---

## 🎯 推奨開発ワークフロー

### 機能開発フロー
```bash
# 1. 機能開発
git checkout -b feature/new-function
# 開発作業...
git push origin feature/new-function

# 2. Preview環境で確認
# → Vercelが自動生成したURLで確認
# 3. PR作成・レビュー
# → GitHub でPR作成

# 4. 本番デプロイ
git checkout main
git merge feature/new-function
git push origin main
# → 自動で本番環境に反映
```

### ブランチ戦略
- **main**: 本番環境（自動デプロイ）
- **develop**: 開発統合ブランチ（Preview環境）
- **feature/**: 機能開発ブランチ（個別Preview環境）
- **hotfix/**: 緊急修正ブランチ（優先デプロイ）

### CI/CDパイプライン実行タイミング
- **PR作成時**: 品質チェック + テスト実行
- **main push時**: 品質チェック + テスト + 本番デプロイ
- **feature push時**: Preview環境デプロイ

### 環境確認・デバッグフロー
1. **ローカル開発**: `npm run dev` (localhost:3001)
2. **Preview確認**: Vercel自動生成URL
3. **本番確認**: your-app.vercel.app
4. **監視確認**: Vercel Analytics + Sentry Dashboard

---

## 🚀 高度なデプロイメント戦略統合

### GitHub Secrets・環境変数管理
- **セキュリティ第一**: Supabase Service Role Keyは本番環境のみ使用
- **環境分離**: 開発・プレビュー・本番で異なるキー・設定使用
- **自動化**: GitHub Actions CI/CDによる品質チェック・デプロイ自動化
- **監視統合**: Vercel Analytics・Speed Insights・カスタム監視の統合

### CI/CDパイプライン設計
```
PR作成 → 品質チェック → テスト → プレビューデプロイ → レビュー
main merge → 品質チェック → テスト → 本番デプロイ → ヘルスチェック → 監視開始
```

### 品質・セキュリティ管理
- **コード品質**: ESLint・TypeScript・Prettier・バンドル分析
- **セキュリティ**: 依存関係監査・脆弱性スキャン・セキュリティヘッダー
- **アーキテクチャ準拠**: AI滑走路4層構成・ディレクトリ構造・テンプレート準拠チェック
- **ドキュメント整合性**: 要件定義・API仕様・データベース設計の一貫性確認

### 環境別設定戦略
- **本番環境**: 監視・分析有効、デバッグ無効、パフォーマンス最適化
- **プレビュー環境**: 開発者向け監視有効、デバッグ有効
- **開発環境**: フル開発ツール、モック機能、高速ビルド

---

## 今後の改善計画

1. **E2Eテスト自動化**: Playwright導入完了後
2. **パフォーマンステスト**: Lighthouse CI
3. **アラート設定**: エラー率・レスポンス時間監視
4. **A/Bテスト基盤**: 機能フラグ管理