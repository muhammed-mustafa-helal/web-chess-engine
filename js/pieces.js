// base for all chess pieces
var ColorsEnum = Object.freeze({
    'BLACK': 0,
    'WHITE': 1
})

var PiecesEnum = Object.freeze({
    'NONE': 0,
    'PAWN': 1,
    'ROOK': 2,
    'KNIGHT': 3,
    'BISHOP': 4,
    'QUEEN': 5,
    'KING': 6
})

var Piece = function(row, col, type, color){
    this.row = row;
    this.col = col;
    this.type = type;
    this.color = color;
    this.isAlive = true;
}

Piece.prototype.removePiece = function(currentBoard){
    this.isAlive = false;
    if(this.color === ColorsEnum.WHITE){
        attackedWhitePieces.push(this);
    }
    else{
        attackedBlackPieces.push(this);
    }
    currentBoard[this.row][this.col] = null;
}

Piece.prototype.movePiece = function(move, currentBoard){
    currentBoard[this.row][this.col] = null;
    this.row = move.to[0];
    this.col = move.to[1];

    if(move.attack !== null)
        currentBoard[move.to[0]][move.to[1]].removePiece(currentBoard);
    
    currentBoard[this.row][this.col] = this;
}

Piece.prototype.undoMove = function(move, currentBoard){
    currentBoard[this.row][this.col] = null;
    
    this.row = move.from[0];
    this.col = move.from[1];

    currentBoard[this.row][this.col] = this;

    if(move.attack){
        currentBoard[move.to[0]][move.to[1]] = move.attack;
        move.attack.isAlive = true;
    }
}

Piece.prototype.getPieceDivID = function(){
    let row = String.fromCharCode('A'.charCodeAt() + this.row);
    let col = String(this.col);

    id = row + col;

    return id;
}

// Move class
var Move = function(from, to, piece, attack)
{
    this.from = from; // (x, y)
    this.to = to; // (x, y)
    this.piece = piece; // piece
    this.attack = attack // null => no attack, pieceAttacked otherwise
}

// Implement each Piece moves

/////////////////////////////////////////////// PAWN(Askary) //////////////////////////////////////////////////////
var Pawn = function(row, col, color){
    Piece.call(this, row, col, PiecesEnum.PAWN, color)
    
    this.image = 'assets/Pawn-White.png';
    if(this.color === ColorsEnum.BLACK)
        this.image = 'assets/Pawn-Black.png';    
}

Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.getValidMoves = function(currentBoard){
    let validMoves = [];
    
    if(this.color === ColorsEnum.WHITE){ // White Pawn
        // move 1 step forward
        if(this.row > 0 && currentBoard[this.row - 1][this.col] === null){ 
            let move = new Move([this.row, this.col],
                                [this.row - 1, this.col],
                                this,
                                null
                            );
            
            validMoves.push(move);
        }

        // move 2 steps forward
        if(this.row === 6 && currentBoard[this.row - 1][this.col] === null 
            && currentBoard[this.row - 2][this.col] === null) // not yet moved
        { 
            let move = new Move([this.row, this.col],
                [this.row - 2, this.col],
                this,
                null
            );
            validMoves.push(move);
        }

        // Attack other pieces
        for(let j = -1; j < 2; j += 2){
            if(this.col + j < 8 && this.col + j >= 0 && this.row > 0 && currentBoard[this.row - 1][this.col + j] !== null
               && currentBoard[this.row - 1][this.col + j].color !== this.color)
            {
     
                 let move = new Move([this.row, this.col],
                     [this.row - 1, this.col + j],
                     this,
                     currentBoard[this.row - 1][this.col + j]
                 );
                 validMoves.push(move);
             }
        }        
    }
    else{ // Black Pawn
        // move 1 step forward
        if(this.row < 7 && currentBoard[this.row + 1][this.col] === null){ // move 1 step forward
            let move = new Move([this.row, this.col],
                                [this.row + 1, this.col],
                                this,
                                null
                            );

            validMoves.push(move);
        }

         // move 2 steps forward
        if(this.row === 1 && currentBoard[this.row + 1][this.col] === null 
            && currentBoard[this.row + 2][this.col] === null) // not yet moved
        { 
            let move = new Move([this.row, this.col],
                [this.row + 2, this.col],
                this,
                null
            );

            validMoves.push(move);
        }

        // Attack other pieces
        for(let j = -1; j < 2; j += 2){
            if(this.col + j < 8 && this.col + j >= 0 && this.row < 7 && currentBoard[this.row + 1][this.col + j] !== null
               && currentBoard[this.row + 1][this.col + j].color !== this.color)
            {
     
                 let move = new Move([this.row, this.col],
                                    [this.row + 1, this.col + j],
                                    this,
                                    currentBoard[this.row + 1][this.col + j]
                 );
                 validMoves.push(move);
             }
        }        
    }

    return validMoves;
}

//////////////////////////////////////// ROOK(Tabya) ///////////////////////////////////////

var Rook = function(row, col, color){
    Piece.call(this, row, col, PiecesEnum.ROOK, color);

    this.image = 'assets/Rook-White.png';
    if(this.color === ColorsEnum.BLACK)
        this.image = 'assets/Rook-Black.png';
}

Rook.prototype = Object.create(Piece.prototype);

Rook.prototype.getValidMoves = function(currentBoard){
    let validMoves = [];

    let dr = [0, 0, 1,-1];
    let dc = [1,-1, 0, 0];

    let row, col;
    for(let i = 0; i < 4; i++){
        row = this.row;
        col = this.col;
        for(let j = 0; j < 8; j++){
            row += dr[i];
            col += dc[i];

            if(row < 0 || row >= 8 || col < 0 || col >= 8)
                break;
            
            if(currentBoard[row][col] === null){
                let move = new Move([this.row, this.col],
                                    [row, col],
                                    this,
                                    null);
                
                validMoves.push(move);
            }
            else{
                // attack enemy
                if(currentBoard[row][col].color !== this.color){
                    let move = new Move([this.row, this.col],
                                        [row, col],
                                        this,
                                        currentBoard[row][col]);
                    
                    validMoves.push(move);
                }                

                break;
            }

        }
    }

    return validMoves;
}

/////////////////////////////////////////// Knight(Hosan) /////////////////////////////////////////////

var Knight = function(row, col, color){
    Piece.call(this, row, col, PiecesEnum.KNIGHT, color);

    this.image = 'assets/Knight-White.png';
    if(this.color === ColorsEnum.BLACK)
        this.image = 'assets/Knight-Black.png';
}

Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.getValidMoves = function(currentBoard){
    let validMoves = [];

    let dr = [-2, -1, 1, 2, 2, 1, -1, -2];
    let dc = [ 1,  2, 2, 1,-1,-2, -2, -1];

    for(let i = 0; i < 8; i++){
        let row = this.row + dr[i];
        let col = this.col + dc[i];

        if(row < 0 || row >= 8 || col < 0 || col >= 8)
            continue;
        
        //empty cell
        if(currentBoard[row][col] === null){
            let move = new Move([this.row, this.col],
                                [row, col],
                                this,
                                null);
            validMoves.push(move);
        }
        //attack
        else if(currentBoard[row][col].color !== this.color){
            let move = new Move([this.row, this.col],
                                [row, col],
                                this,
                                currentBoard[row][col]);
            validMoves.push(move);
        }
    }

    return validMoves;
}

/////////////////////////////////////// Bishop(Feel) //////////////////////////////////////////////////

var Bishop = function(row, col, color){
    Piece.call(this, row, col, PiecesEnum.BISHOP, color);

    this.image = 'assets/Bishop-White.png';
    if(this.color === ColorsEnum.BLACK)
        this.image = 'assets/Bishop-Black.png';    
}

Bishop.prototype = Object.create(Piece.prototype);

Bishop.prototype.getValidMoves = function(currentBoard){
    let validMoves = [];

    let dr = [-1, -1, 1, 1];
    let dc = [ 1, -1, 1,-1];

    let row, col;
    for(let i = 0; i < 4; i++){
        row = this.row;
        col = this.col;
        for(let j = 0; j < 8; j++){
            row += dr[i];
            col += dc[i];

            if(row < 0 || row >= 8 || col < 0 || col >= 8)
                break;
            
            if(currentBoard[row][col] === null){
                let move = new Move([this.row, this.col],
                                    [row, col],
                                    this,
                                    null);
                
                validMoves.push(move);
            }
            else{
                // attack enemy
                if(currentBoard[row][col].color !== this.color){
                    let move = new Move([this.row, this.col],
                                        [row, col],
                                        this,
                                        currentBoard[row][col]);
                    
                    validMoves.push(move);
                }                

                break;
            }

        }
    }

    return validMoves;
}

/////////////////////////////////// Queen(Wazeer) //////////////////////////////////////////

var Queen = function(row, col, color){
    Piece.call(this, row, col, PiecesEnum.QUEEN, color);

    this.image = 'assets/Queen-White.png';
    if(this.color === ColorsEnum.BLACK)
        this.image = 'assets/Queen-Black.png';
}

Queen.prototype = Object.create(Piece.prototype);

Queen.prototype.getValidMoves = function(currentBoard){
    let validMoves = [];

    let dr = [-1, -1, 1, 1, 0, 0, 1, -1];
    let dc = [ 1, -1, 1,-1, 1,-1, 0,  0];

    let row, col;
    for(let i = 0; i < 8; i++){
        row = this.row;
        col = this.col;
        for(let j = 0; j < 8; j++){
            row += dr[i];
            col += dc[i];

            if(row < 0 || row >= 8 || col < 0 || col >= 8)
                break;
            
            if(currentBoard[row][col] === null){
                let move = new Move([this.row, this.col],
                                    [row, col],
                                    this,
                                    null);
                
                validMoves.push(move);
            }
            else{
                // attack enemy
                if(currentBoard[row][col].color !== this.color){
                    let move = new Move([this.row, this.col],
                                        [row, col],
                                        this,
                                        currentBoard[row][col]);
                    
                    validMoves.push(move);
                }                

                break;
            }

        }
    }

    return validMoves;
}

////////////////////////////////// King ///////////////////////////////////////////////////////

var King = function(row, col, color){
    Piece.call(this, row, col, PiecesEnum.KING, color);

    this.image = 'assets/King-White.png';
    if(this.color === ColorsEnum.BLACK)
        this.image = 'assets/King-Black.png';    
}

King.prototype = Object.create(Piece.prototype);

King.prototype.getValidMoves = function(currentBoard){
    let validMoves = [];

    let dr = [-1, -1, 1, 1, 0, 0, 1, -1];
    let dc = [ 1, -1, 1,-1, 1,-1, 0,  0];

    let row, col;

    for(let i = 0; i < 8; i++){
        row = this.row + dr[i];
        col = this.col + dc[i];

        if(row < 0 || row >= 8 || col < 0 || col >= 8)
            continue;
        
        if(currentBoard[row][col] === null){
            let move = new Move([this.row, this.col],
                                [row, col],
                                this,
                                null);
            
            validMoves.push(move);
        }
        else{
            // attack enemy
            if(currentBoard[row][col].color !== this.color){
                let move = new Move([this.row, this.col],
                                    [row, col],
                                    this,
                                    currentBoard[row][col]);
                
                validMoves.push(move);
            }                
        }

    }
    //console.log(validMoves);
    return validMoves;
}