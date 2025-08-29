# Next.js Universal Boilerplate

モダンなツールとベストプラクティスを備えた、ローカル開発向けのミニマルなNext.jsボイラープレート。

## 🚀 クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# http://localhost:3000 を開く
```

## ⚡ 機能

- **Next.js 15** App Router対応
- **React 19** 最新機能
- **TypeScript** 型安全性
- **Tailwind CSS 4** スタイリング
- **Vitest** ユニットテスト
- **ESLint + Prettier** コード品質
- **Husky** Gitフック

## 📝 利用可能なスクリプト

| コマンド | 説明 |
|---------|-------------|
| `npm run dev` | 開発サーバーの起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバーの起動 |
| `npm run lint` | ESLintの実行 |
| `npm run lint:fix` | ESLintエラーの修正 |
| `npm run type-check` | TypeScriptの型チェック |
| `npm run format` | Prettierでコード整形 |
| `npm run test` | ユニットテストの実行 |
| `npm run test:watch` | ウォッチモードでテスト実行 |
| `npm run test:coverage` | カバレッジ付きテスト実行 |

## 📁 プロジェクト構成

```
src/
├── app/              # Next.js App Router ページ
├── backend/          # サーバーサイドロジック（4層アーキテクチャ）
├── components/       # 再利用可能なUIコンポーネント
├── hooks/           # カスタムReactフック
├── lib/             # ユーティリティ関数
└── shared/          # 共有型と設定

tests/
├── backend/         # バックエンドテスト
└── frontend/       # フロントエンドテスト
```

## 🛠 開発ガイドライン

- **AI滑走路4層アーキテクチャ** バックエンド構造
- **1サービス1SPA設計** フロントエンドアーキテクチャ
- `docs/templates/` のテンプレートに従った一貫したコードパターン
- 詳細な開発指示は `CLAUDE.md` を参照

## 📚 ドキュメント

- **プロジェクト概要**: `docs/project-overview.md`
- **アーキテクチャ**: `docs/architecture/`
- **テンプレート**: `docs/templates/`
- **テスト**: `docs/testing/`

## 🔧 技術スタック

### コア
- **フレームワーク**: Next.js 15
- **ランタイム**: React 19
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS 4

### テスト
- **ユニットテスト**: Vitest + Testing Library
- **カバレッジ**: Vitest Coverage

### 開発ツール
- **リント**: ESLint
- **フォーマッタ**: Prettier
- **Gitフック**: Husky + lint-staged
- **型チェック**: TypeScript

### UIコンポーネント
- **アイコン**: Lucide React
- **チャート**: Recharts
- **ユーティリティ**: clsx, tailwind-merge

## 📋 はじめ方

1. **リポジトリのクローン**
2. **依存関係のインストール**: `npm install`
3. **開発の開始**: `npm run dev`
4. **ドキュメントを読む**: `docs/` で詳細ガイドを確認

## 🤝 コントリビューション

1. `src/README.md` で定義されたコーディング標準に従う
2. 新しいコンポーネントには `docs/templates/` のテンプレートを使用
3. 新機能にはテストを書く
4. コミット前に `npm run lint` と `npm run type-check` を実行

---

❤️ モダンなWeb開発のために構築