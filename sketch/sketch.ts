let showDebugImage: p5.Image | null
let debugMainMenu: p5.Image
let debugOptions: p5.Image
let debugCredits: p5.Image
let debugPlay: p5.Image

// TODO: - spojazdnit multiplayer bloky

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

let ostrov: p5.Image
let vsetko: p5.Image
let alpha_ostrov: p5.Image
let bc: p5.Image
let wp: p5.Image
let panel: p5.Image

let dray: SAMPLE
let spring: SAMPLE
let main_sample: SAMPLE

let muted: boolean

let AI_pos = 0
let global_sec: number
let global_min: number
let res = 0
let depth = 16
let vol = 255
let nlaps = 3
let colb = 0 // color boat
let cols = 1 // color super
let winning_laps = 3

class BOAT {
  x: number
  y: number
  vel: number
  rot: number
  rotate_by: number
  max_speed: number
  accel: number
  slowdown: number
  round: number
  cp_one: number
  cp_two: number
  cp_three: number
  last_lap_sec: number
  best_lap_sec: number
  last_lap_min: number
  best_lap_min: number
  bmp: p5.Image
  controls: {
    up: number,
    down: number,
    left: number,
    right: number,
  }
}

const boat1 = new BOAT()
const boat2 = new BOAT()
// let mb: p5.Image // NOTE: not needed, we draw to screen directly (p5 is double bufferred)
let menu: p5.Image
// let boat, ms, boatr: p5.Image

let airstream: p5.Font
let symbols: p5.Font


let npts = 50
const xs = Array(100 + 1)
const ys = Array(100 + 1)
const xpos = Array(100 * 26)
const ypos = Array(100 * 26)
let curspl = 0
let curpt = 0
let ptbx = 0
let ptby = 0
let beta: number
let endofgame = 0
let xres: number
let yres: number
let lastx = 288
let lasty = 30
let pp = 0
let pots = [ // Array[26][8]
  [966, 1086, 997, 1011, 1026, 966, 1061, 928],
  [1061, 928, 1108, 873, 1111, 832, 1100, 773],
  [1100, 773, 1089, 707, 1072, 661, 1048, 617],
  [1048, 617, 1028, 553, 1016, 522, 991, 473],
  [991, 473, 967, 428, 942, 393, 898, 359],
  [898, 359, 866, 324, 819, 295, 769, 287],
  [769, 287, 709, 270, 643, 269, 582, 278],
  [582, 278, 522, 282, 457, 297, 406, 321],
  [406, 321, 340, 340, 280, 366, 246, 410],
  [246, 410, 185, 468, 166, 527, 175, 596],
  [175, 596, 162, 683, 145, 759, 158, 842],
  [158, 842, 162, 936, 167, 1016, 194, 1115],
  [194, 1115, 244, 1215, 304, 1265, 417, 1298],
  [417, 1298, 538, 1321, 611, 1327, 726, 1304],
  [726, 1304, 833, 1287, 905, 1265, 1013, 1217],
  [1013, 1217, 1083, 1163, 1160, 1128, 1258, 1100],
  [1258, 1100, 1342, 1059, 1411, 1053, 1520, 1079],
  [1520, 1079, 1586, 1097, 1624, 1107, 1678, 1142],
  [1678, 1142, 1736, 1183, 1750, 1208, 1755, 1269],
  [1755, 1269, 1798, 1331, 1800, 1382, 1791, 1440],
  [1791, 1440, 1785, 1551, 1760, 1550, 1712, 1578],
  [1712, 1578, 1657, 1623, 1620, 1646, 1552, 1670],
  [1552, 1670, 1479, 1708, 1414, 1707, 1334, 1698],
  [1334, 1698, 1199, 1689, 1130, 1647, 1093, 1594],
  [1093, 1594, 1018, 1518, 987, 1446, 977, 1350],
  [977, 1350, 952, 1236, 936, 1175, 966, 1086]
]

function mooove_time(): void {
  global_sec++;
  if (global_sec == 60) {
    global_min++;
    global_sec = 0;
  }
}

function preload() {
  debugMainMenu = loadImage("debug/main.png")
  debugOptions = loadImage("debug/options.png")
  debugCredits = loadImage("debug/credits.png")
  debugPlay = loadImage("debug/play.png")

  airstream = loadFont("fonts/airstream.ttf")
  symbols = loadFont("fonts/symbols.ttf")

  // vsetko = create_bitmap(2100, 1900)
  // game_mode = MODE_MP;
  // bc = create_bitmap(100, 100)
  // wp = create_bitmap(100, 100) // NOTE: wp = white point, probably

  //putpixel(wp, 97, 50, color(254, 255, 255))
  //putpixel(wp, 96, 50, color(254, 255, 255))
  //putpixel(bc, 97, 50, color(254, 255, 255))

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

  setupBoats()

  textFont(airstream)
  textSize(50)
  switchScene(Scene.GAME)
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

  if (showDebugImage)
    image(showDebugImage, 0, 0)

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
    //     install_int(mooove_time, 1000);
    if (reset) {
      setupBoats()
      global_min = 0
      global_sec = 0
    }
  }
  scene = newScene
}

function toggleMute(): void {
  muted = !muted
}

function menuButtons(): void {
  let playLabel: TextLabel = {
    text: "Play",
    size: 0.9 * 40,
    xOffset: 47,
    yOffset: 12,
  }
  if (textButton(playLabel, 162, 600, 96, 60)) {
    switchScene(Scene.PLAY_MENU)
  }

  // TODO: make the button a bit bigger
  // TODO: in fact lets make the buttons in code entirely (not in graphic)
  let leaderboardLabel: TextLabel = {
    text: "Leaderboard",
    size: 0.9 * 25,
    xOffset: 48,
    yOffset: 17,
  }
  if (textButton(leaderboardLabel, 312, 597, 96, 57)) {
    switchScene(Scene.LEADERBOARD)
  }

  let optionsLabel: TextLabel = {
    text: "Options",
    size: 0.9 * 35,
    xOffset: 48,
    yOffset: 13,
  }
  if (textButton(optionsLabel, 543, 597, 95, 57)) {
    switchScene(Scene.OPTIONS)
  }

  let creditsLabel: TextLabel = {
    text: "Credits",
    size: 0.9 * 35,
    xOffset: 48,
    yOffset: 12,
  }
  if (textButton(creditsLabel, 664, 601, 95, 57)) {
    switchScene(Scene.CREDITS)
  }

  let muteLabel: TextLabel = {
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

  let singleplayerLabel: TextLabel = {
    text: "Singleplayer",
    size: 0.9 * 60,
    xOffset: 106,
    yOffset: -3,
  }
  if (textButton(singleplayerLabel, 100, 360, 210, 40)) {
    game_mode = Mode.SINGLEPLAYER
    switchScene(Scene.GAME)
  }

  let multiplayerLabel: TextLabel = {
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

  optionsSectionLabel("Player 1", 165, 230)

  textFont(airstream)
  textSize(0.9 * 30)
  noStroke()
  fill(0)
  text("Controlled by: Arrows", 165, 260)
  text("Color:     ", 165, 290)
  fill("#bb0000")
  stroke(200)
  text("       red", 165, 290)
  noStroke()

  optionsSectionLabel("Player 2", 165, 330)

  textFont(airstream)
  textSize(0.9 * 30)
  noStroke()
  fill(0)
  text("Controlled by: WASD", 165, 360)
  text("Color:       ", 165, 390)
  fill("#00bb00")
  stroke(0)
  text("        green", 165, 390)
  noStroke()

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
  if (boat1.round == winning_laps) {
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
  if (boat1.round == winning_laps || boat2.round == winning_laps) {
    switchScene(Scene.GAME_OVER)
  }

  update_boat(boat1)

  // to iste pre druhu lod ak multiplayer
  if (game_mode == Mode.MULTIPLAYER) {
    update_boat(boat2)
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
  if (abs((boat1.x - boat2.x) * (boat1.x - boat2.x)) +
    abs((boat1.y - boat2.y) * (boat1.y - boat2.y)) <=
    90 * 90) {
    spring.play()
  }

  // VYKRESLOVANIE
  if (game_mode == Mode.MULTIPLAYER) {
    // lava polka
    camleft1 = boat1.x - 256;
    camup1 = boat1.y - 384;

    if (camleft1 < 0)
      camleft1 = 0;
    if (camup1 < 0)
      camup1 = 0;
    if (camup1 > (ostrov.height - 768))
      camup1 = ostrov.height - 768;
    if (camleft1 > (ostrov.width - 1024 + 512))
      camleft1 = ostrov.width - 1024 + 512;

    blit(ostrov, vsetko, 0, 0, 0, 0, 2100, 1900);
    dl_rotate(boat1.bmp, boat1.bmp_rot, boat1.rot + 90);
    draw_sprite(vsetko, boat1.bmp_rot, boat1.x, boat1.y);

    // prava polka
    camleft2 = boat2.x - 256;
    camup2 = boat2.y - 384;

    if (camleft2 < 0)
      camleft2 = 0;
    if (camup2 < 0)
      camup2 = 0;
    if (camup2 > (ostrov.height - 768))
      camup2 = ostrov.height - 768;
    if (camleft2 > (ostrov.width - 1024 + 512))
      camleft2 = ostrov.width - 1024 + 512;

    dl_rotate(boat2.bmp, boat2.bmp_rot, boat2.rot + 90);
    draw_sprite(vsetko, boat2.bmp_rot, boat2.x, boat2.y);
    blit(vsetko, mb, camleft1, camup1, 0, 0, 512, 768);
    blit(vsetko, mb, camleft2, camup2, 512, 0, 512, 768);
    vline(mb, 512, 0, 768, makecol(rand() % 255, 0, 0));
  }
  if (game_mode == Mode.SINGLEPLAYER) {
    camleft1 = boat1.x - 512;
    camup1 = boat1.y - 384;
    if (camleft1 < 0)
      camleft1 = 0;
    if (camup1 < 0)
      camup1 = 0;
    if (camup1 > (ostrov.height - 768))
      camup1 = ostrov.height - 768;
    if (camleft1 > (ostrov.width - 1024))
      camleft1 = ostrov.width - 1024;
    image(ostrov, -camleft1, -camup1);

    //dl_rotate(boat1.bmp, boat1.bmp_rot, boat1.rot + 90);
    push()
    translate(boat1.x - camleft1, boat1.y - camup1)
    rotate(boat1.rot + 90)
    image(boat1.bmp, -boat1.bmp.width / 2, -boat1.bmp.height / 2);
    pop()

    stroke(0)
    line(boat1.x - camleft1 - 10, boat1.y - camup1, boat1.x - camleft1 + 10, boat1.y - camup1)
    line(boat1.x - camleft1, boat1.y - camup1 - 10, boat1.x - camleft1, boat1.y - camup1 + 10)

    //dl_rotate(boat2.bmp, boat2.bmp_rot, boat2.rot);
    push()
    translate(boat2.x - camleft1, boat2.y - camup1)
    rotate(boat2.rot + 90)
    image(boat2.bmp, -boat2.bmp.width / 2, -boat2.bmp.height / 2);
    pop()

    stroke(0)
    line(boat2.x - camleft1 - 10, boat2.y - camup1, boat2.x - camleft1 + 10, boat2.y - camup1)
    line(boat2.x - camleft1, boat2.y - camup1 - 10, boat2.x - camleft1, boat2.y - camup1 + 10)
    // image(boat2.bmp, boat2.x - camleft1, boat2.y - camup1);
  }

  drawTimerPanels()
}

// TODO: multiplayer timers
function drawTimerPanels(): void {
  image(panel, 512 - 100, 0);

  textAlign(CENTER, TOP)
  noStroke()
  fill(255)
  textSize(0.9 * 75)
  text(":", 512, 0)
  text(global_sec, 555, 0)
  text(global_min, 472, 0)

  textSize(0.9 * 20)
  text("powered by DL games", 512, 70)

  fill(0)
  textAlign(LEFT, TOP)
  textSize(0.9 * 35)
  text("Laps " + boat1.round, 20, 10)

  text("Last lap time " + boat1.last_lap_min + ":" + boat1.last_lap_sec, 20, 40)
  text("Best lap time " + boat1.best_lap_min + ":" + boat1.best_lap_sec, 20, 70)

  fill(255)
  textAlign(LEFT, TOP)
  textSize(0.9 * 35)
  text("Laps " + boat1.round, 20 - 1, 10 - 1)

  text("Last lap time " + boat1.last_lap_min + ":" + boat1.last_lap_sec, 20 - 1, 40 - 1)
  text("Best lap time " + boat1.best_lap_min + ":" + boat1.best_lap_sec, 20 - 1, 70 - 1)

  if (game_mode == Mode.MULTIPLAYER) {
    alfont_textprintf_aa(mb, pump, 810, 10, 0, "Laps %d", super.round);
    alfont_textprintf_aa(mb, pump, 810, 40, 0, "Last lap time %d:%d",
      super.last_lap_min, super.last_lap_sec);
    alfont_textprintf_aa(mb, pump, 810, 70, 0, "Best lap time %d:%d",
      super.best_lap_min, super.best_lap_sec);
  }
}

function mousePressed(): void {
  // if (getAudioContext().state !== 'running') {
  //   getAudioContext().resume();
  // }
  userStartAudio()
}

function setupBoats(): void {
  boat1.x = 960;
  boat1.y = 1130;
  boat1.round = 0;
  boat1.cp_one = 0;
  boat1.cp_two = 0;
  boat1.vel = 0;
  boat1.rot = -54;
  boat1.last_lap_sec = 0;
  boat1.last_lap_min = 0;
  boat1.best_lap_sec = 99;
  boat1.best_lap_min = 99;
  boat1.max_speed = 10;
  boat1.accel = 0.05;
  boat1.slowdown = 0.08;
  boat1.rotate_by = 1.5;
  // boat1.speed = 5.0;
  boat1.controls = {
    up: UP_ARROW,
    down: DOWN_ARROW,
    left: LEFT_ARROW,
    right: RIGHT_ARROW
  }

  boat2.x = 1060;
  boat2.y = 1200;
  boat2.round = 0;
  boat2.cp_one = 0;
  boat2.cp_two = 0;
  boat2.vel = 0;
  boat2.rot = -54;
  boat2.last_lap_sec = 0;
  boat2.last_lap_min = 0;
  boat2.best_lap_sec = 99;
  boat2.best_lap_min = 99;
  boat2.max_speed = 10;
  boat2.accel = 0.05;
  boat2.slowdown = 0.08;
  boat2.rotate_by = 1.5;
  boat2.controls = {
    up: 87,
    down: 83,
    left: 65,
    right: 68
  }
}

function keyPressed() {
  switch (key) {
    case "n":
      showDebugImage = null
      break
    case "m":
      showDebugImage = debugMainMenu
      break
    case "o":
      showDebugImage = debugOptions
      break
    case "c":
      showDebugImage = debugCredits
      break
    case "p":
      showDebugImage = debugPlay
      break
  }
}

function update_boat(boat: BOAT): void {
  // rotates wp (white point) into bc (biela ciarka maybe?)
  // dl_rotate(wp, bc, boat1.rot)
  bc = wp

  // gets the white point from bc (inefficient)
  let rx: number, ry: number, gx: number, gy: number;
  // for (rx = 0; rx < bc.width; rx++) {
  //   for (ry = 0; ry < bc.height; ry++) {
  //     if (getr(getpixel(bc, rx, ry)) == 254) {
  //       gx = rx;
  //       gy = ry;
  //     }
  //   }
  // }
  gx = 0
  gy = 0

  // checkni naraz do ostrova
  if (red(getpixel(alpha_ostrov, boat.x + gx, boat.y + gy)) == 0) {
    boat.vel *= -0.75;
  }

  // // checkni naraz do checkpointov
  // if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 64) {
  //   boat.cp_one = 1;
  // }
  // if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 128) {
  //   boat.cp_two = 1;
  // }
  // if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 32) {
  //   boat.cp_three = 1;
  // }

  // // checkni naraz do finishlinu
  // if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 192 &&
  //   boat.cp_one == 1 && boat.cp_two == 1 && boat.cp_three == 1) {
  //   boat.cp_one = 0;
  //   boat.cp_two = 0;
  //   boat.cp_three = 0;
  //   boat.last_lap_sec = global_sec - boat.last_lap_sec;
  //   boat.last_lap_min = global_min - boat.last_lap_min;
  //   if (boat.last_lap_sec < 0) {
  //     boat.last_lap_min--;
  //     boat.last_lap_sec = 60 - abs(boat.last_lap_sec);
  //   }
  //   if (boat.last_lap_sec + (boat.last_lap_min) * 60 <
  //     boat.best_lap_sec + (boat.best_lap_min) * 60) {
  //     boat.best_lap_sec = boat.last_lap_sec;
  //     boat.best_lap_min = boat.last_lap_min;
  //   }
  //   boat.round++;
  //   play_sample(dray, 255, 128, 1000, NULL);
  // }

  // pohni lodou
  boat.x += cos(boat.rot) * boat.vel;
  boat.y += sin(boat.rot) * boat.vel;

  // input
  if (keyIsDown(boat.controls.up)) {
    if (boat.vel < boat.max_speed) {
      boat.vel += boat.accel;
    }
  } else {
    if (keyIsDown(boat.controls.down)) {
      if (boat.vel > boat.slowdown)
        boat.vel -= boat.slowdown;
      if (boat.vel < -boat.slowdown)
        boat.vel += boat.slowdown;
    }

    if (boat.vel > boat.slowdown)
      boat.vel -= boat.slowdown;
    if (boat.vel < -boat.slowdown)
      boat.vel += boat.slowdown;
  }

  if (keyIsDown(boat.controls.left)) {
    boat.rot -= boat.rotate_by;
  }

  if (keyIsDown(boat.controls.right)) {
    boat.rot += boat.rotate_by;
  }
}