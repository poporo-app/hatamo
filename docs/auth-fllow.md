# HATAMOマッチングサービス - 認証フロー

## 📋 概要

このドキュメントでは、HATAMOマッチングサービスにおける認証・登録フローを説明します。

---

## 🔐 新規登録フロー

### 1. 招待コード入力
**ページ**: `/auth/register/invite-code`

- ユーザーが招待コードを入力
- フロントエンドで基本的なバリデーション（形式チェック）
- 「次へ」ボタンで次のステップへ進む

### 2. 招待コードのDBチェック
**API**: `/api/auth/verify-invite-code`

- バックエンドでDBに対して招待コードの有効性をチェック
  - 招待コードが存在するか
  - 有効期限内か
  - 使用済みでないか
  - 使用回数制限に達していないか
- チェックOKの場合、次のステップへ進む
- チェックNGの場合、エラーメッセージを表示

### 3. 新規登録（ユーザータイプ選択）
招待コードチェック通過後、ユーザータイプに応じた登録ページへ遷移

**⚠️ アクセス制御**:
- 招待コードのユーザータイプが `CLIENT` の場合
  - `/auth/register/client` のみアクセス可能
  - `/auth/register/sponsor` にアクセスしようとすると `/auth/register/client` へリダイレクト
- 招待コードのユーザータイプが `SPONSOR` の場合
  - `/auth/register/sponsor` のみアクセス可能
  - `/auth/register/client` にアクセスしようとすると `/auth/register/sponsor` へリダイレクト

#### 3-1. CLIENT登録
**ページ**: `/auth/register/client`

**入力項目**:
- 氏名（姓・名）
- メールアドレス
- パスワード
- パスワード（確認）

#### 3-2. SPONSOR登録
**ページ**: `/auth/register/sponsor`

**入力項目**:
- 屋号（店舗名・企業名）
- 担当者名（姓・名）
- メールアドレス
- パスワード
- パスワード（確認）
- 事業内容（任意）

### 4. 登録完了ページ
**ページ**: `/auth/register/complete`

- 登録完了メッセージの表示
- 確認メール送信の案内

### 5. 確認メール送信
**API**: `/api/auth/send-verification-email`

- ユーザー登録時に自動的にメール認証用のメールを送信
- メール本文に認証用のリンクを含める
- リンクの有効期限: 24時間

**メール内容**:
```
件名: 【HATAMO】メールアドレスの確認

HATAMOにご登録いただきありがとうございます。

以下のリンクをクリックして、メールアドレスの確認を完了してください。

[メール確認リンク]

※このリンクの有効期限は24時間です。
※このメールに心当たりがない場合は、破棄してください。
```

### 6. メール確認リンク押下
**ページ**: `/auth/verify-email?token=xxx`

- メール内のリンクをクリック
- トークンをバックエンドで検証
- 検証成功でユーザーの `email_verified` フラグを `true` に更新
- 自動的にログイン処理を実行
- トップページへリダイレクト

### 7. トップページ（サービス一覧）へ遷移

#### CLIENT・SPONSOR 共通
**ページ**: `/`

- CLIENT・SPONSOR共に、ログイン後は `/` （サービス一覧ページ）へリダイレクト
- サービス一覧ページは公開ページとして機能
- 利用可能なSPONSORのサービスを表示
- ヘッダーのアイコンから各ダッシュボードへアクセス可能:
  - CLIENT: ユーザーアイコン → `/client` （ダッシュボード）
  - SPONSOR: ユーザーアイコン → `/client`、ブリーフケースアイコン → `/sponsor` （ダッシュボード）

---

## 🔑 ログインフロー

### 1. ログインページ
**ページ**: `/auth/login`

**入力項目**:
- メールアドレス
- パスワード

### 2. ログイン認証
**API**: `/api/auth/login`

- メールアドレスとパスワードでDB照合
- 認証成功時:
  - JWTトークンを発行
  - Cookieにトークンを保存
  - ユーザータイプに応じたトップページへリダイレクト
- 認証失敗時:
  - エラーメッセージを表示

### 3. トップページへ遷移
- CLIENT・SPONSOR共に `/` （サービス一覧ページ）へリダイレクト
- ヘッダーのアイコンから各ダッシュボードへアクセス可能:
  - CLIENT: `/client` （ダッシュボード）
  - SPONSOR: `/sponsor` （ダッシュボード）

---

## 🛡️ 認証状態による制御

### 未認証ユーザーのアクセス制御

**Next.js Middleware** (`frontend/src/middleware.ts`) で実装

#### アクセス可能なページ（未認証OK）
- `/` - サービス一覧ページ（公開ページ）
- `/auth/login` - ログインページ
- `/auth/register/invite-code` - 招待コード入力
- `/auth/register/client` - CLIENT登録
- `/auth/register/sponsor` - SPONSOR登録
- `/auth/register/complete` - 登録完了
- `/auth/verify-email` - メール確認

#### アクセス制限されるページ（認証必須）
- `/client/*` - CLIENTダッシュボード・マイページ
- `/sponsor/*` - SPONSORダッシュボード・マイページ
- その他の認証が必要なページ

**動作**:
- 未認証状態で認証必須ページにアクセス
- → `/auth/login` にリダイレクト
- ログイン後、`/` （サービス一覧ページ）へリダイレクト

### 認証済みユーザーの制御

#### メール未確認の場合
- ログイン可能だが、一部機能に制限がかかる可能性がある
- メール確認を促すバナー表示

#### ユーザータイプによるアクセス制御
- `/` はCLIENT・SPONSOR・未認証ユーザー全員がアクセス可能（公開ページ）
- `/client/*` はCLIENTのみアクセス可能（マイページ）
- `/sponsor/*` はSPONSORのみアクセス可能（マイページ）
- 不正なパスへのアクセスは `/` （サービス一覧ページ）へリダイレクト

---

## 📊 認証フロー図（Mermaid）

```mermaid
graph TD
    Start[アクセス開始] --> CheckAuth{認証状態?}

    CheckAuth -->|未認証| CheckPath{パス確認}
    CheckPath -->|/auth/*| AllowAccess[アクセス許可]
    CheckPath -->|/auth/* 以外| RedirectLogin[/auth/login へリダイレクト]

    CheckAuth -->|認証済み| CheckEmailVerified{メール確認済み?}
    CheckEmailVerified -->|No| ShowBanner[確認バナー表示]
    CheckEmailVerified -->|Yes| CheckUserType{ユーザータイプ}

    CheckUserType -->|CLIENT| AllowClient[/client/* へアクセス]
    CheckUserType -->|SPONSOR| AllowSponsor[/sponsor/* へアクセス]

    RedirectLogin --> Login[/auth/login]
    Login --> LoginSubmit[ログイン実行]
    LoginSubmit --> CheckAuth

    AllowAccess --> InviteCode[招待コード入力]
    InviteCode --> VerifyCode{DB チェック}
    VerifyCode -->|OK| SelectType[ユーザータイプ選択]
    VerifyCode -->|NG| ErrorMsg[エラー表示]

    SelectType -->|CLIENT| RegisterClient[CLIENT 登録フォーム]
    SelectType -->|SPONSOR| RegisterSponsor[SPONSOR 登録フォーム]

    RegisterClient --> Complete[登録完了ページ]
    RegisterSponsor --> Complete

    Complete --> SendEmail[確認メール送信]
    SendEmail --> WaitEmail[ユーザーがメール確認]

    WaitEmail --> ClickLink[メール内リンククリック]
    ClickLink --> VerifyEmail[/auth/verify-email]
    VerifyEmail --> UpdateDB[email_verified = true]
    UpdateDB --> AutoLogin[自動ログイン]
    AutoLogin --> CheckUserType
```

---

## 🔧 実装時の注意事項

### 招待コードによるアクセス制御
- 招待コード入力後、そのコードに紐づくユーザータイプ情報をセッション（または一時的なトークン）に保存
- `/auth/register/client` と `/auth/register/sponsor` では、セッションのユーザータイプを確認
- 不一致の場合は正しい登録ページへリダイレクト
- 招待コードが未検証の状態で登録ページに直接アクセスした場合は `/auth/register/invite-code` へリダイレクト

### セキュリティ
- パスワードは bcrypt でハッシュ化して保存
- JWT トークンは HttpOnly Cookie に保存
- CSRF 対策を実施
- reCAPTCHA の実装（Phase 2以降）

### バリデーション
- フロントエンド: react-hook-form + zod
- バックエンド: 再度バリデーションを実施（二重チェック）

### エラーハンドリング
- 適切なエラーメッセージを表示
- セキュリティ上、「メールアドレスまたはパスワードが間違っています」のように曖昧にする

### UX
- ローディング状態の表示
- 成功・エラー時のトースト通知
- フォームのオートコンプリート対応

---

## 📝 関連ページ一覧

### 公開ページ
| パス | 説明 | 認証 |
|------|------|------|
| `/` | サービス一覧（公開ページ） | 不要 |

### 認証関連ページ
| パス | 説明 | 認証 |
|------|------|------|
| `/auth/login` | ログイン | 不要 |
| `/auth/register/invite-code` | 招待コード入力 | 不要 |
| `/auth/register/client` | CLIENT登録 | 不要 |
| `/auth/register/sponsor` | SPONSOR登録 | 不要 |
| `/auth/register/complete` | 登録完了 | 不要 |
| `/auth/verify-email` | メール確認 | 不要 |

### CLIENT ページ（マイページ）
| パス | 説明 | 認証 |
|------|------|------|
| `/client` | CLIENTダッシュボード | 必要 |
| `/client?tab=services` | サービス管理タブ | 必要 |
| `/client/services/[id]` | サービス詳細 | 必要 |
| `/client/services/[id]/apply` | サービス申込 | 必要 |
| `/client/messages` | メッセージ | 必要 |

### SPONSOR ページ（マイページ）
| パス | 説明 | 認証 |
|------|------|------|
| `/sponsor` | SPONSORダッシュボード | 必要 |
| `/sponsor/services` | サービス管理 | 必要 |
| `/sponsor/bookings` | 予約管理 | 必要 |
| `/sponsor/bookings/[id]` | 予約詳細 | 必要 |
| `/sponsor/messages` | メッセージ | 必要 |
| `/sponsor/payments` | 入金管理 | 必要 |

---

**作成日**: 2025年10月18日
**バージョン**: v1.2
**最終更新**: 2025年10月18日
**更新内容**:
- サービス一覧ページ（`/`）を公開ページ化
- ログイン後の遷移先を `/` に統一
- `/client`、`/sponsor` をマイページ（ダッシュボード）として位置付け
