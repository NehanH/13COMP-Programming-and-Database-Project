/*****************************************************/
// main.js
// Written by Nehan Hettiarachchi  2023
/*****************************************************/

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
  score:    'n/a',
  gameName: 'n/a',
  phone:    'n/a'
};

function setup(){
  fb_initialise();
}

function draw(){
  // Set Form Name And Email
  regEmailName()
}

function login() {
  fb_readRec(DETAILS, userDetails.uid, userDetails);
  fb_login(userDetails);
  console.log(loginStatus);
  const user = firebase.auth().currentUser;
  if (user) {
  console.log(userDetails.gameName)
  document.getElementById("b_login").style.display = "none";
  document.getElementById("lp").style.display = "none";
  document.getElementById("rp").style.display = "none";
  regEmailName();
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
