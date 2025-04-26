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

fn color(fcell:vec2f,cx: i32,cy: i32) -> u32{
    var cell = vec2<i32>(ceil(fcell));
        
    return celldata_posX_posY[cell.x+i32(cx/2) + ((i32(cy/2)-cell.y)*(i32(cx)))];
}



@vertex
fn vertexMain(@location(0) pos: vec2f, @builtin(instance_index) instance: u32) -> VertexShaderOutput {
    var i = instance;
    let drawcount = cellcount +1;
    let cx = u32(drawcount.x);
    let cy = u32(drawcount.y);

    let cellx = i32(i % cx) - i32(cx) / 2;
    let celly = i32(i / cx) - i32(cy) / 2;

    var vsOutput: VertexShaderOutput;
    let cell = vec2f(f32(cellx),f32(celly));

    let cellSize = vec2f(2.0) / (cellcount*2);
    let cellOffset = cellSize * cell*2; // Updated
    var gridPos = ((pos)* cellSize);

    let c = color(cell,i32(cx),i32(cy));

    vsOutput.position = vec4f(gridPos + cellOffset, 0, 1);
    vsOutput.instance = i;
    vsOutput.cell = cell;
    vsOutput.color = c;
    return vsOutput;

}


@fragment
fn fragmentMain(input : VertexShaderOutput) -> @location(0) vec4f {
    let cell = ceil(input.cell);

    if cell.x == 0 && cell.y == 0{
        return vec4f(0, 123.0/255.0, 246.0/255.0, 1);
    }
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