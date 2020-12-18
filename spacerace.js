// Emily Zhu
// Honors Computer Science P7
// Date: 12.18.20
// This program replicates the game, Spacerace. Spacerace is a game in which the
// player moves a rocket up and down and tries to avoid the asteroids moving across the screen.

var frames = 0;
var counter = 0;
var start = new Date();
var now = new Date();

class Rocket
{
  constructor([[x1, y1], [x2, y2], [x3, y3]])
  {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
  }
  get getCoor()
  {
    return [[this.x1,this.y1], [this.x2,this.y2], [this.x3,this.y3]];
  }
  set setCoor(coors)
  {
    this.x1 = coors[0][0];
    this.y1 = coors[0][1];
    this.x2 = coors[1][0];
    this.y2 = coors[1][1];
    this.x3 = coors[2][0];
    this.y3 = coors[2][1];
  }
}

class Asteroid
{
  constructor([centerX, centerY, radius])
  {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
  }
  get getCoor()
  {
    return [this.centerX, this.centerY, this.radius];
  }
  set setCoor(coors)
  {
    this.centerX = coors[0];
    this.centerY = coors[1];
    this.radius = coors[2];
  }
}

function moveObj(currCircle, objChange)
{
  // Purpose: This function moves an asteroid's coordinates horizontally
  // Parameters: currCircle, Asteroid object: the Asteroid that's being moved;
  // objChange, array with 3 integers: the amount that each aspect of the Asteroid should be changed
  // Return Val: None
  currCircle.centerX += objChange[0];
}

function drawCircle(circle)
{
  // Purpose: This function draws one asteroid
  // Parameters: circle, Asteroid object: the Asteroid that's being drawn
  // Return Val: None
  var coor = circle.getCoor;
  context.beginPath();
  context.arc(coor[0], coor[1], coor[2], 0, 2 * Math.PI);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
}

function createCircle(height)
{
  // Purpose: This function creates 8 Asteroid objects, 5 on each side of the canvas
  // Parameters: height, integer: the height of the canvas
  // Return Val: listOfLeftCircleArrays.concat(listOfRightCircleArrays), list: all of the
  // Asteroid objects made
  var listOfLeftCircleArrays = [];
  var listOfRightCircleArrays = [];

  //Left hand circles
  for (i = 0; i < 4; i++)
  {
    var circleCoorL = [10, Math.random() * height, 5];
    var circle = new Asteroid(circleCoorL);
    listOfLeftCircleArrays.push(circle);
  }

  //Right hand circles
  for (i = 0; i < 4; i++)
  {
    var circleCoorR = [canvas.width - 10, Math.random() * height, 5];
    var circle = new Asteroid(circleCoorR);
    listOfRightCircleArrays.push(circle);
  }

  return listOfLeftCircleArrays.concat(listOfRightCircleArrays);
}

function checkKeyDown(event)
{
  // Purpose: This function checks what key the user has pressed and changes variables accordingly
  // Parameters: event, keyboard event Object: the key that the user pressed
  // Return Val: None
  keyCode = event.which;
  keyStr = event.key;

  // Moves the rocket forward
  if (keyStr == 'w' || keyStr == 'W')
  {
    console.log("WW");
    rocket1.y1 -= 15;
    rocket1.y2 -= 15;
    rocket1.y3 -= 15;
  }

  // Moves the rocket backward
  else if (keyStr == 's' || keyStr == 'S')
  {
    rocket1.y1 += 15;
    rocket1.y2 += 15;
    rocket1.y3 += 15;
  }

  // Start play
  else if (keyStr == 'p' || keyStr == 'P')
  {
    playingState = "playing";
  }

  // Pause play
  else if (keyStr == 'q' || keyStr == "Q")
  {
    playingState = "quit";
  }
}

function drawRocket(rocket)
{
  // Purpose: This function draws the rocket, a triangle
  // Parameters: rocket, Rocket Object: the rocket on the screen that user is controlling
  // Return Val: None
  context.beginPath();
  context.moveTo(rocket.x1, rocket.y1);
  context.lineTo(rocket.x2, rocket.y2);
  context.lineTo(rocket.x3, rocket.y3);
  checkCollision(circleArrays);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
}

function checkCollision(circleCoors)
{
  // Purpose: This function checks to see if the rocket intersects with any of the asteroids
  // Parameters: circleCoors, list of Asteroid objects: all of the asteroids on screen
  // Return Val: None.

  //Generate list of points on circle
  for (i = 0; i < circleCoors.length; i++)
  {
    var currCircle = circleCoors[i];
    for (j = 0; j < 50; j++)
    {
      var angleR = ((2 * Math.PI) / 50) * j;
      var coorX = Math.round(Math.cos(angleR) * 10 + currCircle.centerX);
      var coorY = Math.round(Math.sin(angleR) * 10 + currCircle.centerY);

      if (context.isPointInPath(coorX, coorY))
      {
        rocket1.setCoor = startRocketCoor;
      }
    }
  }
}

function fixOffScreenAsteroids(circleArrays)
{
  // Purpose: This function checks if any of the asteroids are offscreen and moves them
  // to the edge of the screen to be reused if they are.
  // Parameters: circleArrays, list of Asteroid objects: all of the asteroids
  // Return Val: None
  for (var i = 0; i < circleArrays.length; i++)
  {
    var asteroid = circleArrays[i];
    if (asteroid.centerX < -10 || asteroid.centerX > (canvas.width + 10))
    {
      if (i < (circleArrays.length / 2))
      {
        circleArrays[i].setCoor = [10, asteroid.centerY, asteroid.radius];
      }
      else
      {
        circleArrays[i].setCoor = [canvas.width - 10, asteroid.centerY, asteroid.radius];
      }
    }
  }
}

//Draw the number of points that the user has
function drawScore()
{
  // Purpose: This function outputs the user's score
  // Parameters: None
  // Return Val: None
  context.font = "30px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText("+1", canvas.width / 2, canvas.height * 0.7);
  context.font = "50px Arial";
  context.fillText("Points: "+ points, canvas.width / 2, canvas.height * 0.8);
  context.fillText("Press 'p' to keep playing", canvas.width / 2, canvas.height * 0.9);
}

function playGame()
{
  // Purpose: This function is the main function to play the game and utilizes all
  // the other functions.
  // Parameters: None
  // Return Val: None
  if (playingState == "playing")
  {
    counter += 1
    frames += 1;
    if (frames % 200 == 0)
    {
      now = new Date();
      msecs = now.getTime() - start.getTime();
      //console.log(now.getTime());
      //console.log("fps:", (frames / msecs) * 1000);
    }
    //Clear canvas and redraw the background black
    context.clearRect(0,0,canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0,0,canvas.width, canvas.height);

    //Creating 12 new asteroid waves
    if ((counter % 75 == 0) && (counter < 901))
    {
      var circleLR = [];
      circleLR = createCircle(canvas.height);
      for (i = 0; i < 3; i++)
      {
        circleArrays.unshift(circleLR[i]);
      }
      for (i = 3; i < 6; i++)
      {
        circleArrays.push(circleLR[i]);
      }
    }

    //Move asteroids that are offscreen to other side of screen
    fixOffScreenAsteroids(circleArrays);

    var halfArrayLength = circleArrays.length / 2;

    //Draw and move the circles that started on the left
    for (i = 0; i < halfArrayLength; i++)
    {
      var currCircle = circleArrays[i];
      drawCircle(currCircle);
      moveObj(currCircle, circleChangeLeft);
      circleArrays[i] = currCircle;
    }
    //Draw and move the circles that started on the right
    for (i = halfArrayLength; i < circleArrays.length; i++)
    {
      var currCircle = circleArrays[i];
      drawCircle(currCircle);
      moveObj(currCircle, circleChangeRight);
      circleArrays[i] = currCircle;
    }

    drawRocket(rocket1);

    //To check if the user got to the end of the canvas and won a round

    if (rocket1.y1 <= 0 || rocket1.y2 <= 0 || rocket1.y3 <= 0)
    {
      points++;
      console.log(points);
      playingState = "win";
      frames = 0;
    }
  }

  // Once they win, draw the score
  else if (playingState == "win")
  {
    frames += 1;
    drawScore()
    rocket1.setCoor = startRocketCoor;
  }

  // Draw instructions
  else if (playingState == "start")
  {
    frames += 1;
    context.font = "50px Helvetica";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("How to Play Spacerace", canvas.width / 2, canvas.height * 0.1);
    context.font = "30px Helvetica";
    context.fillText("Press 'w' to move forward and press 's' to move backward", canvas.width / 2, canvas.height * 0.75);
    context.fillText("Press 'p' to start playing at anytime and press 'q' to quit/pause the game", canvas.width / 2, canvas.height * 0.9);
    context.font = "20px Helvetica";
    context.fillText("The objective of the game is to move the rocket back and forth, avoiding the asteroids moving across screen, to reach the other end", canvas.width / 2, canvas.height * 0.5);
  }
  window.requestAnimationFrame(playGame);
}


// Get width/height of the browser window
windowWidth = window.innerWidth;
windowHeight = window.innerHeight;
console.log("Window is %d by %d", windowWidth, windowHeight);

// Get the canvas, set the width and height from the window
canvas = document.getElementById("mainCanvas");
// I found that - 20 worked well for me, YMMV
canvas.width = windowWidth - 20;
canvas.height = windowHeight - 20;
canvas.style.border = "1px solid black";

// Set up the context for the animation
context = canvas.getContext("2d");

context.fillStyle = "black";
context.fillRect(0,0,canvas.width, canvas.height);

// How much to move asteroids
var circleChangeLeft = [2, 0, 0];
var circleChangeRight = [-2, 0, 0];

// Create first few circles on screen
var circleArrays = createCircle(canvas.height);
var currCircle = 0;

// The beginning coordinates for the rocket
var startRocketCoor = [[canvas.width / 2, canvas.height * 0.9 - 5], [canvas.width / 2 - 10, canvas.height * 0.9 + 30], [canvas.width / 2 + 10, canvas.height * 0.9 + 30]];
var rocket1 = new Rocket(startRocketCoor);

var points = 0;
var playingState = "start";

document.addEventListener("keydown", checkKeyDown);
// Fire up the animation engine
window.requestAnimationFrame(playGame);
