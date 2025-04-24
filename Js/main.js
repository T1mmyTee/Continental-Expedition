import * as GEN from './Generator.js'
import * as SHADER from "./initShader.js"

alert("Welcome!\nUse scroll to zoom on map\nThe debug menu is below the map")
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("webgpu");
const debug = document.getElementById("debug");
const input1 = document.getElementById("ChunkSize");
const input2 = document.getElementById("ChunkGenDistance");
//const input3 = document.getElementById("Seed");

export var chunkSize = 10
export var ChunkGenDistance = 2
//export var seed = 1

ctx.canvas.width  = window.innerWidth-40;
ctx.canvas.height = window.innerHeight-40;

debug.style.top = `${ctx.canvas.height+20}px`;

let ratio = canvas.width / canvas.height;
let CELL_COUNT_X = 100
let CELL_COUNT_Y = Math.floor(CELL_COUNT_X / ratio)



const shaderResources = await SHADER.initShader(ctx,CELL_COUNT_X,CELL_COUNT_Y)

GEN.generateAllChunks()
draw()

input1.addEventListener("change", (event) => {
    chunkSize = event.target.value
    GEN.clearGeneration()
    GEN.generateAllChunks()
    draw()
});

input2.addEventListener("change", (event) => {
    ChunkGenDistance = event.target.value
    GEN.clearGeneration()
    GEN.generateAllChunks()
    draw()
});

/*input3.addEventListener("change", (event) => {
    seed = event.target.value
    GEN.clearGeneration()
    GEN.generateAllChunks()
    draw()
});*/

window.addEventListener('resize', function(event){
    ctx.canvas.width  = window.innerWidth-40;
    ctx.canvas.height = window.innerHeight-40;
    debug.style.top = `${ctx.canvas.height+20}px`;

    draw()
  });

canvas.addEventListener("wheel", (event) => {

        CELL_COUNT_X = CELL_COUNT_X + Math.round(event.deltaY * 0.1)
        CELL_COUNT_X = Math.min(Math.max(10, CELL_COUNT_X), 1000);

        draw()       
})


canvas.addEventListener("wheel", function(e) {
    e.preventDefault(); // Scrollen verhindern
}, { passive: false });

function draw(){
    ratio = canvas.width/canvas.height
    CELL_COUNT_Y = Math.floor(CELL_COUNT_X / ratio)

    let cellData = GEN.orderCellData(CELL_COUNT_X,CELL_COUNT_Y)


    const tSnap_posX_posY = new Uint32Array(cellData.Snap_posX_posY);
    SHADER.updateBuffer(tSnap_posX_posY,shaderResources.device,shaderResources.cellDataBuffer_posx_posy)

    const tSnap_posX_negY = new Uint32Array(cellData.Snap_posX_negY);
    SHADER.updateBuffer(tSnap_posX_negY,shaderResources.device,shaderResources.cellDataBuffer_posx_negy)

    const tSnap_negX_posY = new Uint32Array(cellData.Snap_negX_posY);
    SHADER.updateBuffer(tSnap_negX_posY,shaderResources.device,shaderResources.cellDataBuffer_negx_posy)

    const tSnap_negX_negY = new Uint32Array(cellData.Snap_negX_negY);
    SHADER.updateBuffer(tSnap_negX_negY,shaderResources.device,shaderResources.cellDataBuffer_negx_negy)


    const new_value = new Float32Array([CELL_COUNT_X,CELL_COUNT_Y])

    SHADER.updateBuffer(new_value,shaderResources.device,shaderResources.CELL_COUNT_Buffer)

    SHADER.render(shaderResources,ctx,CELL_COUNT_X,CELL_COUNT_Y)
}

