# CLAUDE.md - projectnameプロジェクト開発指示書

絶対に守ること。
現在は設計中であるため実装は絶対にしない。
個人開発なのでミニマムシンプル構成。

## 📋 プロジェクト概要

**[プロジェクト詳細]**: [`docs/project/project-overview.md`](./docs/project/project-overview.md)
- **アプリ名**: 
- **目的**: 

## 🔧 技術実装指針

### バックエンド開発
**[バックエンド実装ルール]**: [`src/backend/README.md`](./src/backend/README.md)
- AI滑走路4層アーキテクチャの厳格な遵守
- 階層違反禁止・1ファイル1クラス原則

### フロントエンド開発
**[フロントエンド実装ルール]**: [`src/app/README.md`](./src/app/README.md)
- 1サービス1SPA設計の徹底
- セクション切り替えによる統合ダッシュボード

### 開発・品質管理
**[src/実装ルール統合]**: [`src/README.md`](./src/README.md)
- コード品質基準・命名規則・Git管理
## テンプレート参照

コード生成時は必ず `docs/templates/` のひな型を参照してください：

- **Requirements**: `docs/templates/requirements/` - 要件定義テンプレート
  - アプリ要件: `docs/templates/requirements/app.md`
  - サービス要件: `docs/templates/requirements/service.md` 
  - 機能要件: `docs/templates/requirements/function.md`
- **Backend層**: `docs/templates/backend/` - AI滑走路4層アーキテクチャ
  - API層: `docs/templates/backend/ApiTemplate.ts`
  - Controller層: `docs/templates/backend/ControllerTemplate.ts`
  - Task層: `docs/templates/backend/TaskTemplate.ts`
  - Resource層: `docs/templates/backend/ResourceTemplate.ts`
  - Response層: `docs/templates/backend/ResponseTemplate.ts`
- **Testing**: `docs/templates/testing/` - 各層対応テストテンプレート
- **Wireframe**: `docs/templates/wireframe/` - ワイヤフレームテンプレート（アプリ・サービス・機能）

各ひな型の制約・命名規則・コメント記法を必ず守ってください。詳細は [`docs/templates/README.md`](./docs/templates/README.md) を参照。

**要件定義作成時は必須**：新機能・サービス要件作成時は対応するテンプレートから開始してください。

## 主要機能（MVP）
`src/app/README.md`

## 🚀 運用・デプロイメント

**[デプロイメント戦略]**: [`docs/deployment/strategy.md`](./docs/deployment/strategy.md)
- GitHub Actions CI/CD・環境変数管理
- Vercel デプロイ・監視システム統合

## 🔗 関連ドキュメント
### 開発・運用支援
- **[API仕様書]**: `docs/architecture/api-specification.md`
- **[データベース設計]**: `docs/database/`
- **[テスト実行ガイド]**: `docs/testing/test-execution-guide.md`

## 📋 ドキュメント管理

**[README分散配置管理]**: [`docs/README.md`](./docs/README.md)
- 全READMEファイルの責務・参照タイミングを一元管理
- 抽象設計 vs 具体実装ルールの棲み分け
- 新規README作成時の管理ルール

### ドキュメントファイル制限
- **最大500行制限**: README・設計・方針ファイルは500行以内
- **分割基準**: 機能別・責務別に自然な単位で分割
- **適用外**: ワイヤーフレーム等の図説明ファイルは制限対象外
- **500行超過時**: 論理単位での分割を必須とする

---

## ⚠️ 重要な制約・開発原則

1. **AI滑走路4層アーキテクチャ厳守** - 階層違反・複数クラス配置禁止
2. **1サービス1SPA設計徹底** - 画面遷移禁止・セクション切り替えのみ
3. **テンプレート必須参照** - `docs/templates/` のひな型・命名規則遵守
4. **セキュリティファースト** - RLS活用・定期キーローテーション
5. **TDD実践** - AITDD tsumiki kairo/tddコマンド活用

> **注記**: この指示書はプロジェクトの開発方針を定める重要なドキュメントです。全開発者が遵守してください。
