# projectname システムアーキテクチャ図

## 🏗️ 全体システム構成

### システム全体図
```
┌─────────────────────────────────────────────────────────────────┐
│                        📱 Client Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 15 (App Router) + TypeScript + Tailwind CSS          │
│                      🎯 SPA Architecture                       │
│                                                                 │
│  🖥️ Frontend SPA Services (src/app/)                           │
│  ├── status/                  # 男磨き積み上げSPA                │
│  ├── social/                  # 男磨きSNSSPA                    │
│  ├── components/              # セクション別コンポーネント        │
│  └── hooks/                   # SPA状態管理フック               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTPS API Calls
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🌐 API Gateway Layer                       │
├─────────────────────────────────────────────────────────────────┤
│                    Next.js API Routes                          │
│                                                                 │
│  🔌 API Layer (src/backend/api/) - SPA統合エンドポイント        │
│  ├── StatusDashboardApi.ts   # 積み上げSPA用統合API              │
│  ├── SocialDashboardApi.ts   # SNSSPA用統合API                  │
│  ├── RealtimeApi.ts          # WebSocketリアルタイム             │
│  └── SharedDataApi.ts        # SPA間共有データAPI               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP Request/Response
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   🎯 Business Logic Layer                       │
│                   AI滑走路4層アーキテクチャ                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 Controller Layer (src/backend/controllers/) - SPA統合制御   │
│  ├── StatusDashboardController.ts  # 積み上げSPA統合制御         │
│  ├── SocialDashboardController.ts  # SNSSPA統合制御             │
│  └── RealtimeSyncController.ts     # SPA間リアルタイム同期       │
│                                                                 │
│                                 │                               │
│                                 ▼                               │
│                                                                 │
│  ⚙️ Task Layer (src/backend/tasks/)                             │
│  ├── CreateUserTask.ts      # ユーザー作成処理                   │
│  ├── ValidateUserTask.ts    # ユーザー検証処理                   │
│  ├── CreatePostTask.ts      # 投稿作成処理                       │
│  ├── UpdateUserStatusTask.ts # ステータス更新処理               │
│  ├── CalculateExperienceTask.ts # 経験値計算処理                │
│  └── ProcessGirlfriendGetTask.ts # 彼女GET特別処理              │
│                                                                 │
│                                 │                               │
│                                 ▼                               │
│                                                                 │
│  🗄️ Resource Layer (src/backend/resources/)                     │
│  ├── UserResource.ts        # ユーザーデータアクセス             │
│  ├── PostResource.ts        # 投稿データアクセス                 │
│  ├── DailyCountResource.ts  # 日次カウントデータアクセス          │
│  ├── PresetCommentResource.ts # 定型コメントデータアクセス          │
│  └── ErrorLogResource.ts    # エラーログデータアクセス           │
│                                                                 │
│  📤 Response Layer (src/backend/responses/)                     │
│  ├── AuthResponse.ts        # 認証レスポンス統一                 │
│  ├── UserResponse.ts        # ユーザーレスポンス統一             │
│  ├── PostResponse.ts        # 投稿レスポンス統一                 │
│  └── ErrorResponse.ts       # エラーレスポンス統一               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ SQL Queries
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     🗄️ Data Layer                               │
├─────────────────────────────────────────────────────────────────┤
│                       Supabase                                 │
│                                                                 │
│  🔐 Supabase Auth        🗄️ PostgreSQL Database                 │
│  ├── ユーザー認証         ├── users (ユーザー情報)                 │
│  ├── セッション管理       ├── posts (投稿基本情報)                 │
│  └── JWTトークン         ├── self_investment_posts (自己投資)      │
│                         ├── date_posts (デート投稿)               │
│                         ├── habit_declaration_posts (習慣宣言)   │
│                         ├── girlfriend_get_posts (彼女GET)       │
│                         ├── daily_counts (日次カウント)           │
│                         ├── preset_comments (定型コメント)        │
│                         ├── preset_comment_types (定型コメント種別) │
│                         ├── daily_comment_limits (制限管理)       │
│                         ├── error_logs (エラーログ)               │
│                         └── girlfriend_get_error_logs (特別監視) │
│                                                                 │
│  📊 Supabase Realtime   🎯 Row Level Security (RLS)             │
│  ├── リアルタイム更新     ├── ユーザー別アクセス制御                │
│  └── 購読型データ配信     └── セキュアなデータ保護                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 データフロー図

### 1. 通常投稿フロー
```
User Action → Frontend → API → Controller → Task → Resource → Database
    │                                                              │
    └──────────── Response ← Response ← Task ← Controller ←────────┘
```

### 2. SPA統合ダッシュボードフロー
```
User Action (SPA内操作) → Frontend Dashboard Section
            │
            ▼
   SPA Dashboard API (セクション別統合データ取得)
            │
            ▼
  DashboardController (複数セクションデータ統合)
            │
            ▼
   ┌─ GetDashboardDataTask (全セクション情報)
   ├─ UpdateSectionDataTask (リアルタイム更新)
   ├─ SyncBetweenSectionsTask (セクション間同期)
   └─ BroadcastToSectionsTask (状態変更通知)
            │
            ▼
   ┌─ StatusResource (習慣・期日・ストリーム)
   ├─ SocialResource (投稿・SNS・定型コメント)
   ├─ UserResource (ユーザー情報・認証インフラ)
   └─ RealtimeResource (WebSocket同期)
            │
            ▼
     Database + WebSocket
            │
            ▼
   Unified Dashboard Response → SPA Sections → User
```

## 🏗️ 層間依存関係図

### AI滑走路4層アーキテクチャ
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   API Layer │───▶│ Controller   │───▶│  Task Layer  │───▶│ Resource     │
│             │    │   Layer      │    │              │    │   Layer      │
│ HTTP Request│    │ Business     │    │ Single Unit  │    │ Data Access  │
│ Validation  │    │ Integration  │    │ Processing   │    │ External API │
│ Basic Auth  │    │ Orchestration│    │              │    │              │
└─────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                  │                  │                  │
       │                  ▼                  ▼                  │
       │            ┌──────────────┐                           │
       └───────────▶│  Response    │◀──────────────────────────┘
                    │   Layer      │
                    │ Unified      │
                    │ Error Handle │
                    │ Format       │
                    └──────────────┘
```

### 依存ルール（厳格）
- ✅ **隣接層のみ依存可**: API → Controller → Task → Resource
- ✅ **Response層はどの層からでも利用可**: 統一レスポンス形式
- ❌ **階層飛び越し禁止**: API → Task、Controller → Resource 等
- ❌ **下位層から上位層への依存禁止**: Resource → Task 等

## 🔒 セキュリティアーキテクチャ

### 認証・認可フロー
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Browser   │───▶│   Next.js    │───▶│  Supabase    │───▶│ PostgreSQL   │
│             │    │   Frontend   │    │    Auth      │    │   Database   │
│ Login Form  │    │              │    │              │    │              │
└─────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                  │                  │                  │
       │                  ▼                  ▼                  ▼
       │            ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
       └───────────▶│ JWT Token    │───▶│ RLS Policies │───▶│ Row Level    │
                    │ Validation   │    │ Enforcement  │    │ Security     │
                    │              │    │              │    │              │
                    └──────────────┘    └──────────────┘    └──────────────┘
```

### Row Level Security (RLS) 構成
```sql
-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can only access own data" ON users
  FOR ALL USING (auth.uid() = id);

-- 投稿は全ユーザー閲覧可、自分の投稿のみ編集可
CREATE POLICY "All users can view posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can only edit own posts" ON posts  
  FOR UPDATE USING (auth.uid() = user_id);
```

## 🌐 デプロイメントアーキテクチャ

### 本番環境構成
```
┌─────────────────────────────────────────────────────────────────┐
│                          🌍 Internet                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       🚀 Vercel CDN                            │
│  ├── Static Assets Caching                                     │
│  ├── Edge Functions                                            │
│  └── Global Distribution                                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     🖥️ Vercel Platform                          │
│  ├── Next.js Application Server                                │
│  ├── API Routes                                                │
│  ├── Server-Side Rendering                                     │
│  └── Environment Variables                                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🔧 Supabase Cloud                         │
│  ├── 🔐 Authentication Infrastructure                           │
│  ├── 🗄️ PostgreSQL Database                                     │
│  ├── 📊 Realtime Service                                        │
│  ├── 📁 Storage Service                                         │
│  └── 🔍 Edge Functions                                          │
└─────────────────────────────────────────────────────────────────┘
```

### 開発環境構成
```
┌─────────────────┐    ┌──────────────┐    ┌──────────────┐
│  Local Machine  │───▶│   Next.js    │───▶│  Supabase    │
│                 │    │   Dev Server │    │  Local       │
│ npm run dev     │    │ localhost:3000│    │ Docker       │
│                 │    │              │    │              │
└─────────────────┘    └──────────────┘    └──────────────┘
```

## 📊 パフォーマンス設計

### レスポンス時間目標
| 操作 | 目標時間 | 最大許容 |
|------|----------|----------|
| ページ読み込み | < 1秒 | 3秒 |
| API レスポンス | < 500ms | 2秒 |
| DB クエリ | < 100ms | 500ms |
| 彼女GET投稿 | < 2秒 | 5秒 |

### キャッシュ戦略
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   Browser   │───▶│   Vercel     │───▶│  Supabase    │
│             │    │     CDN      │    │    Cache     │
│ Local Cache │    │ Edge Cache   │    │ Query Cache  │
│ 5min TTL    │    │ 1hour TTL    │    │ 1min TTL     │
└─────────────┘    └──────────────┘    └──────────────┘
```

## 🔍 監視・ログアーキテクチャ

### エラー監視フロー
```
Application Error → Error Boundary → Error Log Resource → Database
                        │                                      │
                        ▼                                      ▼
                 Console Logging                        Structured Log
                        │                                      │
                        ▼                                      ▼
                  Development                            Production
                   Debug Info                           Analysis Data
```

### 監視対象
- **API レスポンス時間**: 各エンドポイント
- **データベース性能**: クエリ実行時間
- **エラー率**: 層別・機能別
- **ユーザー行動**: 投稿・定型コメント・セッション
- **彼女GET投稿監視**: 特別な重要度で監視

## 🔧 開発・テスト戦略

### テスト構成
```
┌─────────────────────────────────────────────────────────────────┐
│                          Test Pyramid                          │
├─────────────────────────────────────────────────────────────────┤
│  🔺 E2E Tests (少数・高価値)                                       │
│     ├── ユーザーフロー全体テスト                                   │
│     ├── 彼女GET投稿フロー                                         │
│     └── 認証フロー                                               │
│                                                                 │
│  🔷 Integration Tests (中程度)                                   │
│     ├── API + Database 統合テスト                                │
│     ├── Controller + Task 統合テスト                             │
│     └── Frontend + API 統合テスト                                │
│                                                                 │
│  🔳 Unit Tests (多数・高速)                                       │
│     ├── Task Layer 単体テスト                                    │
│     ├── Resource Layer 単体テスト                                │
│     ├── Component 単体テスト                                     │
│     └── Utility Function テスト                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📝 実装指針

### 1. **MVP SPA実装アプローチ**
```
MVP: Core Backend + 統合SPA (習慣記録・投稿・定型コメント統合)
- SPA統合API + Database + 認証インフラ
- 習慣記録・投稿機能統合
- 基本的な定型コメント機能

範囲外 (Out of Scope):
- 高度なリアルタイム同期
- SPA間連携機能
- 複雑な状態共有
```

### 2. **SPA対応コード組織・命名規則**
```
src/
├── backend/
│   ├── api/          # {Service}DashboardApi.ts
│   ├── controllers/  # {Service}DashboardController.ts  
│   ├── tasks/        # {Action}{Entity}Task.ts
│   ├── resources/    # {Entity}Resource.ts
│   └── responses/    # {Service}DashboardResponse.ts
├── app/              # フロントエンドSPA
│   ├── status/       # 積み上げSPA
│   ├── social/       # SNS SPA
│   ├── auth/         # 認証画面
│   ├── components/   # 共通コンポーネント
│   └── test/         # テストディレクトリ
├── hooks/            # use{Service}Dashboard.ts
├── lib/              # Supabaseクライアント等
└── shared/
    ├── config/       # 設定ファイル
    └── types/        # 型定義
```

### 3. **SPA開発フロー**
1. **SPA設計** → **セクション定義** → **統合API仕様**
2. **Resource実装** → **Task実装** → **DashboardController実装** → **API実装**
3. **単体テスト** → **セクション統合テスト** → **SPA E2Eテスト**
4. **SPA実装** → **セクション間連携** → **リアルタイム同期確認**

---

このアーキテクチャ図により、開発チーム全体が同じ理解を持ってプロジェクトを進められます。