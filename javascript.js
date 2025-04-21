const boardSize = 3;
const rowForWIn = 3;
let display;

const game = (function Game () {
    const players = [Player(), Player()];
    let gameActive = false;
    let turnCounter = 0; //to determine turn: turncounter // 2 -> player idx

    const board = GameBoard();
    const displayController = DisplayController();

    function newGame() {
        [p1name, p1symbol, p2name, p2symbol] = displayController.getInputValues();
        if (p1name.length === 0 || p1symbol.length === 0 || p2name.length === 0 || p2symbol.length === 0) {
            alert("Not all inputs valid");
            return;
        }

        players[0].name = p1name;
        players[0].symbol = p1symbol;
        players[1].name = p2name;
        players[1].symbol = p2symbol;   
        
        gameActive = true;

        displayController.setFirstTurn();
        displayController.setUpInputListeners(players);
        displayController.drawBoard(board);
        
    }

    function Player() {
        let name = null;
        let symbol = null;  
        let turnIdx = null;
    
        return {name, symbol};
    }

    function playCell(x,y) {
        if (!gameActive) {
            alert("start a new game first, game is not active");
        }        
        
        let player = players[determineTurn()];
        turnCounter++;
        
        if (!board.isCellEmpty(x,y, board)) {
            return;
        }
        displayController.changeTurn(turnCounter);
        
        let victoryCheck = board.setCellPlayer(x, y, player)
        
        if (victoryCheck){
            handleVictory(player);
        }
        
        displayController.drawBoard(board);
    }

    function changeSymbol(element) {
        let player;
        
        if (element.classList.contains("p1")) {
            player = players[0];
        }else {
            player = players[1];
        }        
        player.symbol = element.innerHTML;
    }

    function determineTurn() {
        let activePlayerIdx = turnCounter % 2;        
        return activePlayerIdx;
    }

    function handleVictory(player) {
        console.log(`Player ${player.name} wins!`);
        gameActive = false;
    }

    function selectSymbol(element) {
        if (element.classList.contains("p1")) {
            players[0].symbol = element.innerHTML;
        }
        else {
            players[1].symbol = element.innerHTML;

        }

        displayController.selectSymbol(element);
        changeSymbol(element);
    }

    return {newGame, playCell, selectSymbol}
    
}) ();

//gameBoard module
function GameBoard (){    
    const gameBoard = (function() {
        const newBoard = Array(0);
        
        for (let i = 0; i < 3; i++) {
            let row = [Cell(),Cell(),Cell()];
            newBoard.push(row);        
        }
        return newBoard;
    })();

    function getCellSymbol(x,y) {        
        if (gameBoard[x][y].player != null && gameBoard[x][y].player.symbol != null) {
            return gameBoard[x][y].player.symbol;
        }
        return null;
    }

    function resetGameBoard() {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = Cell();
            }
        }
        
    }

    function isCellEmpty(x, y){
        if (gameBoard[x][y].player === null) {
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
        let emptyCheck = false;
        array.forEach(element => {
            if (typeof(element.player) === 'undefined' || element.player === null){
                emptyCheck = true;
            }
        });

        if(emptyCheck){
            return false;
        }

        for (let i = 1; i < array.length; i++) {
            if (array[i].player.name != array[i - 1].player.name) {
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
                if (gameBoard[i][j].player) {
                    symbol = 'x';
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
        let check = checkForVictory(x,y);
        return check;
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

    return {resetGameBoard, isCellEmpty, printBoard, setCellPlayer, symbolsOnBoard, setCellElement, getCellSymbol}

};

//factory game

function DisplayController () {
    let inputElements = {};

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            getInputReferences();
        })
    } else {
        getInputReferences();
    }

    function setFirstTurn(){
        inputElements["p1sidepanel"].classList.add("player-turn");
    }

    function changeTurn(){
        inputElements["p1sidepanel"].classList.toggle("player-turn");
        inputElements["p2sidepanel"].classList.toggle("player-turn");
    }
    
    function getInputReferences() {
        const p1name = document.querySelector("#p1-name");
        const p1symbol = document.querySelector(".p1.symbol-container"); // TODO: Find selected symbol
        const p2name = document.querySelector("#p2-name");
        const p2symbol = document.querySelector(".p2.symbol-container"); // TODO: Find selected symbol
        const boardContainer = document.querySelector(".game-board"); 
        const p1sidepanel = document.querySelector(".p1.side.left");
        const p2sidepanel = document.querySelector(".p2.side.right");
        inputElements = {p1name, p1symbol, p2name, p2symbol, boardContainer, p1sidepanel, p2sidepanel};    
    }

    function inputsValid() {
        const inputs = getInputValues();
        for (input of inputs) {
            if (!input) {
                return false;
            }
        }
        return true;
    }

    function debounce(callback, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => callback(...args), delay);
        };
    }

    function setUpInputListeners(players) {
        inputElements["p1name"].addEventListener("input", debounce((event) => {         
            players[0].name = event.target.value;
        }, 500));
        inputElements["p2name"].addEventListener("input", debounce((event) => {     
            players[1].name = event.target.value;
        }, 500));
    }
    
    function getInputValues() {
        const player1name = inputElements["p1name"].value;
        const player2name = inputElements["p2name"].value;
        
        // Symbol elements are parent containers, need to find .selected child in container
        if (!inputElements["p1symbol"].querySelector(":scope > .selected")) {
            player1symbol = null;
        }else {
            player1symbol = inputElements["p1symbol"].querySelector(":scope > .selected").innerHTML;
        }
        if (!inputElements["p2symbol"].querySelector(":scope > .selected")) {
            player2symbol = null;
        }else {
            player2symbol = inputElements["p2symbol"].querySelector(":scope > .selected").innerHTML;
        }
        
        return [player1name, player1symbol, player2name, player2symbol];
    }
    
    function selectSymbol(element) {
        const selectClass = "selected";
        
        const parent = element.parentElement;
        const children = parent.querySelectorAll(":scope > .selected");
        for (let i = 0; i < children.length; i++) {
            children[i].classList.toggle(selectClass);
        };
        element.classList.toggle(selectClass);
    }
    
    function drawBoard(board) {
        inputElements["boardContainer"].innerHTML = '';
        inputElements["boardContainer"].style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        inputElements["boardContainer"].style.gridTemplateRows = ` repeat(${boardSize}, 1fr)`;
        inputElements["boardContainer"].style.setProperty('--board-size', boardSize);
        
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                let cell = document.createElement("div");
                cell.onclick = () => game.playCell(i,j);
                cell.classList.add("cell");
                cell.innerHTML = board.getCellSymbol(i,j);
                inputElements["boardContainer"].append(cell);
                board.setCellElement(i,j, cell);
            }
        }    
    }
    return {drawBoard, getInputValues, selectSymbol, inputsValid, setUpInputListeners, changeTurn, setFirstTurn}
}