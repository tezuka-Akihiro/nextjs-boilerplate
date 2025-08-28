#!/bin/bash

# =============================================================================
# パス移行自動化スクリプト
# tsumiageプロジェクトの相対パスを新しいエイリアスに一括変換
# =============================================================================

set -e  # エラー時に停止

# 色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ関数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 進捗表示
show_progress() {
    local current=$1
    local total=$2
    local desc=$3
    local percent=$((current * 100 / total))
    echo -e "${BLUE}[${current}/${total}] (${percent}%)${NC} ${desc}"
}

# バックアップ作成
create_backup() {
    local backup_dir="backups/pre-path-migration-$(date +%Y%m%d_%H%M%S)"
    log_info "バックアップを作成中: ${backup_dir}"
    
    mkdir -p "${backup_dir}"
    cp -r src/ "${backup_dir}/"
    cp -r tests/ "${backup_dir}/"
    cp -r docs/ "${backup_dir}/"
    
    log_success "バックアップ完了: ${backup_dir}"
    echo "${backup_dir}" > .last-backup
}

# 移行前検証
pre_migration_check() {
    log_info "移行前検証を実行中..."
    
    # TypeScriptコンパイル確認
    if ! npm run type-check > /dev/null 2>&1; then
        log_error "TypeScriptコンパイルエラーが存在します。修正してから再実行してください。"
        exit 1
    fi
    
    # テスト実行
    if ! npm test > /dev/null 2>&1; then
        log_warning "テストが失敗しています。続行しますか？ (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    log_success "移行前検証完了"
}

# パス置換実行
execute_replacements() {
    local file_count=0
    local total_files=$(find src/ tests/ docs/ -name "*.ts" -o -name "*.tsx" | wc -l)
    
    log_info "パス置換を開始します（対象ファイル数: ${total_files}）"
    
    # バックエンド層のパス置換
    log_info "バックエンド層のパス置換中..."
    while IFS= read -r file; do
        ((file_count++))
        show_progress $file_count $total_files "処理中: $(basename "$file")"
        
        # 相対パスをエイリアスに置換
        sed -i.bak \
            -e "s|from ['\"]\\.\\.*/controllers/|from '@controllers/|g" \
            -e "s|from ['\"]\\.\\.*/tasks/|from '@tasks/|g" \
            -e "s|from ['\"]\\.\\.*/resources/|from '@resources/|g" \
            -e "s|from ['\"]\\.\\.*/responses/|from '@responses/|g" \
            -e "s|from ['\"]\\.\\.*/api/|from '@api/|g" \
            "$file"
        
        # レガシー@/*をspecific aliasに置換
        sed -i.bak \
            -e "s|from '@/controllers/|from '@controllers/|g" \
            -e "s|from '@/tasks/|from '@tasks/|g" \
            -e "s|from '@/resources/|from '@resources/|g" \
            -e "s|from '@/responses/|from '@responses/|g" \
            -e "s|from '@/types'|from '@types'|g" \
            -e "s|from '@/types/|from '@types/|g" \
            "$file"
        
        # バックアップファイル削除
        rm -f "${file}.bak"
        
    done < <(find src/backend/ -name "*.ts" -o -name "*.tsx")
    
    # フロントエンド層のパス置換
    log_info "フロントエンド層のパス置換中..."
    while IFS= read -r file; do
        ((file_count++))
        show_progress $file_count $total_files "処理中: $(basename "$file")"
        
        sed -i.bak \
            -e "s|from ['\"]\\.\\.*/components/|from '@components/|g" \
            -e "s|from ['\"]\\.\\.*/hooks/|from '@hooks/|g" \
            -e "s|from ['\"]\\.\\.*/app/|from '@app/|g" \
            -e "s|from '@/components/|from '@components/|g" \
            -e "s|from '@/hooks/|from '@hooks/|g" \
            -e "s|from '@/app/|from '@app/|g" \
            "$file"
        
        rm -f "${file}.bak"
        
    done < <(find src/frontend/ -name "*.ts" -o -name "*.tsx" 2>/dev/null || true)
    
    # 共通層のパス置換
    log_info "共通層のパス置換中..."
    while IFS= read -r file; do
        ((file_count++))
        show_progress $file_count $total_files "処理中: $(basename "$file")"
        
        sed -i.bak \
            -e "s|from ['\"]\\.\\.*/shared/types/|from '@types/|g" \
            -e "s|from ['\"]\\.\\.*/shared/config/|from '@config/|g" \
            -e "s|from ['\"]\\.\\.*/lib/|from '@lib/|g" \
            -e "s|from '@/lib/|from '@lib/|g" \
            "$file"
        
        rm -f "${file}.bak"
        
    done < <(find src/ -name "*.ts" -o -name "*.tsx")
    
    # テスト層のパス置換
    log_info "テスト層のパス置換中..."
    while IFS= read -r file; do
        ((file_count++))
        show_progress $file_count $total_files "処理中: $(basename "$file")"
        
        sed -i.bak \
            -e "s|from ['\"]\\.\\.*/src/backend/controllers/|from '@controllers/|g" \
            -e "s|from ['\"]\\.\\.*/src/backend/tasks/|from '@tasks/|g" \
            -e "s|from ['\"]\\.\\.*/src/backend/resources/|from '@resources/|g" \
            -e "s|from ['\"]\\.\\.*/src/backend/responses/|from '@responses/|g" \
            -e "s|from ['\"]\\.\\.*/src/shared/types|from '@types|g" \
            -e "s|from ['\"]\\.\\.*/src/types|from '@types|g" \
            -e "s|from ['\"]\\.\\.*/tests/fixtures/|from '@fixtures/|g" \
            -e "s|from ['\"]\\.\\.*/tests/factories/|from '@factories/|g" \
            -e "s|from ['\"]\\.\\.*/tests/mocks/|from '@mocks/|g" \
            "$file"
        
        rm -f "${file}.bak"
        
    done < <(find tests/ -name "*.ts" -o -name "*.tsx" 2>/dev/null || true)
    
    # ドキュメント・テンプレート層のパス置換
    log_info "ドキュメント層のパス置換中..."
    while IFS= read -r file; do
        ((file_count++))
        show_progress $file_count $total_files "処理中: $(basename "$file")"
        
        sed -i.bak \
            -e "s|from ['\"]\\.\\.*/src/backend/|from '@backend/|g" \
            -e "s|from ['\"]\\.\\.*/src/frontend/|from '@frontend/|g" \
            -e "s|from ['\"]\\.\\.*/src/shared/types|from '@types|g" \
            "$file"
        
        rm -f "${file}.bak"
        
    done < <(find docs/ -name "*.ts" -o -name "*.tsx" 2>/dev/null || true)
}

# 移行後検証
post_migration_check() {
    log_info "移行後検証を実行中..."
    
    # TypeScriptコンパイル確認
    log_info "TypeScriptコンパイル確認中..."
    if ! npm run type-check; then
        log_error "TypeScriptコンパイルエラーが発生しました。"
        return 1
    fi
    
    # テスト実行
    log_info "テスト実行中..."
    if ! npm test; then
        log_error "テストが失敗しました。"
        return 1
    fi
    
    # Lint確認
    log_info "Lint確認中..."
    if command -v npm run lint > /dev/null 2>&1; then
        if ! npm run lint; then
            log_warning "Lintエラーが発生しました。"
        fi
    fi
    
    log_success "移行後検証完了"
}

# 統計情報表示
show_statistics() {
    log_info "移行統計を生成中..."
    
    local remaining_relative=$(grep -r "from ['\"]\.\./" src/ tests/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo 0)
    local new_aliases=$(grep -r "from ['\"]@[btcrsl]" src/ tests/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo 0)
    local legacy_aliases=$(grep -r "from ['\"]@/[^btcrsl]" src/ tests/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo 0)
    
    echo
    echo "=================================="
    echo "        移行統計情報"
    echo "=================================="
    echo "残存相対パス:     ${remaining_relative} 箇所"
    echo "新エイリアス:     ${new_aliases} 箇所"
    echo "レガシーエイリアス: ${legacy_aliases} 箇所"
    echo "=================================="
    echo
    
    if [ "$remaining_relative" -eq 0 ] && [ "$legacy_aliases" -eq 0 ]; then
        log_success "✅ パス移行が完了しました！"
    else
        log_warning "⚠️ 一部のパスが未移行です。手動で確認してください。"
    fi
}

# ロールバック機能
rollback() {
    if [ ! -f .last-backup ]; then
        log_error "バックアップが見つかりません。"
        exit 1
    fi
    
    local backup_dir=$(cat .last-backup)
    log_info "ロールバック中: ${backup_dir}"
    
    cp -r "${backup_dir}/src/" ./
    cp -r "${backup_dir}/tests/" ./
    cp -r "${backup_dir}/docs/" ./
    
    log_success "ロールバック完了"
}

# メイン実行
main() {
    echo "========================================"
    echo "    tsumiage パス移行スクリプト"
    echo "========================================"
    echo
    
    # 引数処理
    case "${1:-}" in
        "rollback")
            rollback
            exit 0
            ;;
        "check")
            show_statistics
            exit 0
            ;;
        "help"|"-h"|"--help")
            echo "使用方法:"
            echo "  $0           - パス移行実行"
            echo "  $0 rollback  - 最新バックアップにロールバック"
            echo "  $0 check     - 現在の移行状況確認"
            echo "  $0 help      - このヘルプを表示"
            exit 0
            ;;
    esac
    
    # 移行実行確認
    echo "相対パスを新しいエイリアスに移行します。"
    echo "この操作により、以下が実行されます："
    echo "  1. バックアップ作成"
    echo "  2. 移行前検証"
    echo "  3. パス置換実行"
    echo "  4. 移行後検証"
    echo
    echo "続行しますか？ (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "操作がキャンセルされました。"
        exit 0
    fi
    
    # 移行処理実行
    create_backup
    pre_migration_check
    execute_replacements
    
    if post_migration_check; then
        show_statistics
        log_success "🎉 パス移行が正常に完了しました！"
    else
        log_error "❌ 移行後検証でエラーが発生しました。"
        log_info "ロールバックする場合: $0 rollback"
        exit 1
    fi
}

# スクリプト実行
main "$@"