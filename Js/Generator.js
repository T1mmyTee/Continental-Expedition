import {seededRandom} from "./Seed.js"
import {chunkGenDistance, chunkSize, chunkBorder} from "./main.js";
import {Chunk} from "./Chunk.js"
//let rng = createSeededRandom(17)
const seed = 1
const ChunkList_posX_negY = [];
const ChunkList_posX_posY = [];
const ChunkList_negX_posY = [];
const ChunkList_negX_negY = [];
//var chunkSize = 50
//var chunkGenDistance = 10 //generiert x chunks in jede richtung in rechteckform gesamte fläche 2x*2x 


function generateChunkInPlane(vonx,bisx,vony,bisy,array,xvor,yvor){
   
    for (let x = vonx; x <= bisx ; x++) {
        const ChunkColumn = []
        for (let y = vony; y <= bisy; y++) {
            let coordx = x*xvor
            let coordy = y*yvor
            const myChunk = new Chunk(coordx,coordy,generateBaseCellArray())
            myChunk.changeCell(seededRandom(seed,coordx,coordy,0,0,chunkSize-1),seededRandom(seed,coordx,coordy,1,0,chunkSize-1),3)
            ChunkColumn.push(myChunk)
        }
        array.push(ChunkColumn)
    }
}
export function generateAllChunks(){
    generateChunkInPlane(0,chunkGenDistance,0,chunkGenDistance,ChunkList_posX_posY,1,1)
    generateChunkInPlane(1,chunkGenDistance+1,0,chunkGenDistance,ChunkList_negX_posY,-1,1)
    generateChunkInPlane(0,chunkGenDistance,1,chunkGenDistance+1,ChunkList_posX_negY,1,-1)
    generateChunkInPlane(1,chunkGenDistance+1,1,chunkGenDistance+1,ChunkList_negX_negY,-1,-1)
    
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
            if(chunkBorder === true && (x === 0 || y === 0 || x === chunkSize-1 || y === chunkSize-1)){ 
                cell = 2
            }/*else if(y % 2 === 0){
                cell = 3
            }*/else{
                cell = 1
            } 

            array.push(cell) 
        }
        baseCellArray.push(array)
    }
    return baseCellArray
}

function getChunkListAndPos(x,y,Chunkx,Chunky,cellx,celly){
    if (x >= 0 && y >= 0){
        return {Chunklist: ChunkList_posX_posY ,Cx: Chunkx,Cy: Chunky,Zx: cellx,Zy: celly}

    }else if (x < 0 && y >= 0){
        return {Chunklist: ChunkList_negX_posY,Cx: Math.abs(Chunkx+1),Cy: Chunky,Zx: cellx,Zy: celly}

    }else if (x >= 0 && y < 0){
        return {Chunklist: ChunkList_posX_negY,Cx: Chunkx,Cy: Math.abs(Chunky+1),Zx: cellx,Zy: celly}

    }else if (x < 0 && y < 0){
        return {Chunklist: ChunkList_negX_negY,Cx: Math.abs(Chunkx+1),Cy: Math.abs(Chunky+1),Zx: cellx,Zy: celly}

    }else{
        console.log("error")
    }
}

export function orderCellData(CELL_COUNT_X,CELL_COUNT_Y){
    let Snap = []
    console.log(CELL_COUNT_X+" "+CELL_COUNT_Y)
    for (let y = Math.ceil((CELL_COUNT_Y)/2); y > -Math.ceil((CELL_COUNT_Y+1)/2);y--){

        let Chunky = Math.floor(y / chunkSize)
        let celly = (y % chunkSize + chunkSize) % chunkSize

        for (let x = -Math.ceil((CELL_COUNT_X)/2); x < Math.ceil((CELL_COUNT_X+1)/2);x++){

            let Chunkx = Math.floor(x / chunkSize)
            let cellx = (x % chunkSize + chunkSize) % chunkSize

            let ChLiPo = getChunkListAndPos(x,y,Chunkx,Chunky,cellx,celly)

            if (ChLiPo.Chunklist[ChLiPo.Cx] === undefined || ChLiPo.Chunklist[ChLiPo.Cx][ChLiPo.Cy] === undefined){
                Snap.push(0)
            }else{
                Snap.push(ChLiPo.Chunklist[ChLiPo.Cx][ChLiPo.Cy].cell(ChLiPo.Zx,ChLiPo.Zy))
            }
        }
    }
    return {Snap}
}