const EmptyCellRGB = "rgb(205, 193, 181)"
const game_screen = document.getElementById("game-screen");
const rows = [...game_screen.children];

const transitionTime = 200;
const MergeDuration = 400;
const MergeWaitDuration = 100

//Canvas element
const canvas = document.getElementById("canvas");
let keyLock = false;

class Block{
    #num;
    #rgb;
    #fontSize;

    constructor(num,rgb,fontSize){
        this.#num = num;
        this.#rgb = rgb;
        this.#fontSize = fontSize;
    };

    get_num(){
        return this.#num
    };

    get_rgb(){
        return this.#rgb
    };

    get_fontSize(){
        return this.#fontSize
    };
};
const Block2 = new Block(2,{r:238, g:228, b:218},50)
const Block4 = new Block(4,{r:236, g:224, b:202},50)
const Block8 = new Block(8,{r:242, g:177, b:121},50)
const Block16 = new Block(16,{r:245, g:149, b:101},50)
const Block32 = new Block(32,{r:245, g:124, b:95},50)
const Block64 = new Block(64,{r:246, g:93, b:59},50)
const Block128 = new Block(128,{r:237, g:206, b:113},50)
const Block256 = new Block(256,{r:237, g:204, b:99},50)
const Block512 = new Block(512,{r:236, g:200, b:808},50)
const Block1024 = new Block(1024,{r:239, g:197, b:63},40)
const Block2048 = new Block(2048,{r:238, g:194, b:46},40)
const Block4096 = new Block(4096,{r:132, g:17, b:167},40)
const Block8192 = new Block(8192,{r:255, g:0, b:212},40)

const BlockMap = {
    2: Block2, 4: Block4, 8: Block8, 16: Block16,
    32: Block32, 64: Block64, 128: Block128, 256: Block256,
    512: Block512, 1024: Block1024, 2048: Block2048, 4096: Block4096,
    8192: Block8192,    
}

class Piece{
    _block;
    _cellID
    _element;
    _isNew;
    
    constructor(num,cellNum,isNew){
        this.set_block(num);
        this._cellID = `cell${cellNum}`;
        this._element = document.getElementById(this._cellID);
        this._isNew = isNew;
    }

    draw(){
        if (this.get_element()) {
            let block = this.get_block();
            let {r,g,b} = block.get_rgb();
            let fontSize = block.get_fontSize();
            this.get_element().innerHTML = `${this.get_num()}`;
            this.get_element().style.backgroundColor = `rgb(${r},${g},${b})`;
            this.get_element().style.fontSize = `${fontSize}px`;
        }
    };

    set_isNew(){
        this._isNew = false;
    };

    get_isNew(){
        return this._isNew;
    }

    set_block(num){
        this._block = BlockMap[num]
    };

    get_num(){
        return this.get_block().get_num();
    };

    get_block(){
        return this._block
    };

    get_cellID(){
        return this._cellID
    };

    set_cellID(cellID){
        this._cellID = cellID
        this._element = document.getElementById(this._cellID)
    }

    get_element(){
        return this._element
    };

    set_element(){
        this._element = document.getElementById(this._cellID)
    }
};

class Game{
    cellDict;
    constructor(){
        this.cellDict =  {
            1:"", 2:"", 3:"",4:"",
            5:"", 6:"", 7:"",8:"",
            9:"",10:"",11:"",12:"",
            13:"",12:"",14:"",15:"",16:""
        };
        this.createPiece(4,11,false);
        this.createPiece(2,7,false);
        this.drawPieces();
    };

    createPiece(blockNum,cellNum,isNew){
        let newPiece = new Piece(blockNum,cellNum,isNew)
        this.cellDict[cellNum] = newPiece;
        return newPiece;
    };

    moveDown(){
        let movedPieces = [];
        let mergedPieces = [];

        let anyPiecesMoved = false;

        for (let i = rows.length - 1; i >= 0; i-- ){
            let row = rows[i]

            let cells = [...row.children]
            for (let j = 0 ; j < cells.length; j++) {
                let cellPosition = j + (i*4) + 1
                let newPiecePos,possibleMergePos,spacesMoved
                let piece = this.cellDict[cellPosition]

                if (piece){
             
                    let positions = this.moveOnePiece(cellPosition,4,1,16)  
            
                    newPiecePos = positions[0];
                    possibleMergePos = positions[1];
                    spacesMoved = positions[2];

                    let oldPieceElement = piece.get_element();

                    this.transferPiece(cellPosition,newPiecePos);

                    if (this.checkIfMergePossible(newPiecePos,possibleMergePos)) {
                        spacesMoved +=1
                    };

                    anyPiecesMoved = (spacesMoved>0)? true: anyPiecesMoved;

                    oldPieceElement.classList.add(`moveDown${spacesMoved}`);
                    oldPieceElement.parentElement.style.zIndex = -1*i + +1000;

                    let newPiece = this.mergePieces(newPiecePos,possibleMergePos);   

                    movedPieces.push([oldPieceElement,spacesMoved,newPiece,piece])

                    if (newPiece) {
                        mergedPieces.push([newPiece,spacesMoved])
                    };                       
                };
            };        
        };
        this.animate("Down",movedPieces,mergedPieces);
        return anyPiecesMoved
    };

    moveUp(){
        let movedPieces = [];
        let mergedPieces = [];
        let anyPiecesMoved = false;

        for (let i = 0; i < rows.length; i++){
            let row = rows[i]

            let cells = [...row.children]
            for (let j = 0 ; j < cells.length; j++) {
                let cellPosition = j + (i*4) + 1
                let newPiecePos,possibleMergePos,spacesMoved
                let piece = this.cellDict[cellPosition]

                if (piece){
                   
                    let positions = this.moveOnePiece(cellPosition,-4,1,16)      
                    newPiecePos = positions[0];
                    possibleMergePos = positions[1];
                    spacesMoved = positions[2];

                    let oldPieceElement = piece.get_element();

                    this.transferPiece(cellPosition,newPiecePos);
                 
                    if (this.checkIfMergePossible(newPiecePos,possibleMergePos)) {
                        spacesMoved +=1
                    };

                    anyPiecesMoved = (spacesMoved>0)? true: anyPiecesMoved;

                    oldPieceElement.classList.add(`moveUp${spacesMoved}`);
                    oldPieceElement.parentElement.style.zIndex = i +1000;

                    let newPiece = this.mergePieces(newPiecePos,possibleMergePos); 

                    movedPieces.push([oldPieceElement,spacesMoved,newPiece,piece]);  

                    if (newPiece) {
                        mergedPieces.push([newPiece,spacesMoved])
                    };               
                };
            };       
        };
        this.animate("Up",movedPieces,mergedPieces);
        return anyPiecesMoved;
    };
    
    moveRight(){
        let movedPieces = [];
        let mergedPieces = [];
        let anyPiecesMoved = false;

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            let cells = [...row.children]
            for (let j = cells.length - 1; j >= 0; j--) {
                let cell = cells[j];
                let cellPosition = j + (i*4) + 1;
                let newPiecePos,possibleMergePos,spacesMoved;
                let piece = this.cellDict[cellPosition];

                if (piece){
                    let lowerLimit = (i*4) + 1;
                    let upperLimit = (i*4) + 1 + 3;

                    let positions = this.moveOnePiece(cellPosition,1,lowerLimit,upperLimit);
                    newPiecePos = positions[0];
                    possibleMergePos = positions[1];
                    spacesMoved = positions[2];

                    let oldPieceElement = piece.get_element();

                    this.transferPiece(cellPosition,newPiecePos);

                    if (this.checkIfMergePossible(newPiecePos,possibleMergePos)) {
                        spacesMoved +=1
                    };

                    anyPiecesMoved = (spacesMoved>0)? true: anyPiecesMoved;
                    
                    oldPieceElement.classList.add(`moveRight${spacesMoved}`);
                    oldPieceElement.parentElement.style.zIndex = -1*j +1000;
                    let newPiece = this.mergePieces(newPiecePos,possibleMergePos);   

                    movedPieces.push([oldPieceElement,spacesMoved,newPiece,piece]);

                    if (newPiece) {
                        mergedPieces.push([newPiece,spacesMoved])
                    };                
                };
            };       
        };

        this.animate("Right",movedPieces,mergedPieces);
        return anyPiecesMoved;
    };

    moveLeft(){
        let movedPieces = [];
        let mergedPieces = [];
        let anyPiecesMoved = false;

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            let cells = [...row.children]
            for (let j = 0 ; j < cells.length; j++) {
                let cell = cells[j]
                let cellPosition = j + (i*4) + 1
                let newPiecePos,possibleMergePos,spacesMoved

                let piece = this.cellDict[cellPosition]

                if (piece){
                    let lowerLimit = (i*4) +1
                    let upperLimit = (i*4) +1+3

                    let positions = this.moveOnePiece(cellPosition,-1,lowerLimit,upperLimit) 
                    newPiecePos = positions[0];
                    possibleMergePos = positions[1]
                    spacesMoved = positions[2]

                    let oldPieceElement = piece.get_element();

                    this.transferPiece(cellPosition,newPiecePos);
                    
                    if (this.checkIfMergePossible(newPiecePos,possibleMergePos)) {     
                        spacesMoved +=1;
                    };

                    anyPiecesMoved = (spacesMoved>0)? true: anyPiecesMoved;
                    
                    oldPieceElement.classList.add(`moveLeft${spacesMoved}`);
                    oldPieceElement.parentElement.style.zIndex = j +1000;

                    let newPiece = this.mergePieces(newPiecePos,possibleMergePos);   
                    movedPieces.push([oldPieceElement,spacesMoved,newPiece,piece])
                    if (newPiece) {
                        mergedPieces.push([newPiece,spacesMoved])
                    };            
                };
            };       
        };
        this.animate("Left",movedPieces,mergedPieces);
        return anyPiecesMoved;
    };

    animate(direction,movedPieces,mergedPieces){

        mergedPieces.forEach(attributes => {
            let newPiece = attributes[0];
            let spacesMoved = attributes[1];
            setTimeout(() => {
                newPiece.get_element().classList.add("merge")
                setTimeout(() => {
                    newPiece.get_element().classList.remove('merge');
                }, MergeDuration );
                
            }, MergeWaitDuration*spacesMoved);
        });


        movedPieces.forEach(attributes => {
            let [pieceElement,spacesMoved,newPiece,piece] = attributes

            setTimeout(() => {
                pieceElement.classList.remove(`move${direction}${spacesMoved}`);
                pieceElement.parentElement.style.zIndex = 1;
                pieceElement.style.backgroundColor = "rgb(205, 193, 181)";
                pieceElement.innerHTML = ""
                

                if (newPiece) {
                    newPiece.draw();
                }
                else{
                    piece.draw()
                }                
            }, spacesMoved*transitionTime);
           
        });
    };

    moveOnePiece(cellPosition,cellInc,lowerLimit,upperLimit){
        let oneCellDifference = cellPosition+cellInc;
        let twoCellDifference = cellPosition+2*cellInc;
        let threeCellDifference = cellPosition+3*cellInc;

        let newPiecePos = cellPosition
        let possibleMergePos;

        let [move1,move2,move3] = [false,false,false]
        move1 = (lowerLimit<=oneCellDifference && oneCellDifference<=upperLimit && !this.cellDict[oneCellDifference])? true: false;
        move2 = (lowerLimit<=twoCellDifference && twoCellDifference<=upperLimit && !this.cellDict[twoCellDifference] && move1)? true: false;
        move3 = (lowerLimit<=threeCellDifference && threeCellDifference<=upperLimit && !this.cellDict[threeCellDifference] && move2)? true: false

        let spacesMoved = 0;
        if (move3) {
            newPiecePos = threeCellDifference;
            spacesMoved = 3
        }
        else if (move2){
            newPiecePos = twoCellDifference;
            spacesMoved = 2;
        } 
        else if (move1) {
            newPiecePos = oneCellDifference;
            spacesMoved = 1;
        }
    
        possibleMergePos = newPiecePos + cellInc

        if (possibleMergePos > upperLimit || possibleMergePos < lowerLimit) {
            possibleMergePos = -1000
        }
        return [newPiecePos, possibleMergePos,spacesMoved]
    };

    checkIfMergePossible(cellPos1,cellPos2){
        if (1<=cellPos2 && cellPos2<=16 && 1<=cellPos1 && cellPos1<=16){
            let piece1 = this.cellDict[cellPos1];
            let piece2 = this.cellDict[cellPos2];

            if (piece1 && piece2 && !piece1.get_isNew() && !piece2.get_isNew()) {
                     
                if (piece1.get_num() == piece2.get_num()) {
                    return true

                };
            };       
        };

        return false
    };
    
    mergePieces(cellPos1,cellPos2){

        if (1<=cellPos2 && cellPos2<=16 && 1<=cellPos1 && cellPos1<=16){
            let piece1 = this.cellDict[cellPos1];
            let piece2 = this.cellDict[cellPos2];

            if (piece1 && piece2 && !piece1.get_isNew() && !piece2.get_isNew()) {
                     
                if (piece1.get_num() == piece2.get_num()) {
                    let newNum = piece1.get_num() * 2
                    this.cellDict[cellPos1] = "";
                    this.cellDict[cellPos2] = "";
                    

                    return this.createPiece(newNum,cellPos2,true);
                };
            };       
        };
        return undefined;
    };

    transferPiece(oldPos,newPos){
        if (1<=oldPos && oldPos<=16 && 1<=newPos && newPos<=16){
            let tempPiece = this.cellDict[`${oldPos}`]
            tempPiece.set_cellID(`cell${newPos}`)
            this.cellDict[oldPos] = "";
            this.cellDict[newPos] =  tempPiece;
        };
    };

    drawPieces(){

        for (const [pos, piece] of Object.entries(this.cellDict)) {
            if (piece) piece.draw();
            
            else{
                let cell = document.getElementById(`cell${pos}`)

                cell.innerHTML = ``;
                cell.style.backgroundColor = EmptyCellRGB

            };
        };
    };

    setNewPieces(){

        for (const [pos, piece] of Object.entries(this.cellDict)) {
            if (piece)  piece.set_isNew();
        };
    };

    getEmptyCell(){
        let emptyCells = []
        for (const [pos, piece] of Object.entries(this.cellDict)) {
            if (!piece) emptyCells.push(pos);
        };
        return get_random(emptyCells);
    };

    hasGameEnded(){
        for (const [pos, piece] of Object.entries(this.cellDict)) {

            let below = this.cellDict[pos+4];
            let above = this.cellDict[pos-4];
            let left = this.cellDict[pos-1];
            let right = this.cellDict[pos+1];

            if (below == "" || above == "" || left == "" || right == "" || piece == "") return false;
            
            if (below && below.get_num() == piece.get_num()) return false;
            if (above && above.get_num() == piece.get_num()) return false;
            if (left  && left.get_num()  == piece.get_num()) return false;
            if (right && right.get_num() == piece.get_num()) return false;

        };
        return true;
    };

    restart(){
        this.cellDict =  {
            1:"", 2:"", 3:"",4:"",
            5:"", 6:"", 7:"",8:"",
            9:"",10:"",11:"",12:"",
            13:"",12:"",14:"",15:"",16:""
        };
        this.createPiece(4,11,false);
        this.createPiece(2,7,false);
        this.drawPieces();    }
};

function get_random (list) {
    return list[Math.floor((Math.random()*list.length))];
};

const game = new Game();


window.addEventListener("keydown",async (event)=>{

    let anyPiecesMoved = false;

    if (!keyLock) {
        switch (event.key) {
            case "w": case "ArrowUp":
                anyPiecesMoved = game.moveUp()
                game.setNewPieces();
                break;
        
            case "s": case "ArrowDown":
                anyPiecesMoved = game.moveDown()
                game.setNewPieces();
                break;
    
            case "a": case "ArrowLeft":
                anyPiecesMoved = game.moveLeft()
                game.setNewPieces();
                break;
    
            case "d": case "ArrowRight":
                anyPiecesMoved = game.moveRight()
                game.setNewPieces();
                break;
        }
        if (anyPiecesMoved) {
            game.createPiece(get_random([2,4]),game.getEmptyCell(),false)
        }

        keyLock = true;

        setTimeout(() => {
            keyLock = false;
            game.drawPieces()
            
        }, transitionTime*3.01);
        
    }
    if (game.hasGameEnded()){
        alert("Game ended")
    }
    
})