const { parentPort, workerData } = require("worker_threads");
const sendMail = require("./mailer");
const pLimit = require("p-limit").default;

const limit = pLimit(5);

function replaceVariables(html, email) {
  return html
    .replace(/{{email}}/g, email)
    .replace(/{{date}}/g, new Date().toDateString())
    .replace(/{{uuid}}/g, crypto.randomUUID());
}

async function sendOne(email) {
  try {
    const html = replaceVariables(workerData.html, email);

    await sendMail(workerData.smtp, {
      email,
      subject: workerData.subject,
      html,
      fromName: workerData.fromName,
      attachments: workerData.attachments,
    });

    parentPort.postMessage({
      status: "sent",
      email,
    });
  } catch (err) {
    console.error("Error sending to", email, err);
    parentPort.postMessage({
      status: "failed",
      email,
      error: err.message,
    });
  }
}

async function start() {
  const tasks = workerData.emails.map((email) => limit(() => sendOne(email)));

  await Promise.all(tasks);
}

start();
