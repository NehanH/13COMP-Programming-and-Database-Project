/******************************************************/
// html_buildLobby.js
// Written by mr Bob, Term 1 2023
// Example of building html lobby
// NOTE: uses a temperate literal
/****************************************************/
MODULENAME = "html_buildLobby.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*----------------------------------------------------*/
// Example of a template literal
/*----------------------------------------------------*/
var html_simple = `This is a template 
              literal`;
console.log(html_simple);

var firstName = 'John',
    lastName  = 'Doe';

var html_greeting = `Hi ${firstName}, ${lastName}`;
console.log(html_greeting); // Hi John, Doe
console.log("-----------------------------------");

var html_sortKey = '';

/******************************************************/
// html_getData()
// Called by html GET DATA button
// Call fb_ readAll to read all firebase records in the path
// Input:  n/a
// Output: n/a
/*******************************************************/

function html_getData() {
  console.log("html_getData: ");
  
  fb_readAll(LOBBY, lobbyArray, fbR_procReadAll);
}

/******************************************************/
// html_build()
// Called by html build button
// Calls function to build html table
// Input:  n/a
// Output: n/a
/****************************************************/
function html_build() {
  console.log("html_build: ");

  html_buildTableFunc("tb_userDetails", lobbyArray);
}

/******************************************************/
// html_reset()
// Called by html reset button
// resets html table & buttons
// Input:  n/a
// Output: n/a
/****************************************************/
function html_reset() {
  console.log("html_reset: ");
  
  document.getElementById("tb_userDetails").innerHTML = '';
  lobbyArray = [];

  var html_elements = document.querySelectorAll('.b_options');
  html_elements.forEach((element) => {
    element.classList.remove('w3-disabled');
  });
  html_elements = document.querySelectorAll('.b_part2');
  html_elements.forEach((element) => {
    element.classList.add('w3-disabled');
  });
}

/******************************************************/
// html_buildTableFunc(_tableBodyID, _array)
// Called by html_build()
// Build html table rows from an array of objects
// Input:  html id of table body, array of objects
//  EG  [{name:   'bobby',
//        wins:    4,
//        draws:   1,
//        losses:  0,
//        UID:     zE45Thkj9#se4ThkP},
//       {name:   'car man',
//        wins:    9,
//        draws:   0,
//        losses:  0,
//        UID:     g7K456hledrj#gkij}]
// Output: n/a
/****************************************************/
function html_buildTableFunc(_tableBodyID, _array){
  console.log("html_buildTableFunc: ");
  console.table(_array);

  // Get all the info on the table
  var html_table = document.getElementById(_tableBodyID);
  
  // Loop thu array; build row & add it to table
  for (i = 0; i < _array.length; i++) {
    // Back ticks define a temperate literal
    var row = `<tr>  
                <td>${_array[i].name}</td>
                <td class="w3-center">${_array[i].wins}</td>
                <td class="w3-center">${_array[i].draws}</td>
                <td class="w3-center">${_array[i].losses}</td>
                <td>${_array[i].UID}</td>
                <td><button class="b_join">Join</button></td>
              </tr>`
    html_table.innerHTML += row;
  }
  
  /*--------------------------------------------------*/
  // jQuery ready()
  // Only runs when jQuery determines page is "ready"
  // Adds to all rows inside tb_userDetails an onclick
  //  function to get the current row's UID entry.
  /*--------------------------------------------------*/
  $(document).ready(function(){
      // code to read selected table row cell data (values).
      $("#tb_userDetails").on('click','.b_join',function(){
           // get the current row
           var currentRow=$(this).closest("tr"); 
           // get current row's 1st TD value
           var col4 = currentRow.find("td:eq(4)").text();
           console.log("html_buildTableFunc: uid = " + col4);
      });
  });
}

/******************************************************/
// END OF CODE
/******************************************************/