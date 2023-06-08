/**************************************************************/
// START OF PROGRAM
/**************************************************************/

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
    p2Rematch: '',
    p1Disconnect: '',
    p2Disconnect: ''
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
      sessionStorage.setItem('Game', 'true');
      runDisconnect();
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
  sessionStorage.setItem('Game', 'true');
  RPSgame();
  p2NameDisplay();
  runDisconnect();
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
/**************************************************************/
// Choice Functions
// Called by Clicked a move
// P1's and P2's Moves
// Input:  n/a
// Return: n/a
/**************************************************************/
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
/**************************************************************/
// checkPlayerMoves()
// Called by player move functions
// checks if both players have made a move and if they have calculates winner
// Input:  n/a
// Return: n/a
/**************************************************************/
function checkPlayerMoves() {
  const lobbyKey = sessionStorage.getItem('currentGame');
  const lobbyRef = firebase.database().ref('userLobbies/RPS/active/' + lobbyKey)

  lobbyRef.on('value', snapshot => {
    const lobbyData = snapshot.val();
    if (lobbyData) {
      const p1Pick = lobbyData.p1Pick;
      const p2Pick = lobbyData.p2Pick;

      if (p1Pick && p2Pick) {
        winnerCalc(p1Pick, p2Pick)
      }
    }
  })
}
/**************************************************************/
// winnerCalc()
// Called by checkPlayerMoves()
// Calculates the winner / tie
// Input:  n/a
// Return: n/a
/**************************************************************/
function winnerCalc(player1, player2) {
  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const playerNum = sessionStorage.getItem('playerNumber');
  const winnerParagraph = document.getElementById('winnerParagraph');

  if (player1 === 'Rock' && player2 === 'Paper') {
    winnerParagraph.textContent = 'Player 2 Wins!'
    if (playerNum == 'player2') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
        })
      })
    }
    if (playerNum == 'player1') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Paper' && player2 === 'Rock') {
     winnerParagraph.textContent = 'Player 1 Wins!'
    if (playerNum == 'player1') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
        })
      })
    }
    if (playerNum == 'player2') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Rock' && player2 === 'Scissors') {
    winnerParagraph.textContent = 'Player 1 Wins!'
    if (playerNum == 'player1') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
        })
      })
    }
    if (playerNum == 'player2') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Scissors' && player2 === 'Rock') {
    winnerParagraph.textContent = 'Player 2 Wins!'
    if (playerNum == 'player2') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
        })
      })
    }
    if (playerNum == 'player1') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Paper' && player2 === 'Scissors') {
     winnerParagraph.textContent = 'Player 2 Wins!'
    if (playerNum == 'player2') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
        })
      })
    }
    if (playerNum == 'player1') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === 'Scissors' && player2 === 'Paper') {
     winnerParagraph.textContent = 'Player 1 Wins!'
    if (playerNum == 'player1') {
      const userWinsRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'win');
      userWinsRef.once('value', (snapshot) => {
        const currentWins = snapshot.val();
        const newWins = currentWins + 1;

        userWinsRef.set(newWins).then(() => {
        })
      })
    }
    if (playerNum == 'player2') {
      const userLossRef = firebase.database().ref('userDetails/' + userDetails.uid + '/' + 'loss');
      userLossRef.once('value', (snapshot) => {
        const currentLosses = snapshot.val();
        const newLosses = currentLosses + 1;

        userLossRef.set(newLosses).then(() => {
        })
      })
    }
    showGameEndBtn()
  } else if (player1 === player2) {
     winnerParagraph.textContent = 'Draw!'
    showGameEndBtn()
  }
}
/**************************************************************/
// showGameEndBtn()
// Called by winnerCalc()
// Shows rematch and home buttons
// Input:  n/a
// Return: n/a
/**************************************************************/
function showGameEndBtn() {
  document.getElementById("rematchBtn").style.display = "block";
  document.getElementById("homeBtn").style.display = "block";
}
/**************************************************************/
// gameRematch()
// Called by rematch button
// resets game board
// Input:  n/a
// Return: n/a
/**************************************************************/
function gameRematch() {
  clearMoves()
  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const playerNum = sessionStorage.getItem('playerNumber');
  const lobbyKey = sessionStorage.getItem('currentGame');
  if (playerNum == 'player1') {
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
      p1Rematch: "Yes",
    })
    document.getElementById("rematchBtn").style.display = "none";
  } else if (playerNum == 'player2') {
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
      p2Rematch: "Yes",
    })
    document.getElementById("rematchBtn").style.display = "none";
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
/**************************************************************/
// clearMoves()
// Called by gameRematch() and gameHomeBtn()
// Clears database entries for player moves
// Input:  n/a
// Return: n/a
/**************************************************************/
function clearMoves() {
  const playerNum = sessionStorage.getItem('playerNumber');
  const lobbyKey = sessionStorage.getItem('currentGame');
  firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
    p1Pick: '',
    p2Pick: '',
  })
}
/**************************************************************/
// runRematch()
// Called by gameRematch()
// Updates database with rematch entry
// Input:  n/a
// Return: n/a
/**************************************************************/
function runRematch() {
  const userDetails = JSON.parse(sessionStorage.getItem("details"));
  const playerNum = sessionStorage.getItem('playerNumber');
  const lobbyKey = sessionStorage.getItem('currentGame');
  const winnerParagraph = document.getElementById('winnerParagraph');

  if (playerNum == 'player1') {
    document.getElementById("choices1").style.display = "block";
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
      p1Rematch: '',
    })
  } else if (playerNum == 'player2') {
    document.getElementById("choices2").style.display = "block";
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
      p2Rematch: '',
    })
  }
  document.getElementById("rematchBtn").style.display = "none";
  document.getElementById("homeBtn").style.display = "none";
  winnerParagraph.textContent = ''
}
/**************************************************************/
// runDisconnect()
// Called by joinGame() and waitingScreen()
// checks for player disconnect
// Input:  n/a
// Return: n/a
/**************************************************************/
function runDisconnect() {
  const playerNum = sessionStorage.getItem('playerNumber');
  const lobbyKey = sessionStorage.getItem('currentGame');
  const lobbyRef = firebase.database().ref('userLobbies/RPS/active/' + lobbyKey)


  if (playerNum == 'player1') {
    lobbyRef.onDisconnect().update({
      p1Disconnect: 'true',
    })
  } else if (playerNum == 'player2') {
    lobbyRef.onDisconnect().update({
      p2Disconnect: 'true',
    })
  }

  if (playerNum == 'player1') {
    const p2DCRef = firebase.database().ref('userLobbies/RPS/active/' + lobbyKey + '/' + 'p2Disconnect')
    p2DCRef.on('value', snapshot => {
      const lobbyData = snapshot.val();
      if (lobbyData) {
        alert('p2 has disconnected returning to lobby select')
        document.getElementById("RPS").style.display = "none";
        document.getElementById("homeBtn").style.display = "none";
        document.getElementById("rematchBtn").style.display = "none";
        document.getElementById("ls").style.display = "block";
        lobbyRef.remove();
        lobbyRef.onDisconnect().cancel();
      }
    })
  } else if (playerNum == 'player2') {
    const p1DCRef = firebase.database().ref('userLobbies/RPS/active/' + lobbyKey + '/' + 'p1Disconnect')
    p1DCRef.on('value', snapshot => {
      const lobbyData = snapshot.val();
      if (lobbyData) {
        alert('p1 has disconnected returning to lobby select')
        document.getElementById("RPS").style.display = "none";
        document.getElementById("homeBtn").style.display = "none";
        document.getElementById("rematchBtn").style.display = "none";
        document.getElementById("ls").style.display = "block";
        lobbyRef.remove();
        lobbyRef.onDisconnect().cancel();
      }
    })
  }
}
/**************************************************************/
// gameHomeBtn()
// Called by home button
// handles player going back to lobby screen
// Input:  n/a
// Return: n/a
/**************************************************************/
function gameHomeBtn() {
  clearMoves()
  const playerNum = sessionStorage.getItem('playerNumber');
  const lobbyKey = sessionStorage.getItem('currentGame');
  document.getElementById("RPS").style.display = "none";
  document.getElementById("ls").style.display = "block";
  document.getElementById("homeBtn").style.display = "none";
  document.getElementById("rematchBtn").style.display = "none";
  if (playerNum == 'player1') {
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
      p1Disconnect: "Yes",
    })
    document.getElementById("rematchBtn").style.display = "none";
  } else if (playerNum == 'player2') {
    firebase.database().ref('userLobbies/RPS/active/' + lobbyKey).update({
      p2Disconnect: "Yes",
    })
  }
}
/**************************************************************/
// leaderboard()
// Called by keaderboard button
// displays leaderboard
// Input:  n/a
// Return: n/a
/**************************************************************/
function leaderboard() {
  document.getElementById("ls").style.display = "none";
  document.getElementById("lb").style.display = "block";
}
/**************************************************************/
// backToRps()
// Called by Back To Lobby button
// hides leaderboard displays lobby
// Input:  n/a
// Return: n/a
/**************************************************************/
function backToRps() {
  document.getElementById("lb").style.display = "none";
  document.getElementById("ls").style.display = "block";
}
/**************************************************************/
// refreshLeaderboard()
// Called by refresh leaderboard button
// gets all info for table and updates table with top 5 players with most wins.
// Input:  n/a
// Return: n/a
/**************************************************************/
function refreshLeaderboard() {
  const leaderboardTable = document.getElementById("leaderboard");
  leaderboardTable.innerHTML = "";

  const labelsRow = document.createElement('tr');
  const rankLabel = document.createElement('th');
  const gameNameLabel = document.createElement('th');
  const winLabel = document.createElement('th');

  rankLabel.textContent = "Rank";
  gameNameLabel.textContent = "Game Name";
  winLabel.textContent = "Wins";

  labelsRow.appendChild(rankLabel);
  labelsRow.appendChild(gameNameLabel);
  labelsRow.appendChild(winLabel);

  leaderboardTable.appendChild(labelsRow)
  firebase.database().ref("userDetails").orderByChild("win").limitToLast(5).once('value', (snapshot) => {
    const users = [];
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      users.push(user);
    });

    users.reverse().forEach((user, index) => {
      const row = document.createElement('tr');
      const rankCell = document.createElement('td');
      const gameNameCell = document.createElement('td');
      const winCell = document.createElement('td');

      rankCell.textContent = index + 1;
      gameNameCell.textContent = user.gameName;
      winCell.textContent = user.win;

      row.appendChild(rankCell);
      row.appendChild(gameNameCell);
      row.appendChild(winCell);

      leaderboardTable.appendChild(row);
    });
  });
}
/**************************************************************/
// END OF PROGRAM
/**************************************************************/