'use client';

import { ClientLayout } from '@/components/client/ClientLayout';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

// バリデーションスキーマ
const profileSchema = z.object({
  name: z.string().min(1, '氏名は必須です').max(50, '氏名は50文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  newPassword: z.string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'パスワードは英数字を含む必要があります'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// モックデータ
const MOCK_USER = {
  name: '山田太郎',
  email: 'yamada@example.com',
  profileImage: null,
  userType: 'CLIENT',
  emailVerified: true,
  createdAt: '2024-09-15T10:30:00Z',
  updatedAt: '2024-10-10T15:45:00Z',
};

export default function ClientProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(MOCK_USER.profileImage);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // プロフィールフォーム
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: MOCK_USER.name,
      email: MOCK_USER.email,
    },
  });

  // パスワード変更フォーム
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // プロフィール画像アップロード
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        console.log('プロフィール画像をアップロード:', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // プロフィール保存
  const handleProfileSubmit = (data: ProfileFormData) => {
    console.log('プロフィールを保存:', {
      ...data,
      profileImage,
    });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // パスワード変更
  const handlePasswordSubmit = (data: PasswordFormData) => {
    console.log('パスワードを変更:', {
      currentPassword: '***',
      newPassword: '***',
    });
    setShowSuccessMessage(true);
    setIsChangingPassword(false);
    passwordForm.reset();
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // 日時フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ClientLayout>
      <main className="max-w-[1199px] mx-auto px-8 py-8">
        {/* ページタイトル */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-[#0f172b] mb-1">プロフィール設定</h1>
          <div className="h-1 w-20 bg-blue-500 rounded-full mt-3"></div>
        </div>

        {/* 成功メッセージ */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            変更を保存しました
          </div>
        )}

        <div className="space-y-6">
          {/* プロフィール画像セクション */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-lg font-medium text-[#0f172b] mb-6">プロフィール画像</h2>
            <div className="flex items-center gap-6">
              {/* 画像表示エリア */}
              <div className="relative w-32 h-32 bg-slate-200 rounded-full overflow-hidden flex-shrink-0">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="プロフィール画像"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 64 64">
                      <circle cx="32" cy="20" r="12" stroke="currentColor" strokeWidth="3" />
                      <path stroke="currentColor" strokeWidth="3" d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24" />
                    </svg>
                  </div>
                )}
              </div>

              {/* アップロードボタン */}
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" strokeWidth="1.5" d="M8 3v10M3 8h10" />
                  </svg>
                  画像をアップロード
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-[#62748e] mt-2">
                  JPG、PNG形式の画像をアップロードできます（最大5MB）
                </p>
              </div>
            </div>
          </div>

          {/* 基本情報セクション */}
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-lg font-medium text-[#0f172b] mb-6">基本情報</h2>
              <div className="space-y-5">
                {/* 氏名 */}
                <div>
                  <label className="block text-sm font-medium text-[#314158] mb-2">
                    氏名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...profileForm.register('name')}
                    type="text"
                    className="w-full h-12 px-4 border border-slate-300 rounded-md text-base text-[#0f172b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="山田太郎"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* メールアドレス */}
                <div>
                  <label className="block text-sm font-medium text-[#314158] mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...profileForm.register('email')}
                    type="email"
                    className="w-full h-12 px-4 border border-slate-300 rounded-md text-base text-[#0f172b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="yamada@example.com"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* 登録日 */}
                <div>
                  <label className="block text-sm font-medium text-[#314158] mb-2">
                    登録日
                  </label>
                  <input
                    type="text"
                    value={formatDate(MOCK_USER.createdAt)}
                    disabled
                    className="w-full h-12 px-4 border border-slate-200 rounded-md text-base text-[#62748e] bg-slate-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* 保存ボタン */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="submit"
                  className="px-6 h-12 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                >
                  変更を保存
                </button>
                <button
                  type="button"
                  onClick={() => profileForm.reset()}
                  className="px-6 h-12 bg-slate-50 border border-[#cad5e2] text-[#314158] text-sm font-medium rounded-md hover:bg-slate-100 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </form>

          {/* パスワード変更セクション */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#0f172b]">パスワード変更</h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                >
                  パスワードを変更する
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
                <div className="space-y-5">
                  {/* 現在のパスワード */}
                  <div>
                    <label className="block text-sm font-medium text-[#314158] mb-2">
                      現在のパスワード <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...passwordForm.register('currentPassword')}
                      type="password"
                      className="w-full h-12 px-4 border border-slate-300 rounded-md text-base text-[#0f172b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="現在のパスワードを入力"
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* 新しいパスワード */}
                  <div>
                    <label className="block text-sm font-medium text-[#314158] mb-2">
                      新しいパスワード <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...passwordForm.register('newPassword')}
                      type="password"
                      className="w-full h-12 px-4 border border-slate-300 rounded-md text-base text-[#0f172b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="新しいパスワードを入力"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                    <p className="text-sm text-[#62748e] mt-1">
                      8文字以上、英数字を含む必要があります
                    </p>
                  </div>

                  {/* 新しいパスワード（確認） */}
                  <div>
                    <label className="block text-sm font-medium text-[#314158] mb-2">
                      新しいパスワード（確認） <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...passwordForm.register('confirmPassword')}
                      type="password"
                      className="w-full h-12 px-4 border border-slate-300 rounded-md text-base text-[#0f172b] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="新しいパスワードを再入力"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ボタン */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    type="submit"
                    className="px-6 h-12 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                  >
                    パスワードを変更
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      passwordForm.reset();
                    }}
                    className="px-6 h-12 bg-slate-50 border border-[#cad5e2] text-[#314158] text-sm font-medium rounded-md hover:bg-slate-100 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-base text-[#62748e]">
                セキュリティのため、定期的にパスワードを変更することをお勧めします
              </p>
            )}
          </div>

          {/* アカウント情報セクション */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-lg font-medium text-[#0f172b] mb-6">アカウント情報</h2>
            <div className="space-y-5">
              {/* ユーザータイプ */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-base text-[#314158]">ユーザータイプ</span>
                <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded">
                  {MOCK_USER.userType}
                </span>
              </div>

              {/* メール認証状態 */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-base text-[#314158]">メール認証状態</span>
                <div className="flex items-center gap-2">
                  {MOCK_USER.emailVerified ? (
                    <>
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 10l3 3 5-5" />
                      </svg>
                      <span className="text-base text-green-600">認証済み</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <path stroke="currentColor" strokeWidth="1.5" d="M10 6v5M10 14v.5" />
                      </svg>
                      <span className="text-base text-orange-500">未認証</span>
                    </>
                  )}
                </div>
              </div>

              {/* 最終更新日 */}
              <div className="flex items-center justify-between py-3">
                <span className="text-base text-[#314158]">最終更新日</span>
                <span className="text-base text-[#62748e]">
                  {formatDate(MOCK_USER.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
