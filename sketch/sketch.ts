// TODO: - hlavny timer nech je tiez based on deltatime

// TODO: - refactor
// TODO: - debug (napr vzdy hybajuce sa lodicky nikdy nezastavia)

// TODO: - dat prec debug rects a mouse vypis
// TODO: - on game exit (mozno on escape) vsetky zvuky (sfx) skoncit prehravat
// TODO: - v hre on escape menu
// TODO: - natrenovat AI
// TODO: - spojazdnit leaderboard
// TODO: - better collision detection
// TODO: - keypressed/keytyped: when space or backspace etc do not do default browser behaviour
// TODO: - naklonit menu buttony
//          - make the leaderboard button a bit bigger
//          - in fact lets make the buttons in code entirely (not in graphic)

type SAMPLE = p5.SoundFile

enum Mode {
  SINGLEPLAYER,
  MULTIPLAYER,
}
let game_mode = Mode.SINGLEPLAYER

enum Scene {
  MAIN_MENU,
  PLAY_MENU,
  OPTIONS,
  CREDITS,
  LEADERBOARD,
  GAME,
  GAME_OVER
}
let scene = Scene.MAIN_MENU

let camup1 = 0
let camup2 = 0
let camleft1 = 0
let camleft2 = 0

let leftBuffer: p5.Graphics
let rightBuffer: p5.Graphics

let ostrov: p5.Image
let alpha_ostrov: p5.Image
let panel: p5.Image

let dray: SAMPLE
let spring: SAMPLE
let main_sample: SAMPLE

let muted: boolean

let raceTime: number
let vol = 255
let nlaps = 3

const ROTATE_BY = 1.5 * 60 // px/s
const MAX_SPEED = 6.5 * 60 // px/s, originally 10
const ACCEL = 0.05 * 3600 // px/s²
const SLOWDOWN = 0.08 * 3600 // px/s²

let boat1: Boat
let boat2: Boat
let menu: p5.Image

let airstream: p5.Font
let symbols: p5.Font

let player1textBox: TextBox
let player2textBox: TextBox

function preload() {
  airstream = loadFont("fonts/airstream.ttf")
  symbols = loadFont("fonts/symbols.ttf")

  leftBuffer = createGraphics(512, 768)
  rightBuffer = createGraphics(512, 768)

  boat1 = new Boat()
  boat2 = new Boat()
  boat1.bmp = loadImage("images/lodcervena.png")
  boat2.bmp = loadImage("images/lodzelena.png")
  ostrov = loadImage("images/ostrov1.bmp")
  alpha_ostrov = loadImage("images/alpha1.bmp")
  menu = loadImage("images/menu.png")
  panel = loadImage("images/panel.png")

  soundFormats('wav')
  dray = loadSound("sounds/dray.wav")
  spring = loadSound("sounds/spring.wav")
  main_sample = loadSound("sounds/main.wav")
}

function setup() {
  createCanvas(1024, 768)
  // frameRate(60)

  angleMode(DEGREES)
  leftBuffer.angleMode(DEGREES)
  rightBuffer.angleMode(DEGREES)

  resetBoats()
  player1textBox = new TextBox("Name:", 8, 190, 295)
  player2textBox = new TextBox("Name:", 8, 190, 405)

  textFont(airstream)
  textSize(50)
  switchScene(Scene.PLAY_MENU)
}

function draw() {
  background(0);
  // ??? CONSISTENT SPEED REGARDLESS OF FRAMERATE
  // ??? const speed = something something frameCount;

  switch (scene) {
    case Scene.MAIN_MENU:
      mainMenuScreen()
      break
    case Scene.PLAY_MENU:
      playMenuScreen()
      break
    case Scene.OPTIONS:
      optionsScreen()
      break
    case Scene.CREDITS:
      creditsScreen()
      break
    case Scene.LEADERBOARD:
      leaderboardScreen()
      break
    case Scene.GAME:
      game()
      break
    case Scene.GAME_OVER:
      gameOverScreen()
      break
  }

  textSize(16)
  textAlign(LEFT, TOP)
  noStroke()
  fill(0)
  text(mouseX + " : " + mouseY, 10, 10)
}

function switchScene(newScene: Scene, reset = true): void {
  if (newScene == Scene.MAIN_MENU) {
    // main_sample.play()
  } else if (newScene == Scene.GAME) {
    if (reset) {
      resetBoats()
      raceTime = 0
    }
  }
  scene = newScene
}

function toggleMute(): void {
  muted = !muted
}

function menuButtons(): void {
  const playLabel: TextLabel = {
    text: "Play",
    size: 0.9 * 40,
    xOffset: 47,
    yOffset: 12,
  }
  if (textButton(playLabel, 162, 600, 96, 60)) {
    switchScene(Scene.PLAY_MENU)
  }

  const leaderboardLabel: TextLabel = {
    text: "Leaderboard",
    size: 0.9 * 25,
    xOffset: 48,
    yOffset: 17,
  }
  if (textButton(leaderboardLabel, 312, 597, 96, 57)) {
    switchScene(Scene.LEADERBOARD)
  }

  const optionsLabel: TextLabel = {
    text: "Options",
    size: 0.9 * 35,
    xOffset: 48,
    yOffset: 13,
  }
  if (textButton(optionsLabel, 543, 597, 95, 57)) {
    switchScene(Scene.OPTIONS)
  }

  const creditsLabel: TextLabel = {
    text: "Credits",
    size: 0.9 * 35,
    xOffset: 48,
    yOffset: 12,
  }
  if (textButton(creditsLabel, 664, 601, 95, 57)) {
    switchScene(Scene.CREDITS)
  }

  const muteLabel: TextLabel = {
    text: "\ueee8", // "\uf028", // "\udb81\udf5a", // "\udb81\udf5b", 
    size: 0.9 * 25,
    xOffset: 25,
    yOffset: 7,
    rotate: 15,
    font: symbols,
  }
  if (textButton(muteLabel, 883, 678, 45, 33)) {
    toggleMute()
  }

  // logo
  // TODO: should this be a label?
  textFont(airstream)
  noStroke()
  fill(0)
  textSize(0.9 * 75)
  text("Hawaii", 512, 100)
}

function mainMenuScreen(): void {
  image(menu, 0, 0)
  menuButtons()
}

function playMenuScreen(): void {
  image(menu, 0, 0)
  menuButtons()

  const singleplayerLabel: TextLabel = {
    text: "Singleplayer",
    size: 0.9 * 60,
    xOffset: 106,
    yOffset: -3,
  }
  if (textButton(singleplayerLabel, 100, 360, 210, 40)) {
    game_mode = Mode.SINGLEPLAYER
    switchScene(Scene.GAME)
  }

  const multiplayerLabel: TextLabel = {
    text: "Multiplayer",
    size: 0.9 * 60,
    xOffset: 106,
    yOffset: -3,
  }
  if (textButton(multiplayerLabel, 100, 400, 210, 42)) {
    game_mode = Mode.MULTIPLAYER
    switchScene(Scene.GAME)
  }
}

function optionsScreen(): void {
  image(menu, 0, 0)
  menuButtons()

  // Left side

  textSize(0.9 * 30)
  textAlign(CENTER, TOP)
  fill("#bb0000")
  stroke(200)
  strokeWeight(2)
  text("Player 1", 190, 230)
  strokeWeight(1)

  textFont(airstream)
  textSize(0.9 * 30)
  noStroke()
  fill(0)
  text("Controlled by Arrows", 190, 260)
  player1textBox.update()
  player1textBox.draw()

  textSize(0.9 * 30)
  textAlign(CENTER, TOP)
  fill("#00bb00")
  stroke(50)
  strokeWeight(2)
  text("Player 2", 190, 340)
  strokeWeight(1)

  textFont(airstream)
  textSize(0.9 * 30)
  noStroke()
  fill(0)
  text("Controlled by WASD", 190, 370)
  player2textBox.update()
  player2textBox.draw()

  // Right side 

  optionsSectionLabel("Game options", 800, 230)

  optionLabel("Laps", 775, 270)
  const lapsOptions = [1, 3, 5, 7]
  const lapsChangedToIndex = optionSelector(lapsOptions, 1, 800, 270, 30)
  if (lapsChangedToIndex != -1) {
    nlaps = lapsOptions[lapsChangedToIndex]
  }

  // TODO: add AI difficulty settings

  optionsSectionLabel("Settings", 800, 330)

  optionLabel("Sound volume", 775, 370)
  const sfxOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  const sfxChangedToIndex = optionSelector(sfxOptions, 10, 800, 370, 45)
  if (sfxChangedToIndex != -1) {
    vol = sfxOptions[sfxChangedToIndex]
  }

  optionLabel("Music volume", 775, 400)
  const musicOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  const musicChangedToIndex = optionSelector(musicOptions, 10, 800, 400, 45)
  if (musicChangedToIndex != -1) {
    // TODO: implement this
  }

  optionLabel("Graphics", 775, 430)
  const gfxOptions = ["original", "enhanced"]
  const gfxChangedToIndex = optionSelector(gfxOptions, 1, 800, 430, 90)
  if (gfxChangedToIndex != -1) {
    // TODO: implement this
  }
}

function creditsScreen(): void {
  image(menu, 0, 0)
  menuButtons()

  textAlign(CENTER, TOP)
  textFont(airstream)

  noStroke()
  fill(0)
  textSize(0.9 * 35)
  text("Original Game Code By", 206, 417)
  text("Graphics & Web Remake By", 800, 417)

  textSize(0.9 * 70)
  text("Daniel Lovásko", 206, 437)
  text("Dominik Lukác", 800, 437)
  text("ˇ", 946, 445)
}

function leaderboardScreen(): void {
  image(menu, 0, 0)
  menuButtons()

  textAlign(CENTER, TOP)
  textFont(airstream)

  // NOTE: only 8 characters per name

  noStroke()
  fill(0)
  textSize(0.9 * 50)
  text("Leaderboard", 512, 190)
  textSize(0.9 * 35)

  textAlign(LEFT, TOP)
  text("Name", 370, 250)

  text("OG Boop", 370, 280)
  text("Dano", 370, 310)

  textAlign(RIGHT, TOP)
  text("Lap time", 674, 250)

  text("1.", 350, 280)
  text("16.431 s", 674, 280)
  text("2.", 350, 310)
  text("17.555 s", 674, 310)
}

function gameOverScreen(): void {
  // return to menu
  if (keyIsPressed && keyCode == ESCAPE) {
    switchScene(Scene.MAIN_MENU)
  }

  background(0)

  textAlign(CENTER, TOP)
  noStroke()
  fill(255)
  textSize(0.9 * 75)
  text("The winner is...!", 512, 384)

  textSize(0.9 * 80)
  if (boat1.round == nlaps) {
    text("Player no.1", 512, 434)
  }
  else {
    text("Player no.2", 512, 434)
  }
}

function game(): void {
  // return to menu
  if (keyIsPressed && keyCode == ESCAPE) {
    switchScene(Scene.MAIN_MENU)
  }

  // win conditions
  if (boat1.round == nlaps || boat2.round == nlaps) {
    switchScene(Scene.GAME_OVER)
  }

  // update timer
  raceTime += deltaTime / 1000

  boat1.update()
  if (game_mode == Mode.MULTIPLAYER) {
    boat2.update()
  }

  // pohni za AIcku ak singleplayer
  if (game_mode == Mode.SINGLEPLAYER) {
    // boat2.x = getAI_x(AI_pos);
    // boat2.y = getAI_y(AI_pos);
    // boat2.rot = getAI_rot(AI_pos);
    // if (boat2.xv > 0.2 || boat2.yv > 0.2) {
    //   boat2.x += boat2.xv;
    //   boat2.y += boat2.yv;
    //   if (boat2.xv > boat2.slowdown)
    //     boat2.xv -= boat2.slowdown;
    //   if (boat2.yv > boat2.slowdown)
    //     boat2.yv -= boat2.slowdown;
    //   if (boat2.xv < -boat2.slowdown)
    //     boat2.xv += boat2.slowdown;
    //   if (boat2.yv < -boat2.slowdown)
    //     boat2.yv += boat2.slowdown;
    // }
  }

  // naraz do lode
  if (dist(boat1.x, boat1.y, boat2.x, boat2.y) <= 90) {
    spring.play()
  }

  drawGameCameras()
  drawTimerPanels()
}

function drawTimerPanels(): void {
  image(panel, 512 - 100, 0);

  textAlign(CENTER, TOP)
  noStroke()
  fill(255)
  textSize(0.9 * 75)
  text(formatAsTime(raceTime, false), 512, 0)

  textSize(0.9 * 20)
  text("powered by DL games", 512, 70)

  textAlign(LEFT, TOP)
  textSize(0.9 * 35)
  white_text_with_shadow("Lap " + (boat1.round + 1) + " of " + nlaps, 20, 10)

  white_text_with_shadow("Lap time " + formatAsTime(boat1.lap_time, true), 20, 40)
  if (boat1.best_lap_time == Infinity) {
    white_text_with_shadow("Best lap time --:--", 20, 70)
  } else {
    white_text_with_shadow("Best lap time " + formatAsTime(boat1.best_lap_time, true), 20, 70)
  }

  if (game_mode == Mode.MULTIPLAYER) {
    textAlign(LEFT, TOP)
    textSize(0.9 * 35)
    white_text_with_shadow("Lap " + (boat2.round + 1) + " of " + nlaps, 810, 10)

    white_text_with_shadow("Lap time " + formatAsTime(boat2.lap_time, true), 810, 40)
    if (boat2.best_lap_time == Infinity) {
      white_text_with_shadow("Best lap time --:--", 810, 70)
    } else {
      white_text_with_shadow("Best lap time " + formatAsTime(boat2.best_lap_time, true), 810, 70)
    }
  }
}

function formatAsTime(seconds: number, includeMillis: boolean): string {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  if (includeMillis) {
    if (min == 0) {
      return nf(sec, 1) + "." + nf(ms, 2)
    }
    return nf(min, 1) + ":" + nf(sec, 2) + "." + nf(ms, 2)
  }
  return nf(min, 1) + ":" + nf(sec, 2)
}

function white_text_with_shadow(str: string, x: number, y: number): void {
  fill(0)
  text(str, x, y)
  fill(255)
  text(str, x - 1, y - 1)
}

function mousePressed(): void {
  // if (getAudioContext().state !== 'running') {
  //   getAudioContext().resume();
  // }
  userStartAudio()
  if (scene == Scene.OPTIONS) {
    player1textBox.mousePressed()
    player2textBox.mousePressed()
  }
}

function mouseMoved(): void {
  if (scene == Scene.OPTIONS) {
    player1textBox.mouseMoved()
    player2textBox.mouseMoved()
  }
}

function keyPressed(): void {
  if (scene == Scene.OPTIONS) {
    player1textBox.keyPressed()
    player2textBox.keyPressed()
  }
}

function keyTyped(): void {
  if (scene == Scene.OPTIONS) {
    player1textBox.keyTyped()
    player2textBox.keyTyped()
  }
}

function drawGameCameras(): void {
  if (game_mode == Mode.MULTIPLAYER) {
    // lava polka
    camleft1 = constrain(boat1.x - 256, 0, ostrov.width - 1024 + 512)
    camup1 = constrain(boat1.y - 384, 0, ostrov.height - 768)

    leftBuffer.image(ostrov, -camleft1, -camup1)

    // prava polka
    camleft2 = constrain(boat2.x - 256, 0, ostrov.width - 1024 + 512)
    camup2 = constrain(boat2.y - 384, 0, ostrov.height - 768)

    rightBuffer.image(ostrov, -camleft2, -camup2)

    boat1.draw(leftBuffer, camleft1, camup1)
    boat2.draw(leftBuffer, camleft1, camup1)

    boat1.draw(rightBuffer, camleft2, camup2)
    boat2.draw(rightBuffer, camleft2, camup2)
    image(leftBuffer, 0, 0)
    image(rightBuffer, 512, 0)
    stroke(0)
    line(512, 0, 512, 768)
  }

  if (game_mode == Mode.SINGLEPLAYER) {
    camleft1 = constrain(boat1.x - 512, 0, ostrov.width - 1024)
    camup1 = constrain(boat1.y - 384, 0, ostrov.height - 768)

    image(ostrov, -camleft1, -camup1);

    boat1.draw(null, camleft1, camup1)
    boat2.draw(null, camleft1, camup1)
  }
}
