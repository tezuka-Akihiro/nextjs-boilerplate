'use client'

import { useCallback } from 'react'

interface RecaptchaResponse {
  token: string | null
  error?: string
}

export function useRecaptcha() {
  const executeRecaptcha = useCallback(async (action: string): Promise<RecaptchaResponse> => {
    try {
      // reCAPTCHA v3スクリプトが読み込まれているかチェック
      if (!window.grecaptcha || !window.grecaptcha.ready) {
        return {
          token: null,
          error: 'reCAPTCHA not loaded'
        }
      }

      return new Promise((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            { action }
          ).then((token: string) => {
            resolve({ token })
          }).catch((error: Error) => {
            resolve({
              token: null,
              error: error.message
            })
          })
        })
      })
    } catch (error) {
      return {
        token: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }, [])

  return { executeRecaptcha }
}

// グローバル型定義の拡張
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}