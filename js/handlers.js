
var selectedDiv = null;
var selectedPiece = null;
var selectedPieceValidMoves = {};
var Turn = [ColorsEnum.WHITE, ColorsEnum.BLACK];

// get the position of the div from its id
function getDivPosition(id){
    let row = id[0].charCodeAt(0) - 'A'.charCodeAt(0);
    let col = parseInt(id[1]);

    return [row, col];
}

function getDivID(row, col){
    let r = String.fromCharCode('A'.charCodeAt() + row);
    let c = String(col);

    id = r + c;

    return id;
}

function checkForCheckMate(currentBoard){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(currentBoard[i][j] === null || currentBoard[i][j].color === Turn[currentTurn])
                continue;
            
            let enemyValidMoves = currentBoard[i][j].getValidMoves(currentBoard);
            for(let k = 0; k < enemyValidMoves.length; k++){
                let move = enemyValidMoves[k]

                if(checkMoveValidity(currentBoard, move)){
                    return;
                }
            }
        }
    }
    console.log(currentBoard);
    setTimeout(function() { 
        alert('Player ' + (1 - currentTurn) + ' Won !!');
        location.reload();
    }, 500);
    //alert('Player ' + (1 - currentTurn) + ' Won !!');
    // reload page: restart the game
    //location.reload();
}

function checkMoveValidity(currentBoard, move){
    let allyKing;
    let enemies = [];
    // perform move
    move.piece.movePiece(move, currentBoard);
    
    // get an array of pieces of each color
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(currentBoard[i][j] === null)
                continue;
            
            if(currentBoard[i][j].color === move.piece.color){ // ally
                if(currentBoard[i][j].type === PiecesEnum.KING)
                    allyKing = currentBoard[i][j];
            }
            else{ // enemy
                enemies.push(currentBoard[i][j]);
            }
        }
    }
    // check if king will be under attack after this move
    for(let i = 0; i < enemies.length; i++){
        let enemy = enemies[i];
        let validMoves = enemy.getValidMoves(currentBoard);

        for(let j = 0; j < validMoves.length; j++){
            let enemyMove = validMoves[j];
            if(enemyMove.to[0] === allyKing.row && enemyMove.to[1] === allyKing.col){
                move.piece.undoMove(move, currentBoard);
                //console.log('INVALID: ' + move.to[0] + ' ' + move.to[1]);
                return false;
            }
        }
    }
    move.piece.undoMove(move, currentBoard);

    return true;
}

function removeSuggestedMoves(){
    for(divID in selectedPieceValidMoves){
        let div = document.getElementById(divID);
        div.classList.remove('suggestedMove');
    }
    selectedPieceValidMoves = {};
    selectedPiece = null;
}

// function handleComputerMove(){
//     performComputerMove(boardPieces);
//     render();
//     checkForCheckMate(boardPieces);
//     currentTurn = 1 - currentTurn;
// }

function handleSelectedDiv(){
    divPosition = getDivPosition(this.id);
    let row = divPosition[0];
    let col = divPosition[1];

    // click on square with no pieces selected
    if(selectedPiece === null && boardPieces[row][col] === null){
        //console.log('Empty square with no pieces selected');
        return;
    }    
    // no piece selected and wrong turn
    if(selectedPiece === null && Turn[currentTurn] !== boardPieces[row][col].color){
        //console.log('No Pieces selected and turn is incorrect');
        return;
    }
    
    // select same piece twice
    if(selectedPiece === boardPieces[row][col]){
        //console.log('Same piece selected');
        return;
    }
    // move piece to an empty cell
    if(selectedPiece && boardPieces[row][col] === null && (this.id in selectedPieceValidMoves)){
        //console.log('Moving to empty cell');
        let move = selectedPieceValidMoves[this.id];
        selectedPiece.movePiece(move, boardPieces);
        removeSuggestedMoves();
        render();
        // check if player won
        checkForCheckMate(boardPieces)
        currentTurn = 1 - currentTurn;

        if(isSinglePlayer)
            handleComputerMove();

        return;
    }

    // attack another piece
    if(selectedPiece && boardPieces[row][col] && boardPieces[row][col].color !== selectedPiece.color 
        && (this.id in selectedPieceValidMoves)){
        //console.log('Attacking enemy');
        let move = selectedPieceValidMoves[this.id];
        selectedPiece.movePiece(move, boardPieces);
        removeSuggestedMoves();
        render();
        // check if player won
        checkForCheckMate(boardPieces)
        currentTurn = 1 - currentTurn;

        if(isSinglePlayer)
            handleComputerMove();

        return;
    }
    // trying to attack, invalid move
    if(selectedPiece && boardPieces[row][col] && boardPieces[row][col].color !== selectedPiece.color){
        //console.log('Invalid attack');
        return;
    }
    
    removeSuggestedMoves();
    if(boardPieces[row][col] === null)
        return;

    // select current piece
    pieceValidMoves = boardPieces[row][col].getValidMoves(boardPieces);
    selectedDiv = boardPieces[row][col];
    for(let i = 0; i < pieceValidMoves.length; i++){
        let move = pieceValidMoves[i];
        if(!checkMoveValidity(boardPieces, move))
            continue;
        let divID = getDivID(move.to[0], move.to[1]);
        
        let div = document.getElementById(divID);
        div.classList.add('suggestedMove');
        selectedPieceValidMoves[divID] = move;
    }
    selectedPiece = boardPieces[row][col]; 
}

function render(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            // clear div contents
            let imageDiv = document.getElementById(getDivID(i, j));
            imageDiv.innerHTML = "";

            if(boardPieces[i][j] === null)
                continue;

            let imgTag = document.createElement('img');
            imgTag.src = boardPieces[i][j].image;
            imageDiv.appendChild(imgTag);
        }
    }
}