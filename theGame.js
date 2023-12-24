import { RP2PlayArea, RP2PlayAreaUI } from "./RP2PlayArea.js";
import { GameHandler } from "./GameHandler.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function gamePlay() {
    for (let i  = 0; i < 10000; i++) {
        console.log("turn="+i);
        gameLogic.turn();
        sleep(1);
    }    

}

const cols = 25;
const rows = 25;

var rp2PlayArea = new RP2PlayArea(cols, rows);
var rp2PlayAreaUI = new RP2PlayAreaUI(cols, rows);

// rp2PlayArea.initialise();
// rp2PlayAreaUI.initialise();

// console.log(rp2PlayAreaUI.getCols())

var gameLogic = new GameHandler(rp2PlayArea, rp2PlayAreaUI);
gameLogic.setup()


var testButton = document.getElementById("test-button");
testButton.addEventListener("click", gamePlay);