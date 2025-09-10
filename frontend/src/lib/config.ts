export function getAppRole(): 'user' | 'sponsor' | 'admin' {
  const role = process.env.NEXT_PUBLIC_APP_ROLE;
  
  switch (role) {
    case 'sponsor':
      return 'sponsor';
    case 'admin':
      return 'admin';
    default:
      return 'user';
  }
}