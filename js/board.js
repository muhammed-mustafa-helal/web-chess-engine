
(function initBoard(){
    
    var board = document.getElementById('chessBoard');
    var isWhite = true;

    //draw squares
    for(let i = 0; i < 8; i++){
        squaresIDs[i] = new Array(8);
        boardPieces[i] = new Array(8);
        
        let row = String.fromCharCode('A'.charCodeAt() + i);
        
        for(let j = 0; j < 8; j++){
            let col = String(j);
            squaresIDs[i][j] = row + col;
            boardPieces[i][j] = null;
            
            square = document.createElement('div');
            square.id = squaresIDs[i][j];

            square.addEventListener('click', handleSelectedDiv);
            
            if(isWhite){
                square.classList.add('square', 'white');            
            }else{
                square.classList.add('square', 'black');
            }
            board.appendChild(square);
            isWhite = !isWhite;
        }
        isWhite = !isWhite;
    }
    
    function addPieces(){
         // Chess pieces locations
        for(let i = 0 ; i < 8; i++){
            boardPieces[6][i] = new Pawn(6, i, ColorsEnum.WHITE);
            boardPieces[1][i] = new Pawn(1, i, ColorsEnum.BLACK);
        }
        // Rooks 
        boardPieces[7][0] = new Rook(7, 0, ColorsEnum.WHITE);
        boardPieces[7][7] = new Rook(7, 7, ColorsEnum.WHITE);
        boardPieces[0][0] = new Rook(0, 0, ColorsEnum.BLACK);
        boardPieces[0][7] = new Rook(0, 7, ColorsEnum.BLACK);
        // Knights
        boardPieces[7][1] = new Knight(7, 1, ColorsEnum.WHITE);
        boardPieces[7][6] = new Knight(7, 6, ColorsEnum.WHITE);
        boardPieces[0][1] = new Knight(0, 1, ColorsEnum.BLACK);
        boardPieces[0][6] = new Knight(0, 6, ColorsEnum.BLACK);
        // Bishops
        boardPieces[7][2] = new Bishop(7, 2, ColorsEnum.WHITE);
        boardPieces[7][5] = new Bishop(7, 5, ColorsEnum.WHITE);
        boardPieces[0][2] = new Bishop(0, 2, ColorsEnum.BLACK);
        boardPieces[0][5] = new Bishop(0, 5, ColorsEnum.BLACK);
        // Queens
        boardPieces[7][3] = new Queen(7, 3, ColorsEnum.WHITE);
        boardPieces[0][3] = new Queen(0, 3, ColorsEnum.BLACK);
        // Kings
        boardPieces[7][4] = new King(7, 4, ColorsEnum.WHITE);
        boardPieces[0][4] = new King(0, 4, ColorsEnum.BLACK);;
    }

    function render(){
        // draw Pieces
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(boardPieces[i][j] === null)
                    continue;

                let imgTag = document.createElement('img');
                imgTag.src = boardPieces[i][j].image;

                let imageDiv = document.getElementById(boardPieces[i][j].getPieceDivID());
                //imageDiv.addEventListener('click', handleSelectedDiv);

                imageDiv.appendChild(imgTag);
            }
        }
    }

    addPieces();
    render();

    // white player starts
    currentTurn = 0;

    var inputDialog = document.getElementById('inputDialog');
    inputDialog.showModal();

})();

function numOfPlayersChange(){
    var numOfPlayers = document.querySelector("form").elements[0].value;

    var difficulty = document.getElementById("difficulty");
    
    if(numOfPlayers[0] == '2'){
        difficulty.style.display = "none";
    }
    else{
        difficulty.style.display = "block";
    }
}

function getUserInput(){
    console.log('Getting Input');
    var numOfPlayers = document.querySelector("form").elements[0].value;
    var difficulty   = document.querySelector("form").elements[1].value;

    // Play against the computer
    if(numOfPlayers[0] == '1'){
        isSinglePlayer = true;

        if(difficulty == 'Easy'){
            difficultyDepth = 1;
        }
        else if(difficulty == 'Medium'){
            difficultyDepth = 2;
        }
        else{
            difficultyDepth = 3;
        }
    }

    console.log(numOfPlayers);
    console.log(difficulty);
}