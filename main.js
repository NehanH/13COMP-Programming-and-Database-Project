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
  win:      'n/a',
  loss:     'n/a',
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

function ss_store(_key, _value){
  sessionStorage.setItem(_key,  JSON.stringify(_value));
}

function login() {
  fb_readRec(DETAILS, userDetails.uid, userDetails);
  fb_login(userDetails);
  console.log(loginStatus);
  const user = firebase.auth().currentUser;
  if (user && loginStatus == "logged in" && userDetails.gameName != null && userDetails.gameName != 'undefined') {
  console.log(userDetails.gameName)
  ss_store("details", userDetails);
  regEmailName();
  window.location.href = "https://13comp-programming-and-db-assessment-nehanhettiarach.13comp-gl-2023.repl.co/gp.html";
  } else if (user == null) {
  console.log(userDetails.gameName)
  document.getElementById("b_login").style.display = "none";
  document.getElementById("lp").style.display = "none";
  document.getElementById("rp").style.display = "block";
  regEmailName();
  }
}

function saveSS(){
 var ss_userDetails = JSON.parse(sessionStorage.getItem("details"));
  console.log(ss_userDetails.photoURL);
  console.log(ss_userDetails.gameName);
  console.log(ss_userDetails.win);
  console.log(ss_userDetails.loss);
  document.getElementById("userProfile").src = ss_userDetails.photoURL;
  var element = document.getElementById("userName");
  element.innerHTML = ss_userDetails.gameName;
  var elementWL = document.getElementById("userWinLoss");
  elementWL.innerHTML = ss_userDetails.win + '/' + ss_userDetails.loss;
}

/*************************************************************/
//      END OF APP
/*************************************************************/
