const boardSize = 3;
const rowForWIn = 3;

const game = (function Game() {
    const players = [Player(), Player()];
    let playerTurnIdx = 0;

    function updatePlayer(name, symbol, player) {
        player.name = name;
        player.symbol = symbol;
    }

    function Player() {
        let name = null;
        let symbol = null;  // allow players to choose from a set    
        let turnIdx = playerTurnIdx;
    
        return {name, symbol, turnIdx};
    }

    
    let turnCounter = 0; //to determine turn: turncounter // 2 -> player idx
}) ();

function DisplayController(){
    const p1nameInputElement = document.querySelector("#p1-name");
    const p1symbolContainer = document.querySelector(".p1.symbol-container"); // TODO: Find selected symbol
    const p2nameInputElement = document.querySelector("#p2-name");
    const p2symbolContainer= document.querySelector(".p2.symbol-container"); // TODO: Find selected symbol
    const boardContainerElement = document.querySelector(".game-board");
}

document.addEventListener("DOMContentLoaded", function () {
    game.displayController = DisplayController();
})