# Scripts Directory

## setup-vercel-env.sh

Vercel環境変数を一括設定するスクリプトです。

### 使用方法

```bash
# スクリプト実行
./scripts/setup-vercel-env.sh

# または直接実行
bash scripts/setup-vercel-env.sh
```

### 前提条件

1. **Vercel CLI インストール**
   ```bash
   npm install -g vercel
   ```

2. **Vercel ログイン**
   ```bash
   vercel login
   ```

3. **プロジェクト初期化**（未実行の場合）
   ```bash
   vercel --confirm
   ```

4. **環境変数ファイル**
   - `.env.local` が適切に設定されていること

### 設定される環境変数

#### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

#### Next.js
- `NODE_ENV`
- `NEXT_PUBLIC_APP_ENV`
- `SKIP_ENV_VALIDATION`

#### Analytics & Monitoring
- `NEXT_PUBLIC_VERCEL_ANALYTICS`
- `NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS`
- `NEXT_PUBLIC_API_MONITORING`
- `NEXT_PUBLIC_PERFORMANCE_TRACKING`
- `NEXT_PUBLIC_DEBUG_MODE`

### 対象環境

- **production**: 本番環境
- **preview**: プレビュー環境（PR）
- **development**: 開発環境

### トラブルシューティング

#### エラー: Vercel CLI にログインしていません
```bash
vercel login
```

#### エラー: プロジェクトが見つかりません
```bash
vercel --confirm
```

#### 環境変数の確認
```bash
vercel env ls
```

#### 特定の環境変数を削除
```bash
vercel env rm VARIABLE_NAME production
```