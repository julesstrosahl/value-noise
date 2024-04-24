// Simplified implementatitons outperform p5
const lerp = (a, b, t) => a + (b - a) * t;
const fract = (x) => x % 1;

// Currently can not be changed
const vnoiseGridDims = 3;

const vnoiseGridSizes = Array(vnoiseGridDims).fill(0);
const vnoiseGrid = [];

function populateVNoiseGrid(
  sizes = vnoiseGridSizes,
  dims = vnoiseGridDims,
  subgrid = vnoiseGrid
) {
  const size = sizes[0];
  for (let i = 0; i < size; i++) {
    if (i < subgrid.length) {
      if (dims <= 1) continue;
      populateVNoiseGrid(sizes.slice(1), dims - 1, subgrid[i]);
    } else {
      subgrid.push(
        dims > 1 ? populateVNoiseGrid(sizes.slice(1), dims - 1, []) : random()
      );
    }
  }
  return subgrid;
}

const smoothstep = (x) => 3 * Math.pow(x, 2) - 2 * Math.pow(x, 3);

function sampleGrid(
  coords,
  subgrid = vnoiseGrid,
  location = [],
  dims = vnoiseGridDims
) {
  const coord = coords[0];
  const i1 = floor(coord);
  const i2 = floor(coord + 1);
  const lerpAmount = smoothstep(fract(coord));
  if (i2 >= vnoiseGridSizes[location.length]) {
    vnoiseGridSizes[location.length] = i2 + 1;
    populateVNoiseGrid();
    subgrid = vnoiseGrid;
    for (const i of location) {
      subgrid = subgrid[i];
    }
  }

  if (dims === 1) {
    return lerp(subgrid[i1], subgrid[i2], lerpAmount);
  }
  return lerp(
    sampleGrid(coords.slice(1), subgrid[i1], [...location, i1], dims - 1),
    sampleGrid(coords.slice(1), subgrid[i2], [...location, i2], dims - 1),
    lerpAmount
  );
}

function resetLastDim(newStartI, subgrid = vnoiseGrid, dims = vnoiseGridDims) {
  if (dims > 1) {
    for (const subgrid2 of subgrid) {
      resetLastDim(newStartI, subgrid2, dims - 1);
    }
    return;
  }
  let i = 0;
  for (let oldi = newStartI; oldi < subgrid.length; oldi++) {
    subgrid[i] = subgrid[oldi];
    i++;
  }
  for (; i < subgrid.length; i++) {
    subgrid[i] = random();
  }
}

function vnoise(...coords) {
  for (let i = coords.length; i < vnoiseGridDims; i++) {
    coords.push(0);
  }
  return sampleGrid(coords);
}

const gridSize = 10;
const noiseScale = 0.005;
const timeScale = 0.05;
const maxTime = 6000;
let time = 0;

function setup() {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  colorMode(HSB);
}

function draw() {
  time += 1;
  if (time >= maxTime) {
    resetLastDim(floor(time * timeScale));
    time %= maxTime;
  }
  const scaledTime = time * timeScale;

  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      fill(
        floor(vnoise(x * noiseScale, y * noiseScale, scaledTime) * 360),
        75,
        75
      );
      square(x, y, gridSize);
    }
  }
}
