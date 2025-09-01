export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            tsumiage
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            積み上げる、男磨きアプリ
          </p>
        </div>

        <div style={{ backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '2rem' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                placeholder="example@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.75rem 1rem', border: 'none', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#2563eb', cursor: 'pointer' }}
              >
                ログイン
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                アカウントをお持ちでない方は{' '}
                <a href="#" style={{ fontWeight: '500', color: '#2563eb', textDecoration: 'none' }}>
                  新規登録
                </a>
              </p>
            </div>
          </form>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            継続は力なり。積み上げていこう。
          </p>
        </div>
      </div>
    </div>
  )
}