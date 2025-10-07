'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SponsorRegisterPage() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('code');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-slate-900">
            スポンサー登録
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            事業者情報を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                招待コード: <span className="font-mono font-semibold">{inviteCode}</span>
              </p>
            </div>
            <div className="text-center text-slate-600 py-8">
              <p className="text-lg">このページは現在実装中です</p>
              <p className="text-sm mt-2">スポンサー登録フォームがここに表示されます</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
