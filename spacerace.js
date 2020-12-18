//Emily Zhu
//Honors Computer Science P7
//This program replicates the game, Spacerace. Spacerace is a game in which the
//player moves a rocket up and down and tries to avoid the asteroids moving across the screen.

var frames = 0;
var counter = 0;
var start = new Date();
var now = new Date();

class Rocket {
  constructor([[x1, y1], [x2, y2], [x3, y3]])
  {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
  }
  get getCoor(){
    return [[this.x1,this.y1], [this.x2,this.y2], [this.x3,this.y3]];
  }
  set setCoor(coors){
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

//Move the asteroid across the screen
function moveObj(currCircle, objChange)
{
  currCircle.centerX += objChange[0];
}

//Draw the asteroids
function drawCircle(circle)
{
  var coor = circle.getCoor;
  context.beginPath();
  context.arc(coor[0], coor[1], coor[2], 0, 2 * Math.PI);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
}

//Make the 10 circle objects for each wave of asteroids
function createCircle(height)
{
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

//To check what keys have been pressed to move the rocket forward and back
function checkKeyDown(event)
{
  keyCode = event.which;
  keyStr = event.key;

  if (keyStr == 'w' || keyStr == 'W')
  {
    console.log("WW");
    rocket1.y1 -= 15;
    rocket1.y2 -= 15;
    rocket1.y3 -= 15;
  }

  else if (keyStr == 's' || keyStr == 'S')
  {
    rocket1.y1 += 15;
    rocket1.y2 += 15;
    rocket1.y3 += 15;
  }
}

//Draw the rocket (which is in the same of a triangle)
function drawRocket(rocket)
{
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

//To check if any points on all of the asteroids intersects any of the 3 lines on the rocket (triangle)
function checkCollision(circleCoors)
{
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

//Reuse the asteroid objects that have moved offscreen and restart them at the edges of the screen
function fixOffScreenAsteroids(circleArrays)
{
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
function drawPoints()
{
  context.font = "30px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText("+1", canvas.width / 2, canvas.height * 0.8);
  context.font = "50px Arial";
  context.fillText("Points: "+ points, canvas.width / 2, canvas.height * 0.9);
}


function drawAll()
{
  if (playing) {
    counter += 1
    frames += 1;
    if (frames % 200 == 0) {
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
      playing = false;
      frames = 0;
    }
  }

  //Once they win, draw the score and show for 150 frames
  else
  {
    frames += 1;
    console.log(frames);
    console.log("drawPoints");
    drawPoints()

    if (frames == 150)
    {
      playing = true;
      rocket1.setCoor = startRocketCoor;
      drawRocket(rocket1);
    }
  }
  window.requestAnimationFrame(drawAll);
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

//How much to move asteroids
var circleChangeLeft = [2, 0, 0];
var circleChangeRight = [-2, 0, 0];

//Create first few circles on screen
var circleArrays = createCircle(canvas.height);
var currCircle = 0;

//The beginning coordinates for the rocket
var startRocketCoor = [[canvas.width / 2, canvas.height * 0.9 - 5], [canvas.width / 2 - 10, canvas.height * 0.9 + 30], [canvas.width / 2 + 10, canvas.height * 0.9 + 30]];
var rocket1 = new Rocket(startRocketCoor);

var points = 0;
var playing = true;

document.addEventListener("keydown", checkKeyDown);
// Fire up the animation engine
window.requestAnimationFrame(drawAll);
