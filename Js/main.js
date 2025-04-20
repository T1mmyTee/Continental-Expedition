import * as GEN from './Generator.js'
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth-50;
ctx.canvas.height = window.innerHeight-50;
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width,canvas.height);

let lastColor = "#ffffff";

let ratio = canvas.width / canvas.height;
let CELL_COUNT_X = 500
let CELL_COUNT_Y = Math.round(CELL_COUNT_X / ratio)
let CHUNK_COUNT_X = CELL_COUNT_X/ GEN.chunkSize
let CHUNK_COUNT_Y = CELL_COUNT_Y/ GEN.chunkSize


let CELL_PIXEL_X = canvas.width / CELL_COUNT_X
let CELL_PIXEL_Y = canvas.height / CELL_COUNT_Y

window.addEventListener('resize', function(event){
    ctx.canvas.width  = window.innerWidth-50;
    ctx.canvas.height = window.innerHeight-50;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width,canvas.height); 
    
    calculateCell_Pixel()
    drawMap()
  });

window.addEventListener("wheel", (event) => {

        CELL_COUNT_X = CELL_COUNT_X + Math.round(event.deltaY * 0.1)
        CELL_COUNT_X = Math.min(Math.max(10, CELL_COUNT_X), 5000);

        calculateCell_Pixel()
        
        drawMap()
})

//to-do: Namen ändern
function calculateCell_Pixel(){
    ratio = canvas.width/canvas.height
    CELL_COUNT_Y = Math.round(CELL_COUNT_X / ratio)
    CELL_PIXEL_X = canvas.width / CELL_COUNT_X
    CELL_PIXEL_Y = canvas.height / CELL_COUNT_Y

    CHUNK_COUNT_X = CELL_COUNT_X/ GEN.chunkSize 
    CHUNK_COUNT_Y = CELL_COUNT_Y/ GEN.chunkSize
}




function pixelPositionX(cellPositionInChunk,Chunk_pos_x){
    let CC05 = CHUNK_COUNT_X/2
    let real_pos = Chunk_pos_x + Math.floor(CC05)
    let offset;

    offset = CELL_PIXEL_X * GEN.chunkSize * ( CC05-Math.floor(CC05) ); //für halbe chunks
   
    return real_pos * GEN.chunkSize *CELL_PIXEL_X +(cellPositionInChunk % GEN.chunkSize) * CELL_PIXEL_X +offset - GEN.chunkSize/2 *CELL_PIXEL_X

}
function pixelPositionY(cellPositionInChunk,Chunk_pos_y){
    let CC05 = CHUNK_COUNT_Y/2 
    let real_pos = Chunk_pos_y + Math.floor(CC05)
    let offset;
    
    offset = CELL_PIXEL_Y * GEN.chunkSize * ( CC05-Math.floor(CC05) ); //für halbe chunks

    return real_pos * GEN.chunkSize * CELL_PIXEL_Y + Math.floor((cellPositionInChunk) / GEN.chunkSize)*CELL_PIXEL_Y +offset - GEN.chunkSize/2 *CELL_PIXEL_Y

}

function drawMap() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width,canvas.height);
    let chunkx = -Math.ceil(CHUNK_COUNT_X/2) //ist nur begrenzung das eigentliche drawn macht pixelposition
    let chunkArray = GEN.ChunkList_posX_negY
    while(chunkx <= Math.ceil(CHUNK_COUNT_X/2)){ // solange ich unter oder gleich 5 bin
        let pchunkx = Math.abs(chunkx)


        if(chunkx < -GEN.ChunkGenDistance){chunkx++; continue;} // wenn ich kleiner bin als -10 dan kein draw
        if(chunkx > GEN.ChunkGenDistance){chunkx++; continue;} //wenn ich größer bin als 10 kein draw

        let chunky = -Math.ceil(CHUNK_COUNT_Y/2)
        while(chunky <= Math.ceil(CHUNK_COUNT_Y/2)){
            
            if(chunky < -GEN.ChunkGenDistance){chunky++;continue;}
            if(chunky > GEN.ChunkGenDistance){chunky++;continue;}

            //entscheide in welchem chunk-Array der chunk liegt
            if(chunkx >= 0 && chunky >= 0){
                chunkArray = GEN.ChunkList_posX_posY
            }else if(chunkx >= 0 && chunky < 0){
                chunkArray = GEN.ChunkList_posX_negY
            }else if(chunkx < 0 && chunky >= 0){
                chunkArray = GEN.ChunkList_negX_posY
            }else if(chunkx < 0 && chunky < 0){
                chunkArray = GEN.ChunkList_negX_negY
            }else{console.log("ERROR"+ chunkx +"|"+ chunky)}

            let pchunky = Math.abs(chunky)
            for(let cell = 0; cell <= GEN.chunkSize * GEN.chunkSize-1;cell++){

                fillCell(chunkArray,chunkx,chunky,cell,pchunkx,pchunky)
            }
            chunky++            
        }
        chunkx++
    }
}
 
function fillCell(chunkArray,chunkx,chunky,cell,pchunkx,pchunky){
    let pixelpositionX = Math.ceil(pixelPositionX(cell,chunkx))
    let pixelpositionY = Math.ceil(pixelPositionY(cell,chunky))

    let value = chunkArray[pchunkx][pchunky][cell]
    if(value === 0){
        color("#181c28")
        ctx.fillRect(pixelpositionX, pixelpositionY, Math.ceil(CELL_PIXEL_X),Math.ceil(CELL_PIXEL_Y)); 
    }else if(value === 2){
        color("#18ff28");
        ctx.fillRect(pixelpositionX, pixelpositionY, Math.ceil(CELL_PIXEL_X),Math.ceil(CELL_PIXEL_Y));
    }else{
        color("#1969ff")
        ctx.fillRect(pixelpositionX, pixelpositionY,  Math.ceil(CELL_PIXEL_X), Math.ceil(CELL_PIXEL_Y));
    }

    let x = cell % GEN.chunkSize;
    let y = Math.floor(cell / GEN.chunkSize);
    
    if (x === GEN.chunkSize -1 || y === GEN.chunkSize -1) {
        color("#ff0000")
        ctx.fillRect(pixelpositionX,pixelpositionY, Math.ceil(CELL_PIXEL_X),Math.ceil(CELL_PIXEL_Y));
    }
}

function color(newColor){
    if (newColor !== lastColor){
        ctx.fillStyle = newColor
        lastColor = newColor
    }
}
//main
GEN.generateAllChunks()
drawMap()

