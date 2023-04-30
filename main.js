/*****************************************************/
// main.js
// Written by Nehan Hettiarachchi  2022
/*****************************************************/

/*************************************************************/
// VARIABLES
/*************************************************************/

// database variables
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


/*************************************************************/
// FUNCTIONS
/*************************************************************/

/**************************************************************/
// Setup Function
// Called by n/a
// Creates Ball Object, Creates Canvas, Inintilises Database
// Input:  n/a
// Return: n/a
/**************************************************************/
function setup(){
  fb_initialise();
  fb_login(userDetails);
  frameRate(60)
}

// CONNECT TO FIREBASE AFTER SETUP
var database = firebase.database();


/**************************************************************/
// Draw Function
// Called by n/a
// Calculates Distance to Ball, Creates the balls using the ball object, creates background, changes registration from name and email
// Input:  n/a
// Return: n/a
/**************************************************************/
function draw(){
  // Set Form Name And Email
    regEmailName()
}

/**************************************************************/
  

/**************************************************************/
// gameOver Function
// Called by startTimer Function
// If user highscore is greater than their currently saved score automatically writes to database, hides game canvas, stops the game.
// Input:  user score / highscore
// Return: n/a
/**************************************************************/

/**************************************************************/
// dToBall Function (Distance To Ball)
// Called by Draw
// Calculates Distance to Ball
// Input: Ball length, ball.x, ball.y, mouse.X, mouse.Y
// Return: Distance to ball
/**************************************************************/

/**************************************************************/
// mouseClicked Function
// Called by startTimer
// Calculates user hit or miss
// Input:  Distance to ball
// Return: n/a
/**************************************************************/


/**************************************************************/
// hitOrMiss Function
// Called by mouseClicked
// Records user Hits + Misses
// Input:  n/a
// Return: Hits + Misses
/**************************************************************/

/**************************************************************/
// speedButton Function
// Called by speed button on game selection page
// hides game selection page (gp) displays speed page (sp)
// Input:  n/a
// Return: n/a
/**************************************************************/
function speedButton(){
  document.getElementById("gp").style.display = "none";
  document.getElementById("sp").style.display = "block";
}

function lobbyButton(){
  document.getElementById("gp").style.display = "none";
  document.getElementById("ls").style.display = "block";
}

function gameDisplay(){
  document.getElementById("gp").style.display = "none";
  document.getElementById("sp").style.display = "block";
}
/**************************************************************/
// fakeButton Function
// Called by Track and Flick buttons on game selection page
// gives alert
// Input:  n/a
// Return: n/a
/**************************************************************/
function fakeButton(){
  alert('This is just for show, pick speed to play the game')
}

/*************************************************************/
// FIREBASE FUNCTIONS
// Login + Read(all) + Write + Check Admin
/*************************************************************/

/**************************************************************/
// login()
// Called by setup
// Login to Firebase, check if the user exists, if they do send them to game selection page, if they don't exist send them to reg page. 
// Input:  n/a
// Return: 
/**************************************************************/
function login() {
  readRec();
  fb_login(userDetails);
  console.log(loginStatus);
  const user = firebase.auth().currentUser;
  if (user) {
  console.log(userDetails.gameName)
  document.location.href = "https://13comp-programming-and-db-assessment-nehanhettiarach.13comp-gl-2023.repl.co/gameLobby.html";
  regEmailName();
  createAdminData();
  readAdminData();
  } else if (user == null) {
  console.log(userDetails.gameName)
    document.getElementById("b_login").style.display = "none";
  document.getElementById("lp").style.display = "none";
  document.getElementById("rp").style.display = "block";
  regEmailName();
  createAdminData();
    
  readAdminData();
  }
}



/*****************************************************/
// fb_readAll(_path, _data)
// Read all DB records for the path
// Input:  path to read from and where to save it
// Return:
/*****************************************************/
function readAll() {
  // CALL YOUR READ ALL FUNCTION        <=================
  fb_readAll(DETAILS, dbArray);
}""

/*****************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/*****************************************************/
function writeRec() {
  if (userDetails.uid != '') {
    userDetails.score = score;
    
    // CALL YOUR WRITE A RECORD FUNCTION    <=================
    fb_writeRec(DETAILS, userDetails.uid, userDetails);
  }
  else {
    dbScore     = '';
    writeStatus = '';
    loginStatus = 'not logged in';
  }
}

/*****************************************************/
// createGameLobby for guess the number Function
// Creates a game lobby using users info and also makes them player 1
// Called by create lobby button
/*****************************************************/
function createGameLobby() {
  firebase.database().ref('gameLobby/' + 'GTN/' + userDetails.name + '/P1/').set({
    userName: userDetails.gameName,
    online: 'true',
    photoURL: userDetails.photoURL,
    uid: userDetails.uid,
    email: userDetails.email
  });
}

// Create Admin Data For Nehan And Mr Gillies (Data is supposed to be made manually this is just for convenience)
function createAdminData() {
  if(userDetails.email == '19307nh@hvhs.school.nz' || userDetails.email == 'bryan.gillies@hvhs.school.nz'){
  firebase.database().ref('admin/' + userDetails.name).set({
    isAdmin: userDetails.uid
  });
}
}

/*****************************************************/
// readAdminData
// Checks user for admin by looking for corresponding admin UID
// Called by fb_login
// Input:  n/a
// Return:  n/a
/*****************************************************/
function readAdminData(){
  var adminRef = firebase.database().ref('admin/' + userDetails.name);
  adminRef.on('value', (snapshot) => {
  var data = snapshot.val();
    if(userDetails.uid == data.isAdmin){
      adminButtonDisplay()
    }
});
}

/*****************************************************/
// AdminButtonDisplay Function
// Shows admin button if user is admin
// Called by readAdminData
// Input:  n/a
// Return:  n/a
/*****************************************************/
function adminButtonDisplay(){
   document.getElementById("b_lpAdmin").style.display = "block";
}


/*****************************************************/
// fb_readRec(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/*****************************************************/
function readRec() {
  // CALL YOUR READ A RECORD FUNCTION    <=================
  fb_readRec(DETAILS, userDetails.uid, userDetails);
}

/*************************************************************/
//      END OF APP
/*************************************************************/
