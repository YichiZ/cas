const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// ctx.fillStyle = "royalblue";
// ctx.fillRect(150, 200, 100, 100); // x, y, width, height

const height = ctx.canvas.height;
const width = ctx.canvas.width;
const TICK_COUNT = 24;

// x-axis
ctx.beginPath();
ctx.strokeStyle = "black";
ctx.moveTo(0, height/2);
ctx.lineTo(width, height/2);
ctx.stroke();

const tick_x = width / TICK_COUNT;
for (let i=0; i<=TICK_COUNT; i++) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(i*tick_x, height/2 - tick_x/2);
    ctx.lineTo(i*tick_x, height/2 + tick_x/2);
    ctx.stroke();
}

// y-axis
ctx.beginPath();
ctx.strokeStyle = "blue";
ctx.moveTo(width/2, 0);
ctx.lineTo(width/2, height);
ctx.stroke();

const tick_y = height / TICK_COUNT;
for (let i=0; i<=TICK_COUNT; i++) {
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(width/2 - tick_y/2, i*tick_y);
    ctx.lineTo(width/2 + tick_y/2, i*tick_y);
    ctx.stroke();
}

// generate_points(expr) -> [(x, y)]
// draw_curve([(x, y)]) -> void

// types for representing an equation with variables
// - number
// - variable
// - 

// x^2 + 5
// Add(Pow(Var("x"), 2), 5)

// function to compute the equation with variables set
