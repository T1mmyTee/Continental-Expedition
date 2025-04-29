import {seededRandom} from "./Seed.js"
import {chunkGenDistance, chunkSize, chunkBorder, travelDist, seed} from "./main.js";
import {Chunk} from "./Chunk.js"
//let rng = createSeededRandom(17)
const ChunkList_posX_negY = [];
const ChunkList_posX_posY = [];
const ChunkList_negX_posY = [];
const ChunkList_negX_negY = [];
//var chunkSize = 50
//var chunkGenDistance = 10 //generiert x chunks in jede richtung in rechteckform gesamte fläche 2x*2x 

function calculateSign(dim,vor){
    return vor === 1 ? dim : -(dim+1)
}

function checkForChunk(x,y,ChunkList){
    if (!ChunkList[x] || !ChunkList[x][y]){
        return null
    }else{
        return ChunkList[x][y]
    }
}

function generateChunk(x,y){
    const myChunk = new Chunk(x,y,generateBaseCellArray())
    myChunk.changeCell(seededRandom(seed,x,y,0,0,chunkSize-1),seededRandom(seed,x,y,1,0,chunkSize-1),3)
    return myChunk
}
function findChunkList(x,y){
    let ChunkList = 0
    if (x >= 0 && y >= 0){
        ChunkList = ChunkList_posX_posY
    }else if (x < 0 && y >= 0){
        ChunkList = ChunkList_negX_posY
    }else if (x >= 0 && y < 0){
        ChunkList = ChunkList_posX_negY
    }else if (x < 0 && y < 0){
        ChunkList = ChunkList_negX_negY
    }else{
        console.log("error")
    }
    return ChunkList
}
function findChunkListCoords(ChunkList,x,y){
    if (ChunkList === ChunkList_posX_posY){
        return {x: x,y: y}
    }else if (ChunkList === ChunkList_negX_posY){
        return {x: Math.abs(x+1),y: y}
    }else if (ChunkList === ChunkList_posX_negY){
        return {x: x,y: Math.abs(y+1)}
    }else if (ChunkList === ChunkList_negX_negY){
        return {x: Math.abs(x+1),y: Math.abs(y+1)}
    }else{
        console.log("error")
    }
}
function fitInChunkList(myChunk,ChunkList,coords){
    if (ChunkList[coords.x] == null){
        ChunkList[coords.x] = []
    }
    ChunkList[coords.x][coords.y] = myChunk

}
export function generateAllChunks(){
    let offsetX = Math.floor(travelDist[0]/chunkSize)
    let offsetY = Math.floor(travelDist[1]/chunkSize)
    for (let x = -chunkGenDistance+offsetX; x <= chunkGenDistance+offsetX ; x++) {
        for (let y = -chunkGenDistance+offsetY ; y <= chunkGenDistance+offsetY ; y++) {
            let ChunkList = findChunkList(x,y)
            let ChunkListCoords = findChunkListCoords(ChunkList,x,y)

            if (checkForChunk(ChunkListCoords.x,ChunkListCoords.y,ChunkList) != null){
                continue;
            }
            const myChunk = generateChunk(x,y)
            fitInChunkList(myChunk,ChunkList,ChunkListCoords)
        }
    }
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
            }else{
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
    for (let y = Math.ceil((CELL_COUNT_Y)/2)+travelDist[1]; y > -Math.ceil((CELL_COUNT_Y+1)/2)+travelDist[1];y--){

        let Chunky = Math.floor(y / chunkSize)
        let celly = (y % chunkSize + chunkSize) % chunkSize

        for (let x = -Math.ceil((CELL_COUNT_X)/2)+travelDist[0]; x < Math.ceil((CELL_COUNT_X+1)/2)+travelDist[0];x++){

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