export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          テストページ
        </h1>
        <p className="text-gray-600">
          開発サーバーが正常に動作しています。
        </p>
        <div className="mt-4">
          <span className="text-sm text-green-600">✓ 接続成功</span>
        </div>
      </div>
    </div>
  )
}
