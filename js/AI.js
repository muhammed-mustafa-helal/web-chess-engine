
var infinity = 1000000;

function handleComputerMove(){
    performComputerMove(boardPieces);
    render();
    checkForCheckMate(boardPieces);
    currentTurn = 1 - currentTurn;
}

function evaluatePiece(piece){
    if(piece === null)
        return 0;
    
    let evaluation = 0;

    if(piece.type === PiecesEnum.PAWN){
        evaluation = 10 + (piece.color === ColorsEnum.WHITE ? 
            pawnEvalWhite[piece.row][piece.col] : pawnEvalBlack[piece.row][piece.col]);
    }
    else if(piece.type === PiecesEnum.ROOK){
        evaluation = 50 + (piece.color === ColorsEnum.WHITE ?
            rookEvalWhite[piece.row][piece.col] : rookEvalBlack[piece.row][piece.col]);
    }
    else if(piece.type === PiecesEnum.KNIGHT){
        evaluation = 30 + (piece.color === ColorsEnum.WHITE ? 
            knightEval[piece.row][piece.col] : knightEval[piece.row][piece.col]);
    }
    else if(piece.type === PiecesEnum.BISHOP){
        evaluation = 30 + (piece.color === ColorsEnum.WHITE ? 
            bishopEvalWhite[piece.row][piece.col] : bishopEvalBlack[piece.row][piece.col]);
    }
    else if(piece.type === PiecesEnum.QUEEN){
        evaluation = 900 + (piece.color === ColorsEnum.WHITE ? 
            evalQueen[piece.row][piece.col] : evalQueen[piece.row][piece.col]);
    }
    else if(piece.type === PiecesEnum.KING){
        evaluation = 90 + (piece.color === ColorsEnum.WHITE ? 
            kingEvalWhite[piece.row][piece.col] : kingEvalBlack[piece.row][piece.col]);
    }

    if(piece.color === ColorsEnum.WHITE)
        evaluation = -evaluation;

    return evaluation;
}

function evaluateBoard(currentBoard){
    let boardEvalution = 0;

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            boardEvalution += evaluatePiece(currentBoard[i][j]);
        }
    }
    //console.log('Board Eval: ' + boardEvalution);

    return boardEvalution;
}

function performComputerMove(currentBoard){
    let move = miniMaxAlgorithm(currentBoard, 0, -infinity, infinity, true)[1];

    if(move)
        move.piece.movePiece(move, currentBoard);
}

// computer will take the black color
function miniMaxAlgorithm(currentBoard, depth, alpha, beta, isMax){
    if(depth === difficultyDepth){
        return [evaluateBoard(currentBoard)];
    }

    var whitePieces = [], 
        blackPieces = [];

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(currentBoard[i][j] === null)
                continue;
            
            if(currentBoard[i][j].color === ColorsEnum.BLACK)
                blackPieces.push(currentBoard[i][j]);
            else
                whitePieces.push(currentBoard[i][j]);
        }
    }
    let bestMove = isMax? [alpha, null] : [beta, null];

    if(isMax){
        // pieces
        for(let i = 0; i < blackPieces.length; i++){
            let pieceMoves = blackPieces[i].getValidMoves(currentBoard);
            // move of each piece
            for(let j = 0; j < pieceMoves.length; j++){
                let move = pieceMoves[j];
                if(!checkMoveValidity(currentBoard, move))
                    continue;
                
                blackPieces[i].movePiece(move, currentBoard);
                
                let retVal = miniMaxAlgorithm(currentBoard, depth + 1, alpha, beta, !isMax);                

                if(retVal[0] > alpha){
                    alpha = retVal[0];
                    bestMove = [alpha, move];
                }
                if(alpha >= beta){
                    blackPieces[i].undoMove(move, currentBoard);
                    return bestMove;
                }
                //alpha = Math.max(alpha, retVal[0]);

                blackPieces[i].undoMove(move, currentBoard);
            }
        }
    }
    else{
        for(let i = 0; i < whitePieces.length; i++){
            let pieceMoves = whitePieces[i].getValidMoves(currentBoard);
            // move of each piece
            for(let j = 0; j < pieceMoves.length; j++){
                let move = pieceMoves[j];
                if(!checkMoveValidity(currentBoard, move))
                    continue;
                
                whitePieces[i].movePiece(move, currentBoard);

                let retVal = miniMaxAlgorithm(currentBoard, depth + 1, alpha, beta, !isMax);

                // check for pruning
                if(retVal[0] < bestMove[0]){
                    beta = retVal[0];
                    bestMove = [beta, move];
                }
                if(alpha >= beta){
                    whitePieces[i].undoMove(move, currentBoard);
                    return bestMove;
                }
                //beta = Math.min(beta, retVal[0]);

                whitePieces[i].undoMove(move, currentBoard);
            }

        }
    }

    // console.log(bestMove);
    // console.log('');
    return bestMove;
}

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = pawnEvalWhite.slice().reverse();

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = bishopEvalWhite.slice().reverse();

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = rookEvalWhite.slice().reverse();

var evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = kingEvalWhite.slice().reverse();
