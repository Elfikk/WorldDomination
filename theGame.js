import { RP2PlayArea, RP2PlayAreaUI } from "./RP2PlayArea.js";
import { GameHandler } from "./GameHandler.js";

const cols = 10;
const rows = 10;

var rp2PlayArea = new RP2PlayArea(cols, rows);
var rp2PlayAreaUI = new RP2PlayAreaUI(cols, rows);

// playAreaUI.initialise()

var gameHandler = new GameHandler(rp2PlayArea, rp2PlayAreaUI);
// gameHandler.setup()

var testButton = document.getElementById("test-button");
testButton.addEventListener("click", gameHandler.setup);