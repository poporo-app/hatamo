# Mailtrap設定ガイド

## 1. Mailtrapアカウントの作成

1. [Mailtrap](https://mailtrap.io) にアクセス
2. 無料アカウントを作成（GitHubアカウントでも登録可能）

## 2. SMTP認証情報の取得

1. ログイン後、**Email Testing** → **Inboxes** に移動
2. **My Inbox** をクリック
3. **SMTP Settings** タブを選択
4. **Integrations** ドロップダウンから **SMTP** を選択
5. 以下の情報をコピー：
   - **Host**: sandbox.smtp.mailtrap.io
   - **Port**: 2525
   - **Username**: （表示される文字列）
   - **Password**: （表示される文字列）

## 3. .envファイルの更新

`.env` ファイルを開いて、以下の値を更新：

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=ここにMailtrapのUsernameを貼り付け
SMTP_PASSWORD=ここにMailtrapのPasswordを貼り付け
```

## 4. バックエンドの再起動

```bash
# Dockerを使用している場合
docker-compose restart backend

# または、ローカルで実行している場合
cd backend
go run main.go
```

## 5. メールの確認

1. http://localhost:3001/register で新規登録
2. Mailtrapの **My Inbox** でメールを確認
3. メール内の確認リンクをクリック

## トラブルシューティング

### メールが届かない場合

1. `.env` ファイルの認証情報が正しいか確認
2. バックエンドを再起動
3. バックエンドのログを確認：
   ```bash
   docker-compose logs backend
   ```

### Mailtrap制限

- 無料プランは月間500通まで
- 受信箱は50通まで保存
- テスト環境専用（本番環境では使用不可）

## 本番環境への移行

本番環境では以下のサービスの利用を推奨：
- SendGrid
- Amazon SES
- Mailgun
- Postmark