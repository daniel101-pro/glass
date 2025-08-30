/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate verification code expiry time (10 minutes from now)
 */
export function getVerificationCodeExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
}

/**
 * Check if verification code is expired
 */
export function isVerificationCodeExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
