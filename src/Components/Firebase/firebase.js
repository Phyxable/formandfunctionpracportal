import FirebaseContext, { withFirebase } from "./context";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";

// Form and function practitioner Database configuration
 let config = {
  apiKey: "AIzaSyDrRlySGdplNDvKfsNzowzXRSnWZaslIbg",
    authDomain: "formandfunctionpractitioner.firebaseapp.com",
    databaseURL: "https://formandfunctionpractitioner.firebaseio.com",
    projectId: "formandfunctionpractitioner",
    storageBucket: "formandfunctionpractitioner.appspot.com",
    messagingSenderId: "347765201904",
    appId: "1:347765201904:web:ead4d2d7875b33c3bd1b35",
    measurementId: "G-XBJZ20Y2JB"
 };


// Phyxable Staging Database Configuration
// var config = {
//   apiKey: "AIzaSyBAEyGaOXkMh-DyEmuaJJ_FBR688DnLNKY",
//   authDomain: "phyxabledevelopment.firebaseapp.com",
//   databaseURL: "https://phyxabledevelopment.firebaseio.com",
//   projectId: "phyxabledevelopment",
//   storageBucket: "phyxabledevelopment.appspot.com",
//   messagingSenderId: "556980468782",
//   appId: "1:556980468782:web:67b377c4b489f3e17f73bf",
// };

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.db = firebase.database();
    this.state = {};
    this.uid = "s";
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = (uid) => {
    this.auth.signOut();
  };

  doAddUId = (u) => {
    this.uid = u;
    //  this.setState({ uid: uid });
  };
  doGetUId = () => {
    return this.uid;
  };

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  doGetUserProfile(uid) {
    const email = this.db
      .ref(`/users/${uid}/userProfile`)
      .once("value")
      .then(function (snapshot) {
        return snapshot.val();
      });
    return email;
  }

  // *** User API ***
  user = (uid) => this.db.ref(`users/${uid}`);

  writeData = (path, key, value) => {
    console.log("write data", path, key, value);
    this.db
      .ref(`/users/${path}`)
      .update({
        [key]: value,
      })
      .then(() => {
        console.log("write data proim");
      });
  };
  pushData = (path, key, value) => {
    console.log("write data", path, key, value);
    this.db
      .ref(`/users/${path}`)
      .push({
        [key]: value,
      })
      .then(() => {
        console.log("push data proim");
      });
  };

  users = () => this.db.ref("users");
}

export default Firebase;
export { FirebaseContext, withFirebase };
