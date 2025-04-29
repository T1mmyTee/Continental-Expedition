async function loadShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP-Fehler: ${response.status}`);
    }
    const code = await response.text();
    return code;
  }
 
  
export async function initShader(ctx,CELL_COUNT_X,CELL_COUNT_Y){
    const vertexShaderCode = await loadShader("./Js/shaders/vertexshader.wgsl");

    //webGPU stuff
    if (!navigator.gpu) {
        throw new Error("WebGPU not supported on this browser.");
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error("No appropriate GPUAdapter found.");
    }
    const device = await adapter.requestDevice();

    




    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    ctx.configure({
        device: device,
        format: canvasFormat,
    });



    const vertices = new Float32Array([
        //   X,    Y,
        -1, -1, // Triangle 1 (Blue)
        1, -1,
        1,  1,
    
        -1, -1, // Triangle 2 (Red)
        1,  1,
        -1,  1,
    ]);

    const vertexBuffer = device.createBuffer({
        label: "Cell vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST, //Vertexdaten und daten hinein kopieren
    });

    device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);

    const vertexBufferLayout = {
        arrayStride: 8,
        attributes: [{
            format: "float32x2",
            offset: 0,
            shaderLocation: 0, // Position, see vertex shader
        }],
    };


    const cellShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: vertexShaderCode
    });


    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" }
          },
          {
            binding: 1,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "read-only-storage" }
          },
          {
            binding: 2,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "read-only-storage" }
          },
          {
            binding: 3,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "read-only-storage" }
          },
          {
            binding: 4,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "read-only-storage" }
          }
        ]
      });
      
      const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
      });


    const pipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: pipelineLayout,
        vertex: {
            module: cellShaderModule,
            entryPoint: "vertexMain",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: cellShaderModule,
            entryPoint: "fragmentMain",
            targets: [{
            format: canvasFormat
            }]
        }
    });

    // Buffer 1 für cell count
    const CELL_COUNT_Array = new Float32Array([10,10])
  
    const CELL_COUNT_Buffer = device.createBuffer({
        label: "Grid Uniforms",
        size: CELL_COUNT_Array.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(CELL_COUNT_Buffer, 0, CELL_COUNT_Array);
  
  
    //4buffer für daten der angezeigten zellen fürs färben
    const cellData_posx_posy = new Uint32Array(2000 * 2000)
    const cellData_posx_negy = new Uint32Array(2000 * 2000)
    const cellData_negx_posy = new Uint32Array(2000 * 2000)
    const cellData_negx_negy = new Uint32Array(2000 * 2000)


    const cellDataBuffer_posx_posy = device.createBuffer({
        label: "cellData_posx_posy",
        size: cellData_posx_posy.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const cellDataBuffer_posx_negy = device.createBuffer({
        label: "cellData_posx_negy",
        size: cellData_posx_negy.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const cellDataBuffer_negx_posy = device.createBuffer({
        label: "cellData_negx_posy",
        size: cellData_negx_posy.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const cellDataBuffer_negx_negy = device.createBuffer({
        label: "cellData_negx_negy",
        size: cellData_negx_negy.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  
    device.queue.writeBuffer(cellDataBuffer_posx_posy, 0, cellData_posx_posy);
    device.queue.writeBuffer(cellDataBuffer_posx_negy, 0, cellData_posx_negy);
    device.queue.writeBuffer(cellDataBuffer_negx_posy, 0, cellData_negx_posy);
    device.queue.writeBuffer(cellDataBuffer_negx_negy, 0, cellData_negx_negy);
  
  
    //bindungsgruppe
    const bindGroup = device.createBindGroup({
        label: "Cell renderer bind group",
        layout: bindGroupLayout,
        entries: [
        {
            binding: 0,
            resource: { buffer: CELL_COUNT_Buffer }
        },
        {
            binding: 1,
            resource: { buffer: cellDataBuffer_posx_posy }
        },
        {
            binding: 2,
            resource: { buffer: cellDataBuffer_posx_negy }
        },
        {
            binding: 3,
            resource: { buffer: cellDataBuffer_negx_posy }
        },
        {
            binding: 4,
            resource: { buffer: cellDataBuffer_negx_negy }
        }
        ],
    });

    return {
        device,
        CELL_COUNT_Buffer,
        cellDataBuffer_posx_posy,
        cellDataBuffer_posx_negy,
        cellDataBuffer_negx_posy,
        cellDataBuffer_negx_negy,
        bindGroup,
        pipeline,
        vertexBuffer
    };
}  

export function updateBuffer(value,device,buffer){
    device.queue.writeBuffer(buffer, 0, value.buffer);
}

export function render(shaderResources,ctx,CELL_COUNT_X,CELL_COUNT_Y){
    const encoder = shaderResources.device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: ctx.getCurrentTexture().createView(),
            loadOp: "clear",
            clearValue: { r: 1, g: 1, b: 1, a: 1 },
            storeOp: "store",
        }]
    });
    
    pass.setPipeline(shaderResources.pipeline);
    pass.setVertexBuffer(0, shaderResources.vertexBuffer);
    
    pass.setBindGroup(0, shaderResources.bindGroup);
    pass.draw(6,(CELL_COUNT_X+1)*(CELL_COUNT_Y+1)); // 6 vertices
    
    pass.end();
    shaderResources.device.queue.submit([encoder.finish()]);
}


