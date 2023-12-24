import { RP2PlayArea, RP2PlayAreaUI } from "./RP2PlayArea.js";

export class GameHandler {

    constructor(playArea, playAreaUI) {
        this.playArea = playArea;
        this.playAreaUI = playAreaUI;
        this.gameEnded = false;
    }

    setup() {
        this.playArea.initialise();
        this.playAreaUI.initialise();

        const minID = this.playArea.minID();
        const maxID = this.playArea.maxID();
        this.minID = minID;
        this.maxID = maxID;
    }

    getRandomNum(a,b) {
        const multi = b - a + 1;
        return Math.floor(multi * Math.random() + a);
    }

    getRandomID() {
        return this.getRandomNum(this.minID, this.maxID);
    }
    turn() {

        // Turn flow
        // 1. Pick a vertex.
        // 2. Find vertex owner, referred to as aggressor.
        // 3a. If vertex contested, proceed.
        // 3b. If vertex uncontested, pick one of owner's contested vertices.
        // 4. Pick neighbouring vertex not owned by aggressor - target.
        // 5. Compare sizes of aggressor to target owner to find win 
        //    probability.
        // 6. Generate win or loss depending on probability.
        // 7. If aggressor won, update playArea and playAreaUI accordingly.
        // 8. Return aggressor, target, targetID, outcome and whether the game
        //    has finished.

        // randomID, aggressorID, aggressorOwner, targetID, targetOwner;

        // 1
        const randomID = this.getRandomID()

        // 2
        const aggressorOwner = this.playArea.getOwner(randomID);
        console.log("initialVertex=" + randomID);
        console.log("aggressorOwner=" + aggressorOwner);

        // 3

        // ID of the tile that is attacking
        let aggressorID;
        if (this.playArea.checkContested(randomID)) {
            //a
            aggressorID = randomID;
        } else {
            //b
            const contestedLand = Array.from(this.playArea.getOwnersContested(aggressorOwner));
            console.log("contestedLand=" + contestedLand);
            const maxIndex = contestedLand.length;
            const randomIndex = this.getRandomNum(0, maxIndex-1);
            aggressorID = contestedLand[randomIndex];
        }
        // console.log("finalAggressorVertex="+aggressorID)

        // 4

        // Pick target vertex ID.

        const potentialTargets = this.playArea.getTargetVertices(aggressorID);
        const maxIndex = potentialTargets.length;
        const randomIndex = this.getRandomNum(0, maxIndex-1);
        const targetID = potentialTargets[randomIndex];
        console.log("aggressorTileID=" + aggressorID)
        console.log("contested?="+ this.playArea.checkContested(aggressorID))
        console.log("randomTargetIndex=" + randomIndex);
        console.log("potentialTargets=" + potentialTargets);

        // Find target vertex owner.
        const targetOwner = this.playArea.getOwner(targetID);
        console.log("targetID=" + targetID);
        console.log("targetOwner=" + targetOwner);

        // 5

        const aggressorSize = this.playArea.getSize(aggressorOwner);
        const targetSize = this.playArea.getSize(targetOwner);
        const pWin = aggressorSize / (aggressorSize + targetSize);

        // 6
        const choiceNum = Math.random();
        let aggressorWin;

        // if the choiceNum < pWin, we have a win
        if (choiceNum < pWin) {
            aggressorWin = true;
        } else {
            aggressorWin = false;
        }

        // 7

        if (aggressorWin) {
            this.playArea.update(aggressorOwner, targetOwner, targetID);
            this.playAreaUI.update(aggressorOwner, targetOwner, targetID);
        }

        // 8
        this.gameEnded = this.playArea.gameEnded();

        return [aggressorOwner, 
                targetOwner,
                targetID,
                aggressorWin,
                this.gameEnded];
    }

}