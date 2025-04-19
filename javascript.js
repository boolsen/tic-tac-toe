const boardSize = 3;
const rowForWIn = 3;
let display;
let game;

//gameBoard module
function GameBoard (){    
    const gameBoard = (function() {
        const newBoard = Array(0);
        
        for (let i = 0; i < 3; i++) {
            let row = Array(3);
            row.fill(Cell());
            newBoard.push(row);        
        }
        return newBoard;
    })();

    function resetGameBoard() {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = null;
            }
        }
        
    }

    function isCellEmpty(x, y){
        if (gameBoard[x][y] === null) {
            return true;
        }
        return false;
    }

    function checkForVictory(x,y){
        // check diagonal if x + y = even
        const xArray = [];
        for (let i = 0; i < boardSize; i ++) {
            xArray.push(gameBoard[x][i]);
        }
        if (checkArrayForWin(xArray)) {
            return true;
        }

        const yArray = [];
        for (let i = 0; i < boardSize; i ++) {
            yArray.push(gameBoard[i][y]);
        }
        if (checkArrayForWin(yArray)) {
            return true;
        }

        if (x + y === boardSize) {
            const posDiagonalArray = [];
            for (let i = 0; i < boardSize; i++) {
                posDiagonalArray.push(gameBoard[boardSize - 1 - i][i]);
            }
            if (checkArrayForWin(posDiagonalArray)) {
                return true;
            }
        }

        if (x === y) {
            const negDiagonalArray = [];
            for (let i = 0; i < boardSize; i++) {
                negDiagonalArray.push(gameBoard[i][i]);
            }
            if (checkArrayForWin(negDiagonalArray)) {
                return true;
            }
        }

        return false;
    }

    function checkArrayForWin (array) {
        for (let i = 1; i < array.length; i++) {
            if (array[i] != array[i - 1]) {
                return false;
            }
        }
        return true;
    }

    function printBoard () {
        let text = '';
        for (let i = 0; i < gameBoard.length; i++){
            for (let j = 0; j < gameBoard.length; j++) {
                let symbol = '-';
                if (gameBoard[i][j]) {
                    symbol = gameBoard[i][j].symbol;
                }
                text += symbol;
            }
            text += ' \n';
        }
        console.log(text);
    }

    function Cell() {
        let element = null;
        let player = null;

        return {element, player};
    }

    function setCellPlayer(x,y,player) {
        gameBoard[x][y].player = player;        
        return checkForVictory(x,y);
    }

    function setCellElement(x,y,element) {
        gameBoard[x][y].element = element;   
    }

    function symbolsOnBoard() {
        symbols = [];
        for (let i = 0; i < boardSize;  i++) {
            symbols.push([]);
            for (let j = 0; j < boardSize; j++) {
                symbols[i][j] = gameBoard.symbol;
            }
        }
        return symbols;
    }

    return {resetGameBoard, isCellEmpty, printBoard, setCellPlayer, symbolsOnBoard, setCellElement}

};

//factory game
function Game () {
    const players = [];
    let playerTurnIdx = 0;

    const board = GameBoard();
    const displayContller = DisplayController();

    function createPlayers(player1name, player1symbol, player2name, player2symbol) {
        players[0] = Player(player1name, player1symbol, 0);
        players[1] = Player(player2name, player2symbol, 1);    
    }

    function Player(name, playerSymbol, playerTurnIdx) {
        let symbol = playerSymbol;  // allow players to choose from a set    
        let turnIdx = playerTurnIdx;
    
        return {name, symbol, turnIdx};
    }

    
    let turnCounter = 0; //to determine turn: turncounter // 2 -> player idx

    function playCell(x,y) {
        let player = players[determineTurn()];
        turnCounter++;

        if (!board.isCellEmpty(x,y, board)) {
            return;
        }
        
        let victoryCheck = board.setCellPlayer(x, y, player)
        
        if (victoryCheck){
            handleVictory(player);
        }
        
        board.printBoard();
    }

    function determineTurn(turnCounter) {
        let activePlayerIdx = turnCounter % 2;
        return activePlayerIdx;
    }

    function handleVictory(player) {
        console.log(`Player ${player.name} wins!`);
    }

    return {players, playerTurnIdx, determineTurn, playCell, createPlayers, board}
    
}




function DisplayController () {

    const p1nameInputElement = document.querySelector("#p1-name");
    const p1symbolElement = document.querySelector(".symbol.p1");
    const p2nameInputElement = document.querySelector("#p2-name");

    // TODO: Find selected symbol
    const p2symbolElement = document.querySelector(".symbol.p2");
    const boardContainerElement = document.querySelector(".game-board");
    
    function getInputValues() {
        const player1name = p1nameInputElement.value;
        const player1symbol = p1symbolElement.value;
        const player2name = p2nameInputElement.value;
        const player2symbol = p2symbolElement.value; // Insert as html into new cell

        return {player1name, player1symbol, player2name, player2symbol};
    }

    function drawBoard(boardSymbolsArray, setCellElement) {
        boardContainerElement.style.gridTemplateColumns = boardSize;
        boardContainerElement.style.gridTemplateRows = boardSize;

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                let cell = document.createElement("div");
                cell.onclick = () => game.playCell(i,j);
                cell.innerText = boardSymbolsArray[i][j];
                boardContainerElement.append(cell);
                setCellElement(i,j, cell);
            }
        }    
    }

    return {drawBoard, getInputValues}
}

document.addEventListener('DOMContentLoaded', function () {
    //instantiate displaycontroller
    window.display = displayController();
    window.game1 = display.newGame();
    window.abc = "test";
});