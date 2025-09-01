import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 基本設定
  reactStrictMode: true,
  
  // 画像最適化
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: false,
    minimumCacheTTL: 60,
  },
  
  // TypeScript設定
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: false,
  },
  
  // ESLint設定
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: false,
  },
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
    // ワークスペースルートの明示（警告解消）
  outputFileTracingRoot: __dirname,
};

export default nextConfig;