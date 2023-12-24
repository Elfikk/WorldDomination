import { RP2PlayArea, RP2PlayAreaUI } from "./RP2PlayArea.js";
import { GameHandler } from "./GameHandler.js";

function gamePlay() {
    var gameEnded = gameLogic.gameEnded;
    var i = 0;
    const max_turns = 1;

    let aggressorOwner, targetOwner, targetID, aggressorWin, outcome;

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
    setInterval(gamePlay, 5)
}

const rows = 30;
const cols = 2 * rows; //Nice ratio
var turns = 0;

var rp2PlayArea = new RP2PlayArea(cols, rows);
var rp2PlayAreaUI = new RP2PlayAreaUI(cols, rows);

// console.log(rp2PlayAreaUI.getCols())

var gameLogic = new GameHandler(rp2PlayArea, rp2PlayAreaUI);
gameLogic.setup()

var moveSummary = document.getElementById("move-summariser");

var testButton = document.getElementById("test-button");
testButton.addEventListener("click", startGame);