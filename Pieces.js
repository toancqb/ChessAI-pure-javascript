

class Piece {
    constructor (context, key, x, y) {
        if (this.constructor == Piece) {
            throw new Error("Abstract Piece!");
        }
        this.context = context;
        this.key = key;
        this.img = resources.get(SRC_PIECES[key]);
        this.x = x;
        this.y = y;
        this.type = key[0];
    }

    draw() {
        this.context.drawImage(this.img, this.y * SIZE, this.x * SIZE);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        throw new Error("move() must be implemented");
    }

    defaultLoopMove(board, px, py, cells, moves) {
        var that = this;
        cells.forEach((function(c) {
            var x = px+c[0], y = py+c[1];
            while (preCondCoord(x,y) && board.cells[x][y].contain == null) {
                moves.push([x,y]);
                x += c[0];
                y += c[1];
            }
            if (preCondCoord(x,y) && board.cells[x][y].contain && board.cells[x][y].contain.type != that.type) {
                moves.push([x,y]);
            }
        }));
    }
    
    defaultOnceMove(board, px, py, cells, moves) {
        var that = this;
        cells.forEach((function(c) {
            var x = px + c[0], y = py + c[1];
            if (preCondCoord(x, y)) {
                if (board.cells[x][y].contain == null) {
                    moves.push([x,y]);
                }
                else if (board.cells[x][y].contain && board.cells[x][y].contain.type != that.type) {
                    moves.push([x,y]);
                }
            }
        }));
    }

}

class Pawn extends Piece {
    constructor(context, key, x, y) {
        super(context, key, x, y);
    }

    move(board, x, y, moves) {
        var pInit = 6, z = -1, op = BLACK;
    if (this.type == BLACK) {
        pInit = 1; z = 1; op = WHITE;
    }
    var k = x + z;
    if (x == pInit) {        
        if (board.cells[k][y].contain == null) {
            if (board.cells[k+z][y].contain == null) {                
                moves.push([k,y]);
                moves.push([k+z,y]);
            }
            else {
                moves.push([k, y]);
            }
        }
    } else if (preCondCoord(k, y) && board.cells[k][y].contain == null) 
        moves.push([k, y]);
    var cc = [-1,1];
    var t = (op == WHITE) ? 0 : 1;
    cc.forEach((function(c) {
        if (preCondCoord(k, y+c) && board.cells[k][y+c].contain && board.cells[k][y+c].contain.type != board.cells[x][y].contain.type) {
            moves.push([k, y+c]);
        }

        if (preCondCoord(k, y+c) && preCondCoord(x, y+c) && board.cells[x][y+c].contain && board.cells[x][y+c].contain.type == op 
        && board.cells[k][y+c].contain == null && board.EN_PASSANT[t][y+c]) {
            moves.push([k, y+c]);
            board.cells[k][y+c].en_passant = true;
        }
    }));

    }
}

class Rook extends Piece {
    constructor(context, key, x, y) {
        super(context, key, x, y);
    }

    move(board, x, y, moves) {
        var cells = [[-1,0],[1,0],[0,-1],[0,1]];
        this.defaultLoopMove(board,x,y,cells, moves);
    }
}

class Knight extends Piece {
    constructor(context, key, x, y) {
        super(context, key, x, y);
    }

    move(board, x, y, moves) {
        var cells = [[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]];
        this.defaultOnceMove(board,x,y,cells, moves);
    }
}

class Bishop extends Piece {
    constructor(context, key, x, y) {
        super(context, key, x, y);
    }

    move(board, x, y, moves) {
        var cells = [[-1,-1],[-1,1],[1,-1],[1,1]];
        this.defaultLoopMove(board,x,y,cells, moves);
    }
}

class Queen extends Piece {
    constructor(context, key, x, y) {
        super(context, key, x, y);
    }

    move(board, x, y, moves) {
        var cells = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
        this.defaultLoopMove(board,x,y,cells, moves);
    }
}

class King extends Piece {
    constructor(context, key, x, y) {
        super(context, key, x, y);
    }

    move(board, x, y, moves) {
        var cells = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];       
        this.defaultOnceMove(board,x,y,cells, moves);
    }
}