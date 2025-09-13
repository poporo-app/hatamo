import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
        }} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                HATAMO
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                マッチングサービス
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full" />
            </div>
            
            <div className="space-y-6 text-left">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    厳選されたプロフェッショナル
                  </h3>
                  <p className="text-gray-400">
                    経験豊富な専門家との確実なマッチングを提供
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🔒</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    安心のセキュリティ
                  </h3>
                  <p className="text-gray-400">
                    個人情報保護と安全な決済システム
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    24時間サポート
                  </h3>
                  <p className="text-gray-400">
                    困ったときはいつでもサポートチームがお手伝い
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}