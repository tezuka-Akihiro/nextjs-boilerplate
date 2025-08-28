export abstract class BaseTask {
  protected validateRequired(value: unknown, fieldName: string): void {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${fieldName} is required`)
    }
  }

  protected validateEmail(email: string): void {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email format')
    }
    
    // 基本的なメールフォーマットチェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    // 無効なパターンをチェック
    const invalidPatterns = [
      /\.\./,          // 連続するドット
      /^@/,            // @で開始
      /@$/,            // @で終了  
      /^[^@]*$/,       // @が含まれない
      /\s/,            // スペースが含まれる
      /@.*@/,          // 複数の@
      /^\..*@/,        // ドットで開始
      /\.@/,           // @の直前にドット
      /@\./,           // @の直後にドット
      /\.$@/           // ドットで終了
    ]
    
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }
    
    // 無効パターンのチェック
    for (const pattern of invalidPatterns) {
      if (pattern.test(email)) {
        throw new Error('Invalid email format')
      }
    }
  }

  protected validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }
  }

  protected validateNickname(nickname: string): void {
    if (nickname.length < 2 || nickname.length > 50) {
      throw new Error('Nickname must be between 2 and 50 characters')
    }
  }

  protected validateTextLength(text: string, fieldName: string, maxLength: number): void {
    if (text.length > maxLength) {
      throw new Error(`${fieldName} must be ${maxLength} characters or less`)
    }
  }
}