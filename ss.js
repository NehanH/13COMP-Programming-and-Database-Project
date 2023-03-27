function ss_store(_key, _value){
  sessionStorage.setItem(_key,  JSON.stringify(_value));
}

ss_store("details", DETAILS);
var ss_userDetails = JSON.parse(sessionStorage.getItem(details));
