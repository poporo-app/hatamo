/**
 * 認証関連のユーティリティ関数
 */

// 認証トークンのクッキー名
const AUTH_COOKIE_NAME = 'auth_token';

// ユーザー情報のローカルストレージキー
const USER_INFO_KEY = 'user_info';

/**
 * ユーザー情報の型定義
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  userType: 'CLIENT' | 'SPONSOR' | 'ADMIN';
  profileImage?: string;
}

/**
 * クッキーに認証トークンを保存
 */
export function setAuthToken(token: string, expiresInDays: number = 7): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + expiresInDays);

  document.cookie = `${AUTH_COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * クッキーから認証トークンを取得
 */
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') {
    return null; // サーバーサイドでは使用不可
  }

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
  );

  if (!authCookie) {
    return null;
  }

  return authCookie.split('=')[1] || null;
}

/**
 * 認証トークンを削除（ログアウト）
 */
export function removeAuthToken(): void {
  document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

/**
 * ローカルストレージにユーザー情報を保存
 */
export function setUserInfo(userInfo: UserInfo): void {
  if (typeof window === 'undefined') {
    return; // サーバーサイドでは使用不可
  }

  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

/**
 * ローカルストレージからユーザー情報を取得
 */
export function getUserInfo(): UserInfo | null {
  if (typeof window === 'undefined') {
    return null; // サーバーサイドでは使用不可
  }

  const userInfoStr = localStorage.getItem(USER_INFO_KEY);
  if (!userInfoStr) {
    return null;
  }

  try {
    return JSON.parse(userInfoStr) as UserInfo;
  } catch {
    return null;
  }
}

/**
 * ローカルストレージからユーザー情報を削除
 */
export function removeUserInfo(): void {
  if (typeof window === 'undefined') {
    return; // サーバーサイドでは使用不可
  }

  localStorage.removeItem(USER_INFO_KEY);
}

/**
 * ユーザーが認証されているかチェック
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * ログイン処理
 *
 * @param token 認証トークン
 * @param userInfo ユーザー情報
 */
export function login(token: string, userInfo: UserInfo): void {
  setAuthToken(token);
  setUserInfo(userInfo);
}

/**
 * ログアウト処理
 */
export function logout(): void {
  removeAuthToken();
  removeUserInfo();

  // ログアウト後は登録ページにリダイレクト
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/register/invite-code';
  }
}

/**
 * 現在のユーザータイプをチェック
 */
export function getUserType(): 'CLIENT' | 'SPONSOR' | 'ADMIN' | null {
  const userInfo = getUserInfo();
  return userInfo?.userType || null;
}

/**
 * ユーザーがSPONSORかチェック
 */
export function isSponsor(): boolean {
  return getUserType() === 'SPONSOR';
}

/**
 * ユーザーがCLIENTかチェック
 */
export function isClient(): boolean {
  return getUserType() === 'CLIENT';
}

/**
 * ユーザーがADMINかチェック
 */
export function isAdmin(): boolean {
  return getUserType() === 'ADMIN';
}

/**
 * APIリクエスト用の認証ヘッダーを取得
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();

  if (!token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`,
  };
}
