#!/usr/bin/env node

/**
 * カバレッジレポート生成スクリプト
 * 
 * 使用方法:
 *   npm run test:coverage
 *   node scripts/coverage-report.js
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 設定
const config = {
  coverageDir: path.join(__dirname, '../coverage'),
  reportTypes: ['text', 'html', 'lcov', 'json'],
  thresholds: {
    global: { statements: 80, branches: 70, functions: 80, lines: 80 },
    resources: { statements: 90, branches: 80, functions: 90, lines: 90 },
    controllers: { statements: 85, branches: 75, functions: 85, lines: 85 },
    tasks: { statements: 85, branches: 75, functions: 85, lines: 85 }
  }
}

/**
 * カバレッジレポートを生成
 */
function generateCoverageReport() {
  console.log('🔍 カバレッジレポート生成開始...')
  
  try {
    // カバレッジディレクトリのクリーンアップ
    if (fs.existsSync(config.coverageDir)) {
      fs.rmSync(config.coverageDir, { recursive: true, force: true })
      console.log('✅ 既存のカバレッジディレクトリを削除')
    }
    
    // テスト実行 + カバレッジ生成
    console.log('🧪 テスト実行中...')
    execSync('npx vitest run --coverage', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    })
    
    console.log('✅ カバレッジレポート生成完了')
    
    // レポート後処理
    processReports()
    
  } catch (error) {
    console.error('❌ カバレッジレポート生成に失敗:', error.message)
    process.exit(1)
  }
}

/**
 * 生成されたレポートの後処理
 */
function processReports() {
  const jsonReportPath = path.join(config.coverageDir, 'coverage-final.json')
  const htmlIndexPath = path.join(config.coverageDir, 'index.html')
  
  // JSON レポートの解析
  if (fs.existsSync(jsonReportPath)) {
    analyzeCoverageData(jsonReportPath)
  }
  
  // HTML レポートの確認
  if (fs.existsSync(htmlIndexPath)) {
    console.log(`📊 HTMLレポート: file://${htmlIndexPath}`)
  }
  
  // カバレッジサマリーの表示
  displayCoverageSummary()
}

/**
 * カバレッジデータの解析
 */
function analyzeCoverageData(jsonPath) {
  try {
    const coverageData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    
    console.log('\n📈 層別カバレッジ分析:')
    
    const layerStats = {
      resources: analyzeLayer(coverageData, 'src/backend/resources'),
      controllers: analyzeLayer(coverageData, 'src/backend/controllers'),
      tasks: analyzeLayer(coverageData, 'src/backend/tasks'),
      responses: analyzeLayer(coverageData, 'src/backend/responses')
    }
    
    Object.entries(layerStats).forEach(([layer, stats]) => {
      if (stats.fileCount > 0) {
        console.log(`\n${layer.toUpperCase()} 層:`)
        console.log(`  ファイル数: ${stats.fileCount}`)
        console.log(`  文実行率: ${stats.statements.toFixed(1)}%`)
        console.log(`  分岐実行率: ${stats.branches.toFixed(1)}%`)
        console.log(`  関数実行率: ${stats.functions.toFixed(1)}%`)
        console.log(`  行実行率: ${stats.lines.toFixed(1)}%`)
        
        // 閾値チェック
        const threshold = config.thresholds[layer] || config.thresholds.global
        const issues = []
        
        if (stats.statements < threshold.statements) issues.push(`文実行率 ${stats.statements.toFixed(1)}% < ${threshold.statements}%`)
        if (stats.branches < threshold.branches) issues.push(`分岐実行率 ${stats.branches.toFixed(1)}% < ${threshold.branches}%`)
        if (stats.functions < threshold.functions) issues.push(`関数実行率 ${stats.functions.toFixed(1)}% < ${threshold.functions}%`)
        if (stats.lines < threshold.lines) issues.push(`行実行率 ${stats.lines.toFixed(1)}% < ${threshold.lines}%`)
        
        if (issues.length > 0) {
          console.log(`  ⚠️ 閾値未達成: ${issues.join(', ')}`)
        } else {
          console.log(`  ✅ 全ての閾値をクリア`)
        }
      }
    })
    
  } catch (error) {
    console.warn('⚠️ カバレッジデータの解析に失敗:', error.message)
  }
}

/**
 * 特定の層のカバレッジを分析
 */
function analyzeLayer(coverageData, layerPath) {
  const layerFiles = Object.keys(coverageData).filter(file => 
    file.includes(layerPath) && 
    !file.includes('.test.') && 
    !file.includes('.spec.')
  )
  
  if (layerFiles.length === 0) {
    return { fileCount: 0, statements: 0, branches: 0, functions: 0, lines: 0 }
  }
  
  let totalStatements = 0, coveredStatements = 0
  let totalBranches = 0, coveredBranches = 0
  let totalFunctions = 0, coveredFunctions = 0
  let totalLines = 0, coveredLines = 0
  
  layerFiles.forEach(file => {
    const data = coverageData[file]
    
    totalStatements += Object.keys(data.s || {}).length
    coveredStatements += Object.values(data.s || {}).filter(count => count > 0).length
    
    totalBranches += Object.keys(data.b || {}).length
    coveredBranches += Object.values(data.b || {}).filter(branches => 
      Array.isArray(branches) ? branches.some(count => count > 0) : branches > 0
    ).length
    
    totalFunctions += Object.keys(data.f || {}).length
    coveredFunctions += Object.values(data.f || {}).filter(count => count > 0).length
    
    totalLines += Object.keys(data.l || {}).length
    coveredLines += Object.values(data.l || {}).filter(count => count > 0).length
  })
  
  return {
    fileCount: layerFiles.length,
    statements: totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0,
    branches: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0,
    functions: totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0,
    lines: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0
  }
}

/**
 * カバレッジサマリーの表示
 */
function displayCoverageSummary() {
  console.log('\n📊 カバレッジレポート完了')
  console.log('=====================================')
  console.log(`📁 レポート保存先: ${config.coverageDir}`)
  console.log(`🌐 HTMLレポート: file://${path.join(config.coverageDir, 'index.html')}`)
  console.log(`📄 LCOVレポート: ${path.join(config.coverageDir, 'lcov.info')}`)
  console.log(`📋 JSONレポート: ${path.join(config.coverageDir, 'coverage-final.json')}`)
  console.log('')
  console.log('次のステップ:')
  console.log('1. HTMLレポートでカバレッジ詳細を確認')
  console.log('2. 未カバーの部分にテストを追加')
  console.log('3. 閾値未達成の層を優先的に改善')
}

/**
 * CI/CD用のカバレッジチェック
 */
function checkCoverageThresholds() {
  const jsonReportPath = path.join(config.coverageDir, 'coverage-final.json')
  
  if (!fs.existsSync(jsonReportPath)) {
    console.error('❌ カバレッジレポートが見つかりません')
    process.exit(1)
  }
  
  try {
    const coverageData = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'))
    
    const layers = [
      { name: 'resources', path: 'src/backend/resources', threshold: config.thresholds.resources },
      { name: 'controllers', path: 'src/backend/controllers', threshold: config.thresholds.controllers },
      { name: 'tasks', path: 'src/backend/tasks', threshold: config.thresholds.tasks }
    ]
    
    let allPassed = true
    
    layers.forEach(layer => {
      const stats = analyzeLayer(coverageData, layer.path)
      
      if (stats.fileCount > 0) {
        const failed = [
          stats.statements < layer.threshold.statements && `statements(${stats.statements.toFixed(1)}% < ${layer.threshold.statements}%)`,
          stats.branches < layer.threshold.branches && `branches(${stats.branches.toFixed(1)}% < ${layer.threshold.branches}%)`,
          stats.functions < layer.threshold.functions && `functions(${stats.functions.toFixed(1)}% < ${layer.threshold.functions}%)`,
          stats.lines < layer.threshold.lines && `lines(${stats.lines.toFixed(1)}% < ${layer.threshold.lines}%)`
        ].filter(Boolean)
        
        if (failed.length > 0) {
          console.error(`❌ ${layer.name} layer threshold failed: ${failed.join(', ')}`)
          allPassed = false
        } else {
          console.log(`✅ ${layer.name} layer threshold passed`)
        }
      }
    })
    
    if (!allPassed) {
      console.error('\n❌ カバレッジ閾値チェックに失敗しました')
      process.exit(1)
    } else {
      console.log('\n✅ 全ての閾値チェックに合格しました')
    }
    
  } catch (error) {
    console.error('❌ 閾値チェックに失敗:', error.message)
    process.exit(1)
  }
}

// メイン処理
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--check')) {
    checkCoverageThresholds()
  } else {
    generateCoverageReport()
  }
}

module.exports = {
  generateCoverageReport,
  checkCoverageThresholds,
  analyzeCoverageData
}