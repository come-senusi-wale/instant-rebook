// Generate a new OTP
export function generateOTP() {
  let otp = "";
  //const allowedChars =
  //  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const allowedChars =
    "0123456789";
  for (let i = 0; i < 4; i++) {
    otp += allowedChars.charAt(
      Math.floor(Math.random() * allowedChars.length)
    );
  }
  return otp;
}
  
export const OTP_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export function generateCode(length: number = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}