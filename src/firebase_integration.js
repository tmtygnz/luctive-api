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
  constructor(socket) {
    this.socket = socket;
  }

  async getHash(x) {
    console.log(crypto.createHash("md5").update(x).digest("hex"));
    return await crypto.createHash("md5").update(x).digest("hex");
  }

  async doUserExist(userID) {
    let userRef = await db.collection("users").doc(userID).get();
    return userRef.exists;
  }

  async createAccountDocument(userName, userEmail) {
    const userID = await this.getHash(userEmail);
    console.log(await this.doUserExist(userID));
    const res = await db.collection("users").doc(userID);
    if (!(await this.doUserExist(userID))) {
      res.set({
        userName: userName,
        userEmail: userEmail,
        account_date_created: admin.firestore.FieldValue.serverTimestamp(),
        spaces: {
          default: [
            {
              title: "Welcome",
            },
          ],
        },
      });
      return { message: "user created" };
    } else {
      return { message: "user already exist" };
    }
  }
}

module.exports.Integration = Integration;
