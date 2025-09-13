import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">HATAMO</h3>
            <p className="text-sm">
              異次元コミュニティ
              <br />
              マッチングサービス
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">サービスについて</Link></li>
              <li><Link href="/how-to" className="hover:text-white transition-colors">ご利用方法</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">よくある質問</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">スポンサー</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sponsor/register" className="hover:text-white transition-colors">スポンサー登録</Link></li>
              <li><Link href="/sponsor/guide" className="hover:text-white transition-colors">掲載ガイド</Link></li>
              <li><Link href="/sponsor/fees" className="hover:text-white transition-colors">料金プラン</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">法務・規約</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">利用規約</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/commercial-transaction" className="hover:text-white transition-colors">特定商取引法に基づく表記</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 HATAMO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}