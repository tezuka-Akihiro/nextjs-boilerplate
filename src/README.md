# src/README.md

## ドキュメント範囲
- このREADMEは `src/` 配下の全体的なディレクトリ構造とルールを説明
- 範囲外：
  - docs/配下の抽象設計情報
  - 個別フォルダ内の詳細実装ルール（各フォルダのREADME参照）

## 上位参照
- [CLAUDE.md](../CLAUDE.md) - プロジェクト全体の開発指示書
- [プロジェクト概要](../docs/project/project-overview.md)

## アーキテクチャ概要
- **1サービス1SPA設計** - フロントエンドコア設計原則 (app/README.md参照)
- **AI滑走路4層バックエンド** - バックエンドコア設計原則 (backend/README.md参照)

## デザインシステム
- [ブランドアイデンティティ](../docs/guides/brand-identity.md) - カラー・タイポグラフィ・ビジュアルシステム
- [デザインアーキテクチャ](../docs/guides/design-architecture.md) - デザインシステム管理手法

## ディレクトリ構造

### 全体構成
```
src/
├── page.tsx                  # アプリ統合ルートページ
├── global.css                # 全体スタイルシート
├── layout.tsx                # 全体レイアウト設定
├── app/                      # フロントエンドSPA群
│   ├── {service}/            # サービス
│   │   ├── page.tsx          # サービスメインページ
│   │   └── {section}/        # セクション別コンポーネント
│   │       └── section.tsx   # セクション実装
│   ├── components/           # 共通コンポーネント
│   └── test/                 # テストディレクトリ
├── backend/                  # バックエンド4層アーキテクチャ
├── hooks/                    # SPA状態管理フック
├── lib/                      # Supabaseクライアント等
└── shared/                   # 共通設定・型定義
    ├── config/               # 設定ファイル
    └── types/                # 型定義
```

### サービスパス構成原則
各サービスは以下の汎用的な構成に従います：

```
service-path/         # サービスディレクトリ
├── page.tsx          # サービスメインページ（SPA統合ダッシュボード）
├── section1/         # セクション1実装
│   └── section.tsx   # セクション固有コンポーネント
├── section2/         # セクション2実装
│   └── section.tsx   # セクション固有コンポーネント
└── ...               # 追加セクション
```

## 開発標準

### プロジェクト全体の原則
1. **AI滑走路4層アーキテクチャの厳守** - 階層違反・複数クラス配置禁止
2. **1サービス1SPA設計の徹底** - 画面遷移禁止・セクション切り替えのみ
3. **セキュリティファースト** - RLS活用・定期キーローテーション
4. **自動化優先原則** - 手動作業最小化・CI/CD活用

### ファイル・クラス命名規則
```
✅ 良い命名例:
- CreateUserTask.ts (処理内容が明確)
- UserResource.ts (リソース種別が明確)  
- AuthController.ts (機能範囲が明確)

❌ 悪い命名例:
- utils.ts (曖昧すぎる)
- helper.ts (責務不明確)
- manager.ts (抽象的すぎる)
```

### Git・バージョン管理
```bash
# ✅ 良いコミット例
feat: Add habit record section to records SPA
fix: Resolve authentication token expiry issue
refactor: Extract common validation logic to shared utility
docs: Update API specification for new endpoints

# ❌ 悪いコミット例  
update stuff
fix bug
changes
WIP
```

## 局所READMEルール

### 必須参照タイミング
該当フォルダのコードを編集・作成する場合は、必ずフォルダ内のREADME.mdを参照してください

### 各フォルダのREADME責務
- **app/README.md**: 1サービス1SPA設計の具体的実装ルール
- **backend/README.md**: AI滑走路4層アーキテクチャの具体的実装ルール  
- **components/README.md**: 共通コンポーネントの作成・利用ルール
- **lib/README.md**: ユーティリティライブラリの組織化ルール

## サービス固有実装
- **app/[積み上げサービス]/README.md**: 男磨き積み上げSPA固有の実装詳細  
- **app/[SNSサービス]/README.md**: 男磨きSNSSPA固有の実装詳細

## 参照優先度
1. **局所README** (src/*/README.md) - 実装時必須参照（具体的実装ルール）
2. **CLAUDE.md** - 開発方針・制約事項  
3. **docs/guides/** - アーキテクチャ原則・設計思想（抽象設計）
4. **docs/templates/** - 具体的実装テンプレート

## トラブルシューティング
実装中の問題解決は [トラブルシューティングガイド](../docs/guides/troubleshooting.md) を参照してください。

## 重要制約
- **情報の重複禁止**: 同じ内容をdocs/と局所READMEの両方に記載しない
- **抽象と具体の分離**: docs/は設計思想、src/*/README.mdは実装ルール
- **参照必須**: フォルダ内作業時は該当README.mdを必ず参照