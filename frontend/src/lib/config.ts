export function getAppRole(): 'user' | 'business' | 'admin' {
  const role = process.env.NEXT_PUBLIC_APP_ROLE;
  
  switch (role) {
    case 'business':
      return 'business';
    case 'admin':
      return 'admin';
    default:
      return 'user';
  }
}