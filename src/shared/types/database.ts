export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          nickname: string
          goal_months: number
          habit_name: string
          experience: number
          relationship_status: 'single' | 'dating' | 'married'
          relationship_deadline: string | null
          girlfriend_get_date: string | null
          marriage_period_months: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nickname: string
          goal_months: number
          habit_name: string
          experience?: number
          relationship_status?: 'single' | 'dating' | 'married'
          relationship_deadline?: string | null
          girlfriend_get_date?: string | null
          marriage_period_months?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nickname?: string
          goal_months?: number
          habit_name?: string
          experience?: number
          relationship_status?: 'single' | 'dating' | 'married'
          relationship_deadline?: string | null
          girlfriend_get_date?: string | null
          marriage_period_months?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_counts: {
        Row: {
          user_id: string
          count_date: string
          completed: boolean
          experience_gained: number
          created_at: string
        }
        Insert: {
          user_id: string
          count_date: string
          completed?: boolean
          experience_gained?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          count_date?: string
          completed?: boolean
          experience_gained?: number
          created_at?: string
        }
      }
      post_types: {
        Row: {
          id: number
          name: string
          display_name: string
          base_experience: number
        }
        Insert: {
          id: number
          name: string
          display_name: string
          base_experience?: number
        }
        Update: {
          id?: number
          name?: string
          display_name?: string
          base_experience?: number
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          post_type_id: number
          post_date: string
          experience_gained: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_type_id: number
          post_date: string
          experience_gained?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_type_id?: number
          post_date?: string
          experience_gained?: number
          created_at?: string
          updated_at?: string
        }
      }
      self_investment_posts: {
        Row: {
          id: string
          post_id: string
          product_name: string
          product_url: string | null
          amount: number | null
          comment: string | null
        }
        Insert: {
          id?: string
          post_id: string
          product_name: string
          product_url?: string | null
          amount?: number | null
          comment?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          product_name?: string
          product_url?: string | null
          amount?: number | null
          comment?: string | null
        }
      }
      date_posts: {
        Row: {
          id: string
          post_id: string
          meeting_source: string | null
          meeting_count: number | null
          goal_and_result: string | null
          next_goal: string | null
          location_url: string | null
        }
        Insert: {
          id?: string
          post_id: string
          meeting_source?: string | null
          meeting_count?: number | null
          goal_and_result?: string | null
          next_goal?: string | null
          location_url?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          meeting_source?: string | null
          meeting_count?: number | null
          goal_and_result?: string | null
          next_goal?: string | null
          location_url?: string | null
        }
      }
      habit_declaration_posts: {
        Row: {
          id: string
          post_id: string
          reference_url: string | null
          action_content: string
          frequency: string | null
          before_state: string | null
          after_state: string | null
        }
        Insert: {
          id?: string
          post_id: string
          reference_url?: string | null
          action_content: string
          frequency?: string | null
          before_state?: string | null
          after_state?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          reference_url?: string | null
          action_content?: string
          frequency?: string | null
          before_state?: string | null
          after_state?: string | null
        }
      }
      girlfriend_get_posts: {
        Row: {
          id: string
          post_id: string
          date_count: number
          date_location_url: string | null
          goal_and_result: string
          joy_comment: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          date_count: number
          date_location_url?: string | null
          goal_and_result: string
          joy_comment: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          date_count?: number
          date_location_url?: string | null
          goal_and_result?: string
          joy_comment?: string
          created_at?: string
        }
      }
      reaction_types: {
        Row: {
          id: number
          name: string
          display_name: string
          experience_points: number
          sort_order: number | null
          created_at: string
        }
        Insert: {
          id: number
          name: string
          display_name: string
          experience_points?: number
          sort_order?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          display_name?: string
          experience_points?: number
          sort_order?: number | null
          created_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          user_id: string
          post_id: string
          reaction_type_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          reaction_type_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          reaction_type_id?: number
          created_at?: string
        }
      }
      daily_reaction_limits: {
        Row: {
          user_id: string
          reaction_date: string
          reaction_count: number
          experience_gained: number
          created_at: string
        }
        Insert: {
          user_id: string
          reaction_date: string
          reaction_count?: number
          experience_gained?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          reaction_date?: string
          reaction_count?: number
          experience_gained?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      process_girlfriend_get_post: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      check_daily_count_limit: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}