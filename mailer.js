const nodemailer = require("nodemailer");

async function sendMail(smtp, mail) {

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: true,
    auth: {
      user: smtp.email,
      pass: smtp.password
    }
  });

  await transporter.sendMail({
    from: `"${mail.fromName}" <${smtp.email}>`,
    to: mail.email,
    subject: mail.subject,
    html: mail.html,
    attachments: mail.attachments || []
  });

}

module.exports = sendMail;