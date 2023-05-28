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
    win: '',
    p1Rematch: '',
    p2Rematch: ''
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
      p2NameSS();
      document.getElementById("waitingForUser").style.display = 'none';
      p1NameDisplay();
    }
  });
  RPSgame();
}

function p2NameSS() {
  const currentGame = sessionStorage.getItem('currentGame')
  var p2NameRef = firebase.database().ref('userLobbies/RPS/active/' + currentGame + '/p2Name');
  p2NameRef.on('value', (snapshot) => {
    const data = snapshot.val();
    sessionStorage.setItem('p2Name', data);
  });
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
  p2NameDisplay();
}

/**************************************************************/
// RPSGAME()
// Called by waitingScreen() And joinGame()
// Decides which player is player 1 and 2 and hides and shows appropriate game choices.
// Input:  n/a
// Return: n/a
/**************************************************************/
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

/**************************************************************/
// p1NameDisplay()
// Called by waitingScreen()
// Displays p1 and p2 names for player 1 side.
// Input:  n/a
// Return: n/a
/**************************************************************/
function p1NameDisplay() {
  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const lobbyKey = sessionStorage.getItem('currentGame');
  var p2NameRef = firebase.database().ref('userLobbies/RPS/unActive/' + lobbyKey + '/p2Name');
  p2NameRef.once('value', (snapshot) => {
    const data = snapshot.val();
    console.log(data)
    document.getElementById("player2").innerHTML = data;
  });
  document.getElementById("player1").innerHTML = userDetails.gameName;

}
/**************************************************************/
// p2NameDisplay()
// Called by joinGame()
// Displays p1 and p2 names for player 2 side.
// Input:  n/a
// Return: n/a
/**************************************************************/
function p2NameDisplay() {
  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const lobbyKey = sessionStorage.getItem('currentGame');
  var p1NameRef = firebase.database().ref('userLobbies/RPS/unActive/' + lobbyKey + '/p1Name');
  p1NameRef.once('value', (snapshot) => {
    const data = snapshot.val();
    document.getElementById("player1").innerHTML = data;
  });
  document.getElementById("player2").innerHTML = userDetails.gameName;
}

function p1ChoiceRock() {
  const lobbyKey = sessionStorage.getItem('currentGame');
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p1Pick: "Rock",
  })
  document.getElementById("choices1").style.display = "None";
  alert('player1 picks rock')
  checkPlayerMoves()
}

function p1ChoicePaper() {
  const lobbyKey = sessionStorage.getItem('currentGame');
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p1Pick: "Paper",
  })
  document.getElementById("choices1").style.display = "None";
  alert('player1 picks paper')
  checkPlayerMoves()
}

function p1ChoiceScissors() {
  const lobbyKey = sessionStorage.getItem('currentGame');
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p1Pick: "Scissors",
  })
  document.getElementById("choices1").style.display = "None";
  alert('player1 picks scissors')
  checkPlayerMoves()
}

function p2ChoiceRock() {
  const lobbyKey = sessionStorage.getItem('currentGame');
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p2Pick: "Rock",
  })
  document.getElementById("choices2").style.display = "None";
  alert('player2 picks rock')
  checkPlayerMoves()
}

function p2ChoicePaper() {
  const lobbyKey = sessionStorage.getItem('currentGame');
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p2Pick: "Paper",
  })
  document.getElementById("choices2").style.display = "None";
  alert('player2 picks paper')
  checkPlayerMoves()
}

function p2ChoiceScissors() {
  const lobbyKey = sessionStorage.getItem('currentGame');
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p2Pick: "Scissors",
  })
  document.getElementById("choices2").style.display = "None";
  alert('player2 picks scissors')
  checkPlayerMoves()
}

function checkPlayerMoves() {
  const lobbyKey = sessionStorage.getItem('currentGame');
  const lobbyRef = firebase.database().ref('userLobbies/RPS/active/' + lobbyKey)

  lobbyRef.on('value', snapshot => {
    const lobbyData = snapshot.val();
    if (lobbyData) {
      const p1Pick = lobbyData.p1Pick;
      const p2Pick = lobbyData.p2Pick;

      if (p1Pick && p2Pick) {
        const message = 'Player 1 picks ' + p1Pick + ' Player 2 picks ' + p2Pick;
        alert(message);
        winnerCalc(p1Pick, p2Pick)
      }
    }
  })
}

function winnerCalc(player1, player2) {
  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const playerNum = sessionStorage.getItem('playerNumber');

  if (player1 === 'Rock' && player2 === 'Paper') {
    alert('p2 WIN')
    if (playerNum == 'player2') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
          alert('Wins updated successfully!')
        })
      })
    }
    if (playerNum == 'player1') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
          alert('Losses updated successfully!')
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Paper' && player2 === 'Rock') {
    alert('p1 WIN')
    if (playerNum == 'player1') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
          alert('Wins updated successfully!')
        })
      })
    }
    if (playerNum == 'player2') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
          alert('Losses updated successfully!')
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Rock' && player2 === 'Scissors') {
    alert('p1 WIN')
    if (playerNum == 'player1') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
          alert('Wins updated successfully!')
        })
      })
    }
    if (playerNum == 'player2') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
          alert('Losses updated successfully!')
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Scissors' && player2 === 'Rock') {
    alert('p2 WIN')
    if (playerNum == 'player2') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
          alert('Wins updated successfully!')
        })
      })
    }
    if (playerNum == 'player1') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
          alert('Losses updated successfully!')
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Paper' && player2 === 'Scissors') {
    alert('p2 WIN')
    if (playerNum == 'player2') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
          alert('Wins updated successfully!')
        })
      })
    }
    if (playerNum == 'player1') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
          alert('Losses updated successfully!')
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Scissors' && player2 === 'Paper') {
    alert('p1 WIN')
    if (playerNum == 'player1') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
          alert('Wins updated successfully!')
        })
      })
    }
    if (playerNum == 'player2') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
          alert('Losses updated successfully!')
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === player2) {
    alert('TIE')
    showGameEndBtn()
  }
}

function showGameEndBtn() {
  document.getElementById("rematchBtn").style.display = "block";
  document.getElementById("homeBtn").style.display = "block";
}

function gameRematch(){
  clearMoves()
  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const playerNum = sessionStorage.getItem('playerNumber');
  const lobbyKey = sessionStorage.getItem('currentGame');
  if(playerNum == 'player1') {
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p1Rematch: "Yes",
  })
  } else if (playerNum == 'player2'){
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p2Rematch: "Yes",
  })
  }
  
  const lobbyRef = firebase.database().ref('userLobbies/RPS/active/' + lobbyKey)
  lobbyRef.on('value', snapshot => {
    const lobbyData = snapshot.val();
    if (lobbyData) {
      const p1Pick = lobbyData.p1Rematch;
      const p2Pick = lobbyData.p2Rematch;

      if (p1Pick && p2Pick) {
        const message = 'both players want a rematch'
        alert(message);
        runRematch();
      }
    }
  })
}

function clearMoves(){
  const playerNum = sessionStorage.getItem('playerNumber');
  const lobbyKey = sessionStorage.getItem('currentGame');
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p1Pick: '',
    p2Pick: '',
  })
  }

function runRematch(){
  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const playerNum = sessionStorage.getItem('playerNumber');
  const lobbyKey = sessionStorage.getItem('currentGame');
  if(playerNum == 'player1') {
  document.getElementById("choices1").style.display = "block";
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p1Rematch: '',
  })
  } else if (playerNum == 'player2'){
    document.getElementById("choices2").style.display = "block";
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p2Rematch: '',
  })
  }
  document.getElementById("rematchBtn").style.display = "none";
  document.getElementById("homeBtn").style.display = "none";
}