import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function BusinessAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-green-900`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`,
        }} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                HATAMO for Business
              </h1>
              <p className="text-xl text-green-200 mb-8">
                事業者向けマッチングサービス
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full" />
            </div>
            
            <div className="space-y-6 text-left">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    安定した収益機会
                  </h3>
                  <p className="text-green-200">
                    質の高い顧客との継続的なビジネスチャンス
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    売上管理ツール
                  </h3>
                  <p className="text-green-200">
                    リアルタイムで売上・申込状況を把握
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    ターゲット顧客へのアプローチ
                  </h3>
                  <p className="text-green-200">
                    マッチング精度の高い顧客獲得を実現
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-lime-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🛡️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    安心の決済システム
                  </h3>
                  <p className="text-green-200">
                    確実な入金と透明性の高い手数料体系
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