const vnoiseGridStep = 1;
let vnoiseGridSize = 0;
const vnoiseGrid = [];

function populateVNoiseGrid(newSize=vnoiseGridSize) {
  for(let ox=0;ox<vnoiseGridSize;ox+=vnoiseGridStep) {
    const row = vnoiseGrid[ox];
    for(let oy=vnoiseGridSize;oy<newSize;oy+=vnoiseGridStep) {
      row.push(random());
    }
  }
  for (let ox = vnoiseGridSize; ox < newSize; ox += vnoiseGridStep) {
    const row = [];
    vnoiseGrid.push(row);
    for (let oy = 0; oy < newSize; oy += vnoiseGridStep) {
      row.push(random());
    }
  }
  vnoiseGridSize = newSize;
}

const smoothstep = (x) => 3 * Math.pow(x, 2) - 2 * Math.pow(x, 3);

function vnoise(x=0, y=0, z=0) {
  const xi = x / vnoiseGridStep;
  const yi = y / vnoiseGridStep;
  const x1 = floor(xi);
  const x2 = floor(xi+1);
  const y1 = floor(yi);
  const y2 = floor(yi+1);
  if(x2>=vnoiseGridSize||y2>=vnoiseGridSize) {
    populateVNoiseGrid(max(x2,y2)+1);
  }
  const v1 = vnoiseGrid[x1][y1];
  const v2 = vnoiseGrid[x2][y1];
  const v3 = vnoiseGrid[x1][y2];
  const v4 = vnoiseGrid[x2][y2];
  const xfrac = fract(xi);
  const yfrac = fract(yi);
  const xpos = smoothstep(xfrac);
  const ypos = smoothstep(yfrac);
  const v12 = lerp(v1, v2, xpos);
  const v34 = lerp(v3, v4, xpos);
  return lerp(v12, v34, ypos);
}

const gridSize =5;
const noiseScale = .005;

function setup() {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  colorMode(HSB);
}

function draw() {
  for(let x=0;x<width;x+=gridSize) {
    for(let y=0;y<height;y+=gridSize) {
      fill(vnoise(x*noiseScale,y*noiseScale)*360,75,75);
      square(x,y,gridSize);
    }
  }
}