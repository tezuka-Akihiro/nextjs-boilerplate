/**
 * ユーザーテスト用フィクスチャ
 * 
 * テストで使用する定型データを定義
 */

import { UserType } from '@shared/types'

export const userFixtures = {
  validUser: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'test@example.com',
    name: 'Test User',
    nickname: 'testuser',
    status: 'active',
    profile_image_url: null,
    bio: null,
    resolution_statement: null,
    resolution_deadline: null,
    experience_points: 0,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  } as UserType,

  anotherUser: {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'another@example.com',
    name: 'Another User',
    nickname: 'anotheruser',
    status: 'active',
    profile_image_url: null,
    bio: 'Another test user bio',
    resolution_statement: '毎日運動する',
    resolution_deadline: '2024-12-31T23:59:59.000Z',
    experience_points: 150,
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z'
  } as UserType,

  premiumUser: {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'premium@example.com',
    name: 'Premium User',
    nickname: 'premiumuser',
    status: 'active',
    profile_image_url: 'https://example.com/avatar.jpg',
    bio: 'Premium user with advanced features',
    resolution_statement: '起業して成功する',
    resolution_deadline: '2025-12-31T23:59:59.000Z',
    experience_points: 1500,
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  } as UserType,

  inactiveUser: {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'inactive@example.com',
    name: 'Inactive User',
    nickname: 'inactiveuser',
    status: 'inactive',
    profile_image_url: null,
    bio: null,
    resolution_statement: null,
    resolution_deadline: null,
    experience_points: 0,
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z'
  } as UserType,

  userWithLongBio: {
    id: '00000000-0000-0000-0000-000000000005',
    email: 'longbio@example.com',
    name: 'User With Long Bio',
    nickname: 'longbiouser',
    status: 'active',
    profile_image_url: null,
    bio: 'これは非常に長い自己紹介文です。'.repeat(10), // 長いbio
    resolution_statement: '毎日1時間勉強する',
    resolution_deadline: '2024-06-30T23:59:59.000Z',
    experience_points: 500,
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z'
  } as UserType,

  // バリデーションエラー用の無効なデータ
  invalidUsers: {
    missingEmail: {
      name: 'No Email User',
      nickname: 'noemail'
    },

    invalidEmail: {
      email: 'invalid-email-format',
      name: 'Invalid Email User',
      nickname: 'invalidemail'
    },

    missingName: {
      email: 'noname@example.com',
      nickname: 'noname'
    },

    missingNickname: {
      email: 'nonickname@example.com',
      name: 'No Nickname User'
    },

    emptyName: {
      email: 'emptyname@example.com',
      name: '',
      nickname: 'emptyname'
    },

    tooLongName: {
      email: 'toolong@example.com',
      name: 'あ'.repeat(101), // 100文字制限を超える
      nickname: 'toolong'
    },

    tooLongNickname: {
      email: 'toolongnick@example.com',
      name: 'Too Long Nickname User',
      nickname: 'a'.repeat(31) // 30文字制限を超える
    },

    invalidStatus: {
      email: 'invalidstatus@example.com',
      name: 'Invalid Status User',
      nickname: 'invalidstatus',
      status: 'unknown' // 'active' または 'inactive' 以外
    },

    negativeExperiencePoints: {
      email: 'negative@example.com',
      name: 'Negative User',
      nickname: 'negative',
      experience_points: -10
    },

  },

  // 特殊ケース用のデータ
  edgeCases: {
    maxLengthName: {
      email: 'maxname@example.com',
      name: 'あ'.repeat(100), // 最大長の名前
      nickname: 'maxname'
    },

    maxLengthNickname: {
      email: 'maxnick@example.com',
      name: 'Max Nickname User',
      nickname: 'a'.repeat(30) // 最大長のニックネーム
    },

    unicodeCharacters: {
      email: 'unicode@example.com',
      name: '🚀 Unicode User 🌟',
      nickname: 'unicode',
      bio: '絵文字と特殊文字 ✨ を含むテスト 🎉'
    },

    specialEmailCharacters: {
      email: 'test+tag@example-domain.co.jp',
      name: 'Special Email User',
      nickname: 'specialemail'
    },

    futureDeadline: {
      email: 'future@example.com',
      name: 'Future User',
      nickname: 'future',
      resolution_statement: '未来の目標',
      resolution_deadline: '2030-12-31T23:59:59.000Z'
    },

    pastDeadline: {
      email: 'past@example.com',
      name: 'Past User',
      nickname: 'past',
      resolution_statement: '過去の目標',
      resolution_deadline: '2020-12-31T23:59:59.000Z'
    }
  }
}

/**
 * フィクスチャデータの配列を取得
 */
export function getAllValidUsers(): UserType[] {
  return [
    userFixtures.validUser,
    userFixtures.anotherUser,
    userFixtures.premiumUser,
    userFixtures.inactiveUser,
    userFixtures.userWithLongBio
  ]
}

/**
 * ランダムなユーザーフィクスチャを取得
 */
export function getRandomUserFixture(): UserType {
  const validUsers = getAllValidUsers()
  const randomIndex = Math.floor(Math.random() * validUsers.length)
  return validUsers[randomIndex]
}

/**
 * 特定のステータスのユーザーフィクスチャを取得
 */
export function getUsersByStatus(status: 'active' | 'inactive'): UserType[] {
  return getAllValidUsers().filter(user => user.status === status)
}

/**
 * 経験値の範囲でユーザーフィクスチャを取得
 */
export function getUsersByExperienceRange(min: number, max: number): UserType[] {
  return getAllValidUsers().filter(user => 
    user.experience_points >= min && user.experience_points <= max
  )
}


/**
 * 目標設定済みのユーザーフィクスチャを取得
 */
export function getUsersWithResolution(): UserType[] {
  return getAllValidUsers().filter(user => user.resolution_statement !== null)
}

/**
 * プロフィール画像設定済みのユーザーフィクスチャを取得
 */
export function getUsersWithProfileImage(): UserType[] {
  return getAllValidUsers().filter(user => user.profile_image_url !== null)
}