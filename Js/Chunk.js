export class Chunk {
    constructor(X, Y, CellArray) {
        this.X = X;
        this.Y = Y;
        this.CellArray = CellArray
    }
    cell(x,y) {
        return this.CellArray[x][y]
    } 
    changeCell(x,y,value){
        this.CellArray[x][y] = value
    }
   
}