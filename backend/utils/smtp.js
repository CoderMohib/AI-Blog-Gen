// const nodemailer = require("nodemailer");
const fs = require("fs").promises; 
const path = require("path");
require('dotenv').config()
const SibApiV3Sdk = require("@sendinblue/client");
const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// 3. Reusable function to send emails
async function sendEmail(to, subject, htmlFilePath, replacements = {}) {
  try {
    const fullPath = path.resolve(__dirname, `../templates/${htmlFilePath}`);
    let htmlContent = await fs.readFile(fullPath, "utf-8");
    replacements.logoUrl = `http://localhost:3000/public/images/logo.png`;
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, replacements[key]);
    });
    
    const sendSmtpEmail = {
      sender: { email: process.env.FROM_EMAIL, name: "AI Blog Generator" },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    };

    const response = await client.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", response.messageId || response);
    return {success: true};
  } catch (err) {
    console.error("❌ Error sending email:", err);
    return {success: false, error: err};
  }
}

module.exports = { sendEmail };