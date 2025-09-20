const nodemailer = require("nodemailer");
const fs = require("fs").promises; 
const path = require("path");
require('dotenv').config()
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
    
    const info = await transporter.sendMail({
      from: `"AI Blog Generator" <${process.env.FROM_EMAIL}>`, // sender address
      to,
      subject,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully: " + info.messageId);
    return {success: true};
  } catch (err) {
    console.error("❌ Error sending email:", err);
    return {success: false, error: err};
  }
}

module.exports = { sendEmail };