const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SEND_MAIL_GMAIL_EMAIL,
    pass: process.env.SEND_MAIL_GMAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, templateName, templateData) => {
  try {
    const templatePath = path.join(`views/mail/templates/${templateName}.ejs`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const htmlContent = ejs.render(templateContent, templateData);
    const mailOptions = {
      from: process.env.SEND_MAIL_GMAIL_EMAIL,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return {
        status:true,
        data:info
    }
  } catch (error) {
    return {
        status:true,
        data:{},
        error:error
    }
  }
};

module.exports = { sendMail };
