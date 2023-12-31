/*************************************************************
  gp.js
  
  Written by Nehan Hettiarachchi, Term 1 2023
  Javascript for the gamepage (gp.html)
  V1: Added saveSS (save session storage)
  V2: Added lobby button function which will hide the game select page and show the lobby page.
*************************************************************/
/**************************************************************/
// saveSS()
// Called onload by gp.html
// Takes userDetails from session storage
// Input:  userDetails from session storage
// Return: Creates object with userDetails (ss_userDetails)
/**************************************************************/
function saveSS() {
  var ss_userDetails = JSON.parse(sessionStorage.getItem("details"));
  console.log(ss_userDetails.photoURL);
  console.log(ss_userDetails.gameName);
  console.log(ss_userDetails.win);
  console.log(ss_userDetails.loss);
  fb_readRec(DETAILS, userDetails.win, userDetails);
  document.getElementById("userProfile").src = ss_userDetails.photoURL;
  var element = document.getElementById("userName");
  element.innerHTML = "Logged In As:" + " " + ss_userDetails.gameName;
  var elementWL = document.getElementById("userWinLoss");
  elementWL.innerHTML = "Win/Loss: " + ss_userDetails.win + '/' + ss_userDetails.loss;
  readAdminData();
}
/**************************************************************/
// lobbyButton()
// Called by game select button press
// Hides game selection and shows lobby selection
// Input:  n/a
// Return: n/a
/**************************************************************/
function lobbyButton() {
  document.getElementById("gp").style.display = "none";
  document.getElementById("ls").style.display = "block";
}

function fakeButton() {
  alert('This is just for show, pick Rock Paper Scissors To Play The Game!')
}

/*****************************************************/
// readAdminData
// Checks user for admin by looking for corresponding admin UID
// Called by fb_login
// Input:  n/a
// Return:  n/a
/*****************************************************/
function readAdminData() {
  var ss_userDetails = JSON.parse(sessionStorage.getItem("details"));
  var adminRef = firebase.database().ref('admin/' + ss_userDetails.name);
  adminRef.on('value', (snapshot) => {
    var data = snapshot.val();
    if (ss_userDetails.uid == data.isAdmin) {
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
function adminButtonDisplay() {
  document.getElementById("b_lpAdmin").style.display = "block";
}
