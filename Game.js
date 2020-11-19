
class Game {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");        
        
        this.board = new Board(this.context);
        this.cboard = this.board.simulation;
        this.AI = new AI(this.canvas, this.context);
        this.TURN = 0;  // 0 = White / 1 = Black
        this.MOVE = {   originX: 0,
                        originY: 0,
                        targetX: 0, 
                        targetY: 0  };
        this.STAGE = 0;        
        this.debugMode = false;
        this.moves = [];        
    }

    handlerClick(that, e) {
        var elemLeft = that.canvas.offsetLeft + that.canvas.clientLeft;
        var elemTop = that.canvas.offsetTop + that.canvas.clientTop;
        var px = Math.floor((e.pageY - elemTop) / SIZE);
        var py = Math.floor((e.pageX - elemLeft)/ SIZE);

        if (that.debugMode)
            console.log(that.board.simulation[px][py], px, py);
            
        if (this.STAGE == 0 && this.preCondSelectedS1(px, py)) {
            this.processSelectedS1(this.board, px, py);
            if (this.debugMode)
                this.board.printBoardSimulation();
        }
        else if (this.STAGE == 1 && this.preCondSelectedS2(px, py)) {
            this.processSelectedS2(px, py);
            if (this.debugMode)
                this.board.printBoardSimulation();
        }
    }    

    init() {
        var that = this;
        this.canvas.addEventListener("click", (function(e) {
            that.handlerClick(that, e);
        }));
        
        this.board.printBoardSimulation();
        this.board.draw(true);
    }

    update() {
        this.context.clearRect(0,0,400,400);

        this.board.draw(true);
    }
/*
    handlerClickAI(that, e) {
        var elemLeft = that.canvas.offsetLeft + that.canvas.clientLeft;
        var elemTop = that.canvas.offsetTop + that.canvas.clientTop;
        var px = Math.floor((e.pageY - elemTop) / SIZE);
        var py = Math.floor((e.pageX - elemLeft)/ SIZE);

        if (that.debugMode)
            console.log(that.board.simulation[px][py], px, py);
        if (!this.TURN) {
            if (this.STAGE == 0 && this.preCondSelectedS1(px, py)) {
                this.processSelectedS1(this.board, px, py);
            if (this.debugMode)
                this.board.printBoardSimulation();
            }
            else if (this.STAGE == 1 && this.preCondSelectedS2(px, py)) {
                this.processSelectedS2(px, py);
                
                this.MoveAI();

                if (this.debugMode)
                    this.board.printBoardSimulation();
            }
        } 
    }
    
    initAI() {
        var that = this;
        this.canvas.addEventListener("click", (function(e) {
            that.handlerClickAI(that, e);
        }));
        
        this.board.printBoardSimulation();
        this.board.draw(true);
    }

    updateAI() {
        this.context.clearRect(0,0,400,400);

        this.board.draw(true);
    }

    MoveAI() {
        this.SelectPieceAI(this, this.board, this.MOVE);
        if (this.Move()) {
            this.clearPotentialMove(this.board);
            this.STAGE = 0;
            this.TURN = 1 - this.TURN;
            if (this.debugMode)
                console.log(this.MOVE);
        }
    }

    processSelectedS1AI(x, y) {
        var that = this;
        this.moves = [];
        this.MOVE.originX = x;
        this.MOVE.originY = y;
        var piece = this.board.cells[x][y].contain;
        
        piece.move(this.board, x, y, this.moves);

        if (piece.key[1] == 'k')
            this.updatePreMoveCastle(x, y, this.moves);

        this.moves.forEach((function(p) {
            SelecteS1_BoardSimulation(that.board, p[0], p[1]);
            SelecteS1_Board(that.board, p[0], p[1], true);
        }));
    }

    SelectPieceAI() {
        var bps = this.board.bpieces;
        do {
        do {
        var piece = bps[getRandomInt(bps.length)];
        this.MOVE.originX = piece.x;
        this.MOVE.originY = piece.y;

        this.processSelectedS1AI(piece.x, piece.y);
        var pos = this.moves[getRandomInt(this.moves.length)];
        } while (pos == undefined);

        this.MOVE.targetX = pos[0];
        this.MOVE.targetY = pos[1];
        
        } while (this.Move() == false);
        this.clearPotentialMove(this.board);
        this.STAGE = 0;
        this.TURN = 1 - this.TURN;
        if (this.debugMode)
            console.log(this.MOVE);
    }*/

    preCondSelectedS1(x, y) {
        var piece = this.board.cells[x][y].contain;
        if (piece != null) {
            if ((this.TURN == 0 && piece.type == WHITE) || (this.TURN == 1 && piece.type == BLACK)) {
                return true;
            }
        }
        return false;
    }

    preCondSelectedS2(x, y) {
        var piece = this.board.cells[x][y].contain;
        if (this.board.cells[x][y].marked == true)
            return true;
        else if (piece && ((this.TURN == 0 && piece.type == WHITE) || (this.TURN == 1 && piece.type == BLACK))) {
            this.clearPotentialMove(this.board);
            this.processSelectedS1(this.board, x, y);
            this.STAGE = 1;
            return false;
        }
        this.STAGE = 0;
        this.clearPotentialMove(this.board);
        return false;
    }

    isPositionChecked(p0, p1, p2, type) {
        var lstThreated = this.lstThreatedPosition(type);

        return (isPinLst(lstThreated ,[p0[0],p0[1]]) || isPinLst(lstThreated ,[p1[0],p1[1]]) || isPinLst(lstThreated ,[p2[0],p2[1]]));
    }

    updatePreMoveCastle(x, y, moves) {
        var type = (this.TURN == 0) ? WHITE : BLACK; 
        var board = this.board;
        if (board.CASTLE_K[this.TURN] && !board.cells[x][y+1].contain && !board.cells[x][y+2].contain 
            && !this.isPositionChecked([x,y],[x,y+1],[x,y+2],type)) {
            moves.push([x, y+2]);
            board.cells[x][y+2].castle_k = true;
        }
        if (board.CASTLE_Q[this.TURN] && !board.cells[x][y-1].contain && !board.cells[x][y-2].contain 
            && !board.cells[x][y-3].contain  && !this.isPositionChecked([x,y],[x,y-1],[x,y-2],type)) {
            moves.push([x, y-2]);
            board.cells[x][y-2].castle_q = true;
        }
    }

    processSelectedS1(board, x, y) {
        this.moves = [];
        this.MOVE.originX = x;
        this.MOVE.originY = y;
        var piece = board.cells[x][y].contain;
        
        piece.move(board, x, y, this.moves);

        if (piece.key[1] == 'k')
            this.updatePreMoveCastle(x, y, this.moves);

        this.moves.forEach((function(p) {
            SelecteS1_BoardSimulation(board, p[0], p[1]);
            SelecteS1_Board(board, p[0], p[1], true);
        }));
        this.STAGE = 1;
    }

    clearPotentialMove(board) {
        this.moves.forEach((function(p) {
            DeselecteS1_BoardSimulation(board, p[0], p[1]);
            SelecteS1_Board(board, p[0], p[1], false);
        }));
        this.moves = [];
    }

    processSelectedS2(x, y) {
        this.MOVE.targetX = x;
        this.MOVE.targetY = y;

        if (this.Move()) {
            this.clearPotentialMove(this.board);
            this.STAGE = 0;
            this.TURN = 1 - this.TURN;
        }
    }

    updateCondPawnEnPassant() {
        var c = (this.TURN == 0) ? -2 : 2;
        if (this.MOVE.targetY == this.MOVE.originY && this.MOVE.originX + c == this.MOVE.targetX) {
            this.board.EN_PASSANT[this.TURN][this.MOVE.targetY] = 2;
        } else {
            this.board.EN_PASSANT[this.TURN][this.MOVE.targetY] = 0;
        }
    }

    updateCondCastle(x, y) {
        if (this.board.cells[x][y].contain.key[1] == 'k') {
            this.board.CASTLE_K[this.TURN] = 0;
            this.board.CASTLE_Q[this.TURN] = 0;
        } else {
            if (y == 0) this.board.CASTLE_Q[this.TURN] = 0;
            if (y == 7) this.board.CASTLE_K[this.TURN] = 0;
        }
    }

    pawnBeQueen(x, y) {
        var piece = this.board.cells[x][y].contain;
        var key = this.board.simulation[x][y][0] + 'q';
        var px = (this.TURN == 0) ? 0 : 7;
        if ((this.TURN == 0 && x == px) || (this.TURN == 1 && x == px)) {
            removePieceFromLists(piece, this.board);

            var newPiece = new Queen(this.context, key, x, y);
            this.board.cells[x][y].contain = newPiece;
            this.board.simulation[x][y] = key;
            addPieceToLists(newPiece, this.board);
        }
    }

    updateGlobal(x, y) {
        var lstPawn = getLstPiece(this.board, 'p');
        var that = this;
        lstPawn.forEach((function(p) {
            if (that.board.EN_PASSANT[that.TURN][p[1]] > 0)
                that.board.EN_PASSANT[that.TURN][p[1]]--;
            if (that.board.EN_PASSANT[1-that.TURN][p[1]] > 0)
                that.board.EN_PASSANT[1-that.TURN][p[1]]--;
        }));
        if (this.board.cells[x][y].contain.key[1] == 'p') {
            this.updateCondPawnEnPassant();
            this.pawnBeQueen(x, y);
        }
        if (this.board.cells[x][y].contain.key[1] == 'r' || this.board.cells[x][y].contain.key[1] == 'k')
            this.updateCondCastle(x, y);
    }

    enPassantMove(x, y) {
        var t = (this.TURN == 0) ? 1 : -1;
        var piece = this.board.cells[x+t][y].contain;
        this.board.cells[x+t][y].contain = null;
        this.board.simulation[x+t][y] = '  ';
        if (piece)
            removePieceFromList(piece, this.board);
        this.board.cells[x][y].en_passant = false;
    }

    castleMove(x, y) {
        if (this.board.cells[x][y].castle_k) {
            this.board.cells[x][y-1].contain = this.board.cells[x][y+1].contain;
            this.board.cells[x][y+1].contain = null;
            this.board.cells[x][y-1].contain.setPosition(x, y-1);
            this.board.simulation[x][y-1] = this.board.simulation[x][y+1];
            this.board.simulation[x][y+1] = '  ';

            this.board.cells[x][y].castle_k = false;
            this.board.CASTLE_K[this.TURN] = 0;
        }
        if (this.board.cells[x][y].castle_q) {
            this.board.cells[x][y+1].contain = this.board.cells[x][y-2].contain;
            this.board.cells[x][y-2].contain = null;
            this.board.cells[x][y+1].contain.setPosition(x, y+1);
            this.board.simulation[x][y+1] = this.board.simulation[x][y-2];
            this.board.simulation[x][y-2] = '  ';

            this.board.cells[x][y].castle_q = false;
            this.board.CASTLE_Q[this.TURN] = 0;
        }
    }

    Move() {
        var i = this.MOVE.originX, j = this.MOVE.originY, x = this.MOVE.targetX, y = this.MOVE.targetY;
        
        if (this.preCondMovePiece(i,j,x,y)) {        
            var piece = this.board.cells[x][y].contain;
            
            this.board.simulation[x][y] = this.board.simulation[i][j];
            this.board.simulation[i][j] = '  ';

            if (piece) 
                removePieceFromLists(piece, this.board);
            
            this.board.cells[x][y].contain = this.board.cells[i][j].contain;
            this.board.cells[i][j].contain = null;
            piece = this.board.cells[x][y].contain;
            piece.setPosition(x, y);
            
            if (this.board.cells[x][y].en_passant) 
               this.enPassantMove(x, y);
            if (this.board.cells[x][y].castle_k || this.board.cells[x][y].castle_q) 
               this.castleMove(x, y);
            
            this.updateGlobal(x, y);

            if (this.isChecked(PLAYER_TYPE[1-this.TURN]) && this.isCheckMate(PLAYER_TYPE[1-this.TURN])) {
                var w = document.getElementById("winner");
                w.innerHTML = "PLAYER [" + PLAYER[this.TURN] + "] WIN!";
                // alert("Congratualation!\n"+PLAYER[this.TURN] + " WIN!");
            }

            return true;
        } else {
            this.STAGE = 0;
            return false;
        }
    } 

    lstThreatedPosition(type) {
        var lstThreated = [], tmpLst = [];
        var lst = (type == WHITE) ? this.board.bpieces : this.board.wpieces;
        for (var i = 0; i < lst.length; i++) {
            tmpLst = [];
            if (lst[i].key[1] == 'p') {
                tmpLst = createListThreatedForPawn(type, lst[i].x, lst[i].y);
            } else {
                lst[i].move(this.board, lst[i].x, lst[i].y, tmpLst);
            }
            tmpLst.forEach((function(p) {
                if (!isPinLst(lstThreated, p))
                    lstThreated.push(p);
            }));
        }
        return lstThreated;
    }

    isChecked(type) {
        var kp = getKingPosition(this.board, type);
        var lstThreated = this.lstThreatedPosition(type);

        return isPinLst(lstThreated ,kp);
    }
    
    preCondMovePiece(i, j, x, y) {
        this.clearPotentialMove(this.board);
        var piece1 = this.board.cells[i][j].contain;
        var piece2 = this.board.cells[x][y].contain;
        var type = piece1.type;

        if (piece2) 
            removePieceFromLists(piece2, this.board);         
        
        this.board.cells[x][y].contain = this.board.cells[i][j].contain;
        this.board.cells[i][j].contain = null;
        this.board.cells[x][y].contain.setPosition(x, y);
        
        var is_checked = this.isChecked(type);

        if (piece2)
            addPieceToLists(piece2, this.board);

        this.board.cells[x][y].contain = piece2;
        this.board.cells[i][j].contain = piece1;
        this.board.cells[i][j].contain.setPosition(i, j);
        return !is_checked;
    }

    isCheckMate(type) {
        var lst = (type == WHITE) ? this.board.wpieces : this.board.bpieces;
        var tmpLst;

        for (var i = 0; i < lst.length; i++) {
            tmpLst = [];
            lst[i].move(this.board, lst[i].x, lst[i].y, tmpLst);
            for (var j = 0; j < tmpLst.length; j++) {
                if (this.preCondMovePiece(lst[i].x, lst[i].y, tmpLst[j][0], tmpLst[j][1]))
                    return false;
            }
        }
        return true;
    }
 
}