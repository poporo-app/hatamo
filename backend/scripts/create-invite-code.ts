import { PrismaClient, UserType, InviteCodeStatus } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// 8文字のランダムな招待コードを生成
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 紛らわしい文字を除外
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function createInviteCode(userType: UserType) {
  try {
    // まず、管理者ユーザーを作成（招待コードの作成者として必要）
    let adminUser = await prisma.user.findFirst({
      where: { userType: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('管理者ユーザーが存在しないため、作成します...');
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@hatamo.com',
          passwordHash: '$2b$10$dummy.hash.for.admin.user', // ダミーハッシュ
          emailVerified: true,
          userType: 'ADMIN',
          name: 'System Admin'
        }
      });
      console.log('管理者ユーザーを作成しました:', adminUser.email);
    }

    // 招待コードを生成
    const code = generateInviteCode();

    // 招待コードをデータベースに保存
    const inviteCode = await prisma.inviteCode.create({
      data: {
        code,
        userType,
        status: InviteCodeStatus.ACTIVE,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
        memo: `テスト用${userType}招待コード`,
        createdBy: adminUser.id
      }
    });

    console.log('\n✅ 招待コードを作成しました:');
    console.log('-----------------------------------');
    console.log('コード:', inviteCode.code);
    console.log('タイプ:', inviteCode.userType);
    console.log('ステータス:', inviteCode.status);
    console.log('有効期限:', inviteCode.expiresAt);
    console.log('-----------------------------------\n');

    return inviteCode;
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// コマンドライン引数からユーザータイプを取得
const userType = process.argv[2]?.toUpperCase() as UserType;

if (!userType || !['CLIENT', 'SPONSOR'].includes(userType)) {
  console.error('使用方法: ts-node create-invite-code.ts <CLIENT|SPONSOR>');
  process.exit(1);
}

createInviteCode(userType);
