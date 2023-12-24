import { RP2PlayArea, RP2PlayAreaUI } from "./RP2PlayArea.js";

function testGraphInput() {
    var zePlayArea = new RP2PlayArea(3, 3);
    var testGraph = zePlayArea.getGraph();
    testGraph.printGraph();    

    // ((n % d) + d) % d
    // JS doesn't define a modulo operator, but instead has a remainder
    // one that always takes the sign of n - so gotta do extra shift and
    // remainder operation to get smallest positive remainders.
    // var moduloTest = ((-1%12)+12)%12;
    // console.log(moduloTest);
}

// function testGridMaking(rowtot = 32, coltot = 32) {

//     let celltot = rowtot * coltot;

//     gridContainer.style.display = 'grid';
//     gridContainer.style.gridTemplateRows = `repeat(${rowtot}, 1fr)`;
//     gridContainer.style.gridTemplateColumns = `repeat(${coltot}, 1fr)`;

//     let row = 1;
//     let column = 1;
//     for (let i = 0; i < celltot; i++) {
//         let cell = document.createElement('div');
//         // cell.style.border = '1px solid black';
//         cell.style.textAlign = "center";
//         cell.style.display = "flex";
        
//         cell.style.gridRow = row;
//         cell.style.gridColumn = column;
//         // cell.textContent = i;
//         cell.style.color = "#000000";
        
//         var rgbVals = testGradient(row, column, rowtot, coltot);
//         var rgbString = rgbVals.toString();
//         var rgbSetter = "rgb(".concat(rgbString).concat(")")    

//         cell.style.backgroundColor = rgbSetter;

//         column += 1;
//         if (column === coltot + 1) {
//             row += 1;
//             column = 1;
//         }
//         gridContainer.appendChild(cell);
//     }
// }

// function testGradient(x, y, rowtot, coltot) {
//     var xPrimed = Math.PI * (x-1) / (rowtot);
//     var yPrimed = Math.PI * (y-1) / (coltot);

//     var r = 255 * (Math.pow(Math.sin(xPrimed),2));
//     var g = 255 * (Math.pow(Math.sin(yPrimed),2));

//     // console.log([r,g,255])

//     return [r,g,100]
    
// } 

// var gridContainer = document.querySelector('.grid');
// var nomnom = 25;
// testGridMaking(nomnom, nomnom);
var UI = new RP2PlayAreaUI(5, 5);
UI.initialise(true);

var testButton = document.getElementById("test-button");
testButton.addEventListener("click", testGraphInput);

