import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証不要のパス（ログイン・新規登録）
const publicPaths = [
  '/business/business-login',
  '/business/business-register',
  '/business/business-register/verify-email',
];

// 認証が必要なパス
const protectedPaths = [
  '/business/dashboard',
  '/business/setup',
  '/business/register-case',
  '/business/payment',
  '/business/approval-pending',
  '/business/register',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 事業者側のパスのみを処理
  if (!pathname.startsWith('/business')) {
    return NextResponse.next();
  }

  // 静的ファイルやAPIルートはスキップ
  if (
    pathname.startsWith('/business/_next') ||
    pathname.startsWith('/business/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 認証トークンの確認（Cookieから取得）
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;

  // パスの正規化（末尾のスラッシュを削除）
  const normalizedPath = pathname.replace(/\/$/, '') || '/business';

  // /business ルートの処理
  if (normalizedPath === '/business') {
    if (isAuthenticated) {
      // ログイン済みの場合はダッシュボードへリダイレクト
      return NextResponse.redirect(new URL('/business/dashboard', request.url));
    } else {
      // 未ログインの場合はログインページへリダイレクト
      return NextResponse.redirect(new URL('/business/business-login', request.url));
    }
  }

  // 公開パスかチェック
  const isPublicPath = publicPaths.some(path => normalizedPath.startsWith(path));
  
  // 保護されたパスかチェック
  const isProtectedPath = protectedPaths.some(path => normalizedPath.startsWith(path));

  // 未ログインで保護されたパスへのアクセス
  if (!isAuthenticated && isProtectedPath) {
    // ログインページへリダイレクト（リダイレクト後の遷移先を保存）
    const loginUrl = new URL('/business/business-login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ログイン済みで公開パス（ログイン・新規登録）へのアクセス
  if (isAuthenticated && isPublicPath) {
    // ダッシュボードへリダイレクト
    return NextResponse.redirect(new URL('/business/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/business/:path*',
};