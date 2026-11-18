export function validateLogin(body) {
  const { email, password } = body || {};

  // 1. Check email (must be text containing '@' and '.')
  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return { valid: false, message: 'Must be a valid email address' };
  }

  // 2. Check password (must not be empty)
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }

  // 3. Everything looks good!
  return { valid: true };
}