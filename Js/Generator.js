import {createSeededRandom} from "./Seed.js"
let rng = createSeededRandom(17)


export const ChunkList_posX_negY = [];
export const ChunkList_posX_posY = [];
export const ChunkList_negX_posY = [];
export const ChunkList_negX_negY = [];
export const chunkSize = 50
export const ChunkGenDistance = 100 //generiert x chunks in jede richtung in rechteckform gesamte fläche 2x*2x 


function generateChunkRow(){
    const yLine = []
    for (let y = 0; y <= ChunkGenDistance ; y++) {
        yLine.push(chunk())
    }
    return yLine    
}

export function generateAllChunks(){
    for (let x = 0; x <= ChunkGenDistance ; x++) {
        ChunkList_posX_negY.push(generateChunkRow())
    }
    for (let x = 0; x <= ChunkGenDistance ; x++) {
        ChunkList_posX_posY.push(generateChunkRow())
    }
    for (let x = 0; x <= ChunkGenDistance ; x++) {
        ChunkList_negX_posY.push(generateChunkRow())
    }
    for (let x = 0; x <= ChunkGenDistance ; x++) {
        ChunkList_negX_negY.push(generateChunkRow())
    }
}

function chunk(){
    const chunk = []
    let random = rng.nextInt(0, chunkSize*chunkSize-1)
    for (let x = 0; x <= chunkSize*chunkSize-1 ; x++) {
        if (x === random){
            chunk[x] = 3
        }else if(x % chunkSize === 0 ||  x % chunkSize == chunkSize-1 || x < chunkSize || x > chunkSize*chunkSize-1-chunkSize){ 
            chunk[x] = 2
        }else{
            chunk[x] = 1
        }  
    }
    return chunk
}

function changeChunkCell(array,cell,wert){
    array[cell] = wert
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
            let celly = (y %chunkSize)*chunkSize

            
            if (ChunkList_posX_posY[Chunkx] === undefined || ChunkList_posX_posY[Chunkx][Chunky] === undefined){
                Snap_posX_posY.push(5)
            }else{
                Snap_posX_posY.push(ChunkList_posX_posY[Chunkx][Chunky][cellx+celly])
            }
            
            if (ChunkList_posX_negY[Chunkx] === undefined || ChunkList_posX_posY[Chunkx][Chunky] === undefined){
                Snap_posX_negY.push(5)
            }else{
    //da man hier in -x richtung geht, aber der key der chunk zellen per chunk in x+ richtung steigt muss der key umgedreht werden (0=chunksize-1) und (chunksize-1 = 0)
                Snap_posX_negY.push(ChunkList_posX_negY[Chunkx][Chunky][(chunkSize-1-cellx)+celly])
            }

            if (ChunkList_negX_posY[Math.floor(x / chunkSize)] === undefined || ChunkList_negX_posY[Math.floor(x / chunkSize)][y] === undefined){
                Snap_negX_posY.push(0)
            }else{
                Snap_negX_posY.push(ChunkList_negX_posY[Math.floor(x / chunkSize)][y][x % chunkSize])
            }

            if (ChunkList_negX_negY[Math.floor(x / chunkSize)] === undefined || ChunkList_negX_negY[Math.floor(x / chunkSize)][y] === undefined){
                Snap_negX_negY.push(0)
            }else{
                Snap_negX_negY.push(ChunkList_negX_negY[Math.floor(x / chunkSize)][y][x % chunkSize])
            }
        }
    }
    return {Snap_posX_posY, Snap_posX_negY, Snap_negX_posY ,Snap_negX_negY}
}