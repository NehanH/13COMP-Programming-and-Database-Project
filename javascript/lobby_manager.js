// Array list of unactive lobbies
const unactiveLobbies = [];

/**************************************************************/
// createLobby()
// Called by create button
// Creates a lobby in the userLobbies database
// Input:  n/a
// Return: n/a
/**************************************************************/
function createLobby() {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    return;
  }

  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const lobbyRef = firebase.database().ref('userLobbies/RPS/unActive').push({
    p1UID: currentUser.uid,
    p2UID: '',
    p1Name: userDetails.gameName,
    p2Name: '',
    p1Pick: '',
    p2Pick: '',
    win: ''
  });

  // Display the waiting user screen
  document.getElementById("ls").style.display = "none";
  document.getElementById("RPS").style.display = "block";
  document.getElementById("waitingForUser").style.display = "block";
  sessionStorage.setItem('currentGame', lobbyRef.key);
  sessionStorage.setItem('playerNumber', 'player1');

  waitingScreen();
}

/**************************************************************/
// waitingScreen()
// Called by createLobby
// checks with read on if player 2 has joined lobby, if yes, remove waiting modal. 
// Input:  n/a
// Return: n/a
/**************************************************************/
function waitingScreen() {
  const currentGame = sessionStorage.getItem('currentGame')
  console.log()
  const gameRef = firebase.database().ref('userLobbies/RPS/unActive/' + currentGame + '/p2UID');

  gameRef.on('value', (snapshot) => {
    const p2UID = snapshot.val();
    if (p2UID) {
      document.getElementById("waitingForUser").style.display = 'none';
    }
  });
  RPSgame();
}
/**************************************************************/
// refreshLobby()
// Called by refresh button
// reads all unactive lobbies and puts them into table
// Input:  n/a
// Return: n/a
/**************************************************************/
function refreshLobby() {
  const tableBody = document.getElementById("RPS_tableBody");
  tableBody.innerHTML = "";

  firebase.database().ref("userLobbies/RPS/unActive").once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const lobby = childSnapshot.val();
      if (!lobby || !lobby.p1Name) {
        return;
      }

      const lobbyKey = childSnapshot.key;
      const gameName = `${lobby.p1Name}'s game`;
      const numPlayers = lobby.p2Name ? '2/2' : '1/2';
      const joinButton = createJoinButton(lobby.p1UID, lobbyKey);

      // Add the lobby info and join button to the table
      const row = tableBody.insertRow(-1);
      const nameCell = row.insertCell(0);
      const playersCell = row.insertCell(1);
      const joinCell = row.insertCell(2);
      nameCell.textContent = gameName;
      playersCell.textContent = numPlayers;
      joinCell.appendChild(joinButton);

      // Add the lobby to the list of unactive lobbies
      unactiveLobbies.push({
        key: lobbyKey,
        p1UID: lobby.p1UID,
        p1Name: lobby.p1Name,
        p2UID: lobby.p2UID,
        p2Name: lobby.p2Name
      });
    });
  });
}

/**************************************************************/
// createJoinButton(p1UID, LobbyKey)
// Called by refreshLobby
// creates join button
// Input:  n/a
// Return: n/a
/**************************************************************/
function createJoinButton(p1UID, lobbyKey) {
  const joinButton = document.createElement('button');
  joinButton.type = 'button';
  joinButton.textContent = 'Join';
  joinButton.addEventListener('click', () => joinGame(p1UID, lobbyKey));
  return joinButton;
}

/**************************************************************/
// joinGame(_joinID)
// Called by join button
// removes unactive lobby and makes active lobby with p1 and p2 info, ready to play game.
// Input:  n/a
// Return: n/a
/**************************************************************/
function joinGame(p1UID, lobbyKey) {
  var ss_userDetails = JSON.parse(sessionStorage.getItem("details"));
  var player2Name = ss_userDetails.gameName;
  var player2UID = ss_userDetails.uid;

  document.getElementById("ls").style.display = "none";
  document.getElementById("RPS").style.display = "block";
  sessionStorage.setItem('currentGame', lobbyKey);
  console.log(ss_userDetails.gameName);
  console.log(ss_userDetails.uid);
  firebase.database().ref('userLobbies/RPS/unActive/' + lobbyKey).update({
    p2Name: player2Name,
    p2UID: player2UID,
  })
  firebase.database().ref('userLobbies/RPS/unActive/' + lobbyKey).once('value', function(snapshot) {
    var currentGame = snapshot.val();
    firebase.database().ref('userLobbies/RPS/active/').update({
      [lobbyKey]: currentGame
    });
    firebase.database().ref('userLobbies/RPS/unActive/' + lobbyKey).remove();
  });
  sessionStorage.setItem('playerNumber', 'player2');
  RPSgame();
}

function RPSgame() {
  const userNumber = sessionStorage.getItem('playerNumber');
      if (userNumber == 'player1') {
      document.getElementById("choices1").style.display = "block";
      document.getElementById("choices2").style.display = "none";
      document.getElementById("fake-choices2").style.display = "block";
    } else if (userNumber == 'player2') {
      document.getElementById("choices1").style.display = "none";
      document.getElementById("choices2").style.display = "block";
      document.getElementById("fake-choices1").style.display = "block";
    }
}