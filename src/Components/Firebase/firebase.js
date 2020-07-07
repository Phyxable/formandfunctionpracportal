import FirebaseContext, { withFirebase } from "./context";
import firebase from '@firebase/app';
import "@firebase/auth";
import "@firebase/database";

var config = {
    apiKey: "AIzaSyDZZ-kPUtTzhDIIC7eKcLuy0hOf-qpcIiI",
    authDomain: "phyxabletest.firebaseapp.com",
    databaseURL: "https://phyxabletest.firebaseio.com",
    projectId: "phyxabletest",
    storageBucket: "phyxabletest.appspot.com",
    messagingSenderId: "257817324866",
    appId: "1:257817324866:web:0bce82121a81eecd"
};


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

  doSignOut = uid => {
    this.auth.signOut();
  };

  doAddUId = u => {
    this.uid = u;
    //  this.setState({ uid: uid });
  };
  doGetUId = () => {
    return this.uid;
  };

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

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
  user = uid => this.db.ref(`users/${uid}`);

  writeData = (path, key, value) => {
    console.log("write data", path, key, value);
    this.db
      .ref(`/users/${path}`)
      .update({
        [key]: value
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
        [key]: value
      })
      .then(() => {
        console.log("push data proim");
      });
  };

  users = () => this.db.ref("users");
}

export default Firebase;
export { FirebaseContext, withFirebase };
