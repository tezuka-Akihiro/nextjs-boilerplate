# Templates Directory Guide

tsumiageプロジェクト用のテンプレート集です。コード生成とドキュメント作成を効率化する統一されたひな型を提供します。

## ディレクトリ構成

```
docs/templates/
├── backend/                # バックエンドコードテンプレート
├── testing/               # テストコードテンプレート
├── wireframe/             # ワイヤフレームテンプレート
├── requirements/          # 要件定義テンプレート
└── README.md             # このファイル
```

---

## Backend Templates (`backend/`)

### テンプレート一覧

| ファイル | 用途 |
|----------|------|
| `ApiTemplate.ts` | HTTP リクエスト受付・基本バリデーション |
| `ControllerTemplate.ts` | ビジネスロジック統合・調整 |
| `TaskTemplate.ts` | 単一処理実行 |
| `ResourceTemplate.ts` | データ・外部API取得 |
| `ResponseTemplate.ts` | レスポンス形式統一・エラーハンドリング |

### 使用方法
```bash
# 例: AuthController作成時
cp docs/templates/backend/ControllerTemplate.ts src/backend/controllers/AuthController.ts
# テンプレート内の [FunctionName] を AuthController に置換
```

> **詳細**: AI滑走路4層アーキテクチャの制約・原則は [`docs/architecture/system-architecture.md`](../architecture/system-architecture.md) を参照

---

## Testing Templates (`testing/`)

### テンプレート一覧

| ファイル | テスト対象 |
|----------|------------|
| `ApiTestTemplate.ts` | API層 |
| `ControllerTestTemplate.ts` | Controller層 |
| `TaskTestTemplate.ts` | Task層 |
| `ResourceTestTemplate.ts` | Resource層 |
| `ResponseTestTemplate.ts` | Response層 |

### 使用方法
```bash
# 例: AuthController用テスト作成時
cp docs/templates/testing/ControllerTestTemplate.ts tests/backend/controllers/AuthController.test.ts
```

> **詳細**: テスト戦略・モック手法は [`docs/testing/test-strategy.md`](../testing/test-strategy.md) を参照

---

## Requirements Templates (`requirements/`)

### テンプレート一覧

| ファイル | 用途 |
|----------|------|
| `app.md` | アプリ全体の要件仕様（プロジェクト概要・サービス構成） |
| `service.md` | サービス要件仕様（機能一覧・画面設計・データフロー） |
| `function.md` | 個別機能要件仕様（詳細仕様・API・テスト） |

### 使用方法
```bash
# 例: 新サービス要件作成時
cp docs/templates/requirements/service.md src/app/[サービス名]/README.md

# 例: 個別機能要件作成時
cp docs/templates/requirements/function.md src/app/[サービス名]/components/[機能名]/README.md
```

### 推奨構成
```
src/app/
├── README.md                    # アプリ全体要件（app.mdベース）
└── [サービス名]/
    ├── README.md                # サービス要件（service.mdベース）
    └── [機能名]/
        ├── README.md            # 機能要件（function.mdベース）
        └── wireframe.md         # ワイヤフレーム（wireframe/function.mdベース）
```

---

## Wireframe Templates (`wireframe/`)

### テンプレート一覧

| ファイル | 用途 |
|----------|------|
| `app.md` | アプリ全体のワイヤフレーム（ヘッダー・フッター） |
| `service.md` | サービスのワイヤフレーム（セクション統合） |
| `function.md` | 機能のワイヤフレーム（個別機能の詳細UI） |

### レイアウト図フォーマット
40文字幅の┌─┐ボックス形式
テキスト・・・・・・・・・通常テキスト表示
数値・・・・・・・・・・・42.6% / 120日 などの数値データ
入力フィールド・・・・・・[▶入力内容] （プレースホルダー付き）
ボタン・・・・・・・・・・[+アクションラベル] （アクション実行）
選択ボタン・・・・・・・・[選択項目▼] （ドロップダウン・選択肢）
リンク・・・・・・・・・・リンクテキスト （画面内遷移・外部リンク）

```
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │                                    │ │
│ │  📝 今日の男磨きをシェア            │ │
│ │  📊 投稿数: 12件 | エンゲージ       │ │
│ │  メント率: 85%                      │ │
│ │                                    │ │
│ │  [▶テキスト入力エリア]               │ │
│ │                                    │ │
│ │  [+画像] [+デート] [+習慣]          │ │
│ │  [+自己投資] [+投稿する]            │ │
│ │                                    │ │
│ │  💡 コミュニティと男磨き成果を       │ │
│ │  シェア                            │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### 使用方法
```bash
# 例: 習慣記録機能のワイヤフレーム作成時
cp docs/templates/wireframe/function.md src/app/status/components/habit-tracking/wireframe.md
```

---

## 基本的な開発フロー

### 新機能開発時の手順
```bash
# 1. 機能要件作成
cp docs/templates/requirements/function.md src/app/[サービス名]/components/[機能名]/README.md

# 2. ワイヤフレーム作成
cp docs/templates/wireframe/function.md src/app/[サービス名]/components/[機能名]/wireframe.md

# 3. バックエンド実装
cp docs/templates/backend/ControllerTemplate.ts src/backend/controllers/[機能名]Controller.ts
cp docs/templates/backend/TaskTemplate.ts src/backend/tasks/[処理名]Task.ts
cp docs/templates/backend/ResourceTemplate.ts src/backend/resources/[リソース名]Resource.ts

# 4. テスト作成
cp docs/templates/testing/ControllerTestTemplate.ts tests/backend/controllers/[機能名]Controller.test.ts
```

---

## 関連ドキュメント

### 設計・アーキテクチャ
- **[開発指示書]**: [`CLAUDE.md`](../../CLAUDE.md) - プロジェクト全体の開発方針
- **[システム構成]**: [`docs/architecture/system-architecture.md`](../architecture/system-architecture.md) - AI滑走路4層アーキテクチャ詳細

### テスト・品質管理
- **[テスト戦略]**: [`docs/testing/test-strategy.md`](../testing/test-strategy.md) - テスト手法・モック戦略

### UI/UX・デザイン
- **[画面仕様統合書]**: 各サービスの画面仕様統合書 - デザインシステム・UI指針

---

> **注意**: テンプレート使用時は、各関連ドキュメントでプロジェクト固有の制約・命名規則・要件を必ず確認してください。