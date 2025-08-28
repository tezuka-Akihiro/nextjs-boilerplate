// Supabase RLS設定スクリプト
// SQL Editorが使えない場合の代替手段

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwruehfcvjjcsruovjxd.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY // サービスロールキー必要

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupRLS() {
  console.log('🔧 RLS設定開始...')

  try {
    // 1. usersテーブルのRLS有効化
    const { data: rlsResult, error: rlsError } = await supabase
      .rpc('exec_sql', { 
        sql: 'ALTER TABLE users ENABLE ROW LEVEL SECURITY;' 
      })

    if (rlsError) {
      console.error('RLS有効化エラー:', rlsError)
      return
    }

    console.log('✅ users テーブルのRLS有効化完了')

    // 2. 基本ポリシー作成
    const policies = [
      {
        name: 'Users can view own profile',
        sql: `CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);`
      },
      {
        name: 'Users can update own profile', 
        sql: `CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);`
      }
    ]

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy.sql })
      
      if (error && !error.message.includes('already exists')) {
        console.error(`ポリシー作成エラー (${policy.name}):`, error)
      } else {
        console.log(`✅ ${policy.name} 作成完了`)
      }
    }

    console.log('🎉 RLS設定完了！')

  } catch (error) {
    console.error('RLS設定エラー:', error)
  }
}

// 実行
setupRLS()