'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
  } | null;
  onLogout?: () => void;
}

export default function Header({ isAuthenticated = false, user = null, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMenuDropdown = () => {
    setIsMenuDropdownOpen(!isMenuDropdownOpen);
  };

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      onLogout?.();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-14">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              tsumiage
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* メニュードロップダウン */}
                <div className="relative">
                  <button
                    onClick={toggleMenuDropdown}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                  >
                    <span>MENU</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isMenuDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <Link href="/status" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        📊 ステータス確認
                      </Link>
                      <Link href="/social" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        📊 SNS
                      </Link>
                      <Link href="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        ❓ よくある質問
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      >
                        🚪 ログアウト
                      </button>
                    </div>
                  )}
                </div>

                {/* ログアウトボタン */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2">
                  LOGIN
                </Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  SIGNUP
                </Link>
              </>
            )}
          </div>

          {/* モバイルハンバーガーメニュー */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {isAuthenticated ? (
              <>
                <Link href="/status" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md">
                  📊 ステータス確認
                </Link>
                <Link href="/social" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md">
                  📊 SNS
                </Link>
                <Link href="/faq" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md">
                  ❓ よくある質問
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md"
                >
                  🚪 ログアウト
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md">
                  LOGIN
                </Link>
                <Link href="/signup" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md">
                  SIGNUP
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}