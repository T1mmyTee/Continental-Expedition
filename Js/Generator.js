import {createSeededRandom} from "./Seed.js"
//import {chunkNumberx,chunkNumbery} from "./main.js"
let rng = createSeededRandom(17)


export const ChunkList_posX_negY = [];
export const ChunkList_posX_posY = [];
export const ChunkList_negX_posY = [null];
export const ChunkList_negX_negY = [null];
export const chunkSize = 10
export const ChunkGenDistance = 5 //generiert x chunks in jede richtung in rechteckform gesamte fläche 2x*2x 


function generateChunkRow(hasEntryInZero){
    const yLine = []
    if(hasEntryInZero === false){
        yLine.push("null")
    }
    for (let y = 0; y <= ChunkGenDistance ; y++) {
        yLine.push(chunk())
    }
    return yLine    
}

export function generateAllChunks(){
    for (let x = 0; x <= ChunkGenDistance ; x++) {
        ChunkList_posX_negY.push(generateChunkRow(false))
    }
    for (let x = 0; x <= ChunkGenDistance ; x++) {
        ChunkList_posX_posY.push(generateChunkRow(true))
    }
    for (let x = 0; x <= ChunkGenDistance ; x++) {
        ChunkList_negX_posY.push(generateChunkRow(true))
    }
    for (let x = 0; x <= ChunkGenDistance ; x++) {
        ChunkList_negX_negY.push(generateChunkRow(false))
    }
    /*for (let x = 0; x <= chunkSize*chunkSize-1 ; x++) {
        changeChunkCell(ChunkList_posX_posY[0][0],x,2)
    }*/
    changeChunkCell(ChunkList_posX_posY[0][0],Math.round(chunkSize*chunkSize/2),2) // muss geamcht werden

}

function chunk(){
    const chunk = []
    let random = rng.nextInt(0, chunkSize*chunkSize-1)
    for (let x = 0; x <= chunkSize*chunkSize-1 ; x++) {
        if (x === random){
            chunk[x] = 1
        }else{
            chunk[x] = 0
        }  
    }
    return chunk
}

function changeChunkCell(array,cell,wert){
    array[cell] = wert
}
