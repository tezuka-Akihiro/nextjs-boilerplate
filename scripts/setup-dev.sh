#!/bin/bash
# ===============================
# tsumiage 開発環境セットアップスクリプト
# ===============================

set -e

echo "🚀 tsumiage 開発環境をセットアップ中..."

# Node.js バージョンチェック
echo "📋 Node.js バージョンを確認中..."
node_version=$(node -v | cut -d'v' -f2)
required_version="18.0.0"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js が見つかりません。Node.js 18+ をインストールしてください。"
    exit 1
fi

echo "✅ Node.js $node_version 検出"

# 依存関係インストール
echo "📦 依存関係をインストール中..."
npm ci

# Husky セットアップ
echo "🐶 Husky Git hooks をセットアップ中..."
if command -v npx &> /dev/null; then
    npx husky install
    npx husky add .husky/pre-commit "npx lint-staged"
    npx husky add .husky/commit-msg "npx commitlint --edit \$1"
fi

# 環境変数ファイルチェック
echo "📋 環境変数ファイルを確認中..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local が見つかりません"
    echo "📄 .env.example をコピーして .env.local を作成中..."
    cp .env.example .env.local
    echo "✏️  .env.local を編集して適切な値を設定してください"
fi

# TypeScript型チェック
echo "🔍 TypeScript 設定を確認中..."
npm run type-check

# Linting実行
echo "🧹 コード品質チェック中..."
npm run lint

# テスト実行
echo "🧪 テストを実行中..."
npm run test

# Docker環境チェック
echo "🐳 Docker 環境を確認中..."
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✅ Docker と Docker Compose が利用可能です"
    echo "💡 開発環境を起動するには: npm run docker:dev"
else
    echo "⚠️  Docker または Docker Compose が見つかりません"
    echo "   Dockerを使わない場合は: npm run dev"
fi

echo ""
echo "🎉 セットアップ完了！"
echo ""
echo "次のコマンドで開発を開始できます："
echo "  npm run dev          # 開発サーバー起動"
echo "  npm run docker:dev   # Docker環境起動"
echo "  npm run test:watch   # テスト監視モード"
echo ""
echo "その他の便利なコマンド："
echo "  npm run lint         # コード品質チェック"
echo "  npm run format       # コードフォーマット"
echo "  npm run type-check   # TypeScript チェック"
echo ""