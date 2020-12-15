var frames = 0;
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
function moveObj(currCircle, objChange)
{
  var currCircleCoor = currCircle.getCoor;
  for (j = 0; j < currCircleCoor.length; j++)
  {
    //console.log(j);
    currCircleCoor[j] += objChange[j];
  }
  currCircle.setCoor = currCircleCoor;
}

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

function createCircle(height)
{
  var listOfLeftCircleArrays = [];
  var listOfRightCircleArrays = [];

  for (i = 0; i < 3; i++)
  {
    var circleCoorL = [10, Math.random() * height, 10];
    var circle = new Asteroid(circleCoorL);
    listOfLeftCircleArrays.push(circle);
  }

  //Right hand circles
  for (i = 0; i < 3; i++)
  {
    var circleCoorR = [canvas.width - 10, Math.random() * height, 10];
    var circle = new Asteroid(circleCoorR);
    listOfRightCircleArrays.push(circle);
  }

  return listOfLeftCircleArrays.concat(listOfRightCircleArrays);
}
function checkKeyDown(event)
{
  keyCode = event.which;
  keyStr = event.key;
  //console.log(keyStr);
  rocketPos = rocket1.getCoor;

  if (keyStr == 'w' || keyStr == 'W')
  {
    for (i = 0; i < 3; i++)
    {
      rocketPos[i][1] -= 15;
    }
  }

  else if (keyStr == 's' || keyStr == 'S')
  {
    for (i = 0; i < 3; i++)
    {
      rocketPos[i][1] += 15;
    }
  }
  rocket1.setCoor = rocketPos;
}

function drawRocket(rocket)
{
  //console.log("in drawRocket");
  rocketPos = rocket1.getCoor;
  context.beginPath();
  context.moveTo(rocketPos[0][0], rocketPos[0][1]);
  context.lineTo(rocketPos[1][0], rocketPos[1][1]);
  context.lineTo(rocketPos[2][0], rocketPos[2][1]);
  checkCollision(circleArrays);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
}

function checkCollision(circleCoors)
{
  //Generate list of points on circle
  var avgX = 0;
  var avgY = 0;
  for (i = 0; i < circleCoors.length; i++)
  {
    var currCircle = circleCoors[i].getCoor;
    //console.log(currCircle);
    for (j = 0; j < 50; j++)
    {
      var angleR = ((2 * Math.PI) / 50) * j;
      var coorX = Math.round(Math.cos(angleR) * 10 + currCircle[0]);
      var coorY = Math.round(Math.sin(angleR) * 10 + currCircle[1]);

      if (context.isPointInPath(coorX, coorY))
      {
        rocket1.setCoor = startRocketCoor;
        console.log("True");
      }
    }
  }
}

function drawAllTEST()
{

  frames += 1;
  if (frames % 200 == 0) {
    now = new Date();
    msecs = now.getTime() - start.getTime();
    //console.log(now.getTime());
    //console.log("fps:", (frames / msecs) * 1000);
  }

  context.clearRect(0,0,canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fillRect(0,0,canvas.width, canvas.height);

  drawCircle(circleArrays);

  drawRocket(rocket1);

  window.requestAnimationFrame(drawAllTEST);
}

function drawAll()
{
  frames += 1;
  if (frames % 200 == 0) {
    now = new Date();
    msecs = now.getTime() - start.getTime();
    console.log(now.getTime());
    //console.log("fps:", (frames / msecs) * 1000);
  }
  context.clearRect(0,0,canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fillRect(0,0,canvas.width, canvas.height);

  //New Asteroids

  if (frames % 200 == 0)
  {
    var circleLR = [];
    circleLR = createCircle(canvas.height);
    for (i = 0; i < 3; i++)
    {
      console.log("L");
      circleArrays.unshift(circleLR[i]);
    }
    for (i = 3; i < 6; i++)
    {
      console.log("R");
      circleArrays.push(circleLR[i]);
    }
  }

  console.log(circleArrays.length);
  //Take out asteroids that are offscreen
  for (var i = 0; i < circleArrays.length; i++)
  {
    var asteroidCoor = circleArrays[i].getCoor;
    if (asteroidCoor[0] < -10 || asteroidCoor[0] > (canvas.width + 10))
    {
      if (i < (circleArrays / 2))
      {
        circleArrays[i].setCoor = [10, asteroidCoor[1], asteroidCoor[2]];
      }
      else
      {
        circleArrays[i].setCoor = [canvas.width - 10, asteroidCoor[1], asteroidCoor[2]];
      }
    }
  }

  console.log(circleArrays.length);
  var halfArrayLength = circleArrays.length / 2;

  //Left
  for (i = 0; i < halfArrayLength; i++)
  {
    var currCircle = circleArrays[i];
    drawCircle(currCircle);
    moveObj(currCircle, circleChangeLeft);
    circleArrays[i] = currCircle;
  }
  //Right
  for (i = halfArrayLength; i < circleArrays.length; i++)
  {
    var currCircle = circleArrays[i];
    drawCircle(currCircle);
    moveObj(currCircle, circleChangeRight);
    circleArrays[i] = currCircle;
  }

  drawRocket(rocket1);

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

var circleChangeLeft = [1, 0, 0];
var circleChangeRight = [-1, 0, 0];

var circleArrays = createCircle(canvas.height);
//console.log(circleArraysL);
//console.log(circleArraysR);
//var circleArrays = circleArraysL.concat(circleArraysR);
var currCircle = 0;

var startRocketCoor = [[canvas.width / 2, canvas.height * 0.9 - 5], [canvas.width / 2 - 10, canvas.height * 0.9 + 30], [canvas.width / 2 + 10, canvas.height * 0.9 + 30]];
var rocket1 = new Rocket(startRocketCoor);

document.addEventListener("keydown", checkKeyDown);
// Fire up the animation engine
window.requestAnimationFrame(drawAll);
