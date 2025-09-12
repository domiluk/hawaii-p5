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
var BOAT_COLLISION_RADIUS = 28;
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
        g.stroke(0);
        g.noFill();
        g.circle(0, 0, BOAT_COLLISION_RADIUS * 2);
        g.pop();
    };
    Boat.prototype.update = function () {
        var gx = 0;
        var gy = 0;
        var accel = ACCEL * deltaTime / 1000;
        var slowdown = SLOWDOWN * deltaTime / 1000;
        var rotate_by = ROTATE_BY * deltaTime / 1000;
        if (keyIsDown(this.controls.up)) {
            this.speed += accel;
        }
        else {
            this.speed -= slowdown;
        }
        if (keyIsDown(this.controls.down)) {
            this.speed -= slowdown;
        }
        if (keyIsDown(this.controls.left)) {
            this.rot -= rotate_by;
        }
        if (keyIsDown(this.controls.right)) {
            this.rot += rotate_by;
        }
        this.speed = constrain(this.speed, 0, MAX_SPEED);
        var r = BOAT_COLLISION_RADIUS;
        var vx = this.speed * cos(this.rot);
        var vy = this.speed * sin(this.rot);
        if ((this.x - r < 0 && vx < 0) || (this.x + r >= ostrov.width && vx > 0)) {
            this.speed *= 0.5;
            this.rot = atan2(vy, -vx);
            this.x = constrain(this.x, r, ostrov.width - r - 1);
        }
        if ((this.y - r < 0 && vy < 0) || (this.y + r >= ostrov.height && vy > 0)) {
            this.speed *= 0.5;
            this.rot = atan2(-vy, vx);
            this.y = constrain(this.y, r, ostrov.height - r - 1);
        }
        var px = getpixel(alphaOstrov, this.x + gx, this.y + gy);
        var redValue = red(px);
        if (redValue == 64) {
            this.checkpoint1 = true;
        }
        else if (redValue == 128) {
            this.checkpoint2 = true;
        }
        else if (redValue == 32) {
            this.checkpoint3 = true;
        }
        else if (redValue == 192 && this.checkpoint1 && this.checkpoint2 && this.checkpoint3) {
            this.checkpoint1 = false;
            this.checkpoint2 = false;
            this.checkpoint3 = false;
            if (this.lapTime < this.bestLapTime) {
                this.bestLapTime = this.lapTime;
            }
            this.lapTime = 0;
            this.round++;
            dray.play();
        }
        this.x += this.speed * cos(this.rot) * deltaTime / 1000;
        this.y += this.speed * sin(this.rot) * deltaTime / 1000;
        this.lapTime += deltaTime / 1000;
    };
    Boat.prototype.collideWith = function (other) {
        var distance = dist(this.x, this.y, other.x, other.y);
        if (distance <= BOAT_COLLISION_RADIUS * 2) {
            var impact = p5.Vector.sub(createVector(other.x, other.y), createVector(this.x, this.y));
            var overlap = BOAT_COLLISION_RADIUS * 2 - distance;
            var dir = impact.copy().setMag(0.5 * overlap);
            this.x -= dir.x;
            this.y -= dir.y;
            other.x += dir.x;
            other.y += dir.y;
            var newDistance = BOAT_COLLISION_RADIUS * 2;
            impact.setMag(newDistance);
            var v1x = this.speed * cos(this.rot);
            var v1y = this.speed * sin(this.rot);
            var v2x = other.speed * cos(other.rot);
            var v2y = other.speed * sin(other.rot);
            var vDiff = p5.Vector.sub(createVector(v2x, v2y), createVector(v1x, v1y));
            var num = vDiff.dot(impact);
            var den = newDistance * newDistance;
            var deltaV1 = impact.copy().mult(num / den);
            var velocity1 = createVector(v1x, v1y).add(deltaV1);
            this.speed = sqrt(velocity1.x * velocity1.x + velocity1.y * velocity1.y);
            this.rot = atan2(velocity1.y, velocity1.x);
            var deltaV2 = impact.copy().mult(-num / den);
            var velocity2 = createVector(v2x, v2y).add(deltaV2);
            other.speed = sqrt(velocity2.x * velocity2.x + velocity2.y * velocity2.y);
            other.rot = atan2(velocity2.y, velocity2.x);
            spring.play();
        }
    };
    return Boat;
}());
function resetBoats() {
    boat1.x = 960;
    boat1.y = 1130;
    boat1.round = 0;
    boat1.checkpoint1 = false;
    boat1.checkpoint2 = false;
    boat1.checkpoint3 = false;
    boat1.speed = 0;
    boat1.rot = -54;
    boat1.lapTime = 0;
    boat1.bestLapTime = Infinity;
    boat1.controls = {
        up: UP_ARROW,
        down: DOWN_ARROW,
        left: LEFT_ARROW,
        right: RIGHT_ARROW
    };
    boat2.x = 1060;
    boat2.y = 1200;
    boat2.round = 0;
    boat2.checkpoint1 = false;
    boat2.checkpoint2 = false;
    boat2.checkpoint3 = false;
    boat2.speed = 0;
    boat2.rot = -54;
    boat2.lapTime = 0;
    boat2.bestLapTime = Infinity;
    boat2.controls = {
        up: 87,
        down: 83,
        left: 65,
        right: 68
    };
}
var Island = (function () {
    function Island() {
        this.points = [];
        this.segments = [];
    }
    Island.prototype.load = function (lines) {
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line_1 = lines_1[_i];
            var _a = line_1.split(" ").map(function (number) { return parseInt(number); }), x = _a[0], y = _a[1];
            this.points.push({ x: x, y: y });
        }
        for (var i = 0; i < this.points.length; i++) {
            var p1 = this.points[i];
            var p2 = i + 1 == this.points.length ? this.points[0] : this.points[i + 1];
            this.segments.push([p1, p2]);
        }
    };
    Island.prototype.draw = function (camleft, camup) {
        for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            var p1 = segment[0], p2 = segment[1];
            stroke(0);
            line(p1.x - camleft, p1.y - camup, p2.x - camleft, p2.y - camup);
        }
        for (var _b = 0, _c = this.points; _b < _c.length; _b++) {
            var point_1 = _c[_b];
            ellipse(point_1.x - camleft, point_1.y - camup, 5, 5);
        }
    };
    Island.prototype.collideWith = function (boat) {
        for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            var pos = createVector(boat.x, boat.y);
            var vel = createVector(boat.speed * cos(boat.rot), boat.speed * sin(boat.rot));
            var _b = collideCircleWithSegment(pos, vel, BOAT_COLLISION_RADIUS, segment, 0.5), newPos = _b.pos, newVel = _b.vel;
            boat.x = newPos.x;
            boat.y = newPos.y;
            boat.speed = newVel.mag();
            if (newVel.mag() > 1e-8) {
                boat.rot = atan2(newVel.y, newVel.x);
            }
        }
    };
    return Island;
}());
function clamp01(value) {
    return max(0, min(1, value));
}
function closestPointOnSegment(segment, point) {
    var A = createVector(segment[0].x, segment[0].y);
    var B = createVector(segment[1].x, segment[1].y);
    var AB = p5.Vector.sub(B, A);
    var AP = p5.Vector.sub(point, A);
    var len2 = AB.dot(AB);
    if (len2 == 0)
        return A;
    var t = clamp01(AP.dot(AB) / len2);
    return A.add(AB.mult(t));
}
function reflectVelocity(vel, normal, e) {
    if (e === void 0) { e = 1.0; }
    var vn = vel.dot(normal);
    if (vn >= 0)
        return vel.copy();
    return p5.Vector.sub(vel, normal.copy().mult((1 + e) * vn));
}
function collideCircleWithSegment(pos, vel, radius, segment, e) {
    if (e === void 0) { e = 1.0; }
    var Q = closestPointOnSegment(segment, pos);
    var toCenter = p5.Vector.sub(pos, Q);
    var d = toCenter.mag();
    var normal;
    if (d < 1e-8) {
        var A = createVector(segment[0].x, segment[0].y);
        var B = createVector(segment[1].x, segment[1].y);
        var AB = B.sub(A);
        normal = createVector(-AB.y, AB.x).normalize();
    }
    else {
        normal = toCenter.normalize();
    }
    var newPos = pos.copy();
    var newVel = vel.copy();
    if (d < radius) {
        var overlap = radius - d;
        newPos.add(normal.copy().mult(overlap));
        newVel = reflectVelocity(newVel, normal, e);
    }
    return { pos: newPos, vel: newVel };
}
var LEADERBOARD_KEY = "hawaii-leaderboard-v1";
var MAX_ENTRIES = 8;
function saveToLeaderboard(name, lapTime) {
    var currentBoard = getLeaderboard();
    currentBoard.push({ name: name, lapTime: lapTime });
    currentBoard.sort(function (a, b) { return a.lapTime - b.lapTime; });
    var topEntries = currentBoard.slice(0, MAX_ENTRIES);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
}
function getLeaderboard() {
    var stored = localStorage.getItem(LEADERBOARD_KEY);
    if (!stored)
        return [];
    return JSON.parse(stored);
}
var DT_HISTORY_LENGTH = 400;
var dtHistory = [];
var dtHistoryIndex = 0;
var Mode;
(function (Mode) {
    Mode[Mode["SINGLEPLAYER"] = 0] = "SINGLEPLAYER";
    Mode[Mode["MULTIPLAYER"] = 1] = "MULTIPLAYER";
})(Mode || (Mode = {}));
var gameMode = Mode.SINGLEPLAYER;
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
var isPaused = false;
var camup1 = 0;
var camup2 = 0;
var camleft1 = 0;
var camleft2 = 0;
var leftBuffer;
var rightBuffer;
var ostrov;
var alphaOstrov;
var panel;
var dray;
var spring;
var mainSample;
var muted = true;
var raceTime;
var sfxOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var sfxIndex = 10;
var sfxVol = 1;
var musicOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var musicIndex = 10;
var musicVol = 1;
var lapsOptions = [1, 3, 5, 7];
var lapsIndex = 1;
var nLaps = 3;
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
var topLeftIslandStrings;
var topLeftIsland;
var bottomRightIslandStrings;
var bottomRightIsland;
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
    alphaOstrov = loadImage("images/alpha1.png");
    menu = loadImage("images/menu.png");
    panel = loadImage("images/panel.png");
    soundFormats('wav');
    dray = loadSound("sounds/dray.wav");
    dray.setVolume(0);
    spring = loadSound("sounds/spring.wav");
    spring.setVolume(0);
    mainSample = loadSound("sounds/main.wav");
    mainSample.setVolume(0);
    topLeftIslandStrings = loadStrings("islands/topleft.txt");
    bottomRightIslandStrings = loadStrings("islands/bottomright.txt");
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
    mainSample.setLoop(true);
    mainSample.play();
    switchScene(Scene.MAIN_MENU);
    topLeftIsland = new Island();
    topLeftIsland.load(topLeftIslandStrings);
    bottomRightIsland = new Island();
    bottomRightIsland.load(bottomRightIslandStrings);
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
    text(mouseX + " : " + mouseY, mouseX + 5, mouseY - 15);
    if (scene == Scene.GAME && gameMode == Mode.SINGLEPLAYER) {
        text(floor(mouseX + camleft1) + " : " + floor(mouseY + camup1), mouseX + 5, mouseY - 35);
    }
    text("FPS: " + floor(frameRate()), mouseX + 5, mouseY - 55);
    stroke(0);
    line(mouseX - 10, mouseY, mouseX + 10, mouseY);
    line(mouseX, mouseY - 10, mouseX, mouseY + 10);
    dtHistory[dtHistoryIndex] = Math.round(deltaTime);
    for (var i = 0; i < dtHistory.length; i++) {
        stroke(0);
        var diffFromCurrent = dtHistoryIndex - i;
        if (diffFromCurrent < 0) {
            diffFromCurrent += DT_HISTORY_LENGTH;
        }
        if (diffFromCurrent > DT_HISTORY_LENGTH - 255) {
            stroke(0, 255 - (diffFromCurrent - DT_HISTORY_LENGTH + 255));
        }
        var x = 1024 - DT_HISTORY_LENGTH - 10 + i;
        line(x, 100 - dtHistory[i], x, 100);
    }
    dtHistoryIndex = (dtHistoryIndex + 1) % DT_HISTORY_LENGTH;
    dl_mouseIsPressed = false;
}
function switchScene(newScene, reset) {
    if (reset === void 0) { reset = true; }
    if (newScene == Scene.GAME) {
        if (reset) {
            resetBoats();
            raceTime = 0;
        }
    }
    scene = newScene;
}
function toggleMute() {
    muted = !muted;
    if (muted) {
        dray.setVolume(0);
        spring.setVolume(0);
        mainSample.setVolume(0);
    }
    else {
        dray.setVolume(sfxVol / 300);
        spring.setVolume(sfxVol / 300);
        mainSample.setVolume(musicVol / 300);
    }
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
    if (muted) {
        muteLabel.text = "\ueee8";
    }
    else {
        muteLabel.text = "\uf028";
    }
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
        gameMode = Mode.SINGLEPLAYER;
        switchScene(Scene.GAME);
    }
    var multiplayerLabel = {
        text: "Multiplayer",
        size: 0.9 * 60,
        xOffset: 106,
        yOffset: -3,
    };
    if (textButton(multiplayerLabel, 100, 400, 210, 42)) {
        gameMode = Mode.MULTIPLAYER;
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
    var lapsChangedToIndex = optionSelector(lapsOptions, lapsIndex, 800, 270, 30);
    if (lapsChangedToIndex != -1) {
        lapsIndex = lapsChangedToIndex;
        nLaps = lapsOptions[lapsChangedToIndex];
    }
    optionsSectionLabel("Settings", 800, 330);
    optionLabel("Sound volume", 775, 370);
    var sfxChangedToIndex = optionSelector(sfxOptions, sfxIndex, 800, 370, 45);
    if (sfxChangedToIndex != -1) {
        sfxIndex = sfxChangedToIndex;
        sfxVol = sfxOptions[sfxChangedToIndex];
        if (muted) {
            toggleMute();
        }
        spring.setVolume(sfxVol / 300);
        dray.setVolume(sfxVol / 300);
        dray.play();
    }
    optionLabel("Music volume", 775, 400);
    var musicChangedToIndex = optionSelector(musicOptions, musicIndex, 800, 400, 45);
    if (musicChangedToIndex != -1) {
        musicIndex = musicChangedToIndex;
        musicVol = musicOptions[musicChangedToIndex];
        if (muted) {
            toggleMute();
        }
        mainSample.setVolume(musicVol / 300);
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
    textAlign(RIGHT, TOP);
    text("Lap time", 674, 250);
    var entries = getLeaderboard();
    entries.forEach(function (entry, index) {
        textAlign(LEFT, TOP);
        text(entry.name, 370, 280 + index * 30);
        textAlign(RIGHT, TOP);
        text("".concat(index + 1, "."), 350, 280 + index * 30);
        text(formatAsTime(entry.lapTime, true), 674, 280 + index * 30);
    });
    for (var index = entries.length; index < MAX_ENTRIES; index++) {
        textAlign(LEFT, TOP);
        text("--", 370, 280 + index * 30);
        textAlign(RIGHT, TOP);
        text("".concat(index + 1, "."), 350, 280 + index * 30);
        text("--", 674, 280 + index * 30);
    }
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
    if (boat1.round == nLaps) {
        text("Player no.1", 512, 434);
    }
    else {
        text("Player no.2", 512, 434);
    }
}
function drawPauseMenu() {
    fill(0, 0, 0, 127);
    rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    textFont(airstream);
    fill(255);
    textSize(50);
    text("PAUSED", width / 2, height / 2 - 80);
    textSize(30);
    var resumeY = height / 2 - 20;
    var mainMenuY = height / 2 + 20;
    if (mouseY >= resumeY - 15 && mouseY <= resumeY + 15 &&
        mouseX >= width / 2 - 100 && mouseX <= width / 2 + 100) {
        fill("#ff0000");
        if (mouseIsPressed) {
            isPaused = false;
        }
    }
    else {
        fill(255);
    }
    text("Resume", width / 2, resumeY);
    if (mouseY >= mainMenuY - 15 && mouseY <= mainMenuY + 15 &&
        mouseX >= width / 2 - 100 && mouseX <= width / 2 + 100) {
        fill("#ff0000");
        if (mouseIsPressed) {
            isPaused = false;
            switchScene(Scene.MAIN_MENU);
        }
    }
    else {
        fill(255);
    }
    text("Main Menu", width / 2, mainMenuY);
}
function game() {
    if (!isPaused) {
        if (boat1.round == nLaps || boat2.round == nLaps) {
            switchScene(Scene.GAME_OVER);
            if (boat1.round == nLaps) {
                saveToLeaderboard(player1textBox.input || "Player 1", boat1.bestLapTime);
            }
            else {
                saveToLeaderboard(player2textBox.input || "Player 2", boat2.bestLapTime);
            }
        }
        raceTime += deltaTime / 1000;
        boat1.collideWith(boat2);
        topLeftIsland.collideWith(boat1);
        topLeftIsland.collideWith(boat2);
        bottomRightIsland.collideWith(boat1);
        bottomRightIsland.collideWith(boat2);
        boat1.update();
        if (gameMode == Mode.MULTIPLAYER) {
            boat2.update();
        }
        else if (gameMode == Mode.SINGLEPLAYER) {
            boat2.update();
        }
    }
    drawGameCameras();
    drawTimerPanels();
    if (isPaused) {
        drawPauseMenu();
    }
}
function drawTimerPanels() {
    var opacity = 255;
    if (gameMode == Mode.SINGLEPLAYER) {
        var x = boat1.x - camleft1;
        var y = boat1.y - camup1;
        if (x > 512 - 100 && x < 512 + 100 && y < 100) {
            opacity = 127;
        }
    }
    else {
        var x1 = boat1.x - camleft1;
        var y1 = boat1.y - camup1;
        var x2 = boat2.x - camleft2;
        var y2 = boat2.y - camup2;
        if ((x1 > 512 - 100 && x1 < 512 && y1 < 100) || (x2 > 0 && x2 < 100 && y2 < 100)) {
            opacity = 127;
        }
    }
    tint(255, opacity);
    image(panel, 512 - 100, 0);
    tint(255, 255);
    textAlign(CENTER, TOP);
    noStroke();
    fill(255);
    textSize(0.9 * 75);
    text(formatAsTime(raceTime, false), 512, 0);
    textSize(0.9 * 20);
    text("powered by DL games", 512, 70);
    textAlign(LEFT, TOP);
    textSize(0.9 * 35);
    white_text_with_shadow("Lap " + (boat1.round + 1) + " of " + nLaps, 20, 10);
    white_text_with_shadow("Lap time " + formatAsTime(boat1.lapTime, true), 20, 40);
    if (boat1.bestLapTime == Infinity) {
        white_text_with_shadow("Best lap time --:--", 20, 70);
    }
    else {
        white_text_with_shadow("Best lap time " + formatAsTime(boat1.bestLapTime, true), 20, 70);
    }
    if (gameMode == Mode.MULTIPLAYER) {
        textAlign(LEFT, TOP);
        textSize(0.9 * 35);
        white_text_with_shadow("Lap " + (boat2.round + 1) + " of " + nLaps, 810, 10);
        white_text_with_shadow("Lap time " + formatAsTime(boat2.lapTime, true), 810, 40);
        if (boat2.bestLapTime == Infinity) {
            white_text_with_shadow("Best lap time --:--", 810, 70);
        }
        else {
            white_text_with_shadow("Best lap time " + formatAsTime(boat2.bestLapTime, true), 810, 70);
        }
    }
}
function formatAsTime(seconds, includeMillis) {
    var min = Math.floor(seconds / 60);
    var sec = Math.floor(seconds % 60);
    var ms = Math.floor((seconds % 1) * 100);
    if (includeMillis) {
        if (min == 0) {
            return nf(sec, 1) + "." + nf(ms, 2);
        }
        return nf(min, 1) + ":" + nf(sec, 2) + "." + nf(ms, 2);
    }
    return nf(min, 1) + ":" + nf(sec, 2);
}
function white_text_with_shadow(str, x, y) {
    fill(0);
    text(str, x, y);
    fill(255);
    text(str, x - 1, y - 1);
}
var isFirstClick = true;
function mousePressed() {
    dl_mouseIsPressed = true;
    if (isFirstClick) {
        userStartAudio();
        toggleMute();
        isFirstClick = false;
        if (mouseX >= 883 && mouseX < 928 && mouseY >= 678 && mouseY < 711) {
            dl_mouseIsPressed = false;
        }
    }
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
    if (key == "m") {
        toggleMute();
    }
    if (scene == Scene.OPTIONS) {
        player1textBox.keyPressed();
        player2textBox.keyPressed();
    }
    if (scene == Scene.GAME) {
        if (keyCode == ESCAPE) {
            isPaused = !isPaused;
            if (isPaused) {
                dray.stop();
                spring.stop();
            }
        }
    }
}
function keyTyped() {
    if (scene == Scene.OPTIONS) {
        player1textBox.keyTyped();
        player2textBox.keyTyped();
    }
}
function drawGameCameras() {
    if (gameMode == Mode.MULTIPLAYER) {
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
    else if (gameMode == Mode.SINGLEPLAYER) {
        camleft1 = constrain(boat1.x - 512, 0, ostrov.width - 1024);
        camup1 = constrain(boat1.y - 384, 0, ostrov.height - 768);
        image(ostrov, -camleft1, -camup1);
        boat1.draw(null, camleft1, camup1);
        boat2.draw(null, camleft1, camup1);
        topLeftIsland.draw(camleft1, camup1);
        bottomRightIsland.draw(camleft1, camup1);
    }
}
var dl_mouseIsPressed = false;
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
        if (dl_mouseIsPressed) {
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
        changedTo = constrain(pickedIndex - 1, 0, options.length - 1);
    }
    if (rightChevronButton(x + 25 + gapWidth, y)) {
        changedTo = constrain(pickedIndex + 1, 0, options.length - 1);
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
        this.input = "MMMMMMMM";
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