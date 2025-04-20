import * as GEN from './Generator.js'
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth-50;
ctx.canvas.height = window.innerHeight-50;
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width,canvas.height);


let ratio = canvas.width / canvas.height;
let CELL_COUNT_X = 100
let CELL_COUNT_Y = Math.round(CELL_COUNT_X / ratio)


export let chunkNumberx = Math.floor(CELL_COUNT_X/GEN.chunkSize)
export let chunkNumbery = Math.floor(CELL_COUNT_Y/GEN.chunkSize)


let CELL_PIXEL_X = canvas.width / CELL_COUNT_X
let CELL_PIXEL_Y =  canvas.height / CELL_COUNT_Y

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
        CELL_COUNT_X = Math.min(Math.max(10, CELL_COUNT_X), 250);
        calculateCell_Pixel()
        drawMap()
})

function calculateCell_Pixel(){
    ratio = canvas.width/canvas.height
    CELL_COUNT_Y = Math.round(CELL_COUNT_X / ratio)
    CELL_PIXEL_X = canvas.width / CELL_COUNT_X
    CELL_PIXEL_Y = canvas.height / CELL_COUNT_Y

    chunkNumberx = Math.floor(CELL_COUNT_X/GEN.chunkSize)
    chunkNumbery = Math.floor(CELL_COUNT_Y/GEN.chunkSize)
}




function pixelPositionX(cellPositionInChunk,Chunk_pos_x){
    return Chunk_pos_x * GEN.chunkSize *CELL_PIXEL_X +((cellPositionInChunk % GEN.chunkSize) * CELL_PIXEL_X)

}
function pixelPositionY(cellPositionInChunk,Chunk_pos_y){
    return Chunk_pos_y * GEN.chunkSize * CELL_PIXEL_Y +( Math.floor(cellPositionInChunk/GEN.chunkSize)*CELL_PIXEL_Y)

}

function drawMap() {
    for (let chunkx = 0; chunkx <= chunkNumberx; chunkx++) {
        for (let chunky = 0; chunky <= chunkNumbery ; chunky++) {

            for(let cell = 0; cell <= GEN.chunkSize * GEN.chunkSize-1;cell++){

                

                if(GEN.ChunkList[chunkx][chunky][cell] == 0){
                    ctx.fillStyle = "#181c28";
                    ctx.fillRect(Math.ceil(pixelPositionX(cell,chunkx)),Math.ceil(pixelPositionY(cell,chunky)), Math.ceil(CELL_PIXEL_X),Math.ceil(CELL_PIXEL_Y)); 
                }else{
                    ctx.fillStyle = "#1969ff";
                    ctx.fillRect(Math.ceil(pixelPositionX(cell,chunkx)), Math.ceil(pixelPositionY(cell,chunky)),  Math.ceil(CELL_PIXEL_X), Math.ceil(CELL_PIXEL_Y));
                }

                if((cell+1) % GEN.chunkSize == 0 || cell >= GEN.chunkSize * GEN.chunkSize-1-GEN.chunkSize){
                    ctx.fillStyle = "#ff0000";
                    ctx.fillRect(Math.ceil(pixelPositionX(cell,chunkx)),Math.ceil(pixelPositionY(cell,chunky)), Math.ceil(CELL_PIXEL_X),Math.ceil(CELL_PIXEL_Y));
                }

            }
                        
        }
    }
}
    
    
//main
GEN.generateMap()
drawMap()

