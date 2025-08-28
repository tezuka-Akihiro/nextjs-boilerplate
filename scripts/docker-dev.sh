#!/bin/bash
# ===============================
# tsumiage Docker 開発環境管理スクリプト
# ===============================

set -e

function show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  up      開発環境を起動"
    echo "  down    開発環境を停止"
    echo "  restart 開発環境を再起動"
    echo "  logs    ログを表示"
    echo "  clean   すべてのコンテナとボリュームを削除"
    echo "  db      データベースに接続"
    echo "  redis   Redis CLI に接続"
    echo "  help    このヘルプを表示"
}

function docker_up() {
    echo "🐳 Docker 開発環境を起動中..."
    docker-compose up -d
    echo "✅ サービスが起動しました："
    echo "  📱 アプリケーション: http://localhost:3000"
    echo "  🗃️  PostgreSQL: localhost:5432"
    echo "  🔴 Redis: localhost:6379"
    echo "  📊 pgAdmin: http://localhost:5050"
    echo "  🔍 RedisInsight: http://localhost:8001"
}

function docker_down() {
    echo "⏹️  Docker 開発環境を停止中..."
    docker-compose down
    echo "✅ すべてのサービスが停止しました"
}

function docker_restart() {
    echo "🔄 Docker 開発環境を再起動中..."
    docker-compose restart
    echo "✅ すべてのサービスが再起動しました"
}

function docker_logs() {
    echo "📋 ログを表示中..."
    docker-compose logs -f
}

function docker_clean() {
    echo "🧹 すべてのコンテナとボリュームを削除中..."
    docker-compose down -v
    docker system prune -f
    echo "✅ クリーンアップが完了しました"
}

function connect_db() {
    echo "🗃️  PostgreSQL データベースに接続中..."
    docker-compose exec postgres psql -U postgres -d tsumiage_dev
}

function connect_redis() {
    echo "🔴 Redis CLI に接続中..."
    docker-compose exec redis redis-cli
}

case "$1" in
    up)
        docker_up
        ;;
    down)
        docker_down
        ;;
    restart)
        docker_restart
        ;;
    logs)
        docker_logs
        ;;
    clean)
        docker_clean
        ;;
    db)
        connect_db
        ;;
    redis)
        connect_redis
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ 不明なコマンド: $1"
        show_help
        exit 1
        ;;
esac