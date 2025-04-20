import {createSeededRandom} from "./Seed.js"
//import {chunkNumberx,chunkNumbery} from "./main.js"
let rng = createSeededRandom(17)


export const ChunkList = [];
export const chunkSize = 50

export function generateMap(){
    for (let x = 0; x <= 100 ; x++) {
        const yLine = []
        for (let y = 0; y <= 100 ; y++) {
            yLine.push(chunk())
            //console.log("NEUER CHUNK");
        }
        ChunkList.push(yLine)
    }
} 

function chunk(){
    const chunk = []
    let random = rng.nextInt(0, chunkSize*chunkSize-1)
    for (let x = 0; x <= chunkSize*chunkSize-1 ; x++) {
        if (x == random){
            chunk[x] = 1
        }else{
            chunk[x] = 0
        }  
    }
    return chunk
} 
