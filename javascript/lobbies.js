/*************************************************************
  lobbies.js
  
  Written by Nehan Hettiarachchi, Term 1 2023
  Javascript for multiplayer lobbies.
  V1: Add createLobby() Function
*************************************************************/

function createLobby(){
  var ss_userDetails = JSON.parse(sessionStorage.getItem("details"));
  firebase.database().ref('userLobbies/' + 'RPS/' + 'unActive/' + firebase.auth().currentUser.uid).set({
    p1UID: firebase.auth().currentUser.uid,
    p2UID: '',
    p1Name: ss_userDetails.gameName,
    p2Name: '',
    win: ''
  });
  sessionStorage.setItem('gameStart', false);
  sessionStorage.setItem('currentGame', firebase.auth().currentUser.uid);
  document.getElementById("ls").style.display = "none";
  document.getElementById("RPS").style.display = "block";
     
  if (sessionStorage.getItem('gameStart') == 'false') {
        document.getElementById("waitingForUser").style.display = 'block'
    }
    console.log()
    waitingScreen();
}

