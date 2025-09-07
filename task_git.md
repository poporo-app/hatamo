# salon-admin-tool-v2 Git管理・GitHub Actionsデプロイ設定プロンプト

## 目的
salon-admin-tool-v2をGitで管理し、GitHub Actionsを使用して自動デプロイする環境を構築する

## 前提条件
- AWSアカウントが設定済み
- GitHub リポジトリが作成可能

## 実装タスク

### 1. Git リポジトリの初期化とGitHub連携

```bash
# プロジェクトルートで実行
git init
git add .
git commit -m "Initial commit: hatamo"

# GitHubでリポジトリ作成後
git remote add origin https://github.com/poporo-app/hatamo.git
git branch -M main
git push -u origin main
```

### 2. .gitignore ファイルの作成

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# AWS
.aws/
*.pem
```

### 3. GitHub Actions ワークフローの作成 (ここから下は今回対応不要)

`.github/workflows/deploy.yml` を作成:

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

env:
  AWS_REGION: ap-northeast-1
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: ./build

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: ./build
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Deploy to S3 (Staging)
        run: |
          aws s3 sync ./build s3://${{ secrets.STAGING_S3_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.STAGING_CLOUDFRONT_ID }} --paths "/*"

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: ./build
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Deploy to S3 (Production)
        run: |
          aws s3 sync ./build s3://${{ secrets.PRODUCTION_S3_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.PRODUCTION_CLOUDFRONT_ID }} --paths "/*"
```

### 4. GitHub Secrets の設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下を設定:

- `AWS_ACCESS_KEY_ID`: AWS IAMユーザーのアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: AWS IAMユーザーのシークレットアクセスキー
- `STAGING_S3_BUCKET`: ステージング環境のS3バケット名
- `STAGING_CLOUDFRONT_ID`: ステージング環境のCloudFront Distribution ID
- `PRODUCTION_S3_BUCKET`: 本番環境のS3バケット名
- `PRODUCTION_CLOUDFRONT_ID`: 本番環境のCloudFront Distribution ID

### 5. AWS IAM ポリシーの設定

GitHub Actions用のIAMユーザーに必要な権限:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-staging-bucket/*",
        "arn:aws:s3:::your-staging-bucket",
        "arn:aws:s3:::your-production-bucket/*",
        "arn:aws:s3:::your-production-bucket"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": [
        "arn:aws:cloudfront::*:distribution/STAGING_DISTRIBUTION_ID",
        "arn:aws:cloudfront::*:distribution/PRODUCTION_DISTRIBUTION_ID"
      ]
    }
  ]
}
```

### 6. ブランチ戦略

```
main        → 本番環境へ自動デプロイ
develop     → ステージング環境へ自動デプロイ
feature/*   → プルリクエスト作成でテスト実行
hotfix/*    → 緊急修正用ブランチ
```

### 7. package.json スクリプトの確認

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --watchAll=false",
    "lint": "eslint src/**/*.{js,jsx,ts,tsx}",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,json,css,md}"
  }
}
```

### 8. 環境変数の管理

`.env.example` を作成:

```env
REACT_APP_API_ENDPOINT=https://api.example.com
REACT_APP_AUTH_DOMAIN=auth.example.com
REACT_APP_ENVIRONMENT=development
```

GitHub Actions で環境変数を設定:

```yaml
- name: Create env file
  run: |
    echo "REACT_APP_API_ENDPOINT=${{ secrets.API_ENDPOINT }}" >> .env
    echo "REACT_APP_AUTH_DOMAIN=${{ secrets.AUTH_DOMAIN }}" >> .env
    echo "REACT_APP_ENVIRONMENT=${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}" >> .env
```

## デプロイフロー

1. **開発**: feature ブランチで開発
2. **テスト**: プルリクエスト作成時に自動テスト実行
3. **ステージング**: develop ブランチへマージでステージング環境へ自動デプロイ
4. **本番**: main ブランチへマージで本番環境へ自動デプロイ

## トラブルシューティング

### デプロイが失敗する場合
- GitHub Secrets が正しく設定されているか確認
- IAMユーザーの権限を確認
- S3バケットとCloudFront IDが正しいか確認

### ビルドが失敗する場合
- Node.js バージョンの確認
- 依存関係のインストールエラーを確認
- テストの失敗原因を確認

## セキュリティベストプラクティス

1. **最小権限の原則**: IAMユーザーには必要最小限の権限のみ付与
2. **Secrets管理**: 機密情報は必ずGitHub Secretsで管理
3. **ブランチ保護**: main/developブランチは直接プッシュ禁止
4. **コードレビュー**: プルリクエストは必ずレビュー後にマージ

## 監視とログ

- GitHub Actions のワークフロー実行ログを確認
- AWS CloudWatch でS3とCloudFrontのメトリクスを監視
- エラー発生時のSlack/Email通知設定を検討

## 追加の改善案

1. **キャッシュの活用**: node_modulesやビルド成果物のキャッシュ
2. **並列処理**: テストとビルドの並列実行
3. **Blue/Greenデプロイ**: ダウンタイムゼロのデプロイ実装
4. **ロールバック機能**: 問題発生時の自動ロールバック