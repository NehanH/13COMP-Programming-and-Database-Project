function fb_initialise() {
  var firebaseConfig = {
  apiKey: "AIzaSyCs10NnQ4BIdtlDxmGMoLJgZ-OkNIu6VFM",
  authDomain: "comp-nehan-hettiarachchi.firebaseapp.com",
  databaseURL: "https://comp-nehan-hettiarachchi-default-rtdb.firebaseio.com",
  projectId: "comp-nehan-hettiarachchi",
  storageBucket: "comp-nehan-hettiarachchi.appspot.com",
  messagingSenderId: "72222490884",
  appId: "1:72222490884:web:2446be6e4af2a954fa5051",
  measurementId: "G-8MEZ1VQRTY"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);	
		
  database = firebase.database();
}
/**************************************************************/
// fb_login(_dataRec)
// Called by setup
// Login to Firebase
// Input:  object to save login data to
// Return: n/a
/**************************************************************/
function fb_login(_dataRec) {
  console.log('fb_login: ');
  firebase.auth().onAuthStateChanged(newLogin);

  function newLogin(user) {
    if (user) {
      // user is signed in, so save Google login details
      _dataRec.uid      = user.uid;
      _dataRec.email    = user.email;
      _dataRec.name     = user.displayName;
      _dataRec.photoURL = user.photoURL;
      _dataRec.gameName = user.gameName;
      _dataRec.phone    = user.phone;
      loginStatus = 'logged in';
      console.log('fb_login: status = ' + loginStatus);
    } 
    else {
      // user NOT logged in, so redirect to Google login
      loginStatus = 'logged out';
      console.log('fb_login: status = ' + loginStatus);

      var provider = new firebase.auth.GoogleAuthProvider();
      //firebase.auth().signInWithRedirect(provider); // Another method
      firebase.auth().signInWithPopup(provider).then(function(result) {
        _dataRec.uid      = user.uid;
        _dataRec.email    = user.email;
        _dataRec.name     = user.displayName;
        _dataRec.photoURL = user.photoURL;
        _dataRec.gameName = user.gameName;
        _dataRec.phone    = user.phone;
        loginStatus = 'logged in via popup';
        console.log('fb_login: status via popup= ' + loginStatus);
      })
      // Catch errors
      .catch(function(error) {
        if(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          loginStatus = 'error: ' + error.code;
          console.log('fb_login: error code = ' + errorCode + 
                      '    ' + errorMessage);
        }
      });
    }
  }
}
/*****************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/*****************************************************/
function fb_writeRec(_path, _key, _data) { 
      console.log('fb_WriteRec: path= ' + _path + '  key= ' + _key +
                 '  data= ' + _data.name + '/' + _data.gameName);
    firebase.database().ref(_path + '/' + _key).set(_data,
      function(error){
        if (error) {
     writeStatus = 'failed'
      } else {
      writeStatus = 'ok'
      }
    }
  );
}

function fb_processAll(_data, dbData, dbKeys) {
  dbData = dbData.val();
  for(i=0; i < dbKeys.length; i++) {
    let key = dbKeys[i];
    _data.push({
      username: dbData[key].username,
      score: dbData[key].score
    });
  }
}
/*****************************************************/
// fb_readAll(_path, _data)
// Read all DB records for the path
// Input:  path to read from and where to save it
// Return:
/*****************************************************/
function fb_readAll(_path, _data, _processAll) {
  console.log('fb_readAll: path= ' + _path);

    readStatus = 'waiting'
  firebase.database().ref(_path).once("value", gotRecord, readErr);

  function gotRecord(snapshot){
    if(snapshot.val() == null){
      readStatus = 'no record'
    } else {
      readStatus = 'ok'
      let dbData        = snapshot.val();
      console.log(dbData);
      let dbKeys = Object.keys(dbData);
    _processAll(_data, snapshot, dbKeys)

    }
  };
  function readErr (error){
    readStatus = 'failed'
     _processAll(_data, snapshot, dbKeys)
  }
  
}

/*****************************************************/
// fb_readRec(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/*****************************************************/
function fb_readRec(_path, _key, _data) {	
    console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

  readStatus = 'waiting'
  firebase.database().ref(_path + '/' + _key).once("value", gotRecord, readErr);

  function gotRecord(snapshot){
    if(snapshot.val() == null){
      readStatus = 'no record'
    } else {
      readSuccess = 'yes'
      console.log(readStatus);
      var dbData        = snapshot.val();
      _data.uid         = dbData.uid;
      _data.name        = dbData.name;
      _data.email       = dbData.email;
      _data.photoURL    = dbData.photoURL;
      _data.score       = dbData.score;
      _data.gameName    = dbData.gameName;
      _data.phone       = dbData.phone;
      console.log(dbData.gameName)
      
    }
  };

  function readErr (error){
    readStatus = 'failed'
  }
  
}

/*****************************************************/
//    END OF MODULE
/*****************************************************/

