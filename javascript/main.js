/*************************************************************
  loginManager.js
  
  Written by Nehan Hettiarachchi, Term 1 2023
  Javascript for index.html, has userDetails object, login function which checks if the user exists in the database, setup + draw     functions, ss_store() which saves the userDetails object to session storage.
  V1: Copied 12COMP project setup, draw and login functions aswell as variables to main.js
  V2: Added ss_store()
*************************************************************/

const DETAILS = "userDetails"; 

var loginStatus = ' ';
var readStatus  = ' ';
var writeStatus = ' ';
var readSuccess = ' ';

// userDetails object
var userDetails = {
  uid:      'n/a',
  email:    'n/a',
  name:     'n/a',
  photoURL: 'n/a',
  win:      0,
  loss:     0,
  gameName: 'n/a',
  phone:    'n/a',
};

// Setup function
function setup(){
  fb_initialise();
}
// Draw function
function draw(){
  // Set Form Name And Email
  regEmailName()
}
/**************************************************************/
// ss_store(_key, _value)
// Called by login function
// Saves userDetails object to session storage
// Input:  userDetails Object
// Return: n/a
/**************************************************************/
function ss_store(_key, _value){
  sessionStorage.setItem(_key,  JSON.stringify(_value));
}
/**************************************************************/
// login()
// Called by login button press
// Logs user in with google authentication and checks if user exists in database or not.
// Input:  n/a
// Return: n/a
/**************************************************************/
function login() {
  fb_readRec(DETAILS, userDetails.uid, userDetails);
  fb_login(userDetails);
  console.log(loginStatus);
  const user = firebase.auth().currentUser;
  if (user && loginStatus == "logged in" && userDetails.gameName != null && userDetails.gameName != 'undefined') {
  console.log(userDetails.gameName)
  ss_store("details", userDetails);
  regEmailName();
  window.location.href = "/gp.html"
  } else if (user == null) {
  console.log(userDetails.gameName)
  document.getElementById("b_login").style.display = "none";
  document.getElementById("lp").style.display = "none";
  document.getElementById("rp").style.display = "block";
  regEmailName();
  }
}

/*************************************************************/
//      END OF APP
/*************************************************************/
