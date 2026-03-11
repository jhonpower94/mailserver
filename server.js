const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const { Server } = require("socket.io");

const startQueue = require("./queue");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

app.get("/", (req, res) => {
  res.send("Email sender server is running.");
});

app.post("/send", upload.array("attachments"), async (req, res) => {
  const { smtp, subject, html, emails, fromName } = JSON.parse(req.body.data);

  const attachments = req.files.map((file) => ({
    filename: file.originalname,
    path: file.path,
  }));

  startQueue(
    {
      smtp,
      subject,
      html,
      emails,
      fromName,
      attachments,
    },
    io,
  ); // pass socket here

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;