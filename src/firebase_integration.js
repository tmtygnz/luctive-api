const admin = require("firebase-admin");
const crypto = require("crypto");
require("dotenv").config();

const firebaseAuth = JSON.parse(process.env.FIREBASE_AUTH);
console.log(typeof firebaseAuth);

admin.initializeApp({
  credential: admin.credential.cert(firebaseAuth),
});

const db = admin.firestore();

class Integration {
  constructor(io) {
    this.io = io;
    this.listeners = [];
  }

  async doUserExist(userID) {
    console.log(userID);
    let userRef = await db.collection("users").doc(userID).get();
    return userRef.exists;
  }

  async createAccountDocument(userID, userName) {
    const res = await db.collection("users").doc(userID);

    if (!(await this.doUserExist(userID))) {
      res.set({
        userName: userName,
        spaces: [
          {
            spaceName: "default",
            spaceTodo: [
              {
                todoTitle: "Welcom to luctive!",
              },
            ],
          },
        ],
      });
      return { message: "user created", userID: userID };
    } else {
      return { message: "user already exist" };
    }
  }

  createListener(userID) {
    const userQ = db.collection("users").doc(userID);
    const obeserver = userQ.onSnapshot((snapshot) => {
      this.io.sockets.in(userID).emit("dbUpdate", snapshot.data());
    });
  }
}

module.exports.Integration = Integration;
