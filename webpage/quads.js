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
    } // End of Make a title if this sia new quad or small swiss

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
      playerNumberId = `swiss-player-${smallSwissPlayersCount}`;
      document.getElementById(playerNumberId).innerHTML=smallSwissPlayers[smallSwissPlayersCount];
      quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br /> &nbsp; &nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td></td><td></td><td></td></tr>`;
    }else {
      // If this is not a small swiss
      // indicate who plays whom according to which quad player this person is
      switch (quadplayer) {
        case 0:
          quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br /> &nbsp; &nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td>white vs 4</td><td>black vs 3</td><td>color: &nbsp; W &nbsp; B</td></tr>`;
          break;
        case 1:
          quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br /> &nbsp; &nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td>white vs 3</td><td>black vs 4</td><td>color: &nbsp; W &nbsp; B</td></tr>`;
          break;
        case 2:
          quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br /> &nbsp; &nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td>black vs 2</td><td>white vs 1</td><td>color: &nbsp; W &nbsp; B</td></tr>`;
          break;
        case 3:
          quadRow.innerHTML = `<tr><td>${players[i].first.toUpperCase()} ${players[i].last.toUpperCase()}<br /> &nbsp; &nbsp; &nbsp; (${players[i].rating}) ${players[i].id}<td>black vs 1</td><td>white vs 2</td><td>color: &nbsp; W &nbsp; B</td></tr>`;
          break;
      }
    }

    document.getElementById(`quad-${numOfQuads}`).appendChild(quadRow);
    // End of add the player to the printable tables
  }

  // Add instructions on tables
  const qTs = document.querySelectorAll('.quad-table');
  for (let k = 0; k < qTs.length; k++) {
    let quadInstruction = "<svg style=\"max-width:30%;float:right;\" id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 256 256\"><image width=\"256\" height=\"256\" xlink:href=\"data:image/png;base64,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\"/></svg>"
    + "<p><strong>Round One</strong><br />"
    + "Player 1 plays white against Player 4.<br />"
    + "Player 2 plays white against Player 3.<br />"
    + "Indicate points in table above.</p>"
    + "<p><strong>Round Two</strong><br />"
    + "Player 3 plays white against Player 1.<br />"
    + "Player 4 plays white against Player 2.<br />"
    + "Indicate points in table above.</p>"
    + "<p><strong>Round Three</strong><br />"
    + "Player 1 plays against Player 2 (draw for color).<br />"
    + "Player 3 plays against Player 4 (draw for color).<br />"
    + "Indicate points in table above and circle color played.</p>"
    let quadInstructionRow = document.createElement("tr");
    let quadInstructionCell = document.createElement("td");
    quadInstructionCell.setAttribute("colspan", "4");
    quadInstructionCell.className = "quad-instructions";
    quadInstructionCell.innerHTML = quadInstruction;
    quadInstructionRow.appendChild(quadInstructionCell);
    qTs[k].appendChild(quadInstructionRow);
  }  
  // End of Add instructions on tables loop

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