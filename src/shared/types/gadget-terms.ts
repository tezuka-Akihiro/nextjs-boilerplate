export const GADGET_TERMS = {
  // 基本用語
  EXPERIENCE: 'XP',
  HABIT: 'MISSION',
  PROTOCOL: 'PROTOCOL',
  ACHIEVEMENT: 'COMPLETE',
  PROGRESS: 'PROGRESS',
  
  // システム用語
  DASHBOARD: 'Mission Control',
  PROFILE: 'System Profile',
  SETTINGS: 'Configuration',
  STATS: 'Analytics',
  NOTIFICATION: 'System Alert',
  
  // アクション用語
  POST: 'TRANSMIT',
  LIKE: 'BOOST',
  COMMENT: 'SIGNAL',
  FOLLOW: 'SYNC',
  
  // ステータス用語
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
  FAILED: 'ERROR',
  
  // UI用語
  LOADING: 'Processing...',
  SUCCESS: 'UPGRADE COMPLETE',
  ERROR: 'SYSTEM ERROR',
  CONFIRM: 'EXECUTE',
  CANCEL: 'ABORT'
} as const

export type GadgetTerms = typeof GADGET_TERMS[keyof typeof GADGET_TERMS]

export const getGadgetTerm = (key: keyof typeof GADGET_TERMS): string => {
  return GADGET_TERMS[key]
}

export const formatXP = (xp: number): string => {
  return `${xp.toLocaleString()} XP`
}



export const formatProgress = (current: number, total: number): string => {
  const percentage = Math.round((current / total) * 100)
  return `${percentage}%`
}