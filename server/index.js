const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
var firebase = require('firebase');
const configPort = require("./config");
const app = express();
const proxy = require('express-http-proxy');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
var cors = require('cors')
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(cors())

var config = {
  apiKey: "AIzaSyDrRlySGdplNDvKfsNzowzXRSnWZaslIbg",
    authDomain: "formandfunctionpractitioner.firebaseapp.com",
    databaseURL: "https://formandfunctionpractitioner.firebaseio.com",
    projectId: "formandfunctionpractitioner",
    storageBucket: "formandfunctionpractitioner.appspot.com",
    messagingSenderId: "347765201904",
    appId: "1:347765201904:web:ead4d2d7875b33c3bd1b35",
    measurementId: "G-XBJZ20Y2JB"
};
firebase.initializeApp(config);

app.get("/api/users", (req, res) => {
  console.log("HTTP Get Request");
  var userReference = firebase.database().ref("/users/");
  var data = 0;
  
  userReference.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(snapshot) {
      console.log(snapshot.child("Age").val());
      data = data + snapshot.child("Age").val();
  });
  res.json(data);
});

	//Attach an asynchronous callback to read the data
	// userReference.on("value", 
	// 		  function(snapshot) {
	// 				console.log(snapshot.child("Age").val());
	// 				res.json(snapshot.child("Age").val());
	// 				userReference.off("value");
	// 				}, 
	// 		  function (errorObject) {
	// 				console.log("The read failed: " + errorObject.code);
	// 				res.send("The read failed: " + errorObject.code);
	// 		 });
});

app.get("/api/greeting", (req, res) => {
  const name = req.query.name || "World";
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

//to handle HTTP get request
app.get('/api/playlists', function (req, res) {

	console.log("HTTP Get Request");
	var userReference = firebase.database().ref("/customPhyx/");

	//Attach an asynchronous callback to read the data
	userReference.on("value", 
			  function(snapshot) {
					console.log(snapshot.val());
					res.json(snapshot.val());
					userReference.off("value");
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});

app.post("/api/playlists", (req, res) => {
  const media_list = req.body.media_list;
  const selected_users = req.body.selected_users;
  const randomString = req.body.randomString;
  const program_name = req.body.program_name;
  const date = req.body.date;
  const timestamp = req.body.timestamp;
  const created_by = req.body.created_by;
  
  var referencePath = '/customPhyx/'+randomString+'/';
  var idReference = firebase.database().ref(referencePath);
  var userReference = firebase.database().ref(referencePath+'selected_users'+'/');
  var mediaReference = firebase.database().ref(referencePath+'playlist'+'/');
  idReference.set({ id: randomString, program_name: program_name, timestamp: timestamp, date: date, created_by: created_by });
  userReference.set(selected_users);
  mediaReference.set(media_list);
});

app.delete("/api/playlists", (req, res) => {
  const id = req.body.id;
  
  var referencePath = '/customPhyx/'+id+'/';
  var idReference = firebase.database().ref(referencePath);
  idReference.remove();
});

// Dev environment front-end proxy server
const devProxy = proxy('localhost:8080', {
  proxyReqPathResolver: function (req) {
      console.log(req.url)
      return req.url;
  }
});

process.env.DEV_PROXY ? app.use("/", devProxy) : app.use("*",express.static(path.join(__dirname, "..", "build")));

app.listen(configPort.port, () =>
  console.log(`Express server is running on localhost:${configPort.port}`)
);
