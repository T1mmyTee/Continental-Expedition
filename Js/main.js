import * as GEN from './Generator.js'
import * as SHADER from "./initShader.js"

//alert("Welcome!\nUse scroll to zoom on map\nThe debug menu is below the map")
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("webgpu");
const debug = document.getElementById("debug");
//const input3 = document.getElementById("Seed");

export let chunkSize = 10
export let chunkGenDistance = 1
export let chunkBorder = true
export let travelDist = [0,0]
//export var seed = 1

resizeCanvas()

let ratio = canvas.width / canvas.height;
let CELL_COUNT_X = 100
let CELL_COUNT_Y = Math.floor(CELL_COUNT_X / ratio)

const shaderResources = await SHADER.initShader(ctx,CELL_COUNT_X,CELL_COUNT_Y)

GEN.generateAllChunks()
draw()

debug.addEventListener("change", (event) => {
    const id = event.target.id
    const value = event.target.value
    if (id === "ChunkSize"){
        chunkSize = Number(value)
    }else if (id === "ChunkGenDistance"){
        chunkGenDistance = Number(value)-1
    }else if (id === "ChunkBorder"){
        chunkBorder = event.target.checked
    }else{
        console.log("error")
    }
    GEN.clearGeneration()
    GEN.generateAllChunks()
    draw()
});

window.addEventListener('resize', function(event){
    resizeCanvas()
    draw()
});

window.addEventListener('keydown',function(event){
      switch(event.code) {
        case "ArrowRight":
            travelDist[0]++;
            break;
        case "ArrowLeft":
            travelDist[0]--;
            break;
        case "ArrowUp":
            travelDist[1]++;
            break;
        case "ArrowDown":
            travelDist[1]--;
            break;
        default:
           console.log(event.key)
      }
    draw()
})

canvas.addEventListener("wheel", (event) => {

        CELL_COUNT_X = CELL_COUNT_X + Math.round(event.deltaY * 0.1)
        CELL_COUNT_X = Math.min(Math.max(10, CELL_COUNT_X), 1000);

        draw()       
})


canvas.addEventListener("wheel", function(e) {
    e.preventDefault(); // Scrollen verhindern
}, { passive: false });

function draw(){
    console.clear()
    ratio = canvas.width/canvas.height
    CELL_COUNT_Y = Math.floor(CELL_COUNT_X / ratio)

    let cellData = GEN.orderCellData(CELL_COUNT_X,CELL_COUNT_Y)

    const tSnap = new Uint32Array(cellData.Snap);
    SHADER.updateBuffer(tSnap,shaderResources.device,shaderResources.cellDataBuffer_posx_posy)

    const new_value = new Float32Array([CELL_COUNT_X,CELL_COUNT_Y])

    SHADER.updateBuffer(new_value,shaderResources.device,shaderResources.CELL_COUNT_Buffer)

    SHADER.render(shaderResources,ctx,CELL_COUNT_X,CELL_COUNT_Y)
}

function resizeCanvas(){
    ctx.canvas.width  = window.innerWidth-40;
    ctx.canvas.height = window.innerHeight-40;
    debug.style.top = `${ctx.canvas.height+20}px`;
}