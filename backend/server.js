const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dataRoutes = require("./router/router.js");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: 'http://localhost:8081',
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/", dataRoutes);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8081',
    credentials: true,
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling']
  }
});

// io.on('connection', (socket) => {
//   console.log("New client connected");

//   socket.on("joinRoom", (room) => {
//     socket.join(room);
//     console.log(`User joined room: ${room}`);
//   });

//   socket.on("sendMessage", (messageData) => {
//     console.log("Message received:", messageData);
//     io.to(messageData.room).emit("message", messageData);
//     console.log(`Message sent to room: ${messageData.room}`);
//   });

//   socket.on('disconnect', () => {
//     console.log("Client disconnected");
//   });
// });
io.on('connection', (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("sendMessage", (messageData) => {
    console.log("Message received:", messageData);
    io.emit("message", messageData); // Broadcast message to all clients
  });

  socket.on('disconnect', () => {
    console.log("Client disconnected:", socket.id);
  });
});
server.listen(process.env.PORT || 3003, () => {
  console.log("Running at Port 3003");
});
