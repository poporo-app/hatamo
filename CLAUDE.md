# CLAUDE.md

# HATAMOマッチングサービス - Claude Code 実行ルール

**バージョン**: v4.0
**更新日**: 2025年10月13日
**更新内容**: アーキテクチャドキュメントの分割整理

---

## 📁 プロジェクトドキュメント

詳細なプロジェクト仕様は `/docs/architecture` フォルダ内に整理されています：

1. **[プロジェクト概要](./docs/architecture/01-project-overview.md)** - サービス概要、関係者、ビジネスモデル
2. **[機能要件](./docs/architecture/02-feature-requirements.md)** - CLIENT/SPONSOR/ADMIN機能仕様
3. **[招待コード仕様](./docs/architecture/03-invite-code-specification.md)** - 招待コード発行・管理の詳細仕様
4. **[技術要件](./docs/architecture/04-technical-requirements.md)** - 認証、決済、セキュリティ、データベース設計
5. **[開発計画](./docs/architecture/05-development-plan.md)** - Phase 1/2/3の段階的開発計画
6. **[セットアップ手順](./docs/architecture/06-setup-instructions.md)** - 環境構築・Docker・Prismaの設定

---

## 🎯 基本ルール

### 1. 実行方針

- **指示以外の修正を行わない**: ユーザーが明示的に指示した内容のみ対応すること
- **デザインを崩さない**: 既存の UI/UX を維持し、余計な修正を加えない
- **Git操作禁止**: ユーザーが明示的に指示しない限り、git コマンドの実行は禁止

### 2. 調査・分析

- **Serena MCP を活用**: 広範囲のコードベース調査には Serena MCP の symbolic tools を優先的に使用
- **ファイル全体の読み込みを避ける**: `get_symbols_overview` や `find_symbol` を使って必要な部分のみ読み込む
- **ドキュメント参照**: `/docs` ディレクトリ内のドキュメントを適宜参照して理解を深める

### 3. 思考・判断

- **ULTRATHINK の使用**: 以下の場合に `mcp__sequential-thinking__sequentialthinking` を使用すること
  - 大規模ファイル（1000行以上）の処理
  - 複雑なコードベースの解析
  - トークン消費が高い場合
  - コンテキストウィンドウの使用率が高い場合

### 4. フロントエンド開発

#### 技術スタック
- **Framework**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **UI コンポーネント**: shadcn/ui
- **状態管理**: Zustand
- **フォーム**: react-hook-form + zod

#### レスポンシブ対応
- **ブレークポイント**: `md: 768px` のみ
- **対応パターン**: スマートフォン（〜767px）とデスクトップ（768px〜）の2パターン
- 詳細は `/docs/デザイン設計-レスポンシブ設計.md` を参照

#### Figma 連携
- Figma デザインからの実装時は Figma MCP (`mcp__Figma_Desktop__*`) を使用
- デザインの完全再現を優先

### 5. バックエンド開発

#### 技術スタック
- **Runtime**: Node.js
- **Framework**: Express.js
- **言語**: TypeScript
- **ORM**: Prisma
- **Database**: MySQL 8.0
- **決済**: Stripe
- **リアルタイム通信**: Socket.io

#### 認証・認可
- **未認証ユーザー**: `/auth/*` のみアクセス可能
- **それ以外のパス**: `/auth/register/invite-code` にリダイレクト
- **実装方法**: Next.js Middleware + JWT

### 6. 開発環境

#### ポート
- **Frontend**: 3000
- **Backend**: 5000
- **Admin Backend**: 5001
- **MySQL**: 3306
- **Redis**: 6379
- **Adminer**: 8080

#### 開発コマンド
```bash
# 全サービス起動
npm run dev

# データベースのみ起動
npm run db:up

# マイグレーション実行
npm run db:migrate

# Prisma Studio
npm run db:studio
```

---

## 🔍 重要な仕様

### SPONSORの特徴
- **サービス提供**: 自分のサービスを登録・提供できる
- **サービス利用**: 他のSPONSORのサービスを利用できる（CLIENT扱い）
- **制限**: 自分自身のサービスには申し込めない

### 招待コード
- **Phase 1**: テスト用の招待コードを手動生成して使用
- **Phase 2以降**: 管理者が招待コード発行機能を使用
- 詳細仕様は `/docs/architecture/03-invite-code-specification.md` を参照

---

## 📝 開発フロー

1. **要件確認**: `/docs/architecture` 内の関連ドキュメントを参照
2. **調査**: Serena MCP で必要な範囲のみ調査
3. **思考**: ULTRATHINK で実装方針を検討（必要に応じて）
4. **実装**: 指示された内容のみ実装
5. **テスト**: Playwright などで動作確認
6. **報告**: 実装内容と結果を簡潔に報告

---

## 🚀 クイックスタート

### 新規開発者向け
1. `/docs/architecture/01-project-overview.md` でサービス全体を理解
2. `/docs/architecture/02-feature-requirements.md` で担当機能を確認
3. `/docs/architecture/06-setup-instructions.md` で環境構築

### 特定機能の実装
1. 関連する architecture ドキュメントを読む
2. Serena MCP で既存実装を調査
3. ULTRATHINK で実装方針を整理（必要に応じて）
4. 実装・テスト・報告

---

## ⚠️ 注意事項

- **セキュリティ**: reCAPTCHA を全フォームに実装（Phase 1は未実装でも可）
- **決済**: Stripe のテストモードを使用
- **エラーハンドリング**: 適切なエラーメッセージとログを実装
- **コードスタイル**: TypeScript の strict モードを遵守
- **コミット**: ユーザーが明示的に指示しない限りコミット禁止

---

## 📚 参考リソース

- [デザイン設計 - レスポンシブ設計](./docs/デザイン設計-レスポンシブ設計.md)
- [フロントエンド開発ガイド](./docs/front-template-create.md)
- [Prisma スキーマ](./backend/prisma/schema.prisma)

---

**作成日**: 2025年9月21日
**バージョン**: v4.0 (簡略化版)
**最終更新**: 2025年10月13日
**作成者**: 要件定義チーム
- # 対応内容

サブエージェント：backend-special で実装して下さい

docs/auth-fllow.md を参照して 以下のファイルを適切に修正して下さい
backend/prisma/schema.prisma 
docs/architecture/06-setup-instructions.md

指示以外の修正はNG