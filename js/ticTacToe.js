/*Gameboard */

let GameBoardModule = (() => {
   let gameBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    //Event listener 
    function addCellEvent() {

        let gameCellArray = Array.from(document.querySelectorAll(".game-cell"));

        for (let i = 0; i < gameCellArray.length; i++) {
            let cell = gameCellArray[i];
            cell.addEventListener("click", GameFlowObj.addMarker);
        }
    }

    function render() {

        let gameContainer = document.querySelector(".game-container");
        //Initialise 
        for (let i = 0; i < gameBoard.length; i++) {
            let gameCell = document.createElement("div");
            gameCell.classList.add("game-cell");
            gameCell.id = String(i);
            gameCell.innerHTML = gameBoard[i];
            gameContainer.append(gameCell);
        }

        // Add an event listener to each cell
        addCellEvent();
    }
  return {   gameBoard,  render };
})();

/*Gameflow */
const GameFlowFactory = function(gameBoard) {
    let currentMarker = "X";
    let currentTurn = 1;

    function resetGame() {

        clearBoard();
        GameBoardObj.render();
    }

    function updateGameBoard(index) {

        gameBoard[index] = currentMarker;
        checkWin();
        displayTurn();
    }

    function clearBoard() {

        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = " ";
        }

        let gameContainer = document.querySelector(".game-container");
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
    }

    function displayTurn() {

        let player1 = document.querySelector(".player1");
        let player2 = document.querySelector(".player2");

        if (currentTurn === 1) {
            player1.style.backgroundColor = "#72f22e";//green
            player2.style.backgroundColor = "#f22e58";//red
        }
        else {
            player1.style.backgroundColor = "#f22e58";//red
            player2.style.backgroundColor = "#72f22e";//green
        }
    }

    function detectStatusOfGame(status) {

        let player1Name = document.querySelector(".player1");
        let player2Name = document.querySelector(".player2");
        let playerWon = "";
        let playerNext = "";

        if (status === "tie" && currentTurn === 1) {
            console.log("Draw");
            playerWon = "Draw!";
            playerNext = player2Name.textContent + " turn is next";
            return [playerWon, playerNext];
        }
        else if (status === "tie" && currentTurn === 0) {
            playerWon = "Draw!";
            playerNext = player1Name.textContent + " turn is next";
            return [playerWon, playerNext];
        }
        if (currentTurn === 1) {
            playerWon = player1Name.textContent + " Won";
            playerNext = player2Name.textContent + " turn is next";
            return [playerWon, playerNext];
        }
        else {
            playerWon = player2Name.textContent + " Won";
            playerNext = player1Name.textContent + " turn is next";
            return [playerWon, playerNext];
        }
    }

    function createPopUp(status) {

        let displayPopUp = document.querySelector(".popup");

        // Make the pop up appear
        let popUp = document.querySelector(".popup-container");
        popUp.classList.remove("hidden");

        // Add results of the game to the pop up
        let playerWon = document.createElement("span");
        let playerNext = document.createElement("p");
        let result = detectStatusOfGame(status);

        playerWon.innerHTML = result[0];
        playerNext.innerHTML = result[1];
        displayPopUp.append(playerWon);
        displayPopUp.append(playerNext);

        // Button to play again
        let playAgain = document.createElement("button");
        playAgain.innerHTML = "Play again";
        playAgain.classList.add("play-again-btn");

        playAgain.addEventListener("click", function () {
            clearBoard();
            GameBoardObj.render();

            // Reset the winner pop up by removing them
            // This is okay since they will be created again
            displayPopUp.removeChild(playerWon);
            displayPopUp.removeChild(playerNext);
            displayPopUp.removeChild(playAgain);

            // Hide the pop up
            popUp.classList.add("hidden");
        });

        displayPopUp.append(playAgain);
    }// End of createPopUp

    function checkWin() {

        let winnerFlag = false;

        // Rows
      
        if (gameBoard[0] === currentMarker && gameBoard[1] === currentMarker && gameBoard[2] === currentMarker) {
            winnerFlag = true;
        }
        else if (gameBoard[3] === currentMarker && gameBoard[4] === currentMarker && gameBoard[5] === currentMarker) {
            winnerFlag = true;
        }
        else if (gameBoard[6] === currentMarker && gameBoard[7] === currentMarker && gameBoard[8] === currentMarker) {
            winnerFlag = true;
        }
        // Columns
       
        else if (gameBoard[0] === currentMarker && gameBoard[3] === currentMarker && gameBoard[6] === currentMarker) {
            winnerFlag = true;
        }
        else if (gameBoard[1] === currentMarker && gameBoard[4] === currentMarker && gameBoard[7] === currentMarker) {
            winnerFlag = true;
        }
        else if (gameBoard[2] === currentMarker && gameBoard[5] === currentMarker && gameBoard[8] === currentMarker) {
            winnerFlag = true;
        }
        // Diagonals
        
        else if (gameBoard[0] === currentMarker && gameBoard[4] === currentMarker && gameBoard[8] === currentMarker) {
            winnerFlag = true;
        }
        else if (gameBoard[2] === currentMarker && gameBoard[4] === currentMarker && gameBoard[6] === currentMarker) {
            winnerFlag = true;
        }

        if (winnerFlag === false && gameBoard.indexOf(" ") < 0) {
            createPopUp("tie");
        }
        if (winnerFlag) {
            createPopUp("won");
        }
    }

    function updateTurn(marker) {
        if (marker === "X") {//X is first
            currentTurn = 0;
        }
        else {
            currentTurn = 1;
        }
    }

    function updateMarker(index) {

        if (currentMarker === "X") {
            updateGameBoard(index);
            updateTurn("X");
            currentMarker = "O";
        }
        else {
            updateGameBoard(index);
            updateTurn("O");
            currentMarker = "X";
        }
    }

    function checkToAddMarker(that) {
        let classArray = that.className.split(" ");

        if (classArray.indexOf("taken") < 0) {
            that.innerHTML = currentMarker;
            that.classList.add("taken");
            updateMarker(that.id);
        }
        else {
            console.log("spot is taken");
        }
    }

    function addMarker() {

        let that = this;
        checkToAddMarker(that);
    }

    return { addMarker, resetGame };
};// End of GameFlowFactory

  
    
/* Player */
let PlayerFactory = function(name){
    return { name };
};

/*DisplayController*/
let DisplayControllerModule = (() => {
    let player1 = "";
    let player2 = "";

    function startScreen() {

        // Add event listener to start button and gather the names of the players
        let startButton = document.querySelector(".start-btn");
        startButton.addEventListener("click", () => {

            let player1Form = document.forms["PlayersForm"]["player1"];
            let player2Form = document.forms["PlayersForm"]["player2"];

            // If they do not enter a name for either player then default will Player 1 or Player 2
            if (player1Form.value.length === 0 || player2Form.value.length === 0) {
                player1 = PlayerFactory("Player 1");
                player2 = PlayerFactory("Player 2");
            }
            else {
                player1 = PlayerFactory(player1Form.value);
                player2 = PlayerFactory(player2Form.value);
            }

            startGame();
        });
    }

    function startGame() {

        // Hide the start screen 
        let startScreen = document.querySelector(".start-screen-container");
        startScreen.classList.add("hidden");

        // Show the gameboard
        let game = document.querySelector(".game-screen-container");
        game.classList.remove("hidden");

        // Bind event listener to back button
        let backButton = document.querySelector(".back-btn");
        backButton.addEventListener("click", goBackToStartScreen);

        // Bind event listener to reset button
        let resetButton = document.querySelector(".reset-btn");
        resetButton.addEventListener("click", GameFlowObj.resetGame);

        // Show the player names
        let player1Display = document.querySelector(".player1");
        player1Display.innerHTML = "<span>"+player1.name+"</span>";

        let player2Display = document.querySelector(".player2");
        player2Display.innerHTML = "<span>"+player2.name+"</span>";
    }

    function goBackToStartScreen() {

        // Hide the gameboard 
        let game = document.querySelector(".game-screen-container");
        game.classList.add("hidden");

        // Show the start  
        let startScreen = document.querySelector(".start-screen-container");
        startScreen.classList.remove("hidden");
    }

    return {
        startScreen, player1, player2
    };
  })();//End of DisplayController
//Initializing
let DisplayControllerModuleObj = DisplayControllerModule;
let GameBoardObj = GameBoardModule;
//Beware of the argument
let GameFlowObj = GameFlowFactory(GameBoardObj.gameBoard);

console.log('Initializing game');
// Start the application
DisplayControllerModuleObj.startScreen();
GameBoardObj.render();
  
  