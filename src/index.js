const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const sockio = require("socket.io");
const io = new sockio.Server(server, {
  cors: {
    origin: "*",
  },
});

console.log("Server Starting");
const firebaseIntegration = require("./firebase_integration");
const Integration = new firebaseIntegration.Integration();

const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>API Documentation is Comming</h1>");
});

app.get("/users/create", (req, res) => {
  let { userName, userId, userEmail } = req.body;
  Integration.createAccount(userId, userName, userEmail)
    .then((resp) => res.send(resp))
    .catch((err) => res.send(err));
});

io.on("connection", (socket) => {
  console.log("user is connected");
  socket.on("newSession", (userId) => socket.join(userId));
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`listening in *:${port}`);
});
