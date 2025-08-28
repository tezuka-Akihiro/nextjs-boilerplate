import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel デプロイ最適化
  output: 'standalone',
  
  // サーバー外部パッケージ
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // 実験的機能
  // typedRoutes: true, // 一時的に無効化
 
  
  // 画像最適化
  images: {
    domains: ['localhost', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: false,
    minimumCacheTTL: 60,
  },
  
  // TypeScript設定
  typescript: {
    tsconfigPath: './tsconfig.json',
    // 本番ビルド時の型チェック強化
    ignoreBuildErrors: process.env.SKIP_ENV_VALIDATION === 'true',
  },
  
  // ESLint設定
  eslint: {
    dirs: ['src'],
    // 本番ビルド時のESLint無視
    ignoreDuringBuilds: process.env.SKIP_ENV_VALIDATION === 'true',
  },
  
  // 環境変数
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE || 'true',
  },
  
  // Webpack設定
  webpack: (config, { isServer, dev }) => {
    // バンドル分析
    if (process.env.BUILD_ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer ? '../analyze/server.html' : '../analyze/client.html',
          openAnalyzer: false,
        })
      );
    }

    // 本番環境最適化
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            enforce: true,
          },
          supabase: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            enforce: true,
          },
        },
      };
    }

    return config;
  },
  
  // セキュリティヘッダー（本番環境強化）
  async headers() {
    const securityHeaders = [
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
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];

    // 本番環境のみHTST
    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/api/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? process.env.NEXTAUTH_URL || 'https://projectname.vercel.app'
              : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
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
      {
        source: '/login',
        destination: '/auth/login',
        permanent: false,
      },
      {
        source: '/register',
        destination: '/auth/register',
        permanent: false,
      },
    ];
  },

  // リライト設定（API監視用）
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/monitoring/health',
      },
      {
        source: '/api/metrics',
        destination: '/api/monitoring/metrics',
      },
    ];
  },

  // 本番環境設定
  ...(process.env.NODE_ENV === 'production' && {
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
  }),

  // 開発環境設定
  ...(process.env.NODE_ENV === 'development' && {
    reactStrictMode: true,
  }),
};

export default nextConfig;
