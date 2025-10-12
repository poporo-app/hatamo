import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が不要なパス（未認証でもアクセス可能）
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register/invite-code',
  '/auth/register/client',
  '/auth/register/sponsor',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// 認証トークンのクッキー名
const AUTH_COOKIE_NAME = 'auth_token';

/**
 * ユーザーが認証されているかチェック
 */
function isAuthenticated(request: NextRequest): boolean {
  // クッキーから認証トークンを取得
  const token = request.cookies.get(AUTH_COOKIE_NAME);

  // トークンが存在すれば認証済みとみなす
  // TODO: 本番環境ではJWTの検証を行う
  return !!token;
}

/**
 * パスが公開パスかチェック
 */
function isPublicPath(pathname: string): boolean {
  // /auth/ で始まるパスはすべて公開
  if (pathname.startsWith('/auth/')) {
    return true;
  }

  // 明示的な公開パスリストもチェック
  return PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静的ファイルやNext.js内部パスはスキップ
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // ファイル拡張子を含むパス（画像など）
  ) {
    return NextResponse.next();
  }

  const authenticated = isAuthenticated(request);
  const publicPath = isPublicPath(pathname);

  // 未認証ユーザーが保護されたページにアクセスしようとした場合
  // TODO: 開発中のため一時的にコメントアウト
  // if (!authenticated && !publicPath) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/auth/register/invite-code';
  //   return NextResponse.redirect(url);
  // }

  // 認証済みユーザーが認証ページにアクセスしようとした場合（オプション）
  // ダッシュボードやホームにリダイレクトすることもできる
  // if (authenticated && publicPath) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/dashboard';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

// Matcherの設定: middlewareを適用するパスを指定
export const config = {
  matcher: [
    /*
     * 以下のパス以外のすべてのリクエストにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
