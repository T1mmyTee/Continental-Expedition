@group(0) @binding(0) var<uniform> cellcount: vec2f;
@group(0) @binding(1) var<storage, read> celldata_posX_posY: array<u32>;
@group(0) @binding(2) var<storage, read> celldata_posX_negY: array<u32>;
@group(0) @binding(3) var<storage, read> celldata_negX_posY: array<u32>;
@group(0) @binding(4) var<storage, read> celldata_negX_negY: array<u32>;

struct VertexShaderOutput {
    @builtin(position) position: vec4f,
    @location(0) @interpolate(flat) instance: u32,
    @location(1) cell : vec2f,
    @location(2) @interpolate(flat) color : u32
};

fn color(fcell:vec2f,cx: i32) -> u32{
    let cell = vec2<i32>(ceil(fcell));

    if cell.x >= 0 && cell.y >= 0{
        return celldata_posX_posY[cell.x + cell.y*(i32(cx/2)+1)];

    }else if cell.x < 0 && cell.y >= 0{
        let realx = abs(cell.x+1);
        return celldata_negX_posY[realx + cell.y*(i32(cx/2)+1)];

    }else if cell.x >= 0 && cell.y < 0{
        
        let realy = abs(cell.y+1);
        return celldata_posX_negY[cell.x + realy*(i32(cx/2)+1)];

    }else if cell.x < 0 && cell.y < 0{
        let realx = abs(cell.x+1);
        let realy = abs(cell.y+1);
        return celldata_negX_negY[realx + realy*(i32(cx/2)+1)];
    }
    return u32(0);
}



@vertex
fn vertexMain(@location(0) pos: vec2f, @builtin(instance_index) instance: u32) -> VertexShaderOutput {
    var i = instance;
    let drawcount = cellcount +1;
    let cx = u32(drawcount.x);
    let cy = u32(drawcount.y);

    var offsetX = 0.0;
    if (i32(cx) % 2 != 0){
        offsetX = 0.5;
    }
    var offsetY = 0.0;
    if (i32(cy) % 2 != 0){
        offsetY = 0.5;
    }
    
    let cellx = i32(i % cx) - i32(cx) / 2;
    let celly = i32(i / cx) - i32(cy) / 2;

    var vsOutput: VertexShaderOutput;
    let cell = vec2f(f32(cellx),f32(celly));

    let cellSize = vec2f(2.0) / (cellcount*2);
    let cellOffset = cellSize * cell *2; // Updated
    var gridPos = ((pos)* cellSize);

    let c = color(cell,i32(cx));

    vsOutput.position = vec4f(gridPos + cellOffset, 0, 1);
    vsOutput.instance = i;
    vsOutput.cell = cell;
    vsOutput.color = c;
    return vsOutput;

}


@fragment
fn fragmentMain(input : VertexShaderOutput) -> @location(0) vec4f {
    let cell = ceil(input.cell);

    if input.color == 0{
        return vec4f(1, 1, 1, 1);
    }else if input.color == 1{
        return vec4f(0, 128.0/255.0, 0, 1);
    }else if input.color == 2{
        return vec4f(0, 0, 0, 1);
    }else if input.color == 3{
        return vec4f(1, 0, 0, 1);
    }
    return vec4f(0, 123.0/255.0, 246.0/255.0, 1);
}