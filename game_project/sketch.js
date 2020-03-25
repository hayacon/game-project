/*

- Coursework 2.2 Game project
- Final game project 

-My first extention is "add sound". I added a sound when charchter jumped, correct correctable items, and when it reaches a goal (flag pole). 
I found that placeing code which play a sound to right place was difficult. In some cases sound would play as a noise. I asumme this happened because of for loop or loop of draw function. From this experience I learned that understand how code being excute is very important. Without this understnading it is very hard to create complicated program. Also, I learned how to include a data from other file to my code. It seems quite simple but you need know where is that file stored and code path to that file. I stored all sound data on a file within a same folder as all other files for this game project located. It is very important to keep all of files in same folder, so you can call a ceratin data form other file easily. 

-My second extention is "create platform ". I added platforms which charcter can jump on to, and it located on several diffrernt places. I used factory pattern to create several platforms that has same functinarity. It is very simple to create just a platform, but it was bit difficult with factory pattern. I needed to code it the way that mutiple object can be created easily from one function. It was way more compliceted than just create one object. I learned lots about how to create factory pattern from this extension. I also learn taht very basic code can be applied to various ways and create some complicated object or functionality. I would love to learn more of those kind of applied coding technique such as factory pattern, or constractor function. 

- I also add one more extention "create enermy". 

-I learned a lot from this course and am looking forward to learn more with Intri Programing 2. 
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var canyons;
var collectable;
var trees_x;
var platforms;

var game_score;
var flagpole;
var lives;


var jumpSound;
var itemSound;
var flagSound;
var completeSound;

var enermy;


function preload() {
    soundFormats('mp3', 'wav');

    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    itemSound = loadSound('assets/item.wav');
    completeSound = loadSound('assets/complete.mp3');
    flagSound = loadSound('assets/flag.wav');

    // volume of each sound
    jumpSound.setVolume(0.5);
    itemSound.setVolume(0.5);
    completeSound.setVolume(0.5);
    flagSound.setVolume(0.5);
}


function setup() {
    createCanvas(1024, 576);

    floorPos_y = height * 3 / 4;
    lives = 3;

    // all setups for starting game
    startGame();

}

function startGame() {



    gameChar_x = width / 2;
    gameChar_y = floorPos_y;

    // Variable to control the background scrolling.
    scrollPos = 0;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;


    // Initialise arrays of scenery objects.

    // tree
    trees_x = [-500, -300, -50, 100, 200, 400, 700, 1000, 1030, 1200, 1400, 1600];

    // clouds
    clouds = [
        {
            x: -100,
            y: 80
        },
        {
            x: -300,
            y: 80
        },
        {
            x: -600,
            y: 80
        },
        {
            x: 100,
            y: 80
        },
        {
            x: 500,
            y: 60
        },
        {
            x: 800,
            y: 100
        },
        {
            x: 1100,
            y: 100
        },
        {
            x: 1400,
            y: 100
        },
        {
            x: 1300,
            y: 100
        },
    ];

    // mountains
    mountains = [{
        x: -700
    }, {
        x: 30
    }, {
        x: 200
    }, {
        x: 600
    }, {
        x: 1300
    }, ];

    // canyons
    canyons = [
        {
            x_pos: -700,
            width: 30
        },
        {
            x_pos: 200,
            width: 30
        },
        {
            x_pos: 1100,
            width: 20
        },
    ];

    // collectables
    collectable = [
        {
            x_pos: -700,
            y_pos: floorPos_y - 140,
            size: -3,
            isFound: false
        },
        {
            x_pos: -400,
            y_pos: floorPos_y - 110,
            size: -2,
            isFound: false
        },
        {
            x_pos: 100,
            y_pos: floorPos_y - 110,
            size: 1,
            isFound: false
        },
        {
            x_pos: 750,
            y_pos: floorPos_y - 130,
            size: -1,
            isFound: false
        },
        {
            x_pos: 1050,
            y_pos: floorPos_y - 130,
            size: 1,
            isFound: false
        },
        {
            x_pos: 1550,
            y_pos: floorPos_y - 110,
            size: -5,
            isFound: false
        },
    ];


    // draw enermies 
    mouseimg = loadImage('assets/mouse.png');

    enermy = [];
    enermy.push(new Enermy(-200, 400));
    enermy.push(new Enermy(0, 240));
    enermy.push(new Enermy(600, 400));
    enermy.push(new Enermy(600, 300));
    //    enermy.push(new Enermy(1300, 400));




    // draw platform 
    platforms = [];

    platforms.push(createPlatfrom(100, floorPos_y - 75, 100));
    platforms.push(createPlatfrom(400, floorPos_y - 75, 50));
    platforms.push(createPlatfrom(800, floorPos_y - 75, 70));
    platforms.push(createPlatfrom(-100, floorPos_y - 75, 90));
    platforms.push(createPlatfrom(1000, floorPos_y - 75, 100));



    // game score 
    game_score = 0;

    // location of goal pole
    flagpole = {
        isReached: false,
        x_pos: 1500
    };






}

function draw() {
    background(100, 155, 255); // fill the sky blue


    noStroke();
    fill(0, 155, 0);
    rect(0, floorPos_y, width, height / 4); // draw some green ground

    push();
    translate(scrollPos, 0);
    // Draw clouds.
    drawCloud();

    // Draw mountains.
    drawMountain();

    // Draw trees.
    drawTree();


    // Draw canyons.
    for (let i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    };

    // Draw collectable items.
    for (let j = 0; j < collectable.length; j++) {
        if (!collectable[j].isFound) {
            drawCollectable(collectable[j]);
            checkCollectable(collectable[j]);
        };
    }

    // draw platform 
    for (var i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }


    // draw flag
    renderFlagpole();

    // draw enermy
    for (var i = 0; i < enermy.length; i++) {
        enermy[i].draw();
        enermy[i].update();

        var isContact = enermy[i].checkContact(gameChar_world_x, gameChar_y)
        if (isContact == true) {
            lives -= 1;

            if (lives > 0) {
                startGame();
                break;
            }

            if (lives < 0) {
                fill(255, 0, 0);
                textSize(40);
                text("GAME OVER. Press space to continue.", width / 2 - 300, height / 2);
                gameChar_y = 2000;
                gameChar_y += 100;
                return;

            }
        }
    }




    pop();

    // Draw game character.
    drawGameChar();

    // score counting display 
    fill(255);
    noStroke();
    textSize(15);
    text("score: " + game_score, 30, 30);

    // Logic to make the game character move or the background scroll.
    if (isLeft) {
        if (gameChar_x > width * 0.2) {
            gameChar_x -= 2;
        } else {
            scrollPos += 2;
        }
    }

    if (isRight) {
        if (gameChar_x < width * 0.8) {
            gameChar_x += 2;
        } else {
            scrollPos -= 2; // negative for moving against the background
        }
    }

    // Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y) {
        var isContact = false;

        for (var i = 0; i < platforms.length; i++) {
            if (platforms[i].checkContact(gameChar_world_x, gameChar_y) == true) {
                isContact = true;
                isFalling = false;
                break;
            }
        }
        if (isContact == false) {
            gameChar_y += 1;
            isFalling = true;
        }
    } else {
        isFalling = false;
    }


    if (flagpole.isReached == false) {
        checkFlagpole();
    }

    checkPlayerDie();
    livescount();


    if (flagpole.isReached == true && lives > 0) {
        fill(255, 255, 0);
        noStroke();
        textSize(20);
        text("Level complete. Press space to continue.", width / 2, height / 2 - 100);
        return;
    }






    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

// input for move character around
function keyPressed() {

    if (keyCode == 68) {
        console.log("isRIght is true");
        isRight = true;
    }

    if (keyCode == 65) {
        console.log("isLeft is true");
        isLeft = true;
    }

    if ((keyCode == 87 || keyCode == 32) && lives > 0) {
        if (isFalling == false) {
            console.log("jump");
            gameChar_y -= 100;
            jumpSound.play();
        }
    }
}
// input for move character around
function keyReleased() {
    if (keyCode == 68) {
        console.log("isRIght is false");
        isRight = false;
    }

    if (keyCode == 65) {
        console.log("isLeft is false");
        isLeft = false;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
    // draw game character
    if (isLeft && isFalling) {
        // add your jumping-left code
        fill(0, 51, 153);
        stroke(0, 0, 0);
        strokeWeight(1);
        //legs
        rect(gameChar_x - 20, gameChar_y - 30 + 13, 30, 10, 10);
        rect(gameChar_x - 3, gameChar_y - 30 + 10, 10, 20, 10);
        ellipse(gameChar_x - 20, gameChar_y - 24 + 13, 5, 13);
        ellipse(gameChar_x + 2, gameChar_y - 10 + 10, 13, 5);

        // arms
        strokeWeight(5);
        line(gameChar_x - 14, gameChar_y - 35 + 10, gameChar_x - 18, gameChar_y - 28);
        strokeWeight(1);
        ellipse(gameChar_x - 18, gameChar_y - 28, 6.5);

        // body
        strokeWeight(1);
        rect(gameChar_x - 13, gameChar_y - 55 + 10, 25, 40, 15)

        // face
        ellipse(gameChar_x, gameChar_y - 55 + 5 + 10, 35, 33);
        fill(255, 255, 255)
        ellipse(gameChar_x - 7, gameChar_y - 51 + 5 + 7, 21, 26);

        // eyes
        ellipse(gameChar_x - 8, gameChar_y - 63 + 5 + 8, 7, 10);
        strokeWeight(3);
        point(gameChar_x - 9, gameChar_y - 63 + 5 + 8);
        stroke(0)
        strokeWeight(1);
        strokeWeight(5);
        stroke(255, 0, 0);
        point(gameChar_x - 17, gameChar_y - 58 + 5 + 10);

        noFill();
        stroke(0)
        strokeWeight(1)
        beginShape();
        curveVertex(gameChar_x + 8 - 13, gameChar_y - 42 + 7);
        curveVertex(gameChar_x + 5 - 13, gameChar_y - 40 + 7);
        curveVertex(gameChar_x + 3 - 13, gameChar_y - 38 + 7);
        curveVertex(gameChar_x - 3 - 13, gameChar_y - 38 + 7);
        curveVertex(gameChar_x - 3 - 9, gameChar_y - 38 + 7);
        curveVertex(gameChar_x - 3 - 9, gameChar_y - 38 + 7);
        endShape();

    } else if (isRight && isFalling) {
        // add your jumping-right code
        fill(0, 51, 153);
        stroke(0, 0, 0);
        strokeWeight(1);
        //legs
        rect(gameChar_x - 10, gameChar_y - 30 + 13, 30, 10, 10);
        rect(gameChar_x - 8, gameChar_y - 30 + 10, 10, 20, 10);
        ellipse(gameChar_x + 20, gameChar_y - 24 + 13, 5, 13);
        ellipse(gameChar_x - 2, gameChar_y - 10 + 10, 13, 5);

        // arms
        strokeWeight(5);
        line(gameChar_x + 17, gameChar_y - 28, gameChar_x + 10, gameChar_y - 35 + 10);

        strokeWeight(1);
        ellipse(gameChar_x + 17, gameChar_y - 28, 6.5);

        // body
        strokeWeight(1);
        rect(gameChar_x - 14, gameChar_y - 55 + 10, 25, 40, 15)

        // face
        ellipse(gameChar_x, gameChar_y - 55 + 5 + 10, 35, 33);
        fill(255, 255, 255)
        ellipse(gameChar_x + 7, gameChar_y - 51 + 5 + 7, 21, 26);

        // eyes
        ellipse(gameChar_x + 8, gameChar_y - 63 + 5 + 8, 7, 10);
        strokeWeight(3);

        point(gameChar_x + 9, gameChar_y - 63 + 5 + 8);
        stroke(0)
        strokeWeight(1);

        strokeWeight(5);
        stroke(255, 0, 0);
        point(gameChar_x + 17, gameChar_y - 58 + 5 + 10);

        noFill();
        stroke(0)
        strokeWeight(1)
        beginShape();
        curveVertex(gameChar_x + 8 + 9, gameChar_y - 38 + 8);
        curveVertex(gameChar_x + 5 + 9, gameChar_y - 38 + 8);
        curveVertex(gameChar_x + 3 + 13, gameChar_y - 38 + 8);
        curveVertex(gameChar_x - 3 + 13, gameChar_y - 38 + 8);
        curveVertex(gameChar_x - 5 + 13, gameChar_y - 40 + 8);
        curveVertex(gameChar_x - 8 + 13, gameChar_y - 42 + 8);
        endShape();


    } else if (isLeft) {
        // add your walking left code
        fill(0, 51, 153);
        stroke(0, 0, 0);
        strokeWeight(1);
        //legs
        rect(gameChar_x - 20, gameChar_y - 30 + 13, 30, 10, 10);
        rect(gameChar_x - 3, gameChar_y - 30 + 10, 10, 20, 10);
        ellipse(gameChar_x - 20, gameChar_y - 24 + 13, 5, 13);
        ellipse(gameChar_x + 2, gameChar_y - 10 + 10, 13, 5);

        // arms
        strokeWeight(5);
        line(gameChar_x - 15, gameChar_y - 35 + 10, gameChar_x - 17, gameChar_y - 35 + 10);

        strokeWeight(1);
        ellipse(gameChar_x - 17, gameChar_y - 35 + 10, 6.5);

        // body
        strokeWeight(1);
        rect(gameChar_x - 13, gameChar_y - 55 + 10, 25, 40, 15)

        // face
        ellipse(gameChar_x, gameChar_y - 55 + 5 + 10, 35, 33);
        fill(255, 255, 255)
        ellipse(gameChar_x - 7, gameChar_y - 51 + 5 + 7, 21, 26);

        // eyes
        ellipse(gameChar_x - 8, gameChar_y - 63 + 5 + 8, 7, 10);
        strokeWeight(3);
        point(gameChar_x - 9, gameChar_y - 63 + 5 + 8);
        stroke(0)
        strokeWeight(1);
        strokeWeight(5);
        stroke(255, 0, 0);
        point(gameChar_x - 17, gameChar_y - 58 + 5 + 10);

        noFill();
        stroke(0)
        strokeWeight(1)
        beginShape();
        curveVertex(gameChar_x + 8 - 13, gameChar_y - 42 + 7);
        curveVertex(gameChar_x + 5 - 13, gameChar_y - 40 + 7);
        curveVertex(gameChar_x + 3 - 13, gameChar_y - 38 + 7);
        curveVertex(gameChar_x - 3 - 13, gameChar_y - 38 + 7);
        curveVertex(gameChar_x - 3 - 9, gameChar_y - 38 + 7);
        curveVertex(gameChar_x - 3 - 9, gameChar_y - 38 + 7);
        endShape();

    } else if (isRight) {
        // add your walking right code
        fill(0, 51, 153);
        stroke(0, 0, 0);
        strokeWeight(1);
        //legs
        rect(gameChar_x - 10, gameChar_y - 30 + 13, 30, 10, 10);
        rect(gameChar_x - 8, gameChar_y - 30 + 10, 10, 20, 10);
        ellipse(gameChar_x + 20, gameChar_y - 24 + 13, 5, 13);
        ellipse(gameChar_x - 2, gameChar_y - 10 + 10, 13, 5);

        // arms
        strokeWeight(5);
        line(gameChar_x + 15, gameChar_y - 35 + 10, gameChar_x + 10, gameChar_y - 35 + 10);
        strokeWeight(1);
        ellipse(gameChar_x + 17, gameChar_y - 35 + 10, 6.5);

        // body
        strokeWeight(1);
        rect(gameChar_x - 14, gameChar_y - 55 + 10, 25, 40, 15)

        // face
        ellipse(gameChar_x, gameChar_y - 55 + 5 + 10, 35, 33);
        fill(255, 255, 255)
        ellipse(gameChar_x + 7, gameChar_y - 51 + 5 + 7, 21, 26);

        // eyes
        ellipse(gameChar_x + 8, gameChar_y - 63 + 5 + 8, 7, 10);
        strokeWeight(3);
        point(gameChar_x + 9, gameChar_y - 63 + 5 + 8);
        stroke(0)
        strokeWeight(1);
        strokeWeight(5);
        stroke(255, 0, 0);
        point(gameChar_x + 17, gameChar_y - 58 + 5 + 10);

        noFill();
        stroke(0)
        strokeWeight(1)
        beginShape();
        curveVertex(gameChar_x + 8 + 9, gameChar_y - 38 + 8);
        curveVertex(gameChar_x + 5 + 9, gameChar_y - 38 + 8);
        curveVertex(gameChar_x + 3 + 13, gameChar_y - 38 + 8);
        curveVertex(gameChar_x - 3 + 13, gameChar_y - 38 + 8);
        curveVertex(gameChar_x - 5 + 13, gameChar_y - 40 + 8);
        curveVertex(gameChar_x - 8 + 13, gameChar_y - 42 + 8);
        endShape();


    } else if (isFalling || isPlummeting) {
        // add your jumping facing forwards code
        fill(0, 51, 153);
        stroke(0, 0, 0);
        strokeWeight(1);

        //legs
        rect(gameChar_x - 13, gameChar_y - 30 + 10, 10, 20, 10);
        rect(gameChar_x + 3, gameChar_y - 30 + 10, 10, 20, 10);
        ellipse(gameChar_x - 8, gameChar_y - 10 + 10, 13, 5);
        ellipse(gameChar_x + 8.5, gameChar_y - 10 + 10, 13, 5);

        // arms
        strokeWeight(5);
        line(gameChar_x - 15, gameChar_y - 35 + 10, gameChar_x - 19, gameChar_y - 28);
        line(gameChar_x + 15, gameChar_y - 35 + 10, gameChar_x + 19, gameChar_y - 28);
        strokeWeight(1);
        ellipse(gameChar_x - 19, gameChar_y - 28, 6.5);
        ellipse(gameChar_x + 20, gameChar_y - 28, 6.5);

        // body
        strokeWeight(1);
        rect(gameChar_x - 15, gameChar_y - 55 + 10, 30, 40, 15)

        // face
        ellipse(gameChar_x, gameChar_y - 55 + 5 + 10, 35, 33);
        fill(255, 255, 255)
        ellipse(gameChar_x, gameChar_y - 51 + 5 + 10, 27, 25);
        ellipse(gameChar_x + 4, gameChar_y - 63 + 5 + 10, 7, 10);
        ellipse(gameChar_x - 4, gameChar_y - 63 + 5 + 10, 7, 10);
        strokeWeight(3);
        point(gameChar_x + 3, gameChar_y - 63 + 5 + 10);
        point(gameChar_x - 3, gameChar_y - 63 + 5 + 10);
        stroke(0)
        strokeWeight(1);
        line(gameChar_x - 0.5, gameChar_y - 60 + 5 + 10, gameChar_x - 0.5, gameChar_y - 48 + 10);
        strokeWeight(5);
        stroke(255, 0, 0);
        point(gameChar_x, gameChar_y - 58 + 5 + 10);


        noFill();
        stroke(0)
        strokeWeight(1)
        beginShape();
        curveVertex(gameChar_x + 8, gameChar_y - 42 + 10);
        curveVertex(gameChar_x + 5, gameChar_y - 40 + 10);
        curveVertex(gameChar_x + 3, gameChar_y - 38 + 10);
        curveVertex(gameChar_x - 3, gameChar_y - 38 + 10);
        curveVertex(gameChar_x - 5, gameChar_y - 40 + 10);
        curveVertex(gameChar_x - 8, gameChar_y - 42 + 10);
        endShape();


    } else {
        // add your standing front facing code
        fill(0, 51, 153);
        stroke(0, 0, 0);
        strokeWeight(1);
        //legs
        rect(gameChar_x - 13, gameChar_y - 30 + 10, 10, 20, 10);
        rect(gameChar_x + 3, gameChar_y - 30 + 10, 10, 20, 10);
        ellipse(gameChar_x - 8, gameChar_y - 10 + 10, 13, 5);
        ellipse(gameChar_x + 8.5, gameChar_y - 10 + 10, 13, 5);

        // arms
        strokeWeight(5);
        line(gameChar_x - 15, gameChar_y - 35 + 10, gameChar_x - 17, gameChar_y - 28 + 10);
        line(gameChar_x + 15, gameChar_y - 35 + 10, gameChar_x + 17, gameChar_y - 28 + 10)
        strokeWeight(1);
        ellipse(gameChar_x - 17, gameChar_y - 28 + 10, 6.5)
        ellipse(gameChar_x + 18, gameChar_y - 28 + 10, 6.5)

        // body
        strokeWeight(1);
        rect(gameChar_x - 15, gameChar_y - 55 + 10, 30, 40, 15)

        // face
        ellipse(gameChar_x, gameChar_y - 55 + 5 + 10, 35, 33);
        fill(255, 255, 255)
        ellipse(gameChar_x, gameChar_y - 51 + 5 + 10, 27, 25);
        ellipse(gameChar_x + 4, gameChar_y - 63 + 5 + 10, 7, 10);
        ellipse(gameChar_x - 4, gameChar_y - 63 + 5 + 10, 7, 10);
        strokeWeight(3);
        point(gameChar_x + 3, gameChar_y - 63 + 5 + 10);
        point(gameChar_x - 3, gameChar_y - 63 + 5 + 10);
        stroke(0)
        strokeWeight(1);
        line(gameChar_x - 0.5, gameChar_y - 60 + 5 + 10, gameChar_x - 0.5, gameChar_y - 48 + 10);
        strokeWeight(5);
        stroke(255, 0, 0);
        point(gameChar_x, gameChar_y - 58 + 5 + 10);

        noFill();
        stroke(0)
        strokeWeight(1)
        beginShape();
        curveVertex(gameChar_x + 8, gameChar_y - 42 + 10);
        curveVertex(gameChar_x + 5, gameChar_y - 40 + 10);
        curveVertex(gameChar_x + 3, gameChar_y - 38 + 10);
        curveVertex(gameChar_x - 3, gameChar_y - 38 + 10);
        curveVertex(gameChar_x - 5, gameChar_y - 40 + 10);
        curveVertex(gameChar_x - 8, gameChar_y - 42 + 10);
        endShape();
    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawCloud() {
    for (var i = 0; i < clouds.length; i++) {
        fill(255, 255, 255);
        ellipse(clouds[i].x + 100, clouds[i].y + 40, 100, 90);
        ellipse(clouds[i].x + 140, clouds[i].y + 40, 80, 70);
        ellipse(clouds[i].x + 60, clouds[i].y + 40, 90, 80);
    }
}

// Function to draw mountains objects.

function drawMountain() {
    for (var i = 0; i < mountains.length; i++) {
        beginShape();
        fill(22, 67, 140);
        stroke(22, 67, 140);
        strokeWeight(2);
        curveVertex(mountains[i].x, 432);
        curveVertex(mountains[i].x, 432);
        curveVertex(mountains[i].x + 20, 425);
        curveVertex(mountains[i].x + 40, 415);
        curveVertex(mountains[i].x + 60, 400);
        curveVertex(mountains[i].x + 80, 380);
        curveVertex(mountains[i].x + 100, 360);
        curveVertex(mountains[i].x + 120, 330);
        curveVertex(mountains[i].x + 140, 300);
        curveVertex(mountains[i].x + 150, 280);
        curveVertex(mountains[i].x + 160, 250);
        curveVertex(mountains[i].x + 180, 240);
        curveVertex(mountains[i].x + 200, 245);
        curveVertex(mountains[i].x + 220, 250);
        curveVertex(mountains[i].x + 230, 280);
        curveVertex(mountains[i].x + 240, 300);
        curveVertex(mountains[i].x + 260, 330);
        curveVertex(mountains[i].x + 280, 360);
        curveVertex(mountains[i].x + 300, 380);
        curveVertex(mountains[i].x + 320, 400);
        curveVertex(mountains[i].x + 340, 415);
        curveVertex(mountains[i].x + 360, 425);
        curveVertex(mountains[i].x + 380, 432);
        curveVertex(mountains[i].x + 380, 432);
        endShape();
        noStroke();
        fill(255, 255, 255);
        beginShape();
        curveVertex(mountains[i].x + 145, 260 + 30);
        curveVertex(mountains[i].x + 160, 250 + 30);
        curveVertex(mountains[i].x + 170, 260 + 30);
        curveVertex(mountains[i].x + 180, 250 + 30);
        curveVertex(mountains[i].x + 190, 260 + 30);
        curveVertex(mountains[i].x + 200, 250 + 30);
        curveVertex(mountains[i].x + 210, 260 + 30);
        curveVertex(mountains[i].x + 220, 250 + 30);
        curveVertex(mountains[i].x + 235, 260 + 30);
        curveVertex(mountains[i].x + 230, 280);
        curveVertex(mountains[i].x + 220, 250);
        curveVertex(mountains[i].x + 200, 245);
        curveVertex(mountains[i].x + 180, 240);
        curveVertex(mountains[i].x + 160, 250);
        curveVertex(mountains[i].x + 150, 280);
        curveVertex(mountains[i].x + 160, 250 + 30);
        curveVertex(mountains[i].x + 160, 250 + 30);
        endShape();
    }
}

// Function to draw trees objects.

function drawTree() {
    for (var i = 0; i < trees_x.length; i++) {
        fill(140, 124, 105);
        noStroke();
        rect(trees_x[i], floorPos_y - 130, 30, 132);
        // branches
        fill(0, 102, 0);
        triangle(trees_x[i] + 65, floorPos_y + 70 - 130, trees_x[i] - 35, floorPos_y + 70 - 130, trees_x[i] + 15, floorPos_y - 10 - 130);
        triangle(trees_x[i] + 65, floorPos_y + 40 - 130, trees_x[i] - 35, floorPos_y + 40 - 130, trees_x[i] + 15, floorPos_y - 40 - 130);
        // fruit
        stroke(255, 0, 0);
        strokeWeight(5);
        point(trees_x[i], floorPos_y + 50 - 130);
        point(trees_x[i] + 30, floorPos_y - 130);
        point(trees_x[i] - 10, floorPos_y + 20 - 130);
        point(trees_x[i] + 30, floorPos_y + 40 - 130);
    }
}

// Function to draw enermies (mouse)
function Enermy(x, range) {
    this.x = x;
    this.y = floorPos_y - 30;
    this.range = range;
    this.currentx = x;
    this.inc = 1;
    this.update = function () {
        this.currentx += this.inc;

        if (this.currentx >= this.x + this.range) {
            this.inc = -1;
        } else if (this.currentx < this.x) {
            this.inc = 1;
        }
    }

    this.draw = function () {
        image(mouseimg, this.currentx, this.y, mouseimg.width / 2.5, mouseimg.height / 2.5);
    };

    this.checkContact = function (gc_x, gc_y) {
        var d = dist(gc_x, gc_y, this.currentx, this.y);

        if (d < 40) {
            return true;
        }

        return false;
    };
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {
    noStroke();
    fill(48, 40, 40);
    quad(t_canyon.x_pos + 100 - t_canyon.width, 432, t_canyon.x_pos + 200, 432, t_canyon.x_pos + 130, 580, t_canyon.x_pos + 70 - t_canyon.width, 580);
    fill(109, 94, 94);
    noStroke();
    quad(t_canyon.x_pos + 95 - t_canyon.width, 432, t_canyon.x_pos + 65 - t_canyon.width, 580, t_canyon.x_pos + 80 - t_canyon.width, 580, t_canyon.x_pos + 110 - t_canyon.width, 432);
    quad(t_canyon.x_pos + 180, 432, t_canyon.x_pos + 130, 580, t_canyon.x_pos + 170, 580, t_canyon.x_pos + 230, 432);

    // river 
    stroke(0, 102, 255);
    strokeWeight(8);
    noFill();
    beginShape();
    curveVertex(t_canyon.x_pos + 130 - t_canyon.width / 2, 440);
    curveVertex(t_canyon.x_pos + 140 - t_canyon.width / 2, 440);
    curveVertex(t_canyon.x_pos + 120 - t_canyon.width / 2, 460);
    curveVertex(t_canyon.x_pos + 115 - t_canyon.width / 2, 510);
    curveVertex(t_canyon.x_pos + 120 - t_canyon.width / 2, 540);
    curveVertex(t_canyon.x_pos + 110 - t_canyon.width / 2, 570);
    curveVertex(t_canyon.x_pos + 130 - t_canyon.width / 2, 590);
    curveVertex(t_canyon.x_pos + 130 - t_canyon.width / 2, 590);
    endShape();
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon) {
    if (gameChar_world_x > t_canyon.x_pos + 95 - t_canyon.width && gameChar_world_x < t_canyon.x_pos + 230 && gameChar_y >= floorPos_y) {
        isPlummeting = true;
    }

    if (isPlummeting == true) {
        gameChar_y += 1;
        isRight = false;
        isLeft = false;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
    stroke(0, 0, 0)
    strokeWeight(1);
    fill(250, 255, 0);
    beginShape();
    // left upper corner 
    vertex(t_collectable.x_pos, t_collectable.y_pos + 70);
    vertex(t_collectable.x_pos + 40 + t_collectable.size, t_collectable.y_pos + 70);
    vertex(t_collectable.x_pos + 40 + t_collectable.size, t_collectable.y_pos + 110 + t_collectable.size);
    vertex(t_collectable.x_pos, t_collectable.y_pos + 110 + t_collectable.size);
    // left upper corner 
    vertex(t_collectable.x_pos, t_collectable.y_pos + 70);
    vertex(t_collectable.x_pos + 13 + t_collectable.size / 7, t_collectable.y_pos + 65);
    vertex(t_collectable.x_pos + 49 + t_collectable.size, t_collectable.y_pos + 65);
    vertex(t_collectable.x_pos + 40 + t_collectable.size, t_collectable.y_pos + 70);
    vertex(t_collectable.x_pos + 50 + t_collectable.size, t_collectable.y_pos + 65);
    vertex(t_collectable.x_pos + 50 + t_collectable.size, t_collectable.y_pos + 105 + t_collectable.size);
    vertex(t_collectable.x_pos + 40 + t_collectable.size, t_collectable.y_pos + 110 + t_collectable.size);
    endShape();

    fill(255, 255, 255);
    strokeWeight(2);
    textSize(25);
    text('?', t_collectable.x_pos + 14 + t_collectable.size / 2, t_collectable.y_pos + 99 + t_collectable.size / 2);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
    if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos + 14 + t_collectable.size / 2, t_collectable.y_pos + 99 + t_collectable.size / 2) < 50) {
        t_collectable.isFound = true;
        itemSound.play();
        game_score += 1;
    }
}

// Function to draw goal flag pole 
function renderFlagpole() {
    push();
    strokeWeight(5);
    stroke(130);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);

    fill(255, 0, 255);
    noStroke();

    if (flagpole.isReached) {
        rect(flagpole.x_pos, floorPos_y - 200, 50, 50);
    } else {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }
    pop();
}

// function to check if player reached a goal 
function checkFlagpole() {
    var d = abs(gameChar_world_x - flagpole.x_pos);

    if (d < 15) {
        flagpole.isReached = true
        flagSound.play();
        completeSound.play();
    };
}

// Function to check if player is die or not 
function checkPlayerDie() {
    fill(255);

    // player lost a life 
    if (gameChar_y > height + 70) {
        lives -= 1;

        if (lives > 0) {
            startGame();
        }
    }
    if (lives < 0) {
        fill(255, 0, 0);
        textSize(40);
        text("GAME OVER. Press space to continue.", width / 2 - 300, height / 2);
        return;
    }
}

// Function to draw platforms 
function createPlatfrom(x, y, length) {
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function () {

            fill(200, 0, 200);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function (gc_x, gc_y) {

            if (gc_x > this.x && gc_x < this.x + this.length) {
                var d = this.y - gc_y;
                if (d >= 0 && d < 5) {
                    return true;
                }

                return false;
            }
        },
    }

    return p;
}

// Function to display amount of lives left on the screen
function livescount() {
    for (let l = 0; l < lives; l++) {
        fill("pink");
        ellipse(90 - (l * 30), 60, 30, 30);
    }
}
