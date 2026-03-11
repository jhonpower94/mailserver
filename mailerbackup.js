const nodemailer = require("nodemailer");

async function sendMail(smtp, mail) {

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port == 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass
    }
  });

  await transporter.sendMail({
    from: `"${mail.fromName}" <${smtp.user}>`,
    to: mail.email,
    subject: mail.subject,
    html: mail.html,
    attachments: mail.attachments || []
  });

}

module.exports = sendMail;