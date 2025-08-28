export type User = {
  id: string
  nickname: string
  goal_months: number
  habit_name: string
  mens_coach_name: string | null
  experience: number
  relationship_status: 'single' | 'dating' | 'married'
  relationship_deadline: string | null
  girlfriend_get_date: string | null
  marriage_period_months: number | null
  created_at: string
  updated_at: string
}

export type DailyCount = {
  user_id: string
  count_date: string
  completed: boolean
  experience_gained: number
  created_at: string
  user?: User
}

// 積み上げストリーム用型定義
export type AchievementStreamItem = {
  nickname: string
  habit_name: string
  created_at: string
  user_id: string
}

export type PostType = {
  id: number
  name: 'self_investment' | 'date' | 'habit_declaration' | 'girlfriend_get'
  display_name: string
  base_experience: number
}

export type Post = {
  id: string
  user_id: string
  post_type_id: number
  post_date: string
  experience_gained: number
  created_at: string
  updated_at: string
  user?: User
  post_type?: PostType
  self_investment_post?: SelfInvestmentPost
  date_post?: DatePost
  habit_declaration_post?: HabitDeclarationPost
  girlfriend_get_post?: GirlfriendGetPost
  reactions?: Reaction[]
}

export type SelfInvestmentPost = {
  id: string
  post_id: string
  product_name: string
  product_url?: string | null
  amount?: number | null
  comment?: string | null
}

export type DatePost = {
  id: string
  post_id: string
  meeting_source?: string | null
  meeting_count?: number | null
  goal_and_result?: string | null
  next_goal?: string | null
  location_url?: string | null
}

export type HabitDeclarationPost = {
  id: string
  post_id: string
  reference_url?: string | null
  action_content: string
  frequency?: string | null
  before_state?: string | null
  after_state?: string | null
}

export type GirlfriendGetPost = {
  id: string
  post_id: string
  date_count: number
  date_location_url?: string | null
  goal_and_result: string
  joy_comment: string
  created_at: string
}

// UI/UX関連型定義
export type GirlfriendGetConfirmDialog = {
  isOpen: boolean
  steps: 'warning' | 'form' | 'celebration'
  impactWarning: {
    statusChange: string
    countdownChange: string
    experienceGain: number
    irreversible: boolean
  }
}

export type MarriagePeriodSlider = {
  months: number // 6-24
  displayDate: string
  progressPercent: number
}

export type CelebrationAnimation = {
  type: 'confetti' | 'fireworks'
  duration: number // seconds
  sound: 'fanfare' | 'chime'
  message: string
}

export type ReactionType = {
  id: number
  name: string
  display_name: string
  experience_points: number
  sort_order?: number | null
  created_at: string
}

export type Reaction = {
  id: string
  user_id: string
  post_id: string
  reaction_type_id: number
  created_at: string
  user?: User
  reaction_type?: ReactionType
}

export type DailyReactionLimit = {
  user_id: string
  reaction_date: string
  reaction_count: number
  experience_gained: number
  created_at: string
  user?: User
}

export type UserStats = {
  id: string
  nickname: string
  experience: number
  relationship_status: 'single' | 'dating' | 'married'
  goal_months: number
  habit_name: string
  mens_coach_name: string | null
  total_daily_counts: number
  total_posts: number
  total_reactions_given: number
  total_reactions_received: number
  days_since_registration: number
  girlfriend_probability: number
  countdown_days: number
  countdown_type: 'girlfriend_goal' | 'marriage_goal'
}

// 認証関連型定義
export type AuthUser = {
  id: string
  email: string
  user_metadata?: {
    nickname?: string
    resolution?: string
    goal_months?: number
    habit_name?: string
  }
}

export type RegisterFormData = {
  email: string
  password: string
  confirmPassword: string
  nickname: string
  resolution: string
  goalMonths: number
  habitName: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthErrorType = 
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'user_not_found'
  | 'weak_password'
  | 'email_already_registered'
  | 'session_expired'
  | 'unknown_error'

// API Response Types (CLAUDE.md準拠)
export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

export type ApiError = {
  type: 'VALIDATION_ERROR' | 'PERMISSION_ERROR' | 'BUSINESS_ERROR' | 'SYSTEM_ERROR' | 'NETWORK_ERROR'
  message: string
  code: string
  statusCode?: number
  fields?: ValidationError[]
  details?: Record<string, unknown>
}

export type ValidationError = {
  field: string
  message: string
}

export type ErrorResponse = {
  success: false
  error: ApiError
}

export type SuccessResponse<T> = {
  success: true
  data: T
}

// 彼女GET投稿専用レスポンス型
export type GirlfriendGetPostResponse = {
  success: true
  data: {
    post: Post
    girlfriend_get_post: GirlfriendGetPost
    updated_user: User
    experience_bonus: number
    marriage_deadline: string
  }
} | {
  success: false
  error: ApiError & {
    recovery_data?: {
      attempted_post_data: unknown
      user_status_before: string
      rollback_successful: boolean
    }
  }
}

// 経験値関連型
export type ExperienceGainRule = {
  action: 'daily_count' | 'self_investment_post' | 'date_post' | 'habit_declaration_post' | 'girlfriend_get_post' | 'reaction'
  points: number
  daily_limit?: number
  description: string
}

export type ExperienceHistory = {
  id: string
  user_id: string
  action: string
  points: number
  created_at: string
  description: string
}

// フロントエンド UI用型
export type CountdownDisplay = {
  type: 'girlfriend_goal' | 'marriage_goal'
  days_remaining: number
  target_date: string
  title: string
  description: string
}

export type PostFormData = {
  post_type: 'self_investment' | 'date' | 'habit_declaration' | 'girlfriend_get'
  post_date: string
  
  // 自己投資投稿
  product_name?: string
  product_url?: string
  amount?: number
  comment?: string
  
  // デート投稿
  meeting_source?: string
  meeting_count?: number
  goal_and_result?: string
  next_goal?: string
  location_url?: string
  
  // 習慣化宣言
  reference_url?: string
  action_content?: string
  frequency?: string
  before_state?: string
  after_state?: string
  
  // 彼女GET投稿
  date_count?: number
  date_location_url?: string
  joy_comment?: string
  marriage_period_months?: number
}

// デザインシステム・ガジェットテーマ関連型定義 ⭐NEW⭐

// カラーパレット型
export type ColorTheme = {
  primary: {
    main: string      // #00D9FF (Cyber Blue)
    accent: string    // #0EA5E9 (Sky-500)
    deep: string      // #0369A1 (Sky-700)
  }
  secondary: {
    success: string   // #10B981 (Emerald-500)
    experience: string // #F59E0B (Amber-500)
    warning: string   // #EF4444 (Red-500)
    info: string      // #8B5CF6 (Violet-500)
  }
  dark: {
    bgPrimary: string    // #0A0A0B
    bgSecondary: string  // #18181B
    bgAccent: string     // #27272A
    border: string       // #3F3F46
    textPrimary: string  // #FAFAFA
    textSecondary: string // #A1A1AA
  }
  glow: {
    cyan: string      // rgba(0, 217, 255, 0.3)
    green: string     // rgba(16, 185, 129, 0.3)
    amber: string     // rgba(245, 158, 11, 0.3)
  }
}

// ガジェット専門用語型
export type GadgetTerms = {
  experience: '%'                     // 経験値（確率表示、上限99%）
  habit: 'MISSION' | 'PROTOCOL'      // 習慣
  habitComplete: 'MISSION COMPLETE'   // 習慣記録
  todayAction: 'ACTIVATE'             // 今日やった！
  progress: 'PROGRESS'                // 進捗
  dashboard: 'Mission Control'        // ダッシュボード
  profile: 'System Profile'           // プロフィール
  settings: 'Configuration'           // 設定
  stream: 'UPGRADE STREAM'            // 積み上げストリーム
}

// UIコンポーネント型
export type UIComponentProps = {
  // 進捗ゲージ（XPバー）
  XPGauge: {
    current: number
    max: number
    label: string
    glowEffect?: boolean
    animated?: boolean
  }
  
  // ホログラム風カード
  HologramCard: {
    children: React.ReactNode
    variant?: 'default' | 'elevated' | 'interactive'
    glowColor?: 'cyan' | 'green' | 'amber'
    backdrop?: boolean
  }
  
  // ガジェット風ボタン
  GadgetButton: {
    variant?: 'primary' | 'secondary' | 'success' | 'danger'
    size?: 'small' | 'medium' | 'large'
    loading?: boolean
    glowEffect?: boolean
    children: React.ReactNode
    onClick?: () => void
  }
}