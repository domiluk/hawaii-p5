function create_bitmap(w, h) {
    var img = createImage(w, h);
    img.loadPixels();
    for (var i = 0; i < w * h * 4; i += 4) {
        img.pixels[i + 0] = 0;
        img.pixels[i + 1] = 0;
        img.pixels[i + 2] = 0;
        img.pixels[i + 3] = 255;
    }
    img.updatePixels();
    console.log(img);
    return img;
}
function putpixel(img, x, y, col) {
    x = floor(x);
    y = floor(y);
    img.loadPixels();
    img.set(x, y, col);
    img.updatePixels();
}
function getpixel(img, x, y) {
    x = floor(x);
    y = floor(y);
    if (x < 0 || y < 0 || x >= img.width || y >= img.height)
        return color(0);
    img.loadPixels();
    var i = 4 * (y * img.width + x);
    var p = img.pixels;
    return color(p[i], p[i + 1], p[i + 2], p[i + 3]);
}
var Boat = (function () {
    function Boat() {
    }
    Boat.prototype.draw = function (g, camleft, camup) {
        if (!g) {
            g = window;
        }
        g.push();
        g.translate(this.x - camleft, this.y - camup);
        g.rotate(this.rot + 90);
        g.image(this.bmp, -this.bmp.width / 2, -this.bmp.height / 2);
        g.pop();
    };
    Boat.prototype.update = function () {
        bc = wp;
        var rx, ry, gx, gy;
        gx = 0;
        gy = 0;
        if (red(getpixel(alpha_ostrov, this.x + gx, this.y + gy)) == 0) {
            this.rot += 180;
        }
        if (keyIsDown(this.controls.up)) {
            this.vel += ACCEL;
        }
        else {
            this.vel -= SLOWDOWN;
        }
        if (keyIsDown(this.controls.down)) {
            this.vel -= SLOWDOWN;
        }
        if (keyIsDown(this.controls.left)) {
            this.rot -= ROTATE_BY;
        }
        if (keyIsDown(this.controls.right)) {
            this.rot += ROTATE_BY;
        }
        this.vel = constrain(this.vel, 0, MAX_SPEED);
        this.x += cos(this.rot) * this.vel;
        this.y += sin(this.rot) * this.vel;
    };
    return Boat;
}());
var showDebugImage;
var debugMainMenu;
var debugOptions;
var debugCredits;
var debugPlay;
var Mode;
(function (Mode) {
    Mode[Mode["SINGLEPLAYER"] = 0] = "SINGLEPLAYER";
    Mode[Mode["MULTIPLAYER"] = 1] = "MULTIPLAYER";
})(Mode || (Mode = {}));
var game_mode = Mode.SINGLEPLAYER;
var Scene;
(function (Scene) {
    Scene[Scene["MAIN_MENU"] = 0] = "MAIN_MENU";
    Scene[Scene["PLAY_MENU"] = 1] = "PLAY_MENU";
    Scene[Scene["OPTIONS"] = 2] = "OPTIONS";
    Scene[Scene["CREDITS"] = 3] = "CREDITS";
    Scene[Scene["LEADERBOARD"] = 4] = "LEADERBOARD";
    Scene[Scene["GAME"] = 5] = "GAME";
    Scene[Scene["GAME_OVER"] = 6] = "GAME_OVER";
})(Scene || (Scene = {}));
var scene = Scene.MAIN_MENU;
var camup1 = 0;
var camup2 = 0;
var camleft1 = 0;
var camleft2 = 0;
var leftBuffer;
var rightBuffer;
var ostrov;
var alpha_ostrov;
var bc;
var wp;
var panel;
var dray;
var spring;
var main_sample;
var muted;
var AI_pos = 0;
var global_sec;
var global_min;
var res = 0;
var depth = 16;
var vol = 255;
var nlaps = 3;
var colb = 0;
var cols = 1;
var winning_laps = 3;
var ROTATE_BY = 1.5;
var MAX_SPEED = 6.5;
var ACCEL = 0.05;
var SLOWDOWN = 0.08;
var boat1;
var boat2;
var menu;
var airstream;
var symbols;
var npts = 50;
var xs = Array(100 + 1);
var ys = Array(100 + 1);
var xpos = Array(100 * 26);
var ypos = Array(100 * 26);
var curspl = 0;
var curpt = 0;
var ptbx = 0;
var ptby = 0;
var beta;
var endofgame = 0;
var xres;
var yres;
var lastx = 288;
var lasty = 30;
var pp = 0;
var pots = [
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
];
function mooove_time() {
    global_sec++;
    if (global_sec == 60) {
        global_min++;
        global_sec = 0;
    }
}
function preload() {
    debugMainMenu = loadImage("debug/main.png");
    debugOptions = loadImage("debug/options.png");
    debugCredits = loadImage("debug/credits.png");
    debugPlay = loadImage("debug/play.png");
    airstream = loadFont("fonts/airstream.ttf");
    symbols = loadFont("fonts/symbols.ttf");
    leftBuffer = createGraphics(512, 768);
    rightBuffer = createGraphics(512, 768);
    boat1 = new Boat();
    boat2 = new Boat();
    boat1.bmp = loadImage("images/lodcervena.png");
    boat2.bmp = loadImage("images/lodzelena.png");
    ostrov = loadImage("images/ostrov1.bmp");
    alpha_ostrov = loadImage("images/alpha1.bmp");
    menu = loadImage("images/menu.png");
    panel = loadImage("images/panel.png");
    soundFormats('wav');
    dray = loadSound("sounds/dray.wav");
    spring = loadSound("sounds/spring.wav");
    main_sample = loadSound("sounds/main.wav");
}
function setup() {
    createCanvas(1024, 768);
    angleMode(DEGREES);
    leftBuffer.angleMode(DEGREES);
    rightBuffer.angleMode(DEGREES);
    setupBoats();
    textFont(airstream);
    textSize(50);
    switchScene(Scene.PLAY_MENU);
}
function draw() {
    background(0);
    switch (scene) {
        case Scene.MAIN_MENU:
            mainMenuScreen();
            break;
        case Scene.PLAY_MENU:
            playMenuScreen();
            break;
        case Scene.OPTIONS:
            optionsScreen();
            break;
        case Scene.CREDITS:
            creditsScreen();
            break;
        case Scene.LEADERBOARD:
            leaderboardScreen();
            break;
        case Scene.GAME:
            game();
            break;
        case Scene.GAME_OVER:
            gameOverScreen();
            break;
    }
    if (showDebugImage)
        image(showDebugImage, 0, 0);
    textSize(16);
    textAlign(LEFT, TOP);
    noStroke();
    fill(0);
    text(mouseX + " : " + mouseY, 10, 10);
}
function switchScene(newScene, reset) {
    if (reset === void 0) { reset = true; }
    if (newScene == Scene.MAIN_MENU) {
    }
    else if (newScene == Scene.GAME) {
        if (reset) {
            setupBoats();
            global_min = 0;
            global_sec = 0;
        }
    }
    scene = newScene;
}
function toggleMute() {
    muted = !muted;
}
function menuButtons() {
    var playLabel = {
        text: "Play",
        size: 0.9 * 40,
        xOffset: 47,
        yOffset: 12,
    };
    if (textButton(playLabel, 162, 600, 96, 60)) {
        switchScene(Scene.PLAY_MENU);
    }
    var leaderboardLabel = {
        text: "Leaderboard",
        size: 0.9 * 25,
        xOffset: 48,
        yOffset: 17,
    };
    if (textButton(leaderboardLabel, 312, 597, 96, 57)) {
        switchScene(Scene.LEADERBOARD);
    }
    var optionsLabel = {
        text: "Options",
        size: 0.9 * 35,
        xOffset: 48,
        yOffset: 13,
    };
    if (textButton(optionsLabel, 543, 597, 95, 57)) {
        switchScene(Scene.OPTIONS);
    }
    var creditsLabel = {
        text: "Credits",
        size: 0.9 * 35,
        xOffset: 48,
        yOffset: 12,
    };
    if (textButton(creditsLabel, 664, 601, 95, 57)) {
        switchScene(Scene.CREDITS);
    }
    var muteLabel = {
        text: "\ueee8",
        size: 0.9 * 25,
        xOffset: 25,
        yOffset: 7,
        rotate: 15,
        font: symbols,
    };
    if (textButton(muteLabel, 883, 678, 45, 33)) {
        toggleMute();
    }
    textFont(airstream);
    noStroke();
    fill(0);
    textSize(0.9 * 75);
    text("Hawaii", 512, 100);
}
function mainMenuScreen() {
    image(menu, 0, 0);
    menuButtons();
}
function playMenuScreen() {
    image(menu, 0, 0);
    menuButtons();
    var singleplayerLabel = {
        text: "Singleplayer",
        size: 0.9 * 60,
        xOffset: 106,
        yOffset: -3,
    };
    if (textButton(singleplayerLabel, 100, 360, 210, 40)) {
        game_mode = Mode.SINGLEPLAYER;
        switchScene(Scene.GAME);
    }
    var multiplayerLabel = {
        text: "Multiplayer",
        size: 0.9 * 60,
        xOffset: 106,
        yOffset: -3,
    };
    if (textButton(multiplayerLabel, 100, 400, 210, 42)) {
        game_mode = Mode.MULTIPLAYER;
        switchScene(Scene.GAME);
    }
}
function optionsScreen() {
    image(menu, 0, 0);
    menuButtons();
    optionsSectionLabel("Player 1", 165, 230);
    textFont(airstream);
    textSize(0.9 * 30);
    noStroke();
    fill(0);
    text("Controlled by: Arrows", 165, 260);
    text("Color:     ", 165, 290);
    fill("#bb0000");
    stroke(200);
    text("       red", 165, 290);
    noStroke();
    optionsSectionLabel("Player 2", 165, 330);
    textFont(airstream);
    textSize(0.9 * 30);
    noStroke();
    fill(0);
    text("Controlled by: WASD", 165, 360);
    text("Color:       ", 165, 390);
    fill("#00bb00");
    stroke(0);
    text("        green", 165, 390);
    noStroke();
    optionsSectionLabel("Game options", 800, 230);
    optionLabel("Laps", 775, 270);
    var lapsOptions = [1, 3, 5, 7];
    var lapsChangedToIndex = optionSelector(lapsOptions, 1, 800, 270, 30);
    if (lapsChangedToIndex != -1) {
        nlaps = lapsOptions[lapsChangedToIndex];
    }
    optionsSectionLabel("Settings", 800, 330);
    optionLabel("Sound volume", 775, 370);
    var sfxOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    var sfxChangedToIndex = optionSelector(sfxOptions, 10, 800, 370, 45);
    if (sfxChangedToIndex != -1) {
        vol = sfxOptions[sfxChangedToIndex];
    }
    optionLabel("Music volume", 775, 400);
    var musicOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    var musicChangedToIndex = optionSelector(musicOptions, 10, 800, 400, 45);
    if (musicChangedToIndex != -1) {
    }
    optionLabel("Graphics", 775, 430);
    var gfxOptions = ["original", "enhanced"];
    var gfxChangedToIndex = optionSelector(gfxOptions, 1, 800, 430, 90);
    if (gfxChangedToIndex != -1) {
    }
}
function creditsScreen() {
    image(menu, 0, 0);
    menuButtons();
    textAlign(CENTER, TOP);
    textFont(airstream);
    noStroke();
    fill(0);
    textSize(0.9 * 35);
    text("Original Game Code By", 206, 417);
    text("Graphics & Web Remake By", 800, 417);
    textSize(0.9 * 70);
    text("Daniel Lovásko", 206, 437);
    text("Dominik Lukác", 800, 437);
    text("ˇ", 946, 445);
}
function leaderboardScreen() {
    image(menu, 0, 0);
    menuButtons();
    textAlign(CENTER, TOP);
    textFont(airstream);
    noStroke();
    fill(0);
    textSize(0.9 * 50);
    text("Leaderboard", 512, 190);
    textSize(0.9 * 35);
    textAlign(LEFT, TOP);
    text("Name", 370, 250);
    text("OG Boop", 370, 280);
    text("Dano", 370, 310);
    textAlign(RIGHT, TOP);
    text("Lap time", 674, 250);
    text("1.", 350, 280);
    text("16.431 s", 674, 280);
    text("2.", 350, 310);
    text("17.555 s", 674, 310);
}
function gameOverScreen() {
    if (keyIsPressed && keyCode == ESCAPE) {
        switchScene(Scene.MAIN_MENU);
    }
    background(0);
    textAlign(CENTER, TOP);
    noStroke();
    fill(255);
    textSize(0.9 * 75);
    text("The winner is...!", 512, 384);
    textSize(0.9 * 80);
    if (boat1.round == winning_laps) {
        text("Player no.1", 512, 434);
    }
    else {
        text("Player no.2", 512, 434);
    }
}
function game() {
    if (keyIsPressed && keyCode == ESCAPE) {
        switchScene(Scene.MAIN_MENU);
    }
    if (boat1.round == winning_laps || boat2.round == winning_laps) {
        switchScene(Scene.GAME_OVER);
    }
    boat1.update();
    if (game_mode == Mode.MULTIPLAYER) {
        boat2.update();
    }
    if (game_mode == Mode.SINGLEPLAYER) {
    }
    if (dist(boat1.x, boat1.y, boat2.x, boat2.y) <= 90) {
        spring.play();
    }
    drawGameCameras();
    drawTimerPanels();
}
function drawTimerPanels() {
    image(panel, 512 - 100, 0);
    textAlign(CENTER, TOP);
    noStroke();
    fill(255);
    textSize(0.9 * 75);
    text(":", 512, 0);
    text(global_sec, 555, 0);
    text(global_min, 472, 0);
    textSize(0.9 * 20);
    text("powered by DL games", 512, 70);
    fill(0);
    textAlign(LEFT, TOP);
    textSize(0.9 * 35);
    text("Laps " + boat1.round, 20, 10);
    text("Last lap time " + boat1.last_lap_min + ":" + boat1.last_lap_sec, 20, 40);
    text("Best lap time " + boat1.best_lap_min + ":" + boat1.best_lap_sec, 20, 70);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(0.9 * 35);
    text("Laps " + boat1.round, 20 - 1, 10 - 1);
    text("Last lap time " + boat1.last_lap_min + ":" + boat1.last_lap_sec, 20 - 1, 40 - 1);
    text("Best lap time " + boat1.best_lap_min + ":" + boat1.best_lap_sec, 20 - 1, 70 - 1);
    if (game_mode == Mode.MULTIPLAYER) {
        fill(0);
        textAlign(LEFT, TOP);
        textSize(0.9 * 35);
        text("Laps " + boat2.round, 810, 10);
        text("Last lap time " + boat2.last_lap_min + ":" + boat2.last_lap_sec, 810, 40);
        text("Best lap time " + boat2.best_lap_min + ":" + boat2.best_lap_sec, 810, 70);
        fill(255);
        textAlign(LEFT, TOP);
        textSize(0.9 * 35);
        text("Laps " + boat2.round, 810 - 1, 10 - 1);
        text("Last lap time " + boat2.last_lap_min + ":" + boat2.last_lap_sec, 810 - 1, 40 - 1);
        text("Best lap time " + boat2.best_lap_min + ":" + boat2.best_lap_sec, 810 - 1, 70 - 1);
    }
}
function mousePressed() {
    userStartAudio();
}
function setupBoats() {
    boat1.x = 960;
    boat1.y = 1130;
    boat1.round = 0;
    boat1.cp_one = false;
    boat1.cp_two = false;
    boat1.cp_three = false;
    boat1.vel = 0;
    boat1.rot = -54;
    boat1.last_lap_sec = 0;
    boat1.last_lap_min = 0;
    boat1.best_lap_sec = 99;
    boat1.best_lap_min = 99;
    boat1.controls = {
        up: UP_ARROW,
        down: DOWN_ARROW,
        left: LEFT_ARROW,
        right: RIGHT_ARROW
    };
    boat2.x = 1060;
    boat2.y = 1200;
    boat2.round = 0;
    boat2.cp_one = false;
    boat2.cp_two = false;
    boat2.cp_three = false;
    boat2.vel = 0;
    boat2.rot = -54;
    boat2.last_lap_sec = 0;
    boat2.last_lap_min = 0;
    boat2.best_lap_sec = 99;
    boat2.best_lap_min = 99;
    boat2.controls = {
        up: 87,
        down: 83,
        left: 65,
        right: 68
    };
}
function keyPressed() {
    switch (key) {
        case "n":
            showDebugImage = null;
            break;
        case "m":
            showDebugImage = debugMainMenu;
            break;
        case "o":
            showDebugImage = debugOptions;
            break;
        case "c":
            showDebugImage = debugCredits;
            break;
        case "p":
            showDebugImage = debugPlay;
            break;
    }
}
function drawGameCameras() {
    if (game_mode == Mode.MULTIPLAYER) {
        camleft1 = constrain(boat1.x - 256, 0, ostrov.width - 1024 + 512);
        camup1 = constrain(boat1.y - 384, 0, ostrov.height - 768);
        leftBuffer.image(ostrov, -camleft1, -camup1);
        camleft2 = constrain(boat2.x - 256, 0, ostrov.width - 1024 + 512);
        camup2 = constrain(boat2.y - 384, 0, ostrov.height - 768);
        rightBuffer.image(ostrov, -camleft2, -camup2);
        boat1.draw(leftBuffer, camleft1, camup1);
        boat2.draw(leftBuffer, camleft1, camup1);
        boat1.draw(rightBuffer, camleft2, camup2);
        boat2.draw(rightBuffer, camleft2, camup2);
        image(leftBuffer, 0, 0);
        image(rightBuffer, 512, 0);
        stroke(0);
        line(512, 0, 512, 768);
    }
    if (game_mode == Mode.SINGLEPLAYER) {
        camleft1 = constrain(boat1.x - 512, 0, ostrov.width - 1024);
        camup1 = constrain(boat1.y - 384, 0, ostrov.height - 768);
        image(ostrov, -camleft1, -camup1);
        boat1.draw(null, camleft1, camup1);
        boat2.draw(null, camleft1, camup1);
    }
}
function textLabel(label, x, y, fillColor, horizAlign, vertAlign) {
    var _a, _b, _c;
    if (fillColor === void 0) { fillColor = color(0); }
    if (horizAlign === void 0) { horizAlign = CENTER; }
    if (vertAlign === void 0) { vertAlign = TOP; }
    noStroke();
    fill(fillColor);
    textAlign(horizAlign, vertAlign);
    textSize(label.size);
    textFont((_a = label.font) !== null && _a !== void 0 ? _a : airstream);
    x = x + ((_b = label.xOffset) !== null && _b !== void 0 ? _b : 0);
    y = y + ((_c = label.yOffset) !== null && _c !== void 0 ? _c : 0);
    if (label.rotate) {
        push();
        translate(x, y);
        rotate(label.rotate);
        translate(-x, -y);
    }
    text(label.text, x, y);
    if (label.rotate) {
        pop();
    }
}
function textButton(label, x, y, w, h, debug) {
    if (debug === void 0) { debug = true; }
    var mouseIsPressedInsideButton = false;
    var fillColor = 0;
    if (mouseX >= x && mouseX < x + w && mouseY >= y && mouseY < y + h) {
        fillColor = 255;
        if (mouseIsPressed) {
            mouseIsPressedInsideButton = true;
        }
    }
    textLabel(label, x, y, color(fillColor), CENTER, TOP);
    if (debug) {
        stroke(180);
        strokeWeight(1);
        noFill();
        rect(x, y, w, h);
    }
    return mouseIsPressedInsideButton;
}
var leftChevronLabel = {
    text: "‹",
    size: 0.9 * 60,
    xOffset: 15,
    yOffset: -13,
};
var rightChevronLabel = {
    text: "›",
    size: 0.9 * 60,
    xOffset: 10,
    yOffset: -13,
};
function leftChevronButton(x, y) {
    return textButton(leftChevronLabel, x, y, 25, 25);
}
function rightChevronButton(x, y) {
    return textButton(rightChevronLabel, x, y, 25, 25);
}
function optionSelector(options, pickedIndex, x, y, gapWidth) {
    var changedTo = -1;
    if (leftChevronButton(x, y)) {
        changedTo = (pickedIndex - 1) % options.length;
    }
    if (rightChevronButton(x + 25 + gapWidth, y)) {
        changedTo = (pickedIndex + 1) % options.length;
    }
    noStroke();
    fill(0);
    textSize(0.9 * 30);
    textAlign(CENTER, TOP);
    text(options[pickedIndex], floor(x + 25 + gapWidth / 2), y);
    return changedTo;
}
function optionLabel(text, x, y) {
    var label = {
        text: text,
        size: 0.9 * 30,
    };
    textLabel(label, x, y, color(0), RIGHT, TOP);
}
function optionsSectionLabel(text, x, y) {
    var label = {
        text: text,
        size: 0.9 * 30,
    };
    textLabel(label, x, y, color(255), CENTER, TOP);
}
//# sourceMappingURL=build.js.map