/**
 * フロントエンドコンポーネント用フィクスチャ
 * 
 * UIコンポーネントのテストで使用する定型データを定義
 */

import { ButtonProps } from '@components/ui/Button'

// ===== Button Component Fixtures =====

export const buttonFixtures = {
  // 基本的なProps
  default: {
    children: 'Default Button',
  } as ButtonProps,

  primary: {
    children: 'Primary Button',
    variant: 'primary' as const,
  } as ButtonProps,

  secondary: {
    children: 'Secondary Button',
    variant: 'secondary' as const,
  } as ButtonProps,

  success: {
    children: 'Success Button',
    variant: 'success' as const,
  } as ButtonProps,

  danger: {
    children: 'Danger Button',
    variant: 'danger' as const,
  } as ButtonProps,

  ghost: {
    children: 'Ghost Button',
    variant: 'ghost' as const,
  } as ButtonProps,

  // サイズバリエーション
  small: {
    children: 'Small Button',
    size: 'sm' as const,
  } as ButtonProps,

  medium: {
    children: 'Medium Button',
    size: 'md' as const,
  } as ButtonProps,

  large: {
    children: 'Large Button',
    size: 'lg' as const,
  } as ButtonProps,

  // 状態バリエーション
  loading: {
    children: 'Loading Button',
    loading: true,
  } as ButtonProps,

  disabled: {
    children: 'Disabled Button',
    disabled: true,
  } as ButtonProps,

  withGlow: {
    children: 'Glowing Button',
    glow: true,
  } as ButtonProps,

  // イベントハンドラー付き
  withClick: {
    children: 'Clickable Button',
    onClick: () => console.log('Button clicked'),
  } as ButtonProps,

  // カスタムクラス
  withCustomClass: {
    children: 'Custom Button',
    className: 'custom-button-class',
  } as ButtonProps,

  // 複合状態
  primaryLargeGlow: {
    children: 'Primary Large Glow',
    variant: 'primary' as const,
    size: 'lg' as const,
    glow: true,
  } as ButtonProps,

  secondarySmallDisabled: {
    children: 'Secondary Small Disabled',
    variant: 'secondary' as const,
    size: 'sm' as const,
    disabled: true,
  } as ButtonProps,
}

// ===== XPGauge Component Fixtures =====

export const xpGaugeFixtures = {
  empty: {
    currentXP: 0,
    requiredXP: 1000,
  },

  quarterFull: {
    currentXP: 250,
    requiredXP: 1000,
  },

  halfFull: {
    currentXP: 500,
    requiredXP: 1000,
  },

  threeQuartersFull: {
    currentXP: 750,
    requiredXP: 1000,
  },

  almostFull: {
    currentXP: 950,
    requiredXP: 1000,
  },

  full: {
    currentXP: 1000,
    requiredXP: 1000,
  },

  overflow: {
    currentXP: 1200,
    requiredXP: 1000,
  },

  smallNumbers: {
    currentXP: 5,
    requiredXP: 10,
  },

  largeNumbers: {
    currentXP: 15000,
    requiredXP: 20000,
  },
}


// ===== Card Component Fixtures =====

export const cardFixtures = {
  basic: {
    children: 'Basic Card Content',
  },

  withHeader: {
    children: (
      <>
        <div>Card Header</div>
        <div>Card Content</div>
      </>
    ),
  },

  solid: {
    children: 'Solid Card',
    variant: 'solid' as const,
  },

  hologram: {
    children: 'Hologram Card',
    variant: 'hologram' as const,
  },

  withHover: {
    children: 'Hoverable Card',
    hover: true,
  },

  complexContent: {
    children: (
      <>
        <h3>Card Title</h3>
        <p>This is a more complex card with multiple elements.</p>
        <button>Action Button</button>
      </>
    ),
  },
}

// ===== Form Fixtures =====

export const formFixtures = {
  loginForm: {
    email: 'test@example.com',
    password: 'password123',
  },

  signupForm: {
    email: 'newuser@example.com',
    password: 'newpassword123',
    confirmPassword: 'newpassword123',
    nickname: 'newuser',
    name: 'New User',
  },

  profileForm: {
    name: 'Updated Name',
    nickname: 'updatednick',
    bio: 'This is my updated bio.',
  },

  invalidEmail: {
    email: 'invalid-email',
    password: 'password123',
  },

  shortPassword: {
    email: 'test@example.com',
    password: '123',
  },

  passwordMismatch: {
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'differentpassword',
  },
}

// ===== User Data Fixtures =====

export const userFixtures = {
  basicUser: {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
    nickname: 'testuser',
    experience: 0,
  },

  advancedUser: {
    id: 'user-2',
    email: 'advanced@example.com',
    name: 'Advanced User',
    nickname: 'advanceduser',
    experience: 2450,
    bio: 'Experienced user with high experience points',
    profileImage: 'https://example.com/avatar.jpg',
  },

  premiumUser: {
    id: 'user-3',
    email: 'premium@example.com',
    name: 'Premium User',
    nickname: 'premiumuser',
    experience: 15000,
    bio: 'Premium user with maximum benefits',
    isPremium: true,
  },
}

// ===== API Response Fixtures =====

export const apiResponseFixtures = {
  successLogin: {
    user: userFixtures.basicUser,
    token: 'mock-jwt-token',
    message: 'Login successful',
  },

  errorLogin: {
    error: 'Invalid credentials',
    message: 'Email or password is incorrect',
  },

  successSignup: {
    user: userFixtures.basicUser,
    message: 'Account created successfully',
  },

  errorSignup: {
    error: 'Email already exists',
    message: 'An account with this email already exists',
  },

  profileUpdate: {
    user: userFixtures.advancedUser,
    message: 'Profile updated successfully',
  },

  experienceGain: {
    newExperience: 650,
    experienceGained: 100,
    rewards: ['Progress milestone', '100 XP bonus'],
    message: 'Experience gained! Keep going!',
  },

  networkError: {
    error: 'Network error',
    message: 'Unable to connect to server',
  },

  serverError: {
    error: 'Internal server error',
    message: 'Something went wrong on our end',
  },
}

// ===== Event Fixtures =====

export const eventFixtures = {
  clickEvent: {
    type: 'click',
    bubbles: true,
    cancelable: true,
  },

  keyboardEvent: {
    Enter: { key: 'Enter', code: 'Enter', keyCode: 13 },
    Escape: { key: 'Escape', code: 'Escape', keyCode: 27 },
    Space: { key: ' ', code: 'Space', keyCode: 32 },
    Tab: { key: 'Tab', code: 'Tab', keyCode: 9 },
  },

  mouseEvent: {
    hover: { type: 'mouseenter', bubbles: true },
    leave: { type: 'mouseleave', bubbles: true },
  },

  formEvent: {
    submit: { type: 'submit', bubbles: true, cancelable: true },
    change: { type: 'change', bubbles: true },
    input: { type: 'input', bubbles: true },
  },
}

// ===== Viewport Fixtures =====

export const viewportFixtures = {
  mobile: {
    width: 375,
    height: 667,
    name: 'iPhone SE',
  },

  tablet: {
    width: 768,
    height: 1024,
    name: 'iPad',
  },

  desktop: {
    width: 1440,
    height: 900,
    name: 'Desktop',
  },

  ultrawide: {
    width: 1920,
    height: 1080,
    name: 'Ultrawide',
  },
}

// ===== Animation Fixtures =====

export const animationFixtures = {
  fadeIn: {
    duration: 300,
    easing: 'ease-in-out',
  },

  slideUp: {
    duration: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  bounce: {
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
}

// ===== ヘルパー関数 =====

/**
 * フィクスチャデータの深いコピーを作成
 */
export function cloneFixture<T>(fixture: T): T {
  return JSON.parse(JSON.stringify(fixture))
}

/**
 * 複数のフィクスチャをマージ
 */
export function mergeFixtures<T>(...fixtures: Partial<T>[]): T {
  return Object.assign({}, ...fixtures) as T
}

/**
 * ランダムなフィクスチャを選択
 */
export function randomFixture<T>(fixtures: Record<string, T>): T {
  const keys = Object.keys(fixtures)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return fixtures[randomKey]
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