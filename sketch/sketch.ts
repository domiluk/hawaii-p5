function setup() {
  createCanvas(windowWidth, windowHeight)
  rectMode(CENTER).noFill().frameRate(30);
}

function draw() {
  background(0);
  // ??? CONSISTENT SPEED REGARDLESS OF FRAMERATE
  // ??? const speed = something something frameCount;
}
