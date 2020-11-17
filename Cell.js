
class Cell {
    constructor(context, x, y, piece, color, tcolor) {
        this.context = context;
        this.color = color;
        this.tcolor = tcolor;
        this.x = x;
        this.y = y;
        this.contain = piece;
        this.marked = false;
        this.threated = false;
        this.en_passant = false;
        this.castle_k = false;
        this.castle_q = false;
    }

    draw() {
        this.context.fillStyle = (!this.marked) ? this.color : this.tcolor;
        this.context.fillRect(this.y * SIZE, this.x * SIZE, SIZE, SIZE);
    }
}