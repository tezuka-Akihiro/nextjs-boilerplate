#!/bin/bash
set -e

# CLI確認
if ! command -v npx &> /dev/null; then
    echo "❌ npx が見つかりません"
    exit 1
fi

# リスト取得
DEPLOYMENTS=$(npx vercel ls | head -20 | grep "https://" || echo "")

# 空チェック
if [ -z "$DEPLOYMENTS" ]; then
    echo "✅ 削除対象のデプロイメントはありません"
    exit 0
fi

# 確認
echo "🗑️  削除対象:"
echo "$DEPLOYMENTS"
echo ""
read -p "全て削除しますか? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ キャンセル"
    exit 0
fi

# 削除実行
URLS=($DEPLOYMENTS)
TOTAL=${#URLS[@]}
CURRENT=0

for url in "${URLS[@]}"; do
    CURRENT=$((CURRENT + 1))
    echo "[$CURRENT/$TOTAL] $url"
    npx vercel rm "$url" --yes
done

echo "✅ 完了"