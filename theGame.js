import { RP2PlayArea, RP2PlayAreaUI } from "./RP2PlayArea.js";
import { GameHandler } from "./GameHandler.js";

function gamePlay() {
    var gameEnded = gameLogic.gameEnded;
    var i = 0;
    const max_turns = 1;

    let aggressorOwner, targetOwner, targetID, aggressorWin, outcome;
    
    var moveSummary = document.getElementById("move-summariser");

    while (!gameEnded && i < max_turns) {
        outcome = gameLogic.turn();
        [aggressorOwner, targetOwner, targetID, aggressorWin] = outcome;
        i++;
        turns++;
        gameEnded = gameLogic.gameEnded;

        moveSummary.innerHTML = 
            `Turn ${turns}:${aggressorOwner} attacks ${targetOwner} for ${targetID}. Won? ${aggressorWin}`
    }
}

function startGame() {
    var intervalInput = document.getElementById("intervalInput").value;
    var interval = setInterval(gamePlay, intervalInput);

    function pauseGame() {
        clearInterval(interval);
    }

    var stopButton = document.getElementById("stop-button");
    stopButton.addEventListener("click", pauseGame);
}

function initialiseGame() {
    var columnInput = document.getElementById("cols-input");
    var rowInput = document.getElementById("rows-input");
    
    // console.log(rowInput.value);
    // console.log(columnInput.value)

    var rows = parseInt(rowInput.value);
    var cols = parseInt(columnInput.value); //Nice ratio
    turns = 0;
    
    var rp2PlayArea = new RP2PlayArea(cols, rows);
    var rp2PlayAreaUI = new RP2PlayAreaUI(cols, rows);
    
    // console.log(rp2PlayAreaUI.getCols())
    
    var gameLogic = new GameHandler(rp2PlayArea, rp2PlayAreaUI);
    gameLogic.setup()

    var gridContainer = document.getElementsByClassName('grid')[0];
    console.log(gridContainer);
    console.log("rogueDivs=" + gridContainer.childElementCount);

    // var testButton = document.getElementById("test-button");
    // testButton.addEventListener("click", gameLogic.delete);

    return gameLogic;
}

function reinitialiseGame() {

    var stopButton = document.getElementById("stop-button");
    stopButton.click();
    var turnSummary = document.getElementById("move-summariser");
    turnSummary.innerHTML = "Turn 0 - All is well 😌";
    gameLogic.delete();
    gameLogic = initialiseGame();

}

var gameLogic;
var turns;
gameLogic = initialiseGame();

var runButton = document.getElementById("run-button");
runButton.addEventListener("click", startGame);

// var sizeButton = document.getElementById("size-button");
// sizeButton.addEventListener("click", reinitialiseGame)

var resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", reinitialiseGame)

