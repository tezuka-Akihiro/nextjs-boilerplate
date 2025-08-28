/**
 * AI滑走路 - API層テンプレート
 * 
 * 責務:
 * - HTTPリクエスト受付
 * - 基本バリデーション
 * - Controllerへの処理委譲
 * - レスポンス返却
 * 
 * 依存関係:
 *  許可: Controllerのみ
 * 禁止: Taskへの直接依存
 * 禁止: Resourceへの直接依存
 * 禁止: 他のAPIへの直接依存
 * 
 * 配置例:
 * - ファイル名: route.ts (Next.js App Router用)
 * - 実装: HTTP動詞別 (GET, POST, PUT, DELETE等)
 * 
 * 禁止項目:
 * - ビジネスロジックの実装
 * - データベースへの直接アクセス
 * - 複雑な処理の実装
 * - 他のAPIへの直接依存
 */

/**
 * @api {httpMethod} /api/resource リソース操作
 * @apiParam {string} param1 パラメータ1の説明
 * @apiParam {string} param2 パラメータ2の説明
 * @apiSuccess {object} result 成功時のレスポンス
 * @apiError {string} error エラーメッセージ
 */

import { NextRequest, NextResponse } from 'next/server'
import { SampleController } from '@/controllers/SampleController'

// 許可された依存: Controllerのみ
const sampleController = new SampleController()

export async function GET(request: NextRequest) {
  try {
    // APIの責務：クエリパラメータの取得
    const { searchParams } = new URL(request.url)
    const param1 = searchParams.get('param1')
    
    // APIの責務：基本バリデーション
    if (!param1) {
      return NextResponse.json(
        { success: false, error: 'param1 is required' },
        { status: 400 }
      )
    }

    // 許可された処理: Controllerへの委譲
    const result = await sampleController.getSample(param1)
    
    // APIの責務：レスポンス返却
    const status = result.success ? 200 : 400
    return NextResponse.json(result, { status })
  } catch (error) {
    // APIの責務：エラーハンドリング
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // APIの責務：リクエストボディの取得
    const body = await request.json()
    
    // 許可された処理: Controllerへの委譲
    const result = await sampleController.createSample(body)
    
    // APIの責務：レスポンス返却
    const status = result.success ? 201 : 400
    return NextResponse.json(result, { status })
  } catch (error) {
    // APIの責務：JSONパースエラーの処理
    return NextResponse.json(
      { success: false, error: 'Invalid request format' },
      { status: 400 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // 許可された処理: Controllerへの委譲
    const result = await sampleController.updateSample(params.id, body)
    
    const status = result.success ? 200 : 400
    return NextResponse.json(result, { status })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 許可された処理: Controllerへの委譲
    const result = await sampleController.deleteSample(params.id)
    
    const status = result.success ? 200 : 400
    return NextResponse.json(result, { status })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/* 
禁止項目例 - 次のような処理は絶対にNG:

// 禁止: Taskへの直接依存
import { SampleTask } from '@/tasks/SampleTask'

// 禁止: Resourceへの直接依存  
import { SampleResource } from '@/resources/SampleResource'

// 禁止: 他のAPIへの直接依存
import { OtherApi } from '@/api/OtherApi'

// 禁止: ビジネスロジックの実装
export async function GET() {
  // ビジネスロジックはControllerで実装すべき
  const complexBusinessLogic = () => { ... }
}

// 禁止: データベースへの直接アクセス
export async function POST() {
  const { data } = await supabase.from('table').select()
}
*/