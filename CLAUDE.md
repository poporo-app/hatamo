# CLAUDE.md

# HATAMOマッチングサービス 要件定義書（最終版）

## 1. プロジェクト概要

### 1.1 サービス概要
- **サービス名**: HATAMOマッチングサービス
- **サービス種別**: クローズドコミュニティ内メンバーマッチングプラットフォーム
- **主要機能**: コミュニティメンバー同士のサービス依頼・提供マッチング
- **利用対象**: 既存コミュニティメンバー（招待コード制）
- **想定規模**: 初期50名未満
- **開発目的**: テスト運用

### 1.2 関係者
- **利用者（ユーザー）**: サービスを依頼するコミュニティメンバー
- **スポンサー（事業者）**: サービスを提供するコミュニティメンバー
- **運営（管理者）**: プラットフォーム運営者

### 1.3 ビジネスモデル
- **手数料体系**: 20%/30%/40%/50% から選択可能（+運営手数料5%）
- **月額料金**: なし（既存コミュニティメンバー向けサービス）
- **参加条件**: 招待コード制（Phase 1では審査機能なし）
- **価格帯**: 最低10,000円〜上限なし

### 1.4 提供サービスカテゴリ
- **IT関連**: 開発、デザイン、システム構築等
- **コンサルティング**: 経営相談、戦略立案等
- **マーケティング**: 広告運用、SNS運用、ブランディング等
- **くらし関連**: ライフスタイル、健康、美容等
- **投資関連**: 資産運用、投資相談等

## 2. 機能要件

### 2.1 利用者機能
| 機能 | 詳細 | 画面 |
|------|------|------|
| ユーザー登録 | 招待コードによる登録 | 登録画面 |
| 認証 | メールアドレス・パスワード認証 | ログイン画面 |
| サービス閲覧 | カテゴリ別サービス一覧・検索 | トップページ、サービス一覧 |
| 検索・フィルター | サービス種別、価格帯、提供者での絞り込み | 検索画面 |
| 事業者詳細確認 | サービス内容、料金、レビュー確認 | 事業者詳細ページ |
| メッセージ機能 | 依頼前相談、チャット機能 | メッセージ画面 |
| サービス申込 | 利用者情報入力、同意チェック | 申込フォーム |
| 決済処理 | Stripe連携決済 | 決済画面 |
| 申込完了 | 完了メッセージ表示 | 完了画面 |
| レビュー・評価 | サービス完了後の評価投稿 | レビュー画面 |

### 2.2 スポンサー機能
| 機能 | 詳細 | 画面 |
|------|------|------|
| スポンサー登録 | 招待コードによる登録 | スポンサー登録画面 |
| サービス登録 | サービス内容、価格、カテゴリ登録 | サービス登録画面 |
| 手数料設定 | 20%/30%/40%/50%から選択 | 設定画面 |
| 案件管理 | 申込状況確認、手動マッチング | 管理画面トップ |
| メッセージ管理 | 利用者とのチャット対応 | メッセージ画面 |
| 通知確認 | メール/LINE連動通知 | 管理画面 |
| 売上確認 | 手数料控除後売上明細確認 | 管理画面 |
| レビュー確認 | 受け取った評価・レビュー確認 | レビュー管理画面 |

### 2.3 運営管理機能
| 機能 | 詳細 | 画面 |
|------|------|------|
| 管理者認証 | ログイン機能 | 管理者ログイン画面 |
| 招待コード管理 | 招待コード生成・管理 | 招待コード管理画面 |
| メンバー管理 | 登録メンバー一覧・ステータス管理 | メンバー管理画面 |
| サービス管理 | 掲載サービス管理、公開設定 | サービス管理画面 |
| 申込管理 | 利用者申込一覧、ステータス管理 | 申込管理画面 |
| 精算管理 | 手数料計算（選択率+5%）、振込額算出、PDF生成 | 精算画面 |
| マッチング支援 | 手動マッチング補助機能 | マッチング管理画面 |
| メッセージ監視 | 不適切なやり取りの監視 | メッセージ管理画面 |

### 2.4 招待コード発行仕様（管理者機能）

#### 2.4.1 招待コード生成仕様
| 項目 | 仕様 |
|------|------|
| **コード形式** | 英数字ランダム8文字（例: A3X9K2M7） |
| **ユーザータイプ指定** | CLIENT（利用者）/ SPONSOR（スポンサー）から選択 |
| **有効期限設定** | 7日 / 14日 / 30日 / 無期限 から選択可能（デフォルト: 30日） |
| **発行数** | 単発発行 または 一括発行（1〜100件） |
| **メモ機能** | 発行目的・対象者メモ（最大500文字） |
| **重複チェック** | 既存コードとの重複を自動排除 |

#### 2.4.2 招待コード管理機能
| 機能 | 詳細 |
|------|------|
| **ステータス表示** | 未使用 / 使用済み / 期限切れ / 無効化 |
| **使用者情報** | 使用済みの場合、使用者名・メールアドレス・使用日時を表示 |
| **発行履歴** | 発行日時、発行者、ユーザータイプ、有効期限を一覧表示 |
| **検索・フィルター** | ステータス、ユーザータイプ、発行日、有効期限で絞り込み |
| **一括操作** | 選択した招待コードの一括無効化 |
| **エクスポート** | CSV/Excelファイルでのダウンロード機能 |
| **コピー機能** | ワンクリックでコードをクリップボードにコピー |
| **メール送信** | 個別送信：招待コードを選択してメールアドレス入力で送信 |
| **一括メール送信** | CSV読み込みで複数の招待コードを一括送信 |
| **送信履歴** | 送信先メールアドレス、送信日時、送信結果を表示 |

#### 2.4.3 招待コード発行フロー
```
1. 管理者ログイン
2. 招待コード管理画面へ移動
3. 「新規発行」ボタンクリック
4. 発行設定入力
   - ユーザータイプ選択（CLIENT / SPONSOR）
   - 発行数入力（1〜100）
   - 有効期限選択
   - メモ入力（任意）
5. 「発行」ボタンクリック
6. 確認ダイアログ表示
7. 招待コード生成完了
8. 生成されたコード一覧を表示（コピー可能）
9. オプション選択
   - CSV/Excelでエクスポート
   - メール送信（個別または一括）
```

#### 2.4.4 招待コード一覧画面項目
| 表示項目 | 説明 |
|---------|------|
| 選択 | チェックボックス（一括操作用） |
| コード | 8文字の招待コード（クリックでコピー） |
| ユーザータイプ | CLIENT / SPONSOR |
| ステータス | 未使用 / 使用済み / 期限切れ / 無効化 |
| 発行日時 | YYYY-MM-DD HH:mm |
| 有効期限 | YYYY-MM-DD または「無期限」 |
| 使用者 | 使用済みの場合、ユーザー名を表示 |
| 使用日時 | 使用済みの場合、使用日時を表示 |
| 送信先 | メール送信済みの場合、送信先メールアドレスを表示 |
| 送信日時 | メール送信済みの場合、送信日時を表示 |
| メモ | 発行時のメモ（省略表示、クリックで全文表示） |
| 操作 | 詳細表示 / メール送信 / 無効化ボタン |

#### 2.4.5 データベース設計（InviteCodeテーブル）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | 主キー |
| code | String | 招待コード（ユニーク、8文字） |
| userType | Enum | CLIENT / SPONSOR / ADMIN |
| status | Enum | ACTIVE / USED / EXPIRED / DISABLED |
| expiresAt | DateTime | 有効期限（NULL=無期限） |
| memo | String | 発行メモ（最大500文字） |
| usedBy | UUID | 使用者ID（外部キー: User.id） |
| usedAt | DateTime | 使用日時 |
| createdBy | UUID | 発行者ID（外部キー: User.id） |
| createdAt | DateTime | 発行日時 |
| updatedAt | DateTime | 更新日時 |

#### 2.4.6 招待コード使用フロー
```
1. ユーザーが新規登録画面で招待コード入力
2. バックエンドで招待コード検証
   - コードの存在確認
   - ステータスチェック（ACTIVE であること）
   - 有効期限チェック（期限内であること）
3. 検証成功 → ユーザータイプを自動判定して表示
4. ユーザー登録完了時
   - InviteCode.status を USED に更新
   - InviteCode.usedBy にユーザーIDを設定
   - InviteCode.usedAt に使用日時を記録
5. 検証失敗 → エラーメッセージ表示
   - 「招待コードが無効です」
   - 「この招待コードは既に使用されています」
   - 「招待コードの有効期限が切れています」
```

#### 2.4.7 招待コードメール送信機能

##### 2.4.7.1 個別送信機能
| 項目 | 仕様 |
|------|------|
| **送信対象** | 招待コード一覧から1件選択 |
| **入力項目** | 送信先メールアドレス（必須）、宛名（任意） |
| **バリデーション** | メール形式チェック、ドメイン検証 |
| **プレビュー** | 送信前にメール内容をプレビュー表示 |
| **送信処理** | 確認ダイアログ → 送信実行 → 結果表示 |

##### 2.4.7.2 CSV一括送信機能
| 項目 | 仕様 |
|------|------|
| **CSV形式** | カラム: `email` (必須), `name` (任意), `code` (任意: 未指定の場合は未使用コードから自動割当) |
| **アップロード** | CSVファイルをドラッグ&ドロップまたはファイル選択 |
| **バリデーション** | メール形式チェック、重複チェック、招待コード存在確認 |
| **プレビュー** | 送信対象リスト表示（件数、エラー件数） |
| **送信処理** | 一括送信実行 → 進捗表示 → 結果レポート |
| **結果レポート** | 成功件数、失敗件数、エラー詳細リスト |
| **エラー処理** | 失敗分のみCSVでダウンロード可能 |

##### 2.4.7.3 個別送信フロー
```
1. 招待コード一覧から送信対象コードを選択
2. 「メール送信」ボタンクリック
3. 送信フォーム表示
   - 招待コード: A3X9K2M7（表示のみ）
   - 送信先メールアドレス: [入力欄]
   - 宛名: [入力欄]（任意）
4. 「プレビュー」ボタンクリック
5. メール内容プレビュー表示
6. 「送信」ボタンクリック
7. 確認ダイアログ表示
8. 送信処理実行
9. 送信結果表示
   - 成功: 「招待コードを送信しました」
   - 失敗: エラーメッセージ表示
10. InviteEmailLogテーブルに送信履歴を記録
```

##### 2.4.7.4 CSV一括送信フロー (後回しでも良い)
```
1. 招待コード管理画面で「一括メール送信」ボタンクリック
2. CSV一括送信画面表示
3. CSVファイルアップロード
   - サンプルCSVダウンロードリンク提供
4. CSVバリデーション実行
   - メール形式チェック
   - 招待コード存在確認（code列が指定されている場合）
   - 重複チェック
5. バリデーション結果表示
   - エラーがある場合: エラー詳細リスト表示
   - 正常の場合: 送信対象プレビュー表示
6. 「一括送信」ボタンクリック
7. 確認ダイアログ表示（送信件数を表示）
8. 一括送信処理実行
   - 進捗バー表示（○○ / ○○ 件送信中）
9. 送信完了後、結果レポート表示
   - 成功: ○○件
   - 失敗: ○○件
   - エラー詳細リストテーブル
10. 失敗分のCSVダウンロードボタン表示
11. InviteEmailLogテーブルに全送信履歴を記録
```

##### 2.4.7.5 メールテンプレート
```
件名: 【HATAMO】招待コードのご案内

{宛名}様

HATAMOマッチングサービスへのご招待です。
以下の招待コードを使用して、会員登録を完了してください。

━━━━━━━━━━━━━━━━━━━━━━━━
招待コード: {招待コード}
登録タイプ: {ユーザータイプ}
有効期限: {有効期限}
━━━━━━━━━━━━━━━━━━━━━━━━

▼ 会員登録はこちら
{登録URL}?code={招待コード}

※このメールは自動送信されています。
※招待コードは第三者に共有しないでください。
※有効期限内に登録を完了してください。

━━━━━━━━━━━━━━━━━━━━━━━━
HATAMO運営チーム
お問い合わせ: support@hatamo.jp
━━━━━━━━━━━━━━━━━━━━━━━━
```

##### 2.4.7.6 送信履歴管理（InviteEmailLogテーブル）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | 主キー |
| inviteCodeId | UUID | 招待コードID（外部キー: InviteCode.id） |
| recipientEmail | String | 送信先メールアドレス |
| recipientName | String | 宛名（任意） |
| sentAt | DateTime | 送信日時 |
| sentBy | UUID | 送信者ID（外部キー: User.id） |
| status | Enum | SUCCESS / FAILED |
| errorMessage | String | エラーメッセージ（失敗時のみ） |
| emailSubject | String | メール件名 |
| emailBody | Text | メール本文 |
| createdAt | DateTime | レコード作成日時 |

##### 2.4.7.7 CSV一括送信用サンプルファイル
```csv
email,name,code
tanaka@example.com,田中太郎,A3X9K2M7
sato@example.com,佐藤花子,
yamada@example.com,山田次郎,B5K8L3P9
```
※ `code` 列が空の場合、未使用の招待コードから自動割当

## 3. 技術要件

### 3.1 プラットフォーム
- **開発形態**: Webアプリケーション
- **対象デバイス**: PC、スマートフォン（レスポンシブ対応）
- **想定規模**: 50名未満（小規模）

### 3.2 認証システム
- **認証方式**: メールアドレス・パスワード認証
- **登録方式**: 招待コード必須
- **セッション管理**: ブラウザベース

### 3.3 決済システム
- **決済サービス**: Stripe
- **対応決済**: クレジットカード決済
- **手数料体系**: サービス提供者選択制（20%/30%/40%/50% + 運営手数料5%）
- **最低価格**: 10,000円

### 3.4 セキュリティ
- **reCAPTCHA**: 全フォームに実装
- **同意チェック**: 購入・申込時の規約同意必須
- **アクセス制限**: 招待コード制による登録制限

### 3.5 法務対応
- 利用規約（策定中）
- 特定商取引法表示
- プライバシーポリシー（策定中）
- キャンセル・返金規約（策定中）

### 3.6 データベース設計（Phase 1）
- **ユーザーテーブル**: 利用者・スポンサー・管理者情報
- **サービステーブル**: 提供サービス情報
- **申込テーブル**: サービス申込情報
- **決済テーブル**: 決済履歴
- **メッセージテーブル**: チャット履歴
- **レビューテーブル**: 評価・レビュー情報
- **招待コードテーブル**: 招待コード管理

## 4. 通知機能
- **メール通知**: 審査結果、申込状況
- **LINE連動**: メッセージ通知機能

## 5. 段階的開発計画

### 5.1 Phase 1（MVP） - 基本的なマッチング・決済機能
**期間**: 2-3ヶ月  
**予算**: 限定的

#### 実装機能
- [ ] 招待コード制ユーザー登録・認証 (招待コードはadminで発行する為、実装時はテスト用コードを生成する)
- [ ] サービス登録・掲載機能
- [ ] サービス検索・フィルター機能
- [ ] 基本的なメッセージ機能
- [ ] 手動マッチング機能
- [ ] Stripe決済機能
- [ ] 基本的な管理画面
- [ ] レビュー・評価機能

### 5.2 Phase 2 - 管理機能強化・通知機能
**期間**: 1-2ヶ月

#### 実装機能
- [ ] 高度な管理機能
- [ ] メール/LINE通知機能
- [ ] 売上・精算レポート機能
- [ ] チャット機能の強化
- [ ] ファイルアップロード機能

### 5.3 Phase 3 - ユーザビリティ向上・追加機能
**期間**: 1-2ヶ月

#### 実装機能
- [ ] 高度な検索・推奨機能
- [ ] ダッシュボード強化
- [ ] 分析・レポート機能
- [ ] モバイルアプリ検討
- [ ] 自動マッチング機能

## 6. 運用要件

### 6.1 参加条件
- **登録方法**: 招待コード制
- **審査**: Phase 1では実装しない
- **対象**: 既存コミュニティメンバー限定

### 6.2 マッチングフロー
1. サービス提供者がサービス内容・料金・手数料率を登録
2. 利用者がサービス一覧から選択・検索
3. 利用者が提供者にメッセージで相談
4. 提供者が申込を承認（手動マッチング）
5. 決済処理（Stripe）
6. サービス実施
7. 完了後レビュー・評価
8. 精算処理

### 6.3 今後検討事項
- [ ] キャンセル・返金ポリシーの策定
- [ ] プライバシーポリシーの策定
- [ ] 利用規約の策定
- [ ] 個人情報取扱い方針の決定
- [ ] カスタマーサポート体制
- [ ] 不正利用防止対策
- [ ] 税務処理の詳細設計

---

**作成日**: 2025年9月21日  
**バージョン**: v3.0 (最終版)  
**更新**: 全機能・開発計画を具体化  
**作成者**: 要件定義チーム

# Claude Code実行プロンプト - HATAMOマッチングサービス初期セットアップ

## 実行内容
HATAMOマッチングサービスのプロジェクト初期セットアップを行ってください。以下の技術スタックでフルスタック開発環境を構築します。

**技術スタック:**
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express.js, TypeScript, Prisma
- Database: MySQL 8.0 (Docker)
- 決済: Stripe
- リアルタイム通信: Socket.io

## 実行手順

### 1. プロジェクト構造作成
```bash
mkdir hatamo-matching-service
cd hatamo-matching-service
mkdir -p frontend backend admin-backend database infrastructure docs
```

### 2. Frontend (Next.js 15) セットアップ
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 必要パッケージインストール
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install zustand
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install socket.io-client

# shadcn/ui セットアップ
npx shadcn-ui@latest init --defaults
npx shadcn-ui@latest add button input label card form select textarea

cd ..
```

### 3. Backend (Node.js + Express) セットアップ
```bash
# メインバックエンド（利用者・スポンサー用）
cd backend
npm init -y

# 依存関係インストール
npm install express cors helmet morgan
npm install jsonwebtoken bcryptjs joi
npm install prisma @prisma/client
npm install stripe socket.io dotenv uuid

# 開発依存関係
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/uuid
npm install -D nodemon ts-node

# TypeScript設定
npx tsc --init
npx prisma init

cd ..

# 管理者用バックエンド
cd admin-backend
npm init -y

# 依存関係インストール
npm install express cors helmet morgan
npm install jsonwebtoken bcryptjs joi
npm install prisma @prisma/client
npm install dotenv uuid

# 開発依存関係
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/uuid
npm install -D nodemon ts-node

# TypeScript設定
npx tsc --init

cd ..
```

### 4. Docker Compose (マルチサービス構成) 作成
プロジェクトルートに以下のファイルを作成：

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  # データベース
  mysql:
    image: mysql:8.0
    container_name: hatamo_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: hatamo_db
      MYSQL_USER: hatamo_user
      MYSQL_PASSWORD: hatamo_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - hatamo_network
    restart: unless-stopped

  # Redis（セッション・キャッシュ用）
  redis:
    image: redis:7-alpine
    container_name: hatamo_redis
    ports:
      - "6379:6379"
    networks:
      - hatamo_network
    restart: unless-stopped

  # メインバックエンド（利用者・スポンサー用）
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: hatamo_backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mysql://hatamo_user:hatamo_password@mysql:3306/hatamo_db
      - JWT_SECRET=your-super-secret-jwt-key
      - FRONTEND_URL=http://localhost:3000
      - ADMIN_BACKEND_URL=http://admin-backend:5001
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - hatamo_network
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  # 管理者用バックエンド
  admin-backend:
    build:
      context: ./admin-backend
      dockerfile: Dockerfile
    container_name: hatamo_admin_backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mysql://hatamo_user:hatamo_password@mysql:3306/hatamo_db
      - JWT_SECRET=your-admin-super-secret-jwt-key
      - ADMIN_FRONTEND_URL=http://localhost:3001
      - MAIN_BACKEND_URL=http://backend:5000
    volumes:
      - ./admin-backend:/app
      - /app/node_modules
    networks:
      - hatamo_network
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  # フロントエンド（利用者・スポンサー用）
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: hatamo_frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
      - NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - hatamo_network
    depends_on:
      - backend
    restart: unless-stopped

  # 管理者用フロントエンド（将来的に追加予定）
  # admin-frontend:
  #   build:
  #     context: ./admin-frontend
  #     dockerfile: Dockerfile.dev
  #   container_name: hatamo_admin_frontend
  #   ports:
  #     - "3001:3000"
  #   environment:
  #     - NEXT_PUBLIC_API_URL=http://localhost:5001/api
  #   volumes:
  #     - ./admin-frontend:/app
  #     - /app/node_modules
  #     - /app/.next
  #   networks:
  #     - hatamo_network
  #   depends_on:
  #     - admin-backend

  # データベース管理ツール
  adminer:
    image: adminer
    container_name: hatamo_adminer
    ports:
      - "8080:8080"
    networks:
      - hatamo_network
    depends_on:
      - mysql
    restart: unless-stopped

  # Nginx（リバースプロキシ・ロードバランサー）
  nginx:
    image: nginx:alpine
    container_name: hatamo_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
    networks:
      - hatamo_network
    depends_on:
      - frontend
      - backend
      - admin-backend
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  hatamo_network:
    driver: bridge
```

**nginx/nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }
    
    upstream admin_backend {
        server admin-backend:5001;
    }
    
    upstream frontend {
        server frontend:3000;
    }

    # メインサービス
    server {
        listen 80;
        server_name localhost hatamo.local;
        
        # フロントエンド
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # メインAPI
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Socket.io
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # 管理者サービス
    server {
        listen 80;
        server_name admin.hatamo.local admin.localhost;
        
        # 管理者API
        location /api/ {
            proxy_pass http://admin_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # 管理者フロントエンド（将来的に追加）
        # location / {
        #     proxy_pass http://admin_frontend;
        #     proxy_set_header Host $host;
        #     proxy_set_header X-Real-IP $remote_addr;
        #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        #     proxy_set_header X-Forwarded-Proto $scheme;
        # }
    }
}
```

### 5. 環境設定ファイル作成

**backend/.env.example:**
```env
DATABASE_URL="mysql://hatamo_user:hatamo_password@localhost:3306/hatamo_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
FRONTEND_URL="http://localhost:3000"
ADMIN_BACKEND_URL="http://localhost:5001"
PORT=5000
NODE_ENV="development"
```

**admin-backend/.env.example:**
```env
DATABASE_URL="mysql://hatamo_user:hatamo_password@localhost:3306/hatamo_db"
JWT_SECRET="your-admin-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
ADMIN_FRONTEND_URL="http://localhost:3001"
MAIN_BACKEND_URL="http://localhost:5000"
PORT=5001
NODE_ENV="development"
```

**frontend/.env.local.example:**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
```

### 6. Prisma スキーマ設定
**backend/prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  userType     UserType @map("user_type")
  name         String
  profileImage String?  @map("profile_image")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  usedInviteCode InviteCode? @relation("InviteCodeUser")
  services       Service[]
  clientBookings Booking[]   @relation("ClientBookings")
  sponsorBookings Booking[]  @relation("SponsorBookings")
  sentMessages   Message[]   @relation("SentMessages")
  clientConversations Conversation[] @relation("ClientConversations")
  sponsorConversations Conversation[] @relation("SponsorConversations")

  @@map("users")
}

model InviteCode {
  id       String   @id @default(uuid())
  code     String   @unique
  userType UserType @map("user_type")
  usedBy   String?  @map("used_by")
  createdAt DateTime @default(now()) @map("created_at")
  usedAt   DateTime? @map("used_at")

  // Relations
  user User? @relation("InviteCodeUser", fields: [usedBy], references: [id])

  @@map("invite_codes")
}

enum UserType {
  client
  sponsor
  admin
}
```

### 7. Backend基本構成ファイル作成

**backend/src/app.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_BACKEND_URL || "http://localhost:5001"
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'main-backend',
    timestamp: new Date().toISOString() 
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Main Backend Server running on port ${PORT}`);
});

export { app, io };
```

**admin-backend/src/app.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.ADMIN_FRONTEND_URL || "http://localhost:3001",
    process.env.MAIN_BACKEND_URL || "http://localhost:5000"
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'admin-backend',
    timestamp: new Date().toISOString() 
  });
});

// Admin API routes will be added here
app.get('/api/admin/stats', (req, res) => {
  res.json({ message: 'Admin stats endpoint' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Admin Backend Server running on port ${PORT}`);
});

export { app };
```

**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

**admin-backend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]
```

**frontend/Dockerfile.dev:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 8. package.json scripts設定
プロジェクトルートに **package.json:**
```json
{
  "name": "hatamo-matching-service",
  "version": "1.0.0",
  "description": "HATAMO Matching Service Platform",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:admin\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "dev:admin": "cd admin-backend && npm run dev",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:build": "docker-compose build",
    "docker:logs": "docker-compose logs -f",
    "db:up": "docker-compose up -d mysql redis",
    "db:down": "docker-compose stop mysql redis",
    "db:migrate": "cd backend && npx prisma migrate dev",
    "db:generate": "cd backend && npx prisma generate",
    "db:studio": "cd backend && npx prisma studio",
    "hosts:setup": "echo '127.0.0.1 hatamo.local admin.hatamo.local' | sudo tee -a /etc/hosts"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**backend/package.json scripts追加:**
```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  }
}
```

**admin-backend/package.json scripts追加:**
```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  }
}
```

### 9. TypeScript設定
**backend/tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**admin-backend/tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 10. README.md作成
最後にプロジェクト全体のREADME.mdを作成してください。

## 確認事項
実行後、以下が正常に動作することを確認：
1. フロントエンド・メインバックエンド・管理者バックエンドのパッケージインストール完了
2. TypeScript設定完了
3. Docker Compose起動可能
4. 基本的なサーバー起動確認
5. ドメイン分離の動作確認

## 実行完了後の次ステップ
1. 環境変数設定 (.env.example をコピーして .env 作成)
2. hosts ファイル設定 (npm run hosts:setup)
3. データベース起動とマイグレーション
4. 開発サーバー起動確認
5. ドメインアクセス確認
   - メインサービス: http://hatamo.local または http://localhost:3000
   - 管理者API: http://admin.hatamo.local/api または http://localhost:5001/api
   - データベース管理: http://localhost:8080

よろしくお願いします！