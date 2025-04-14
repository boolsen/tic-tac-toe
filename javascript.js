const boardSize = 3;
const rowForWIn = 3;

//factory game
function Game () {
    const players = Players();
    let playerTurnIdx = 0;

    function createPlayers() {
        console.log("set up creating players using player factory");
        
    }

    return {board, players, playerTurnIdx}
}

//gameBoard module
const GameBoard = (function (){    
    function initializeGameBoard(){
        const newBoard = Array(0);
        
        for (let i = 0; i < 3; i++) {
            let row = Array(3);
            row.fill(null);
            newBoard.push(row);        
        }
        return newBoard;
    }

    const board = initializeGameBoard();

    function resetGameBoard() {
        while (board.length > 0) {
            board.pop();
        }
        
    }

    function isCellEmpty(x, y){
        console.log(board);
        if (board[x][y] === null) {
            return true;
        }
        return false;
    }

    function playCell(x,y,playerId) {
        if (!isCellEmpty(x,y)) {
            return;
        }
        
        board[x][y] = playerId;

        if (checkForVictory(x,y)) {
            handleVictory(playerId);
        }
    }

    function checkForVictory(x,y){
        // check diagonal if x + y = even
        const xArray = [];
        for (let i = 0; i < boardSize; i ++) {
            xArray.push(board[x][i]);
        }
        if (checkArrayForWin(xArray)) {
            return true;
        }

        const yArray = [];
        for (let i = 0; i < boardSize; i ++) {
            xArray.push(board[i][y]);
        }
        if (checkArrayForWin(yArray)) {
            return true;
        }

        if (x + y === boardSize) {
            const posDiagonalArray = [];
            for (let i = 0; i < boardSize; i++) {
                posDiagonalArray.push(board[boardSize - 1 - i][i]);
            }
            if (checkArrayForWin(posDiagonalArray)) {
                return true;
            }
        }

        if (x === y) {
            const negDiagonalArray = [];
            for (let i = 0; i < boardSize; i++) {
                negDiagonalArray.push(board[i][i]);
            }
            if (checkArrayForWin(negDiagonalArray)) {
                return true;
            }
        }
    }

    function checkArrayForWin (array) {
        for (let i = 1; i < array.length; i++) {
            if (array[i] != array[i - 1]) {
                return false;
            }
        }
        return true;
    }

    function handleVictory(plyerId) {
        console.log("write function to handle victory");
    }

    return {resetGameBoard,playCell}

}) ();

function Player(name, id) {
        
    return {name, id};
}