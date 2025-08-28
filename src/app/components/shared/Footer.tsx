'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* サービスリンク */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features/stackup" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  積み上げ機能
                </Link>
              </li>
              <li>
                <Link href="/features/sns" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  SNS機能
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  クッキーポリシー
                </Link>
              </li>
              <li>
                <Link href="/commercial-law" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  特定商取引法
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライトとトップへ戻るボタン */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            © tsumiage. All rights reserved.
          </div>
          
          {showScrollToTop && (
            <button
              onClick={scrollToTop}
              className="flex flex-col items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
              aria-label="トップへ戻る"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-xs mt-1">TOP</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}