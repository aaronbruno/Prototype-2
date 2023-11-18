title = "prototype-2";

description = `
 Score as many baskets
 as possible within 1 min
[Hold]    Change angle
[Release] Shoot Ball
`;
characters = [
    `
 RRRR
RrrrrR
RrrrrR
RrrrrR
RrrrrR
 RRRR
    `,
    `
 YYYY
YYYYYY
YYYYYY
YYYYYY
YYYYYY
 YYYY
  `,
];
const xBounds = 200;
const yBounds = 100;
options = {
    viewSize: { x: xBounds, y: yBounds },
    isPlayingBgm: true,
    // isReplayEnabled: true,
    seed: 2,
    theme: "shapeDark",
    //isCapturing: true // uncomment to capture & press 'c'
};
let gameOver = false;
let player, v;
let isJumping;
let angle;
let width;
let space;
let scr;
let playerCollision;
let thrown = false;
// let gameTime = 1500; // One minute
let gameTime = 3000; // One minute

const groundX = 0;
const groundY = 90;
const groundWidth = 300;
const groundHeight = 10;
let angleSpeed = 0.02;
// Target Spawning variables
let targetY;
let targetSpeedBase = 0.5;
let targetSpeedMulti;
let targetSpeedCurr = 0.5;
let targetCollision = char("b", targetY);
score = 0;
var highScore = 0;

function spawn() {
    player = vec(100, 85);
    player = vec(100, 85);
    thrown = false;
}

function update() {
    if (gameTime <= 0) {
        endGame();
    }
    if (gameOver && input.isPressed) {
        // restart game
        gameOver = false;
        score = 0;
        gameTime = 3000;
    }
    if (!gameOver) {
        if (!ticks) {
            spawn();
            isJumping = angle = width = space = 0;
        }
        if (width + space < 0) {
            width = 200;
            space = rnd(50, 150);
        }
        color("blue");
        rect(groundX, groundY, groundWidth, groundHeight);
        color("black");
        gameTime--;
        drawTime(gameTime, 80, 3);
        playerCollision = char("a", player);
        //console.log(player.x);
        if (player.x < 0 || player.y > yBounds || player.x > xBounds) {
            setTimeout(spawn, 1000); // respawns after 1 second
            // play("lucky");
            // end(); // ends game
        }
        if (isJumping) {
            thrown = true;
            player.add(v);
            v.y += 0.1; // gravity
            if (playerCollision.isColliding.rect.blue && thrown) {
                isJumping = angle = 0;
                player.y = 85;
                setTimeout(spawn, 500);
            }
        } else {
            if (input.isPressed) {
                angle -= angleSpeed; // how fast the angle changes
                if (angle < -PI) { // (angle < -PI / 2) {
                    angleSpeed *= -1;
                } else if (angle > 0) {
                    angleSpeed *= -1;
                }
                bar(player, 20, 1.25, angle, 0); // this for aiming
            }
            if (input.isJustReleased) {
                play("jump");
                isJumping = 1;
                v = vec(4.5).rotate(angle); // controls how far ball goes
            }
        }
        scr = clamp(player.x - 50, 0, 99) * 0.1 + difficulty;
        //score += scr; controls score, for later
        // ----- Hoop Spawning & score updating -----
        if (!targetY) {
            targetY = 0;
        }
        // Move the hoop up and down
        targetY += targetSpeedCurr;
        targetSpeedMulti = rnd(1, 3);
        // Reverse direction when reaching the top or bottom
        if (targetY <= 0 || targetY >= yBounds - 10) {
            targetSpeedBase *= -1;
            targetSpeedCurr = targetSpeedBase * targetSpeedMulti;
        }

        // Draw the hoop
        char("b", 180, targetY); // hoop on the right
        char("b", 20, targetY); // hoop on the left

        onCollide();
    }
}
// Function to end the game and update the high score
function endGame() {
    gameOver = true;
    // play("explosion");
    if (score > highScore) {
        highScore = score;
    }
    targetY = undefined;
    end();
}
// Check for collision with the hoop
function onCollide() {
    if (char("a", player).isColliding.char.b) {
        play("powerUp"); // play sound effect
        addScore(1);
    }
}


// Code from skygolf
function drawTime(time, x, y) {
    let t = Math.floor((time * 100) / 50);
    if (t >= 10 * 60 * 100) {
        t = 10 * 60 * 100 - 1;
    }
    const ts =
        getPaddedNumber(Math.floor(t / 6000), 1) +
        "'" +
        getPaddedNumber(Math.floor((t % 6000) / 100), 2) +
        '"' +
        getPaddedNumber(Math.floor(t % 100), 2);
    text(ts, x, y);
}
// Code from skygolf
function getPaddedNumber(v, digit) {
    return ("0000" + v).slice(-digit);
}