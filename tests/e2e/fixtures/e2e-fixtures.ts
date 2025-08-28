/**
 * E2Eテスト用フィクスチャ
 * 
 * エンドツーエンドテストで使用する定型データとヘルパー関数を定義
 */

import { Page, BrowserContext } from '@playwright/test'
import { E2ETestBase } from '../base/E2ETestBase'

// ===== ユーザーフィクスチャ =====

export const userFixtures = {
  basicUser: {
    email: 'test-basic@example.com',
    password: 'test123456',
    nickname: 'BasicUser',
    name: 'Test Basic User',
    experience: 0,
    relationship_status: 'single' as const,
  },

  advancedUser: {
    email: 'test-advanced@example.com',
    password: 'test123456',
    nickname: 'AdvancedUser',
    name: 'Test Advanced User',
    experience: 2450,
    relationship_status: 'single' as const,
  },

  datingUser: {
    email: 'test-dating@example.com',
    password: 'test123456',
    nickname: 'DatingUser',
    name: 'Test Dating User',
    experience: 1200,
    relationship_status: 'dating' as const,
  },

  premiumUser: {
    email: 'test-premium@example.com',
    password: 'test123456',
    nickname: 'PremiumUser',
    name: 'Test Premium User',
    experience: 15000,
    relationship_status: 'single' as const,
    isPremium: true,
  }
}

// ===== 投稿フィクスチャ =====

export const postFixtures = {
  basicPost: {
    content: 'これは基本的な投稿のテストです。今日もトレーニングを頑張りました！',
    category: '自己投資',
  },

  datePost: {
    content: '今日は素敵なデートを楽しみました。相手のことをもっと知ることができて良かった。',
    category: 'デート',
  },

  habitPost: {
    content: '毎日の読書習慣を継続中。今日で30日目達成！',
    category: '習慣化宣言',
  },

  girlfriendGetPost: {
    content: 'ついに彼女ができました！半年間の努力が実りました。',
    category: '彼女GET',
    marriageDeadline: 12, // 12ヶ月後
  },

  longPost: {
    content: `
      今日は特別な一日でした。朝早く起きてジムに行き、
      しっかりとトレーニングを積みました。その後、
      新しいスキルを学ぶためのオンラインコースを受講し、
      夕方には友人と食事を楽しみました。
      充実した一日を過ごすことができて、
      自分自身の成長を実感しています。
    `.trim(),
    category: '自己投資',
  },

  emptyPost: {
    content: '',
    category: '自己投資',
  },

  invalidPost: {
    content: 'テスト'.repeat(200), // 文字数制限超過
    category: '自己投資',
  }
}

// ===== フォームフィクスチャ =====

export const formFixtures = {
  validLogin: {
    email: 'test-basic@example.com',
    password: 'test123456',
  },

  invalidLogin: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },

  validSignup: {
    email: 'new-user@example.com',
    password: 'newpassword123',
    confirmPassword: 'newpassword123',
    nickname: 'NewUser',
    name: 'New Test User',
    resolution: '半年以内に理想の自分になる',
  },

  invalidSignup: {
    email: 'invalid-email',
    password: '123',
    confirmPassword: '456',
    nickname: '',
    name: '',
    resolution: '',
  },

  profileUpdate: {
    name: 'Updated Name',
    nickname: 'UpdatedNick',
    bio: '新しい自己紹介文です。',
    goal: '新しい目標設定',
  }
}

// ===== APIレスポンスフィクスチャ =====

export const apiResponseFixtures = {
  loginSuccess: {
    user: userFixtures.basicUser,
    token: 'mock-jwt-token-12345',
    message: 'ログインに成功しました',
  },

  loginError: {
    error: 'Invalid credentials',
    message: 'メールアドレスまたはパスワードが正しくありません',
  },

  signupSuccess: {
    user: userFixtures.basicUser,
    message: 'アカウントが作成されました',
  },

  signupError: {
    error: 'Email already exists',
    message: 'このメールアドレスは既に使用されています',
  },

  postSuccess: {
    id: 'post-12345',
    content: postFixtures.basicPost.content,
    category: postFixtures.basicPost.category,
    experience_gained: 0.2,
    message: '投稿が完了しました',
  },

  postError: {
    error: 'Content too long',
    message: '投稿内容が長すぎます',
  },

  experienceUpdate: {
    new_experience: 125.8,
    experience_gained: 3.0,
    message: '経験値が加算されました',
  },

  experienceGain: {
    new_experience: 150.0,
    rewards: ['経験値マイルストーン達成', '100XPボーナス'],
    message: '経験値が増加しました！継続していきましょう！',
  },

  networkError: {
    error: 'Network error',
    message: 'ネットワークエラーが発生しました',
  },

  serverError: {
    error: 'Internal server error',
    message: 'サーバーエラーが発生しました',
  }
}

// ===== ファイルフィクスチャ =====

export const fileFixtures = {
  validImage: {
    name: 'test-image.jpg',
    type: 'image/jpeg',
    size: 1024 * 100, // 100KB
  },

  largeImage: {
    name: 'large-image.jpg',
    type: 'image/jpeg',
    size: 1024 * 1024 * 10, // 10MB
  },

  invalidFile: {
    name: 'document.pdf',
    type: 'application/pdf',
    size: 1024 * 50, // 50KB
  }
}

// ===== URL・パスフィクスチャ =====

export const urlFixtures = {
  pages: {
    home: '/',
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
    login: '/auth/signin',
    signup: '/auth/signup',
    logout: '/auth/logout',
    posts: '/posts',
    about: '/about',
    privacy: '/privacy',
    terms: '/terms',
  },

  api: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
    profile: '/api/user/profile',
    posts: '/api/posts',
    experience: '/api/user/experience',
    upload: '/api/upload',
  },

  external: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    documentation: 'https://docs.example.com',
  }
}

// ===== タイミング・デバイスフィクスチャ =====

export const timingFixtures = {
  timeouts: {
    short: 1000,    // 1秒
    medium: 5000,   // 5秒
    long: 10000,    // 10秒
    veryLong: 30000, // 30秒
  },

  delays: {
    typing: 100,    // タイピングの遅延
    animation: 300, // アニメーション待機
    api: 1000,      // API呼び出し遅延
    navigation: 2000, // ページ遷移待機
  }
}

export const deviceFixtures = {
  mobile: {
    name: 'iPhone 12',
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
  },

  tablet: {
    name: 'iPad Pro',
    viewport: { width: 1024, height: 1366 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
  },

  desktop: {
    name: 'Desktop Chrome',
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  }
}

// ===== ヘルパー関数 =====

/**
 * E2Eテスト用のベースクラスファクトリー
 */
export function createE2ETestBase(page: Page, context: BrowserContext): E2ETestBase {
  return new (class extends E2ETestBase {
    constructor() {
      super(page, context)
    }
  })()
}

/**
 * テストデータの深いコピーを作成
 */
export function cloneTestData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

/**
 * ランダムなテストデータを生成
 */
export function generateRandomTestData() {
  const randomString = Math.random().toString(36).substring(2, 8)
  
  return {
    email: `test-${randomString}@example.com`,
    password: `password-${randomString}`,
    nickname: `User${randomString}`,
    name: `Test User ${randomString}`,
  }
}

/**
 * フィクスチャのマージ
 */
export function mergeFixtures<T>(...fixtures: Partial<T>[]): T {
  return Object.assign({}, ...fixtures) as T
}

/**
 * 条件に基づいてフィクスチャをフィルタリング
 */
export function filterFixtures<T>(
  fixtures: Record<string, T>,
  predicate: (fixture: T) => boolean
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(fixtures).filter(([, fixture]) => predicate(fixture))
  )
}

/**
 * APIモックレスポンスの設定
 */
export async function setupApiMocks(page: Page, mocks: Record<string, any>) {
  await page.route('**/api/**', async (route) => {
    const url = route.request().url()
    const method = route.request().method()
    
    // マッチするモックを検索
    const mockKey = Object.keys(mocks).find(pattern => url.includes(pattern))
    
    if (mockKey) {
      const mockResponse = mocks[mockKey]
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      })
    } else {
      await route.continue()
    }
  })
}

/**
 * 認証状態の事前設定
 */
export async function setupAuthState(
  context: BrowserContext,
  userType: keyof typeof userFixtures = 'basicUser'
) {
  const user = userFixtures[userType]
  
  // ローカルストレージに認証情報を設定
  await context.addInitScript((userData) => {
    localStorage.setItem('auth_token', 'mock-jwt-token')
    localStorage.setItem('user_data', JSON.stringify(userData))
  }, user)
}

/**
 * テスト環境の初期化
 */
export async function initializeTestEnvironment(page: Page) {
  // エラーハンドリング
  page.on('pageerror', error => {
    console.error('Page error:', error.message)
  })
  
  page.on('requestfailed', request => {
    console.error('Request failed:', request.url(), request.failure()?.errorText)
  })
  
  // コンソールログの監視
  page.on('console', message => {
    if (message.type() === 'error') {
      console.error('Console error:', message.text())
    }
  })
}