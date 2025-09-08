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
        var gx = 0;
        var gy = 0;
        if (red(getpixel(alpha_ostrov, this.x + gx, this.y + gy)) == 0) {
            this.rot += 180;
        }
        if (keyIsDown(this.controls.up)) {
            this.vel += ACCEL * deltaTime / 1000;
        }
        else {
            this.vel -= SLOWDOWN * deltaTime / 1000;
        }
        if (keyIsDown(this.controls.down)) {
            this.vel -= SLOWDOWN * deltaTime / 1000;
        }
        if (keyIsDown(this.controls.left)) {
            this.rot -= ROTATE_BY * deltaTime / 1000;
        }
        if (keyIsDown(this.controls.right)) {
            this.rot += ROTATE_BY * deltaTime / 1000;
        }
        this.vel = constrain(this.vel, 0, MAX_SPEED);
        this.x += cos(this.rot) * this.vel * deltaTime / 1000;
        this.y += sin(this.rot) * this.vel * deltaTime / 1000;
    };
    return Boat;
}());
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
var panel;
var dray;
var spring;
var main_sample;
var muted;
var global_sec;
var global_min;
var vol = 255;
var nlaps = 3;
var ROTATE_BY = 1.5 * 60;
var MAX_SPEED = 6.5 * 60;
var ACCEL = 0.05 * 3600;
var SLOWDOWN = 0.08 * 3600;
var boat1;
var boat2;
var menu;
var airstream;
var symbols;
var player1textBox;
var player2textBox;
function mooove_time() {
    global_sec++;
    if (global_sec == 60) {
        global_min++;
        global_sec = 0;
    }
}
var time_interval;
function preload() {
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
    resetBoats();
    player1textBox = new TextBox("Name:", 8, 190, 295);
    player2textBox = new TextBox("Name:", 8, 190, 405);
    textFont(airstream);
    textSize(50);
    switchScene(Scene.OPTIONS);
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
        time_interval = setInterval(mooove_time, 1000);
        if (reset) {
            resetBoats();
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
    textSize(0.9 * 30);
    textAlign(CENTER, TOP);
    fill("#bb0000");
    stroke(200);
    strokeWeight(2);
    text("Player 1", 190, 230);
    strokeWeight(1);
    textFont(airstream);
    textSize(0.9 * 30);
    noStroke();
    fill(0);
    text("Controlled by Arrows", 190, 260);
    player1textBox.update();
    player1textBox.draw();
    textSize(0.9 * 30);
    textAlign(CENTER, TOP);
    fill("#00bb00");
    stroke(50);
    strokeWeight(2);
    text("Player 2", 190, 340);
    strokeWeight(1);
    textFont(airstream);
    textSize(0.9 * 30);
    noStroke();
    fill(0);
    text("Controlled by WASD", 190, 370);
    player2textBox.update();
    player2textBox.draw();
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
    if (boat1.round == nlaps) {
        text("Player no.1", 512, 434);
    }
    else {
        text("Player no.2", 512, 434);
    }
}
function game() {
    if (keyIsPressed && keyCode == ESCAPE) {
        switchScene(Scene.MAIN_MENU);
        clearInterval(time_interval);
    }
    if (boat1.round == nlaps || boat2.round == nlaps) {
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
    text(global_min, 472, 0);
    text(":", 512, 0);
    text(global_sec < 10 ? "0" + global_sec : global_sec, 555, 0);
    textSize(0.9 * 20);
    text("powered by DL games", 512, 70);
    textAlign(LEFT, TOP);
    textSize(0.9 * 35);
    white_text_with_shadow("Lap " + (boat1.round + 1) + " of " + nlaps, 20, 10);
    white_text_with_shadow("Lap time " + boat1.last_lap_min + ":" + boat1.last_lap_sec, 20, 40);
    if (boat1.best_lap_sec == 99) {
        white_text_with_shadow("Best lap time --:--", 20, 70);
    }
    else {
        white_text_with_shadow("Best lap time " + boat1.best_lap_min + ":" + boat1.best_lap_sec, 20, 70);
    }
    if (game_mode == Mode.MULTIPLAYER) {
        textAlign(LEFT, TOP);
        textSize(0.9 * 35);
        white_text_with_shadow("Lap " + (boat2.round + 1) + " of " + nlaps, 810, 10);
        white_text_with_shadow("Lap time " + boat2.last_lap_min + ":" + boat2.last_lap_sec, 810, 40);
        if (boat2.best_lap_sec == 99) {
            white_text_with_shadow("Best lap time --:--", 810, 70);
        }
        else {
            white_text_with_shadow("Best lap time " + boat2.best_lap_min + ":" + boat2.best_lap_sec, 810, 70);
        }
    }
}
function white_text_with_shadow(str, x, y) {
    fill(0);
    text(str, x, y);
    fill(255);
    text(str, x - 1, y - 1);
}
function mousePressed() {
    userStartAudio();
    if (scene == Scene.OPTIONS) {
        player1textBox.mousePressed();
        player2textBox.mousePressed();
    }
}
function mouseMoved() {
    if (scene == Scene.OPTIONS) {
        player1textBox.mouseMoved();
        player2textBox.mouseMoved();
    }
}
function keyPressed() {
    if (scene == Scene.OPTIONS) {
        player1textBox.keyPressed();
        player2textBox.keyPressed();
    }
}
function keyTyped() {
    if (scene == Scene.OPTIONS) {
        player1textBox.keyTyped();
        player2textBox.keyTyped();
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
function resetBoats() {
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
var TextBox = (function () {
    function TextBox(label, maxLen, x, y) {
        this.input = "WWWWWWWW";
        this.focused = false;
        this.highlighted = false;
        this.cursorVisible = true;
        this.lastBlinkTime = 0;
        this.label = label;
        this.maxLen = maxLen;
        this.x = x;
        this.y = y;
        this.w = 0;
        this.h = 0.9 * 30;
    }
    TextBox.prototype.update = function () {
        if (this.focused) {
            var currentTime = millis();
            if (currentTime - this.lastBlinkTime > 500) {
                this.cursorVisible = !this.cursorVisible;
                this.lastBlinkTime = currentTime;
            }
            if (this.highlighted) {
                this.highlighted = false;
            }
        }
    };
    TextBox.prototype.draw = function () {
        textSize(0.9 * 30);
        var width = textWidth(this.label + " " + this.input);
        this.w = width;
        stroke(150);
        noFill();
        rect(this.x - width / 2, this.y, width, this.h);
        textAlign(CENTER, TOP);
        noStroke();
        fill(this.highlighted || this.focused ? 255 : 0);
        text(this.label + " " + this.input, this.x, this.y);
        if (this.focused) {
            if (this.cursorVisible) {
                var cursorX = this.x + this.w / 2 + 5;
                stroke(255);
                line(cursorX, this.y + 2, cursorX, this.y + this.h - 4);
            }
        }
    };
    TextBox.prototype.keyTyped = function () {
        if (!this.focused)
            return;
        if (/^[ a-zA-Z0-9]$/.test(key) && this.input.length < this.maxLen) {
            this.input += key;
            this.resetBlink();
        }
    };
    TextBox.prototype.keyPressed = function () {
        if (!this.focused)
            return;
        if (keyCode === BACKSPACE && this.input.length > 0) {
            this.input = this.input.slice(0, -1);
            this.resetBlink();
        }
    };
    TextBox.prototype.mousePressed = function () {
        var mouseInside = mouseX >= this.x - this.w / 2 && mouseX < this.x + this.w / 2 &&
            mouseY >= this.y && mouseY < this.y + this.h;
        this.focused = mouseInside;
        if (this.focused)
            this.resetBlink();
    };
    TextBox.prototype.mouseMoved = function () {
        var mouseInside = mouseX >= this.x - this.w / 2 && mouseX < this.x + this.w / 2 &&
            mouseY >= this.y && mouseY < this.y + this.h;
        this.highlighted = mouseInside;
    };
    TextBox.prototype.resetBlink = function () {
        this.cursorVisible = true;
        this.lastBlinkTime = millis();
    };
    return TextBox;
}());
//# sourceMappingURL=build.js.map