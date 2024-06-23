import nodemailer from "nodemailer";
import { google } from "googleapis";
import { envConfig } from "../../appUtils";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

const config = envConfig();
const { OAuth2 } = google.auth;

export type MailInfo = nodemailer.SentMessageInfo;

async function createTransporter() {
  const oauth2Client = new OAuth2(
    config.GMAIL_CLIENT_ID,
    config.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: config.GMAIL_REFRESH_TOKEN,
  });

  const accessToken: string | null | undefined = await new Promise(
    (resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    }
  );

  if (!accessToken) {
    throw new Error("Failed to create access token");
  }

  const smtpOptions: SMTPTransport.Options = {
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.GMAIL_EMAIL,
      accessToken,
      clientId: config.GMAIL_CLIENT_ID,
      clientSecret: config.GMAIL_CLIENT_SECRET,
      refreshToken: config.GMAIL_REFRESH_TOKEN,
    },
  };

  const transporter = nodemailer.createTransport(smtpOptions);
  return transporter;
}

export async function sendMail(mailOps: Mail.Options): Promise<MailInfo> {
  const emailTransporter = await createTransporter();
  mailOps.from = config.GMAIL_EMAIL;
  const info = await emailTransporter.sendMail(mailOps);
  return info;
}
