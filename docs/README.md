# README分散配置管理 - tsumiageプロジェクト

## 管理方針
- **局所README**: 実装時必須参照（具体的ルール・制約）
- **docs/README**: 設計思想・抽象概念（頻繁な変更なし）
- **情報の重複禁止**: 同一情報は1つのREADMEにのみ記載

## README階層構造

### レベル1: プロジェクト全体
- **README.md** - プロジェクト概要・セットアップ・開発開始手順

### レベル2: 開発領域別
- **src/README.md** - src/全体のディレクトリ構造とルール
- **src/app/README.md** - 1サービス1SPA設計の実装ルール
- **src/backend/README.md** - AI滑走路4層アーキテクチャの実装ルール

### レベル3: 機能・用途別
- **scripts/README.md** - 自動化スクリプト・運用ツールの使用方法
- **docs/database/README.md** - データベース設計・テスト環境設定
- **docs/templates/README.md** - コード生成・要件定義テンプレートの利用方法
- **docs/auth/README.md** - 認証・認可システム実装ガイド
- **docs/testing/README.md** - テスト戦略・実行ガイド統合
- **docs/deployment/strategy.md** - デプロイ戦略・GitHub Secrets設定

### レベル4: サービス別機能要件
- **src/app/README.md** - 機能要件全体概要
- **src/app/status/README.md** - 男磨き積み上げの詳細仕様
- **src/app/social/README.md** - 男磨きSNSの詳細仕様

## 抽象設計・デザインシステム (docs/guides)
- **docs/guides/brand-identity.md** - ブランドアイデンティティ・カラー・タイポグラフィ
- **docs/guides/design-architecture.md** - デザインシステム管理アーキテクチャ

## 参照タイミング・ルール

### 実装開始時
1. **プロジェクト参加** → `README.md`
2. **src/作業開始** → `src/README.md`
3. **フロントエンド実装** → `src/app/README.md`
4. **バックエンド実装** → `src/backend/README.md`

### 設計・仕様確認時
- **機能設計** → `src/app/[サービス名]/README.md`
- **データベース設計** → `docs/database/README.md`
- **認証システム設計** → `docs/auth/README.md`
- **テスト戦略確認** → `docs/testing/README.md`
- **デプロイ設定** → `docs/deployment/strategy.md`
- **テンプレート利用** → `docs/templates/README.md` (コード生成・要件定義)
- **ブランド・デザイン** → `docs/guides/brand-identity.md`

### メンテナンス・運用時
- **スクリプト実行** → `scripts/README.md`

## 新規README作成時のルール
1. **この管理ファイルに追加・更新**
2. **責務範囲を明確に定義** - 重複や曖昧さを排除
3. **重複情報がないか確認** - 既存READMEとの棲み分け
4. **適切な参照タイミングを設定** - いつ・誰が・なぜ参照するか
5. **抽象 vs 具体の分離** - docs/は設計思想、src/は実装ルール

## 情報の棲み分けルール

### docs/配下 (抽象設計・思想)
- アーキテクチャ原則
- デザインシステム哲学
- 機能要件仕様
- データベース設計思想

### src/配下 (具体的実装ルール)
- ファイル配置・命名規則
- コーディング標準
- エラーハンドリング方法
- テスト実装パターン

## 変更履歴
- 2025-01-XX 初期版作成 - README分散配置の体系化、chat.mdルールに基づく整理完了
- 2025-01-XX docs/配下ボリューム削減実施 - 10ファイル統合・削除によりメンテナンス効率向上