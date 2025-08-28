'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface RecaptchaProviderProps {
  children: React.ReactNode
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  useEffect(() => {
    // reCAPTCHAのパラメータ設定
    window.grecaptcha?.ready(() => {
      console.warn('reCAPTCHA v3 loaded successfully')
    })
  }, [])

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.warn('reCAPTCHA script loaded')
        }}
        onError={(error) => {
          console.error('Failed to load reCAPTCHA script:', error)
        }}
      />
      {children}
    </>
  )
}