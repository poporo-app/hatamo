# Hatamo - Local Development Environment

このプロジェクトは、Go (Gin Framework)、Next.js 15、MySQL、Redisを使用したフルスタックアプリケーションの開発環境です。

## 技術スタック

### バックエンド
- **Go** with Gin Framework
- **MySQL** (latest) - データベース
- **Redis** (latest) - キャッシュサーバー

### フロントエンド
- **Next.js 15** - SSR対応のReactフレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **Zustand** - 軽量な状態管理ライブラリ
- **Jest** - テストフレームワーク
- **Storybook** - UIコンポーネント開発環境

## プロジェクト構成

```
hatamo/
├── backend/           # Goバックエンドアプリケーション
│   ├── main.go       # メインエントリーポイント
│   ├── go.mod        # Go依存関係
│   └── Dockerfile    # バックエンド用Dockerfile
├── frontend/          # Next.jsフロントエンドアプリケーション
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   ├── components/ # Reactコンポーネント
│   │   └── store/    # Zustand ストア
│   ├── package.json  # Node.js依存関係
│   └── Dockerfile    # フロントエンド用Dockerfile
└── docker-compose.yml # Docker Compose設定

```

## セットアップ手順

### 前提条件
- Docker Desktop がインストールされていること
- Docker Compose がインストールされていること
- Git がインストールされていること

### 1. リポジトリのクローン

```bash
git clone [repository-url]
cd hatamo
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成します：

```bash
cp .env.example .env
```

必要に応じて`.env`ファイルの値を編集してください。

### 3. Dockerコンテナの起動

```bash
# Docker Desktopを起動してから実行
docker-compose up -d
```

初回起動時は、イメージのビルドに時間がかかります。

### 4. アプリケーションへのアクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8080
- **MySQL**: localhost:3306 (ユーザー: root, パスワード: rootpassword)
- **Redis**: localhost:6379

## 開発コマンド

### バックエンド開発

```bash
# コンテナに入る
docker-compose exec backend sh

# 手動でサーバーを起動
go run main.go
```

### フロントエンド開発

```bash
# 依存関係のインストール（ローカル開発時）
cd frontend
npm install

# 開発サーバーの起動
npm run dev

# テストの実行
npm test

# Storybookの起動
npm run storybook

# ビルド
npm run build
```

### Docker関連コマンド

```bash
# コンテナの起動
docker-compose up -d

# コンテナの停止
docker-compose down

# コンテナの再ビルド
docker-compose build

# ログの確認
docker-compose logs -f [service-name]

# 全てのコンテナとボリュームを削除（注意：データが消えます）
docker-compose down -v
```

## APIエンドポイント

### バックエンド

- `GET /` - Hello Worldメッセージを返す
- `GET /health` - ヘルスチェック（DB、Redis接続状態を確認）

## テスト

### フロントエンドテスト

```bash
cd frontend

# 単体テストの実行
npm test

# カバレッジ付きテスト
npm test -- --coverage

# ウォッチモードでテスト
npm run test:watch
```

### Storybook

```bash
cd frontend

# Storybookの起動
npm run storybook

# Storybookのビルド
npm run build-storybook
```

## トラブルシューティング

### Dockerが起動しない場合
1. Docker Desktopが起動していることを確認
2. `docker version`コマンドでDockerが正しくインストールされているか確認

### ポートが既に使用されている場合
他のアプリケーションが同じポートを使用している可能性があります。
`docker-compose.yml`でポート番号を変更するか、既存のアプリケーションを停止してください。

### MySQLに接続できない場合
コンテナが完全に起動するまで待ってください。初回起動時は特に時間がかかることがあります。

```bash
# MySQLコンテナのログを確認
docker-compose logs mysql
```

### npm installでエラーが発生する場合

```bash
# npmキャッシュの権限を修正
sudo chown -R $(whoami) ~/.npm

# または、キャッシュをクリア
npm cache clean --force
```

## 開発のヒント

1. **ホットリロード**: フロントエンドとバックエンドの両方でホットリロードが有効になっています
2. **データの永続化**: MySQLのデータは`mysql-data`ボリュームに保存されます
3. **ネットワーク**: 全てのサービスは`hatamo-network`で接続されています
4. **CORS**: バックエンドはCORSが設定済みなので、フロントエンドから直接APIを呼び出せます

## ライセンス

[ライセンス情報を記載]