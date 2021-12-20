// create an array to hold player objects
let players = [];

// if in local storage, get it and display
if (localStorage.getItem('players') === null) {
  players = [];
} else {
  players = JSON.parse(localStorage.getItem('players'));
  makeNewList();
}


/* * * * * * * * *
 * Event Listeners
 * * * * * * * * */
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
      url = "http://uschess.org/msa/thin3.php?" + id;      
  }
  document.getElementById('uscf-frame').src = url;
});

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
  
  // identify the player list and printable quad tables
  const quadList = document.querySelector('#quad-list');
  const quadTables = document.querySelector('#printable-quads');
  // Clear the Current List and Tables
  quadList.innerHTML = "";
  quadTables.innerHTML = "";
  // To check if small swiss is titled
  let smallSwissTitle = false;
  // quadplayer is to see if it is time to make a title
  let quadplayer = 0;
  // players left is how many players are yet to be grouped
  let playersLeft = 0;
  // quad number
  let numOfQuads = 0; 

  // Loop through array creating the Quads
  for (let i = 0; i < players.length; i++) {
    playersLeft = players.length - i;
    quadplayer = (i % 4);
    if (quadplayer === 0) {

      // if more than 7 or exactly 4 are left, then make a quad title
      if (playersLeft > 7 || playersLeft == 4) {

        // the quad number
        numOfQuads++;

        // Immediate Display List
        let quadTitle = document.createElement('h4');
        quadTitle.className = 'quad-title';
        quadTitle.innerHTML = `Quad ${numOfQuads}`;
        quadList.appendChild(quadTitle);

        // Make the Quad Tables (quadTables)
        let quadTable = document.createElement('table');
        quadTable.className = 'quad-table table';
        quadTable.id = `quad-${numOfQuads}`;
        let quadTableTopRow = document.createElement('tr');
        quadTableTopRow.className = 'title-row';
        let quadTableTopCell = document.createElement('th');
        quadTableTopCell.className = 'title-cell';
        quadTableTopCell.innerHTML = `Quad ${numOfQuads}`;
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

      } else {
        // if a small swiss title has not been made, make one
        if (smallSwissTitle === false) {
            
          // the quad number
          numOfQuads++;

          // Immdediate Display List
          let quadTitle = document.createElement('h4');
          quadTitle.className = 'quad-title';
          quadTitle.innerHTML = 'Small Swiss';
          quadList.appendChild(quadTitle);
          smallSwissTitle = true;

          // Make the Quad Tables (quadTables)
          let quadTable = document.createElement('table');
          quadTable.className = 'small-swiss-table quad-table table';
          quadTable.id = `quad-${numOfQuads}`;
          let quadTableTopRow = document.createElement('tr');
          quadTableTopRow.className = 'title-row';
          let quadTableTopCell = document.createElement('th');
          quadTableTopCell.className = 'title-cell';
          quadTableTopCell.innerHTML = `Small Swiss`;
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
      }
    }

    // add the player to the list
    let quadPlayer = document.createElement('p');
    quadPlayer.className = 'quad-player';
    quadPlayer.innerHTML = players[i].first.toUpperCase() + " " + players[i].last.toUpperCase() + " (" + players[i].rating + ") " + players[i].id;
    quadList.appendChild(quadPlayer);

    // The Printable Quads Player Row
    let quadRow = document.createElement('tr');
    quadRow.className = 'quad-row';
    quadRow.id = `player-${i}`;
    quadRow.innerHTML = "<tr><td>" + players[i].first.toUpperCase() + " " + players[i].last.toUpperCase()
    + "<br /> &nbsp; &nbsp; &nbsp; (" + players[i].rating + ") " + players[i].id
     + "<td></td><td></td><td>color: &nbsp; W &nbsp; B</td></tr>";
    document.getElementById(`quad-${numOfQuads}`).appendChild(quadRow);
    
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

}


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