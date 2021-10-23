const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const sockio = require("socket.io");
const cors = require("cors");
const io = new sockio.Server(server, {
  cors: {
    origin: "*",
  },
});

console.log("Server Starting");
const firebaseIntegration = require("./firebase_integration");
const Integration = new firebaseIntegration.Integration(io);

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("<h1>API Documentation is Comming</h1>");
});

app.post("/users/createNew", async (req, res) => {
  let userID = req.query.userID;
  let userName = req.query.userName;
  console.log(req.body);
  res.send(await Integration.createAccountDocument(userID, userName));
});

app.get("/users/checkUser", async (req, res) => {
  let userID = req.query.userID;
  console.log(`userID Check ${userID}`);
  let x = await Integration.doUserExist(userID);
  console.log(x);
  res.send({ doExist: x });
});

io.on("connection", (socket) => {
  console.log("user is connected");
  socket.on("join_room", (userID) => {
    console.log(userID);
    Integration.createListener(userID);
    socket.join(userID);
  });

  socket.on("leave_room", (userID) => socket.leave(userID));
  socket.on("disconnecting", () => {
    console.log("disconnecting");
    console.log(socket.rooms);
  });
});

server.listen(process.env.PORT || 5467, () => {
  console.log(`listening in *:${process.env.PORT || 3000}`);
});
