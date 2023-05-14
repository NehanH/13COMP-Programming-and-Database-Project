/*************************************************************
  lobbies.js
  
  Written by Nehan Hettiarachchi, Term 2 2023
  Javascript for multiplayer lobbies.
  V1: Add createLobby() Function
  V2: Add refreshLobby() Function
  V3: Add fillLobbies() Function
*************************************************************/

// Unactive lobbies object
var gameList = [];
var gameListCount;

/**************************************************************/
// createLobby()
// Called by create button
// Creates a new entry under userLobbies/
// Input:  gameName, UID
// Return: n/a
/**************************************************************/
function createLobby(){
  var ss_userDetails = JSON.parse(sessionStorage.getItem("details"));
  firebase.database().ref('userLobbies/' + 'RPS/' + 'unActive/' + firebase.auth().currentUser.uid).set({
    p1UID: firebase.auth().currentUser.uid,
    p2UID: '',
    p1Name: ss_userDetails.gameName,
    p2Name: '',
    p1Pick: '',
    p2Pick: '',
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

/**************************************************************/
// refreshLobby()
// Called by refresh button
// Updates lobby table with newly made lobbies
// Input:  n/a
// Return: n/a
/**************************************************************/
function refreshLobby() {
  document.getElementById("RPS_tableBody").innerHTML = "";
  firebase.database().ref('userLobbies/' + 'RPS/' + 'unActive/').once('value',
    function(AllRecords) {
      AllRecords.forEach(
        function(currentRecord) {
          console.log("Current Record:")
          console.log(currentRecord)
          var refGameUID = currentRecord.val();
          var gameName;
          if (refGameUID.p1Name == null) {
            return
            } else {
              gameName = refGameUID.p1Name + "'s game";
            }
          var p1UID = refGameUID.p1UID;
          var p1Name = refGameUID.p1Name;
          var p2UID = refGameUID.p2UID;
          var p2Name = refGameUID.p2Name;
          var gameStatus = refGameUID.gameStart;
          fillLobbies(gameName, p1UID, p1Name, p2UID, p2Name, gameStatus);
      },
    );
  });
}
/**************************************************************/
// fillLobbies()
// Called by refreshLobby()
// Update HTML table with info + create join button
// Input:  n/a
// Return: n/a
/**************************************************************/
function fillLobbies(gameName, p1UID, p1Name, p2UID, p2Name, gameStatus) {
    var tbody = document.getElementById('RPS_tableBody');
    var trow = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var join = document.createElement('button')

    console.log("gameName:")
    console.log(gameName)

    td0.innerHTML = gameName;
    td1.innerHTML = '1/2';
    if (gameName == null) {
        return
    }
    else {
        join.type = 'button'
        join.innerHTML = 'Join'
        join.value = p1UID;
        join.setAttribute("onclick", `joinGame("${p1UID}")`)
    }
    gameList.push([gameName, p1UID, p1Name, p2UID, p2Name, gameStatus]);
    td2.appendChild(join);
    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);
    tbody.appendChild(trow);
};