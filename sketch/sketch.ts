// TODO: - refactor
// TODO: - debug

// TODO: - better collision detection
// TODO: - nastavenia ukladat do local storage

// TODO: - natrenovat AI
// TODO: - dat prec debug rects a mouse vypis
// TODO: - nastavit nastavenia na rozumne starting hodnoty

type SAMPLE = p5.SoundFile

enum Mode {
  SINGLEPLAYER,
  MULTIPLAYER,
}
let gameMode = Mode.SINGLEPLAYER

const enum HawaiiScene {
  MAIN_MENU = 'main menu',
  PLAY_MENU = 'play menu',
  OPTIONS = 'options',
  CREDITS = 'credits',
  LEADERBOARD = 'leaderboard',
  GAME = 'game',
  GAME_OVER = 'game over'
}

type SceneId = `${HawaiiScene}`

let sceneManager: SceneManager<SceneId>

let uiManager: UIManager

let isPaused = false

let camup1 = 0
let camup2 = 0
let camleft1 = 0
let camleft2 = 0

let leftBuffer: p5.Graphics
let rightBuffer: p5.Graphics

let ostrov: p5.Image
let alphaOstrov: p5.Image
let panel: p5.Image
let lodCervena: p5.Image
let lodZelena: p5.Image

let dray: SAMPLE
let spring: SAMPLE
let mainSample: SAMPLE

let muted = true

let raceTime: number

const sfxOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
let sfxIndex = 10
let sfxVol = 1 // TODO: 100

const musicOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
let musicIndex = 10
let musicVol = 1 // TODO: 100

const lapsOptions = [1, 3, 5, 7]
let lapsIndex = 1
let nLaps = 3

let boat1: Boat
let boat2: Boat
let menu: p5.Image

let airstream: p5.Font
let symbols: p5.Font

let player1textBox: TextBox
let player2textBox: TextBox

let topLeftIslandStrings: string[]
let topLeftIsland: Island
let bottomRightIslandStrings: string[]
let bottomRightIsland: Island

function preload() {
  airstream = loadFont("fonts/airstream.ttf")
  symbols = loadFont("fonts/symbols.ttf")

  leftBuffer = createGraphics(512, 768)
  rightBuffer = createGraphics(512, 768)

  lodCervena = loadImage("images/lodcervena.png")
  lodZelena = loadImage("images/lodzelena.png")

  ostrov = loadImage("images/ostrov1.bmp")
  alphaOstrov = loadImage("images/alpha1.png")
  menu = loadImage("images/menu.png")
  panel = loadImage("images/panel.png")

  soundFormats('wav')
  dray = loadSound("sounds/dray.wav")
  spring = loadSound("sounds/spring.wav")
  mainSample = loadSound("sounds/main.wav")

  topLeftIslandStrings = loadStrings("islands/topleft.txt")
  bottomRightIslandStrings = loadStrings("islands/bottomright.txt")
}

function setup() {
  createCanvas(1024, 768)
  // frameRate(60)

  // Set up scenes
  const scenes: Record<SceneId, SceneConstructor> = {
    [HawaiiScene.MAIN_MENU]: MainMenuScene,
    [HawaiiScene.PLAY_MENU]: PlayMenuScene,
    [HawaiiScene.OPTIONS]: OptionsScene,
    [HawaiiScene.CREDITS]: CreditsScene,
    [HawaiiScene.LEADERBOARD]: LeaderboardScene,
    [HawaiiScene.GAME]: GameScene,
    [HawaiiScene.GAME_OVER]: GameOverScene,
  }
  sceneManager = new SceneManager(scenes, "main menu")

  // Set up UI manager
  player1textBox = new TextBox("Name:", 8, 190, 295)
  player2textBox = new TextBox("Name:", 8, 190, 405)

  uiManager = new UIManager()
  uiManager.add(player1textBox, "options")
  uiManager.add(player2textBox, "options")

  // Set global p5 settings
  angleMode(DEGREES)
  leftBuffer.angleMode(DEGREES)
  rightBuffer.angleMode(DEGREES)
  textFont(airstream)

  // Set up boats
  boat1 = new Boat()
  boat2 = new Boat()
  boat1.bmp = lodCervena
  boat2.bmp = lodZelena
  resetBoats()

  // Set up sfx / music
  dray.setVolume(0)
  spring.setVolume(0)
  mainSample.setVolume(0)
  mainSample.setLoop(true)
  mainSample.play()

  // Set up islands
  topLeftIsland = new Island()
  topLeftIsland.load(topLeftIslandStrings)

  bottomRightIsland = new Island()
  bottomRightIsland.load(bottomRightIslandStrings)

  alphaOstrov.loadPixels()
}

function draw() {
  background(0)

  sceneManager.update()
  sceneManager.draw()

  if (debug) {
    drawMouseDebugInfo()
    drawDeltaTimeHistoryBar()
  }

  dl_mouseIsPressed = false
}

let isFirstClick = true

function mousePressed(): void {
  dl_mouseIsPressed = true

  if (isFirstClick) {
    userStartAudio()
    toggleMute()
    isFirstClick = false

    // this is a hack to prevent multiple triggers of mute button
    if (mouseX >= 883 && mouseX < 928 && mouseY >= 678 && mouseY < 711) {
      dl_mouseIsPressed = false
    }
  }

  uiManager.mousePressed()
}

function mouseMoved(): void {
  uiManager.mouseMoved()
}

function keyPressed(): void {
  sceneManager.keyPressed()
  uiManager.keyPressed()

  if (key == "m") {
    toggleMute()
  }

  if (key == "b") {
    toggleDebug()
  }
}

function keyTyped(): void {
  uiManager.keyTyped()
}
