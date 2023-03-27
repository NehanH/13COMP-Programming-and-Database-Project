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

// User Variables
var hit = false;
var score = 0;
var count = 0;
var miss = 0;
var userHighscore

// barrier
var spot = {
  x: 100,
  y: 100,
}

// timer
const timer = document.getElementById("g_timer");
var timerInterval;

// colour
var col = {
  r: 0,
  g: 0,
  b: 0,
}

// Canvas Container
const elmnt = document.getElementById("speedPC");

// Velocity Array
const BALLVEL = [-7,-6,-5,-4,-3,3,4,5,6,7];
const BALLVELNEG = [-7,-6,-5,-4,-3]
const BALLVELPOS = [3,4,5,6,7]

// Ball Array
var ball = []
var ballRadius = 25;
var hits = 0;
var px2ball = [];


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
  hit == false;
  frameRate(60)
  document.getElementById("currentHS").innerHTML = userDetails.score;
  var speed = random(BALLVEL);
  var speedY = random(BALLVEL);
  cnv = createCanvas(0, 0); 
  cnv.mousePressed(mouseClicked)
  // bouncing ball object
  for (let i = 0; i < 3; i++) {
      ball[i] = {
        
    x: random(100, 300),
    y: random(100, 300),
        
    speed: random(BALLVEL),
    speedY: random(BALLVEL),
    radius: 25,
    diameter: 50,
  // Display the ball 
  display: function(){
    col.r = 255;
    col.g = 255;
    col.b = 255;
    spot.x = random(0, width);
    spot.y = random(0, height);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    fill(col.r,col.g,col.b);
  },
  // Ball Speed 
  move: function(){
    this.x = this.x + this.speed;
    this.y = this.y + this.speedY;
  },
  // Ball Bounce
  bounce: function(){
    if(this.x + this.radius > width){
      this.speed = random(BALLVELNEG);
      this.x = elmnt.offsetWidth - 25;
  } else if(this.x - this.radius < 0){
      this.speed = random(BALLVELPOS);
      this.x = 25;
  }
  if(this.y + this.radius > height){
    this.speedY = random(BALLVELNEG);
    this.y = elmnt.offsetHeight - 25;
  } else if(this.y - this.radius < 0){
      this.speedY = random(BALLVELPOS);
        this.y = 25;
      }
    }
  }
  }
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
  // Canvas
  background(200, 200, 200);
  // Ball object
  for (let i = 0; i < ball.length; i++) {
  ball[i].bounce();
  ball[i].display();
  ball[i].move();
  }
  // Distance to ball
 dToBall();
}

/**************************************************************/
// setupCvs Function (Setup Canvas)
// Called by Start Button
// Sets canvas to DIV dimensions inorder to match user screen
// Input:  Canvas container's height and width
// Return: n/a
/**************************************************************/
function setupCvs(){
 cnv = createCanvas(elmnt.offsetWidth, elmnt.offsetHeight);
 cnv.parent('speedPC');
console.log(elmnt.offsetHeight + "/" + elmnt.offsetWidth);
  startTimer();
}

/**************************************************************/
// StartTimer Function
// Called by setupCvs
// Creates timer and starts counting down from 30, resets score and misses to 0
// Input:  n/a
// Return: Scores + Misses
/**************************************************************/
function startTimer(){
  readRec();
  // reset misses + score
  hit == true;
  miss = 0;
  score = 0;
  console.log(elmnt.offsetWidth)
  document.getElementById("currentHS").innerHTML = userDetails.score;
  document.getElementById("p_score").innerHTML = score;
  document.getElementById("p_misses").innerHTML = miss;
  document.getElementById("b_start").style.display = "none";
  // timer
  clearInterval(timerInterval);
  var second = 30;
  var minute = 0;
  var hour = 0;
  timerInterval = setInterval(function () {
  timer.classList.toggle('odd');
    timer.innerHTML =
      (hour ? hour + ":" : "") +
      (minute < 10 ? "0" + minute : minute) +
      ":" +
      (second < 10 ? "0" + second : second);
    second--;
    // when timer finishes
    if (second == -1) {
    clearInterval(timerInterval);
    gameOver()
    }
    // if timer is still going
    if(second >= -1){
  document.getElementById("p_score").innerHTML = score;
  document.getElementById("p_misses").innerHTML = miss;
    }
  }, 1000);
};

/**************************************************************/
// gameOver Function
// Called by startTimer Function
// If user highscore is greater than their currently saved score automatically writes to database, hides game canvas, stops the game.
// Input:  user score / highscore
// Return: n/a
/**************************************************************/
// Game Over Function
function gameOver(){
  // bring back start button
  document.getElementById("b_start").style.display = "block";
  // check for highscore
  if(userDetails.score <= score || userDetails.score == 'n/a'){
    writeRec();
  }
   cnv = createCanvas(0, 0);
  // update metrics
  document.getElementById("currentHS").innerHTML = userDetails.score;
  document.getElementById("p_score").innerHTML = score;
  document.getElementById("p_misses").innerHTML = miss;
}

/**************************************************************/
// dToBall Function (Distance To Ball)
// Called by Draw
// Calculates Distance to Ball
// Input: Ball length, ball.x, ball.y, mouse.X, mouse.Y
// Return: Distance to ball
/**************************************************************/
function dToBall (){
    for (i = 0; i < ball.length; i++) {
    px2ball[i] = dist(ball[i].x, ball[i].y, mouseX, mouseY);
  }
}

/**************************************************************/
// mouseClicked Function
// Called by startTimer
// Calculates user hit or miss
// Input:  Distance to ball
// Return: n/a
/**************************************************************/
function mouseClicked(){
  for (var i = 0; i < ball.length; i++) {
    if (px2ball[i] <= ballRadius) {
      ball[i].x = random(20, 380);
      ball[i].y = random(20, 380);
    }
  }
    hit = px2ball.some(function (e) {
    return e <= ballRadius;
  });
  cnv.mousePressed(hitOrMiss)
} 


/**************************************************************/
// hitOrMiss Function
// Called by mouseClicked
// Records user Hits + Misses
// Input:  n/a
// Return: Hits + Misses
/**************************************************************/
function hitOrMiss(){
    if (hit == true) {
      score += 1;
      console.log("p_score: "+ score);
  }
    else if (hit == false){
      miss += 1;
      console.log("p_miss:" + miss);
    }
}

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
  document.getElementById("b_login").style.display = "none";
  document.getElementById("lp").style.display = "none";
  document.getElementById("gp").style.display = "block";
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
  firebase.database().ref('gameLobby/' + userDetails.name + '/P1/').set({
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
