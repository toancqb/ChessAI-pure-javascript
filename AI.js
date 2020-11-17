
class AI {
    
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.MOVE = {   originX: 0,
            originY: 0,
            targetX: 0, 
            targetY: 0  };
        this.moves = [];        
    }      

    MoveAI(game, board) {
        var i = this.MOVE.originX, j = this.MOVE.originY, x = this.MOVE.targetX, y = this.MOVE.targetY;
        
        if (game.preCondMovePiece(i,j,x,y)) {        
            var piece = board.cells[x][y].contain;
            
            board.simulation[x][y] = board.simulation[i][j];
            board.simulation[i][j] = '  ';

            if (piece) 
                removePieceFromLists(piece, this.board);
            
            board.cells[x][y].contain = board.cells[i][j].contain;
            board.cells[i][j].contain = null;
            piece = this.board.cells[x][y].contain;
            piece.setPosition(x, y);
            
            if (board.cells[x][y].en_passant) 
               game.enPassantMove(x, y);
            if (board.cells[x][y].castle_k || board.cells[x][y].castle_q) 
               game.castleMove(x, y);
            
            game.updateGlobal(x, y);

            if (game.isChecked(PLAYER_TYPE[1-game.TURN]) && game.isCheckMate(PLAYER_TYPE[1-game.TURN])) {
                alert("Congratualation!\n"+PLAYER[game.TURN] + " WIN!");
            }

            return true;
        } else {
            game.STAGE = 0;
            return false;
        } 
    }

    processSelectedS1AI(game, board, x, y) {
        this.moves = [];
        this.MOVE.originX = x;
        this.MOVE.originY = y;
        var piece = board.cells[x][y].contain;
        
        piece.move(board, x, y, this.moves);

        if (piece.key[1] == 'k')
            game.updatePreMoveCastle(x, y, this.moves);

        this.moves.forEach((function(p) {
            SelecteS1_BoardSimulation(board, p[0], p[1]);
            SelecteS1_Board(board, p[0], p[1], true);
        }));
        game.STAGE = 1;
    }
    
    /*SelectPieceAI(game, board, MOVE) {
        var piece = board.bpieces[getRandomInt(board.bpieces.length)];
        MOVE.originX = piece.x;
        MOVE.originY = piece.y;

        this.processSelectedS1AI(game, board, piece.x, piece.y);
        var pos = this.moves[getRandomInt(this.moves.length)];

        MOVE.targetX = pos[0];
        MOVE.targetY = pos[1];
    }*/

    
}