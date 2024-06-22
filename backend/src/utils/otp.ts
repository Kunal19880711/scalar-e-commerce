export type Otp = {
  otp: string;
  expiry?: Date;
};

export function generateOtp(length: number, lifeInSeconds: number | undefined = undefined): Otp {
  const otp = new Array(length)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10) % 10)
    .join("");
  const expiry = lifeInSeconds ? new Date(Date.now() + lifeInSeconds * 1000): undefined;
  return { otp, expiry };
}
