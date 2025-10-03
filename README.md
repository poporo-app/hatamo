# HATAMOマッチングサービス

クローズドコミュニティ内メンバーマッチングプラットフォーム

## 技術スタック

### フロントエンド
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Payment**: Stripe
- **Realtime**: Socket.io Client

### バックエンド
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Realtime**: Socket.io
- **Payment**: Stripe

### インフラ
- **Container**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Database Admin**: Adminer

## プロジェクト構造

```
hatamo/
├── frontend/          # Next.js フロントエンド
├── backend/           # メインバックエンド（利用者・スポンサー用）
├── admin-backend/     # 管理者用バックエンド
├── nginx/            # Nginx設定
├── database/         # データベース関連ファイル
├── infrastructure/   # インフラ設定
├── docs/             # ドキュメント
└── docker-compose.yml
```

## セットアップ

### 1. 環境変数の設定

各サービスの `.env.example` をコピーして `.env` を作成：

```bash
# メインバックエンド
cp backend/.env.example backend/.env

# 管理者バックエンド
cp admin-backend/.env.example admin-backend/.env

# フロントエンド
cp frontend/.env.local.example frontend/.env.local
```

### 2. 依存関係のインストール

```bash
# ルートディレクトリで
npm install

# 各サービスの依存関係
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd admin-backend && npm install && cd ..
```

### 3. データベースの起動とマイグレーション

```bash
# データベースの起動
npm run db:up

# マイグレーションの実行
npm run db:migrate

# Prisma Studioの起動（データベース管理UI）
npm run db:studio
```

### 4. 開発サーバーの起動

```bash
# すべてのサービスを同時に起動
npm run dev

# または個別に起動
npm run dev:frontend  # フロントエンド
npm run dev:backend   # メインバックエンド
npm run dev:admin     # 管理者バックエンド
```

### 5. Docker Composeを使用した起動

```bash
# すべてのサービスをDockerで起動
npm run docker:up

# ログの確認
npm run docker:logs

# サービスの停止
npm run docker:down
```

## アクセスURL

### 開発環境（ローカル）
- **メインサービス**: http://localhost:3000
- **メインAPI**: http://localhost:5000/api
- **管理者API**: http://localhost:5001/api
- **データベース管理**: http://localhost:8080
  - Server: `mysql`
  - Username: `hatamo_user`
  - Password: `hatamo_password`
  - Database: `hatamo_db`

### Dockerドメイン使用時
hosts ファイルの設定後：
```bash
npm run hosts:setup
```

- **メインサービス**: http://hatamo.local
- **管理者サービス**: http://admin.hatamo.local

## 主要コマンド

```bash
# 開発
npm run dev              # 全サービス起動
npm run dev:frontend     # フロントエンドのみ
npm run dev:backend      # バックエンドのみ
npm run dev:admin        # 管理者バックエンドのみ

# Docker
npm run docker:up        # Docker起動
npm run docker:down      # Docker停止
npm run docker:build     # Dockerイメージビルド
npm run docker:logs      # ログ表示

# データベース
npm run db:up            # DB起動
npm run db:down          # DB停止
npm run db:migrate       # マイグレーション実行
npm run db:generate      # Prismaクライアント生成
npm run db:studio        # Prisma Studio起動
```

## 開発フロー

1. **機能開発**
   - フロントエンド: `frontend/src/app/` でページ作成
   - API: `backend/src/` でエンドポイント実装
   - 管理機能: `admin-backend/src/` で管理API実装

2. **データベース変更**
   - `backend/prisma/schema.prisma` を編集
   - `npm run db:migrate` でマイグレーション
   - `npm run db:generate` でクライアント更新

3. **テスト**
   - 各サービスのテストコマンドを実行

## トラブルシューティング

### ポートが既に使用されている場合
```bash
# 使用中のポートを確認
lsof -i :3000  # フロントエンド
lsof -i :5000  # バックエンド
lsof -i :5001  # 管理者バックエンド

# プロセスを終了
kill -9 <PID>
```

### データベース接続エラー
```bash
# MySQLコンテナの状態確認
docker ps | grep mysql

# データベースを再起動
npm run db:down && npm run db:up
```

### Prismaエラー
```bash
# Prismaクライアントを再生成
cd backend && npx prisma generate
```

## ライセンス

Private - All Rights Reserved