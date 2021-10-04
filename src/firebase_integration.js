const admin = require("firebase-admin");
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

  createAccount(userId, userName, userEmail) {
    console.log(`${userId} | ${userName} | ${userEmail}`);
    const res = db
      .collection("users")
      .doc(userEmail)
      .set({
        user_name: userName,
        user_id: userId,
        account_date_created: admin.firestore.FieldValue.serverTimestamp(),
        spaces: {
          default: [
            {
              title: "Welcome",
            },
          ],
        },
      });
    return res;
  }
}

module.exports.Integration = Integration;
