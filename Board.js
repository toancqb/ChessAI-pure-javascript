
class Board {
    constructor(context) {
        this.context = context;
        this.simulation = BOARD;
        this.pieces = [];
        this.bpieces = [];
        this.wpieces = [];
        this.cells = this.initCells();
        this.EN_PASSANT = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        this.CASTLE_K = [1,1]; // 0 = White / 1 = Black
        this.CASTLE_Q = [1,1]; // 0 = White / 1 = Black
    }

    initCells() {
        var cells = [];
        var tmp = [], color, tcolor, piece;
        for (var i = 0; i < 8; i++) {
            tmp = [];
            for (var j = 0; j < 8; j++) {
                color = ((i+j)%2) ? COLOR_ORANGE : COLOR_WHITE;
                tcolor = ((i+j)%2) ? COLOR_GRIS : COLOR_LIGHTGRIS;
                piece = (this.simulation[i][j] == '  ') ? null : this.initPiece(this.context,this.simulation[i][j], i, j);
                tmp.push(new Cell(this.context, i, j, piece, color, tcolor));
                if (piece) {
                    this.pieces.push(piece);
                    if (piece.type == WHITE)
                        this.wpieces.push(piece);
                    else if (piece.type == BLACK)
                        this.bpieces.push(piece);
                }
            }
            cells.push(tmp);
        }
        return cells;
    }

    initPiece(context, key, x, y) {
        switch(key[1]) {
            case 'p':
                return new Pawn(context, key, x, y); 
            case 'r':
                return new Rook(context, key, x, y); 
            case 'n':
                return new Knight(context, key, x, y); 
            case 'b':
                return new Bishop(context, key, x, y); 
            case 'q':
                return new Queen(context, key, x, y); 
            case 'k':
                return new King(context, key, x, y); 
            default:
                return null;
        }
    }
    
    printBoardSimulation() {
        for (var i = 0; i < 8; i++) {
            console.log(this.simulation[i]);
        }
    }

    draw(flag) {
        for (var i = 0; i < 8; i++) 
            for (var j = 0; j < 8; j++) {
                this.cells[i][j].draw();
                if (flag && this.cells[i][j].contain != null) {
                    this.cells[i][j].contain.draw();
                }
        }
    }
}