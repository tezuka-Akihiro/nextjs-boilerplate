/**
 * BaseTask ユニットテスト
 * AI滑走路4層アーキテクチャ準拠
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { BaseTask } from '@tasks/BaseTask'

// テスト用BaseTask実装
class TestTask extends BaseTask {
  testValidateRequired(value: unknown, fieldName: string) {
    return this.validateRequired(value, fieldName)
  }

  testValidateEmail(email: string) {
    return this.validateEmail(email)
  }

  testValidatePassword(password: string) {
    return this.validatePassword(password)
  }

  testValidateNickname(nickname: string) {
    return this.validateNickname(nickname)
  }

  testValidateTextLength(text: string, fieldName: string, maxLength: number) {
    return this.validateTextLength(text, fieldName, maxLength)
  }
}

describe('BaseTask', () => {
  let task: TestTask

  beforeEach(() => {
    task = new TestTask()
  })

  describe('validateRequired', () => {
    describe('正常系', () => {
      it('should not throw for valid string', () => {
        expect(() => task.testValidateRequired('valid string', 'testField')).not.toThrow()
      })

      it('should not throw for valid number', () => {
        expect(() => task.testValidateRequired(42, 'testField')).not.toThrow()
      })

      it('should not throw for zero', () => {
        expect(() => task.testValidateRequired(0, 'testField')).not.toThrow()
      })

      it('should not throw for false boolean', () => {
        expect(() => task.testValidateRequired(false, 'testField')).not.toThrow()
      })

      it('should not throw for empty array', () => {
        expect(() => task.testValidateRequired([], 'testField')).not.toThrow()
      })

      it('should not throw for empty object', () => {
        expect(() => task.testValidateRequired({}, 'testField')).not.toThrow()
      })
    })

    describe('異常系', () => {
      it('should throw for null value', () => {
        expect(() => task.testValidateRequired(null, 'testField'))
          .toThrow('testField is required')
      })

      it('should throw for undefined value', () => {
        expect(() => task.testValidateRequired(undefined, 'testField'))
          .toThrow('testField is required')
      })

      it('should throw for empty string', () => {
        expect(() => task.testValidateRequired('', 'testField'))
          .toThrow('testField is required')
      })

      it('should include field name in error message', () => {
        expect(() => task.testValidateRequired(null, 'customFieldName'))
          .toThrow('customFieldName is required')
      })
    })
  })

  describe('validateEmail', () => {
    describe('正常系', () => {
      it('should not throw for valid email formats', () => {
        const validEmails = [
          'test@example.com',
          'user.name@example.com',
          'user+tag@example.co.jp',
          'test123@subdomain.example.org',
          'a@b.co'
        ]

        validEmails.forEach(email => {
          expect(() => task.testValidateEmail(email)).not.toThrow()
        })
      })
    })

    describe('異常系', () => {
      it('should throw for invalid email formats', () => {
        const invalidEmails = [
          'plainaddress',
          '@example.com', 
          'test@',
          'test..test@example.com',
          'test@example',
          'test @example.com',
          'test@ex ample.com'
        ]

        invalidEmails.forEach(email => {
          expect(() => task.testValidateEmail(email))
            .toThrow('Invalid email format')
        })
      })

      it('should throw for empty email', () => {
        expect(() => task.testValidateEmail(''))
          .toThrow('Invalid email format')
      })

      it('should throw for null email', () => {
        expect(() => task.testValidateEmail(null as any))
          .toThrow('Invalid email format')
      })

      it('should throw for undefined email', () => {
        expect(() => task.testValidateEmail(undefined as any))
          .toThrow('Invalid email format')
      })
    })
  })

  describe('validatePassword', () => {
    describe('正常系', () => {
      it('should not throw for valid passwords', () => {
        const validPasswords = [
          'password123',
          'mySecurePass',
          'a1b2c3d4e5f6g7h8',
          '12345678',
          'Password!'
        ]

        validPasswords.forEach(password => {
          expect(() => task.testValidatePassword(password)).not.toThrow()
        })
      })
    })

    describe('異常系', () => {
      it('should throw for passwords shorter than 8 characters', () => {
        const shortPasswords = [
          'short',
          '1234567',
          'a',
          ''
        ]

        shortPasswords.forEach(password => {
          expect(() => task.testValidatePassword(password))
            .toThrow('Password must be at least 8 characters long')
        })
      })
    })
  })

  describe('validateNickname', () => {
    describe('正常系', () => {
      it('should not throw for valid nicknames', () => {
        const validNicknames = [
          'ab',
          'test',
          'validNickname',
          'user123',
          'a'.repeat(50) // 50文字ちょうど
        ]

        validNicknames.forEach(nickname => {
          expect(() => task.testValidateNickname(nickname)).not.toThrow()
        })
      })
    })

    describe('異常系', () => {
      it('should throw for nicknames shorter than 2 characters', () => {
        const shortNicknames = [
          'a',
          ''
        ]

        shortNicknames.forEach(nickname => {
          expect(() => task.testValidateNickname(nickname))
            .toThrow('Nickname must be between 2 and 50 characters')
        })
      })

      it('should throw for nicknames longer than 50 characters', () => {
        const longNickname = 'a'.repeat(51)
        
        expect(() => task.testValidateNickname(longNickname))
          .toThrow('Nickname must be between 2 and 50 characters')
      })
    })
  })

  describe('validateTextLength', () => {
    describe('正常系', () => {
      it('should not throw for text within limit', () => {
        expect(() => task.testValidateTextLength('short text', 'description', 100))
          .not.toThrow()
      })

      it('should not throw for text exactly at limit', () => {
        const text = 'a'.repeat(50)
        expect(() => task.testValidateTextLength(text, 'description', 50))
          .not.toThrow()
      })

      it('should not throw for empty text', () => {
        expect(() => task.testValidateTextLength('', 'description', 100))
          .not.toThrow()
      })
    })

    describe('異常系', () => {
      it('should throw for text exceeding limit', () => {
        const longText = 'a'.repeat(101)
        
        expect(() => task.testValidateTextLength(longText, 'description', 100))
          .toThrow('description must be 100 characters or less')
      })

      it('should include field name in error message', () => {
        const longText = 'a'.repeat(51)
        
        expect(() => task.testValidateTextLength(longText, 'customField', 50))
          .toThrow('customField must be 50 characters or less')
      })

      it('should include max length in error message', () => {
        const longText = 'a'.repeat(26)
        
        expect(() => task.testValidateTextLength(longText, 'title', 25))
          .toThrow('title must be 25 characters or less')
      })
    })
  })

  describe('複合バリデーションテスト', () => {
    it('should validate multiple fields in sequence', () => {
      // 正常系の複合テスト
      expect(() => {
        task.testValidateRequired('test@example.com', 'email')
        task.testValidateEmail('test@example.com')
        task.testValidateRequired('password123', 'password')
        task.testValidatePassword('password123')
        task.testValidateRequired('nickname', 'nickname')
        task.testValidateNickname('nickname')
      }).not.toThrow()
    })

    it('should fail fast on first validation error', () => {
      expect(() => {
        task.testValidateRequired(null, 'email')
        // この行には到達しない
        task.testValidateEmail('invalid-email')
      }).toThrow('email is required')
    })
  })

  describe('エラーメッセージの一貫性', () => {
    it('should provide consistent error message format', () => {
      const testCases = [
        { fn: () => task.testValidateRequired(null, 'testField'), expected: /testField is required/ },
        { fn: () => task.testValidateEmail('invalid'), expected: /Invalid email format/ },
        { fn: () => task.testValidatePassword('short'), expected: /Password must be at least 8 characters long/ },
        { fn: () => task.testValidateNickname('a'), expected: /Nickname must be between 2 and 50 characters/ },
        { fn: () => task.testValidateTextLength('toolong', 'test', 3), expected: /test must be 3 characters or less/ }
      ]

      testCases.forEach(({ fn, expected }) => {
        expect(fn).toThrow(expected)
      })
    })
  })
})