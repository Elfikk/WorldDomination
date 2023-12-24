import { Graph } from "./Graph.js";
import { mod } from "./functions.js"

export class RP2PlayArea {
    // Rectangular, Periodic, 2D Play Area object.
    // Responsible for initialising rectangular play area of the right size
    // and updating its state when the GameHandler tells it to.

    constructor(cols, rows) {

        // Class attributes
        this.rows = rows;
        this.cols = cols;
        this.graph = new Graph();
        this.playersToLand = new Map();
        this.playersToContestedLand = new Map();
    }

    initialise() {
        // Initialises vertices in the graph.

        let id;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                id = this.coordsToID(x, y);
                this.graph.addVertex(id, id);
                this.playersToLand.set(id, new Set([id]));
                this.playersToContestedLand.set(id, new Set([id]));
            }
        }


        let baseID, to_add;
        // Adds edges to graph.
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {

                baseID = this.coordsToID(x, y);
                
                to_add = [
                    [mod(x - 1, this.cols), mod(y - 1, this.rows)],
                    [mod(x, this.cols), mod(y - 1, this.rows)],
                    [mod(x + 1, this.cols), mod(y - 1, this.rows)],
                    [mod(x - 1, this.cols), mod(y, this.rows)],
                    [mod(x + 1, this.cols), mod(y, this.rows)],
                    [mod(x - 1, this.cols), mod(y + 1, this.rows)],
                    [mod(x, this.cols), mod(y + 1, this.rows)],
                    [mod(x + 1, this.cols), mod(y + 1, this.rows)]
                ];

                for (let i = 0; i < to_add.length;i++){
                    id = this.coordsToID(to_add[i][0], to_add[i][1]);
                    this.graph.addEdge(baseID, id, false);
                }
            
            }
        }

    }

    coordsToID(x, y) {
        return y * this.cols + x;
    }

    idToCoords(id) {
        return [id % this.cols, Math.trunc(id / this.cols)]
    }

    getGraph() {
        // for debugging purposes only - the GameHandler should never interact
        // with the Graph directly.
        return this.graph
    }

    minID() {
        return 0
    }

    maxID() {
        return this.rows * this.cols - 1
    }

    getOwner(id) {
        return this.graph.getData(id);
    }

    getOwnersContested(id) {
        // console.log(this);
        return this.playersToContestedLand.get(id);
    }

    getTargetVertices(id) {
        // Gets all neighbouring vertices that are not owned by the owner of the
        // provided vertex index.

        const vertexIDs = this.graph.getEdges(id);
        const originalOwner = this.getOwner(id);
        var targetVertices = [];

        // let owner;
        for (const vertexID of vertexIDs) {
            let owner = this.getOwner(vertexID);
            if (owner != originalOwner) {
                targetVertices.push(vertexID);
            }
        }

        return targetVertices;
    }

    getSize(ownerID) {
        // console.log(this);
        // console.log(ownerID);
        return this.playersToLand.get(ownerID).size
    }

    checkContested(id) {
        var neighbours = this.graph.getEdges(id);
        var playerNeighbours = new Set();
        for (let i = 0; i < neighbours.length;i++) {
            var neighbour = neighbours[i];
            var neighbourOwner = this.graph.getData(neighbour);
            playerNeighbours.add(neighbourOwner);
        }

        if (playerNeighbours.size == 1) {
            return false;
        }

        return true;
    }

    update(winner, loser, vertexID) {

        // 1. Update graph so the vertex has the right owner in the graph.
        // 2. If the player has lost his final piece of land, get rid of
        //    references to him in players arrays. If player exists, remove
        //    the vertexID from the players arrays.
        // 3. Since vertex must have been contested to be won, check if it 
        //    still is contested now. Update winner player arrays entries
        //    accordingly.
        // 4. Check neighbouring winner vertices to see if they are also 
        //    contested.

        // 1
        this.graph.setData(vertexID, winner);

        // 2

        // Get gets a reference to the set object in the players to land array.
        var loserLandSet = this.playersToLand.get(loser);
        loserLandSet.delete(vertexID);
        
        // if player has no remaining land, delete them from players entries
        // otherwise remove the vertex from the loser contested array.
        if (loserLandSet.length == 0) {
            this.playersToLand.delete(loser);
            this.playersToContestedLand.delete(loser);
        } else {
            this.playersToContestedLand.get(loser).delete(vertexID);
        }

        // 3

        // Regardless of whether land is contested or not, we add the new land
        // to the players' ownership.
        var winnerLandSet = this.playersToLand.get(winner);
        winnerLandSet.add(vertexID);

        // If the vertex is still contested, have to add to contested winner
        // land set.
        if (this.checkContested(vertexID)) {
            this.playersToLand.get(winner).add(vertexID);
        }

        // 4

        // Now check all adjacent neighbours to see if they are contested.
        var neighbours = this.graph.getEdges(vertexID);

        // for each neighbour vertex, check if the neighbour vertex is contested
        for (const neighbour of neighbours) {
            // if the neighbour is contested, make sure the vertex is in the
            // player to contested land set.
            // otherwise, make sure it isn't...
            var owner = this.graph.getData(neighbour);
            if (this.checkContested(neighbour)) {
                this.playersToContestedLand.get(owner).add(neighbour);
            } else {
                this.playersToContestedLand.get(owner).delete(neighbour);
            }
        }
    }

    gameEnded() {
        if (this.playersToLand.size == 1) {
            return true
        }
        return false
    }
}

export class RP2PlayAreaUI {
    // Rectangular, Periodic, 2D Play Area UI object.
    // Handles the drawing of the grid and updating the grid to the correct
    // state based on the RP2 Play Area state object.

    constructor(cols, rows) {
        this.rows = rows
        this.cols = cols
    }

    initialise() {

        // Feel like this is probably poor practice.
        var gridContainer = document.querySelector('.grid');
        // console.log(gridContainer);

        this.celltot = this.rows * this.cols;

        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        gridContainer.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;

        let row = 1;
        let column = 1;
        // let x, y;
        this.cells = [];
        for (let i = 0; i < this.celltot; i++) {
            let cell = document.createElement('div');
            cell.style.border = '1px solid black';
            cell.style.textAlign = "center";
            cell.style.display = "flex";

            cell.style.gridRow = row;
            cell.style.gridColumn = column;

            // console.log(cell.style.gridRow + " " + cell.style.gridColumn);

            cell.style.color = "#000000";

            // x = column - 1;
            // y = row - 1;

            // cell.innerHTML = i;

            var rgbVals = this.gameGradient(i);
            var rgbString = rgbVals.toString();
            var rgbSetter = "rgb(".concat(rgbString).concat(")")    

            cell.style.backgroundColor = rgbSetter;

            column += 1;
            this.cells.push(cell);
            if (column === this.cols + 1) {
                row += 1;
                column = 1;
            }
            // console.log(cell);
            gridContainer.appendChild(cell);
        }
    }

    idToCoords(id) {
        return [id % this.cols, Math.trunc(id / this.cols)]
    }

    gameGradient(ownerID) {
        let x, y;
        const coords = this.idToCoords(ownerID);
        [x, y] = coords;
     
        const xPrimed = Math.PI / 2 * (x+0.5) / this.cols;
        const yPrimed = Math.PI / 2 * (y+0.5) / this.rows;
    
        const r = 255 * (Math.pow(Math.cos(xPrimed),2));
        const g = 255 * (Math.pow(Math.cos(yPrimed),2));
    
        return [r,g,100]
    } 

    update(winnerID, loserID, vertexID) {

        var rgbVals = this.gameGradient(winnerID);
        var rgbString = rgbVals.toString();
        var rgbSetter = "rgb(".concat(rgbString).concat(")")
        
        this.cells[vertexID].style.backgroundColor = rgbSetter;
        // this.cells[vertexID].innerHTML = winnerID;

        this.updateVertexBorder(vertexID);

        let neighbourIDs;
        neighbourIDs = this.getCompassNeighboursIDs(vertexID);
        for (const id of neighbourIDs) {
            this.updateVertexBorder(id);
        }

    }

    getCompassNeighboursIDs(id) {
        const coords = this.idToCoords(id);
        let x,y;
        [x, y] = coords;

        let nCoord, eCoord, sCoord, wCoord;

        nCoord = [x, mod(y - 1, this.rows)];
        eCoord = [mod(x+1, this.cols), y];
        sCoord = [x, mod(y + 1, this.rows)];
        wCoord = [mod(x-1, this.cols), y];

        let n,e,s,w;

        n = this.coordsToID(...nCoord);
        e = this.coordsToID(...eCoord);
        s = this.coordsToID(...sCoord);
        w = this.coordsToID(...wCoord);

        return [n, e, s, w];
    }    

    updateVertexBorder(id) {
        
        var neswBorders = new Array(4);
        const baseColour = this.cells[id].style.backgroundColor;

        // let neighbourIDs;
        const neighbourIDs = this.getCompassNeighboursIDs(id);     

        let neighbour, neighbourColour;
        for (let i = 0; i < 4; i++) {
            neighbour = neighbourIDs[i];
            neighbourColour = this.cells[neighbour].style.backgroundColor;
            if (baseColour == neighbourColour) {
                neswBorders[i] = "none";
            } else {
                neswBorders[i] = "solid";
            }
        }

        let n,e,s,w;
        [n,e,s,w] = neswBorders;

        this.cells[id].style.borderStyle = `${n} ${e} ${s} ${w}`;
    }


    getCols() {
        return this.cols
    }

    coordsToID(x, y) {
        return y * this.cols + x;
    }

}