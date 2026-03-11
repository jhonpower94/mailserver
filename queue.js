const { Worker } = require("worker_threads");
const os = require("os");

function startQueue(data, io) {

  const cpu = os.cpus().length;
  const chunkSize = Math.ceil(data.emails.length / cpu);

  for (let i = 0; i < cpu; i++) {

    const start = i * chunkSize;
    const end = start + chunkSize;

    const chunk = data.emails.slice(start, end);

    if (!chunk.length) continue;

    const worker = new Worker("./worker.js", {
      workerData: {
        ...data,
        emails: chunk
      }
    });

    worker.on("message", (msg) => {

      // forward worker message to frontend
      io.emit("mail-progress", msg);

    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
    });

  }

}

module.exports = startQueue;