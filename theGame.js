import { RP2PlayArea, RP2PlayAreaUI } from "./RP2PlayArea.js";
import { GameHandler } from "./GameHandler.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// aggressorOwner, 
//                 targetOwner,
//                 targetID,
//                 aggressorWin,
//                 this.playArea.gameEnded()

function gamePlay() {
    var gameEnded = gameLogic.gameEnded;
    var i = 0;
    const max_turns = 1;

    let aggressorOwner, targetOwner, targetID, aggressorWin;

    while (!gameEnded && i < max_turns) {
        // console.log("turn="+i);
        [aggressorOwner, targetOwner, targetID, aggressorWin, gameEnded] = gameLogic.turn();
        i++;

        moveSummary.innerHTML = 
            `${aggressorOwner} attacks ${targetOwner} for ${targetID}. Won? ${aggressorWin}`
    }
}

function startGame() {
    setInterval(gamePlay, 20)
}

const cols = 20;
const rows = 20;

var rp2PlayArea = new RP2PlayArea(cols, rows);
var rp2PlayAreaUI = new RP2PlayAreaUI(cols, rows);

// rp2PlayArea.initialise();
// rp2PlayAreaUI.initialise();

// console.log(rp2PlayAreaUI.getCols())

var gameLogic = new GameHandler(rp2PlayArea, rp2PlayAreaUI);
gameLogic.setup()

var moveSummary = document.getElementById("move-summariser");

var testButton = document.getElementById("test-button");
testButton.addEventListener("click", startGame);