let players = []; // an array to hold player objects

// if in local storage, get it and display
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
  first = document.getElementById("form-first").value;
  last = document.getElementById("form-last").value;
  id = document.getElementById("form-id").value;
  // at least a last name
  if (id.length < 1 && last.length < 1) {
    alert('You will need to provide a last name or a USCF ID.');
  } else {
      url = "https://uschess.org/msa/thin3.php?" + id;      
  }
  document.getElementById('uscf-frame').src = url;
});
// End of Search USCF for a player

// Remove a player
document.querySelector('#remove-player-btn').addEventListener('click',
function(e){
  // Get the ID to remove
  idToRemove = document.getElementById('form-delete-id').value;
  // Loop through the array
  for (let i = 0; i < players.length; i++) {
    thisID = players[i].id;
    if (thisID==idToRemove) {
      // Delete this player
      players.splice(i,1);
      makeNewList();
    }
  }
});
// End of remove a player

/* * * * * * * * * * * * * * * * * *
 * makeNewList()
 * Make a new player list
 * * * * * * * * * * * * * * * * * */
function makeNewList() {

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
        // if a small swiss title has not been made, make one
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
    quadRow.innerHTML = "<tr><td>" + players[i].first.toUpperCase() + " " + players[i].last.toUpperCase()
    + "<br /> &nbsp; &nbsp; &nbsp; (" + players[i].rating + ") " + players[i].id
     + "<td></td><td></td><td>color: &nbsp; W &nbsp; B</td></tr>";
    document.getElementById(`quad-${numOfQuads}`).appendChild(quadRow);
    // End of add the player to the printable tables
  }

  // Add instructions on tables
  const qTs = document.querySelectorAll('.quad-table');
  for (let k = 0; k < qTs.length; k++) {
    let quadInstruction = "<p><strong>Round One</strong><br />"
    + "Player 1 plays white against Player 4.<br />"
    + "Player 3 plays white against Player 2.<br />"
    + "Indicate points in table above.</p>"
    + "<p><strong>Round Two</strong><br />"
    + "Player 2 plays white against Player 1.<br />"
    + "Player 4 plays white against Player 3.<br />"
    + "Indicate points in table above.</p>"
    + "<p><strong>Round Three</strong><br />"
    + "Player 1 plays against Player 3 (draw for color).<br />"
    + "Player 4 plays against Player 2 (draw for color).<br />"
    + "Indicate points in table above and circle color played.</p>";
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