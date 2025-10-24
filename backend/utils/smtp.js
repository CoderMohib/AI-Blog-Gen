// const nodemailer = require("nodemailer");
const fs = require("fs").promises; 
const path = require("path");
require('dotenv').config()
const SibApiV3Sdk = require("@sendinblue/client");

// Initialize the API client with proper configuration
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
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
    // Validate required environment variables
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
    }
    if (!process.env.FROM_EMAIL) {
      throw new Error("FROM_EMAIL is not set in environment variables");
    }

    const fullPath = path.resolve(__dirname, `../templates/${htmlFilePath}`);
    let htmlContent = await fs.readFile(fullPath, "utf-8");
    replacements.logoUrl = `${process.env.BACKEND_URL}/public/images/logo.png`;
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, replacements[key]);
    });
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { 
      email: process.env.FROM_EMAIL, 
      name: "AI Blog Generator" 
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    console.log("📧 Attempting to send email to:", to);
    console.log("📧 Using sender:", process.env.FROM_EMAIL);
    
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", response.messageId || response);
    return {success: true, messageId: response.messageId};
  } catch (err) {
    console.error("❌ Error sending email:");
    console.error("Error details:", err.message || err);
    console.error("Full error:", err);
    
    // Return more detailed error information
    return {
      success: false, 
      error: err.message || err,
      details: err.response?.data || err.body || null
    };
  }
}

module.exports = { sendEmail };