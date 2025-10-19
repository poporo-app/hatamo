import { PrismaClient, UserType, InviteCodeStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 管理者ユーザーを作成（招待コード発行者として必要）
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hatamo.com' },
    update: {},
    create: {
      email: 'admin@hatamo.com',
      passwordHash: '$2b$10$example.hash.for.testing', // 実際のハッシュ化されたパスワード
      emailVerified: true,
      userType: UserType.ADMIN,
      name: 'システム管理者',
    },
  });

  console.log('Created admin user:', adminUser.id);

  // CLIENT用テスト招待コード
  const clientInviteCode = await prisma.inviteCode.upsert({
    where: { code: 'CLIENT01' },
    update: {},
    create: {
      code: 'CLIENT01',
      userType: UserType.CLIENT,
      status: InviteCodeStatus.ACTIVE,
      expiresAt: new Date('2025-12-31'), // 2025年末まで有効
      memo: 'テスト用CLIENT招待コード',
      createdBy: adminUser.id,
    },
  });

  console.log('Created CLIENT invite code:', clientInviteCode.code);

  // SPONSOR用テスト招待コード
  const sponsorInviteCode = await prisma.inviteCode.upsert({
    where: { code: 'SPONSOR01' },
    update: {},
    create: {
      code: 'SPONSOR01',
      userType: UserType.SPONSOR,
      status: InviteCodeStatus.ACTIVE,
      expiresAt: new Date('2025-12-31'), // 2025年末まで有効
      memo: 'テスト用SPONSOR招待コード',
      createdBy: adminUser.id,
    },
  });

  console.log('Created SPONSOR invite code:', sponsorInviteCode.code);

  // 期限切れテスト用招待コード
  const expiredInviteCode = await prisma.inviteCode.upsert({
    where: { code: 'EXPIRED01' },
    update: {},
    create: {
      code: 'EXPIRED01',
      userType: UserType.CLIENT,
      status: InviteCodeStatus.ACTIVE,
      expiresAt: new Date('2024-01-01'), // 既に期限切れ
      memo: 'テスト用期限切れ招待コード',
      createdBy: adminUser.id,
    },
  });

  console.log('Created EXPIRED invite code:', expiredInviteCode.code);

  // 無効化されたテスト用招待コード
  const disabledInviteCode = await prisma.inviteCode.upsert({
    where: { code: 'DISABLED01' },
    update: {},
    create: {
      code: 'DISABLED01',
      userType: UserType.CLIENT,
      status: InviteCodeStatus.DISABLED,
      expiresAt: null, // 無期限
      memo: 'テスト用無効化招待コード',
      createdBy: adminUser.id,
    },
  });

  console.log('Created DISABLED invite code:', disabledInviteCode.code);

  console.log('Seed completed successfully!');
  console.log('\nテスト用招待コード一覧:');
  console.log('- CLIENT01 (CLIENT用、有効)');
  console.log('- SPONSOR01 (SPONSOR用、有効)');
  console.log('- EXPIRED01 (期限切れテスト用)');
  console.log('- DISABLED01 (無効化テスト用)');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
