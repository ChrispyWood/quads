let players = []; // an array to hold player objects
let smallSwissPlayers = []; // names of the small swiss players
let smallSwissPlayersCount = 0; // index of smallSwissPlayers[]

// if array is in local storage, get it and display
if (localStorage.getItem('players') === null) players = [];
else {
  players = JSON.parse(localStorage.getItem('players'));
  makeNewList();
}


/* * * * * * * * * * * * * * * * *
 * Event Listeners
 * * * * * * * * * * * * * * * * */

// Add a player
document.querySelector('#add-player').addEventListener('submit',
function(e){
  first = document.getElementById("form-first").value;
  last = document.getElementById("form-last").value;
  rating = document.getElementById("form-rating").value;
  id = document.getElementById("form-id").value;

  // if id is empty, we will count the players and make a value
  if (id==0) {
    let newId=100+players.length;
    id = newId.toString();
  }

  let player = {'first':first,'last':last,'id':id,'rating': rating}
  players.push(player);

  //put in local storage
  localStorage.setItem('players', JSON.stringify(players));
  makeNewList();
  document.getElementById('add-player').reset();
  document.getElementById('form-first').focus();
  e.preventDefault();
});
// End of Add a Player

// Search USCF for a player
document.querySelector('#search-player-btn').addEventListener('click',
function(e){
  let url = "";
  id = document.getElementById("form-id").value;

  // at least a last name
  if (id.length < 1 && last.length < 1) {
    alert('You will need to provide a USCF ID.');
  } else {
      url = "https://uschess.org/msa/thin3.php?" + id;      
  }
  document.getElementById('uscf-frame').src = url;
});
// End of Search USCF for a player

// Remove a player or all players
document.querySelector('#remove-player-btn').addEventListener('click',
function(e){

  // Get the ID to remove
  idToRemove = document.getElementById('form-delete-id').value;

  // This traps some wierd behavior in chrome
  if (idToRemove.length > 0) {
    
    if (document.getElementById('form-delete-id').value=="DELETE ALL") {

      // Delete all of the players
      players = [];
    }

    // Loop through the array
    for (let i = 0; i < players.length; i++) {
      thisID = players[i].id;
      if (thisID===idToRemove) {

        // Delete this player
        players.splice(i,1);
      }
    }

    // Clear the Delete Player Box
    document.getElementById('form-delete-id').value = "";

    //put in local storage
    localStorage.setItem('players', JSON.stringify(players));
    makeNewList();

  }


});
// End of remove a player or all players


/* * * * * * * * * * * * * * * * * *
 * makeNewList()
 * Make a new player list
 * * * * * * * * * * * * * * * * * */
function makeNewList() {

  smallSwissPlayers = []; // Clear the smallSwissPlayers array, so old players are no longer in the small swiss
  smallSwissPlayersCount = 0; // Reset variable for index of smallSwissPlayers[]
  document.getElementById('pairing-table').classList.remove('active'); // Remove the class, if it was added on the last makeNewList
  document.getElementById('pairing-cards').classList.remove('active'); // Remove the class, if it was added on the last makeNewList


  // loop through players and change rating to a number
  for (let i = 0; i < players.length; i++) {

    // if NaN, make zero, else transform to number
    if (isNaN(players[i].rating)) {
      players[i].rating = 0;
    } else {
      ratingAsNumber = Number(players[i].rating);
      players[i].rating = ratingAsNumber;
    }
  } 

  // Sort players by rating
  players.sort((a, b) => { return b.rating - a.rating;});

  // The player list and printable quad tables
  const quadList = document.querySelector('#quad-list');
  const quadTables = document.querySelector('#printable-quads');
  quadList.innerHTML = ""; // Clear the current player list
  quadTables.innerHTML = ""; // Clear the printable tables
  let smallSwissTitle = false; // To check if small swiss is titled
  let quadplayer = 0; // quadplayer is to see if it is time to make a title
  let playersLeft = 0; // Players left to be grouped
  let numOfQuads = 0; // Number of the quad

  // Loop through array creating the Quads
  for (let i = 0; i < players.length; i++) {
    playersLeft = players.length - i;
    quadplayer = (i % 4);

    // Make a title if this is a new quad or small swiss
    if (quadplayer === 0) {
      if (playersLeft > 7 || playersLeft == 4) {

        // if more than 7 or exactly 4 are left, then make a quad title
        numOfQuads++; // the quad number
        let quadTitle = document.createElement('h4');
        quadTitle.className = 'quad-title';
        quadTitle.innerHTML = `Quad ${numOfQuads}`;
        quadList.appendChild(quadTitle);
        makeQuadTable('quad',numOfQuads); // Make the Quad Tables (quadTables)
      } else {

        // if a small swiss title has not been made, make one, then start counting small swiss players
        if (smallSwissTitle === false) {
          numOfQuads++; // the quad number
          let quadTitle = document.createElement('h4');
          quadTitle.className = 'quad-title';
          quadTitle.innerHTML = 'Small Swiss';
          quadList.appendChild(quadTitle);
          smallSwissTitle = true;
          makeQuadTable('swiss',numOfQuads); // Make the Quad Tables (quadTables)
        }
      }
    } // End of Make a title if this is a new quad or small swiss

    // Add the player to the immediately visible list
    let quadPlayer = document.createElement('p');
    quadPlayer.className = 'quad-player';
    quadPlayer.innerHTML = players[i].first.toUpperCase() + " " + players[i].last.toUpperCase() + " (" + players[i].rating + ") " + players[i].id;
    quadList.appendChild(quadPlayer);
    // End of Add the player to the visible list

    // Add the player to the printable tables 
    let quadRow = document.createElement('tr');
    quadRow.className = 'quad-row';
    quadRow.id = `player-${i}`;
 
    if (smallSwissTitle===true) {
      // If this is a small swiss
      // set the names of the small swiss players and increment the number
      smallSwissPlayersCount++;
      smallSwissPlayers[smallSwissPlayersCount] = `${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}`;
      let playerNumberId = `td-player-${smallSwissPlayersCount}`;
      document.getElementById(playerNumberId).innerHTML=smallSwissPlayers[smallSwissPlayersCount];
      document.getElementById(playerNumberId+"b").innerHTML=smallSwissPlayers[smallSwissPlayersCount];
      playerNumberId = `swiss-player-${smallSwissPlayersCount}`;
      document.getElementById(playerNumberId).innerHTML=smallSwissPlayers[smallSwissPlayersCount];
      quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br />&nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }else {
      // If this is not a small swiss
      // indicate who plays whom according to which quad player this person is
      switch (quadplayer) {
        case 0:
          quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br />&nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td>white vs 4</td><td>black vs 4</td><td>black vs 3</td><td>white vs 3</td><td>white vs 2</td><td>black vs 2</td></tr>`;
          break;
        case 1:
          quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br />&nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td>white vs 3</td><td>black vs 3</td><td>black vs 4</td><td>white vs 4</td><td>black vs 1</td><td>white vs 1</td></tr>`;
          break;
        case 2:
          quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br />&nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td>black vs 2</td><td>white vs 2</td><td>white vs 1</td><td>black vs 1</td><td>white vs 4</td><td>black vs 4</td></tr>`;
          break;
        case 3:
          quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br />&nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td>black vs 1</td><td>white vs 1</td><td>white vs 2</td><td>black vs 2</td><td>black vs 3</td><td>white vs 3</td></tr>`;
          break;
      }
    }

    document.getElementById(`quad-${numOfQuads}`).appendChild(quadRow);
    // End of add the player to the printable tables
  }



  // makeQuadTable() - Make the Quad or Small Swiss Table
  function makeQuadTable(quadType,numOfQuads) {
    let quadTable = document.createElement('table');
    if(quadType=='swiss') {
      quadTable.className = 'small-swiss-table quad-table table';
    } else {
      quadTable.className = 'quad-table table';
    } 
    quadTable.id = `quad-${numOfQuads}`;
    let quadTableTopRow = document.createElement('tr');
    quadTableTopRow.className = 'title-row';
    let quadTableTopCell = document.createElement('th');
    quadTableTopCell.className = 'title-cell';
    if(quadType=='swiss') {
      quadTableTopCell.innerHTML = `Small Swiss`;
      document.getElementById('pairing-table').classList.add('active'); // Makes the pairing tables display when needed
      document.getElementById('pairing-cards').classList.add('active'); // Makes the pairing cards display when needed
    } else {
      quadTableTopCell.innerHTML = `Quad ${numOfQuads}`;
    }
    quadTableTopRow.appendChild(quadTableTopCell);
    let quadTableRoundOneCell = document.createElement('td');
    quadTableRoundOneCell.className = 'round-title-cell';
    quadTableRoundOneCell.innerHTML = "Rnd 1";
    quadTableTopRow.appendChild(quadTableRoundOneCell);
    let quadTableRoundTwoCell = document.createElement('td');
    quadTableRoundTwoCell.className = 'round-title-cell';
    quadTableRoundTwoCell.innerHTML = "Rnd 2";
    quadTableTopRow.appendChild(quadTableRoundTwoCell);
    let quadTableRoundThreeCell = document.createElement('td');
    quadTableRoundThreeCell.className = 'round-title-cell';
    quadTableRoundThreeCell.innerHTML = "Rnd 3";
    quadTableTopRow.appendChild(quadTableRoundThreeCell);
    quadTable.appendChild(quadTableTopRow);
    let quadTableRoundFourCell = document.createElement('td');
    quadTableRoundFourCell.className = 'round-title-cell';
    quadTableRoundFourCell.innerHTML = "Rnd 4";
    quadTableTopRow.appendChild(quadTableRoundFourCell);
    quadTable.appendChild(quadTableTopRow); 
    let quadTableRoundFiveCell = document.createElement('td');
    quadTableRoundFiveCell.className = 'round-title-cell';
    quadTableRoundFiveCell.innerHTML = "Rnd 5";
    quadTableTopRow.appendChild(quadTableRoundFiveCell);
    quadTable.appendChild(quadTableTopRow);
    let quadTableRoundsixCell = document.createElement('td');
    quadTableRoundsixCell.className = 'round-title-cell';
    quadTableRoundsixCell.innerHTML = "Rnd 6";
    quadTableTopRow.appendChild(quadTableRoundsixCell);
    quadTable.appendChild(quadTableTopRow);
    quadTables.appendChild(quadTable);
  } 
  // End of makeQuadTable() Make the Quad or Small Swiss Table

} 
// End of makeNewList() - Make a new player list


/* * * * * * * * * * * * * * * * * *
 * clearForm()
 * Clear the form
 * * * * * * * * * * * * * * * * * */
function clearForm() {
  const playerAddForm = document.querySelector('#add-player');
  const playerAddFormInputs = playerAddForm.querySelectorAll('.form-control');
  forEach(playerAddFormInputs, function() {
    playerAddFormInputs.value = '';
  });
}


/* * * * * * * * * * * * * * * * * *
 * printDouble()
 * Print a Double-Round Event
 * * * * * * * * * * * * * * * * * */
function printDouble() {
  const playerAddForm = document.querySelector('#add-player');
  const playerAddFormInputs = playerAddForm.querySelectorAll('.form-control');
  forEach(playerAddFormInputs, function() {
    playerAddFormInputs.value = '';
  });
}