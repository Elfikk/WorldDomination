import { Graph } from "./Graph.js";
import { mod } from "./functions.js"

export class RP2PlayArea {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.graph = new Graph();
        this.playersToLand = new Map();
        this.playersToContestedLand = new Map();

        for (let y = 0; y < this.cols; y++) {
            for (let x = 0; x < this.rows; x++) {
                var id = y * rows + x;
                this.graph.addVertex(id, id);
                this.playersToLand.set(id, new Set([id]));
                this.playersToContestedLand.set(id, new Set([id]));
            }
        }

        for (let y = 0; y < this.cols; y++) {
            for (let x = 0; x < this.rows; x++) {

                var baseID = y * rows + x;
                
                var to_add = [
                    [mod(x - 1, rows), mod(y - 1, cols)],
                    [mod(x, rows), mod(y - 1, cols)],
                    [mod(x + 1, rows), mod(y - 1, cols)],
                    [mod(x - 1, rows), mod(y, cols)],
                    [mod(x + 1, rows), mod(y, cols)],
                    [mod(x - 1, rows), mod(y + 1, cols)],
                    [mod(x, rows), mod(y + 1, cols)],
                    [mod(x + 1, rows), mod(y + 1, cols)]
                ];

                for (let i = 0; i < to_add.length;i++){
                    var id = to_add[i][1] * rows + to_add[i][0];
                    this.graph.addEdge(baseID, id, false);
                }
            
            }
        }

    }

    coordsToID(x, y) {
        return y * this.rows + x;
    }

    idToCoords(id) {
        return []
    }

    getGraph() {
        return this.graph
    }

    maxID() {
        return this.rows * this.cols - 1
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
        
        // if player has no remaining land
        if (loserLandSet.length == 0) {
            this.playersToLand.delete(loser);
            this.playersToContestedLand.delete(loser);
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


    }
}