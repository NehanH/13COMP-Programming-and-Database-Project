
function saveSS(){
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
  elementWL.innerHTML = ss_userDetails.win + '/' + ss_userDetails.loss;
}

function lobbyButton(){
  document.getElementById("gp").style.display = "none";
  document.getElementById("s_table").style.display = "block";
}

function fakeButton(){
  alert('This is just for show, pick Rock Paper Scissors To Play The Game!')
}