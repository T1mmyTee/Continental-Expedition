import {seededRandom} from "./Seed.js"
import {ChunkGenDistance, chunkSize} from "./main.js";
import {Chunk} from "./Chunk.js"
//let rng = createSeededRandom(17)


const ChunkList_posX_negY = [];
const ChunkList_posX_posY = [];
const ChunkList_negX_posY = [];
const ChunkList_negX_negY = [];
//var chunkSize = 50
//var ChunkGenDistance = 10 //generiert x chunks in jede richtung in rechteckform gesamte fläche 2x*2x 


function generateChunkInPlane(vonx,bisx,vony,bisy,array,xvor,yvor){
   
    for (let x = vonx; x <= bisx ; x++) {
        const ChunkColumn = []
        for (let y = vony; y <= bisy; y++) {
            let coordx = x*xvor
            let coordy = y*yvor
            const myChunk = new Chunk(coordx,coordy,generateBaseCellArray())
            myChunk.changeCell(seededRandom(coordx,coordy,0,0,chunkSize-1),seededRandom(coordx,coordy,1,0,chunkSize-1),3)
            ChunkColumn.push(myChunk)
        }
        array.push(ChunkColumn)
    }
}
export function generateAllChunks(){
    generateChunkInPlane(0,ChunkGenDistance,0,ChunkGenDistance,ChunkList_posX_posY,1,1)
    generateChunkInPlane(1,ChunkGenDistance+1,0,ChunkGenDistance,ChunkList_negX_posY,-1,1)
    generateChunkInPlane(0,ChunkGenDistance,1,ChunkGenDistance+1,ChunkList_posX_negY,1,-1)
    generateChunkInPlane(1,ChunkGenDistance+1,1,ChunkGenDistance+1,ChunkList_negX_negY,-1,-1)
    
}
export function clearGeneration(){
    ChunkList_posX_negY.length = 0;
    ChunkList_negX_posY.length = 0;
    ChunkList_posX_posY.length = 0;
    ChunkList_negX_negY.length = 0;
}
function generateBaseCellArray(){
    const baseCellArray = []
    for (let x = 0; x < chunkSize ; x++) {
        const array = []
        for (let y = 0; y < chunkSize ; y++) {
            let cell = 0
            if(x  === 0 || y === 0 || x === chunkSize-1 || y == chunkSize-1){ 
                cell = 2
            }else{
                cell = 1
            } 

            array.push(cell) 
        }
        baseCellArray.push(array)
    }
    return baseCellArray
}

export function orderCellData(CELL_COUNT_X,CELL_COUNT_Y){
    let Snap_posX_posY = []
    let Snap_posX_negY = []
    let Snap_negX_posY = []
    let Snap_negX_negY = []
    for (let y = 0; y <= Math.floor((CELL_COUNT_Y+1)/2);y++){
        for (let x = 0; x <= Math.floor((CELL_COUNT_X+1)/2);x++){

            let Chunkx = Math.floor(x / chunkSize)
            let Chunky = Math.floor(y / chunkSize)
            let cellx = (x % chunkSize)
            let celly = (y % chunkSize)

            
            if (ChunkList_posX_posY[Chunkx] === undefined || ChunkList_posX_posY[Chunkx][Chunky] === undefined){
                Snap_posX_posY.push(0)
            }else{
                
                
                Snap_posX_posY.push(ChunkList_posX_posY[Chunkx][Chunky].cell(cellx,celly))
            }
            
            if (ChunkList_negX_posY[Chunkx] === undefined || ChunkList_negX_posY[Chunkx][Chunky] === undefined){
                Snap_negX_posY.push(0)
            }else{
                Snap_negX_posY.push(ChunkList_negX_posY[Chunkx][Chunky].cell(chunkSize-1-cellx,celly))
            }

            if (ChunkList_posX_negY[Chunkx] === undefined || ChunkList_posX_negY[Chunkx][Chunky] === undefined){
                Snap_posX_negY.push(0)
            }else{
                Snap_posX_negY.push(ChunkList_posX_negY[Chunkx][Chunky].cell(cellx,chunkSize-1-celly))
            }

            if (ChunkList_negX_negY[Chunkx] === undefined || ChunkList_negX_negY[Chunkx][Chunky] === undefined){
                Snap_negX_negY.push(0)
            }else{
                Snap_negX_negY.push(ChunkList_negX_negY[Chunkx][Chunky].cell(chunkSize-1-cellx,chunkSize-1-celly))
            }
        }
    }

    return {Snap_posX_posY, Snap_negX_posY ,Snap_posX_negY, Snap_negX_negY}
}