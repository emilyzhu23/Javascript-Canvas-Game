var frames = 0;
var start = new Date();
var now = new Date();
console.log(start);
//TO DO: Create rocket, multiplayer?, keydown, rocket hitting asteroids, asteroids class, asteroids stagger
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
function moveObj(currCircle, objChange)
{
  for (j = 0; j < currCircle.length; j++)
  {
    console.log(j);
    currCircle[j] += objChange[j];
  }
}

function drawCircle(circle)
{
  context.beginPath();
  context.arc(circle[0], circle[1], circle[2], 0, 2 * Math.PI);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
}

function createCircle(height)
{
  var listOfLeftCircleArrays = [];
  var listOfRightCircleArrays = [];

  for (i = 0; i < 5; i++)
  {
    var circleCoorL = [10, Math.random() * height, 10];
    listOfLeftCircleArrays.push(circleCoorL);
  }
  console.log(listOfLeftCircleArrays.length);

  //Right hand circles
  for (i = 0; i < 5; i++)
  {
    var circleCoorR = [canvas.width - 10, Math.random() * height, 10];
    listOfRightCircleArrays.push(circleCoorR);
  }

  return [listOfLeftCircleArrays, listOfRightCircleArrays];
}
function checkKeyDown(event)
{
  keyCode = event.which;
  keyStr = event.key;
  console.log(keyStr);
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
  console.log("in drawRocket");
  rocketPos = rocket1.getCoor;
  context.beginPath();
  context.moveTo(rocketPos[0][0], rocketPos[0][1]);
  context.lineTo(rocketPos[1][0], rocketPos[1][1]);
  context.lineTo(rocketPos[2][0], rocketPos[2][1]);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
  checkCollision(circleArrays);
}

function checkCollision(circleCoors)
{
  console.log("in checkCollision");
  //Generate list of points on circle
  for (i = 0; i < circleCoors.length; i++)
  {
    var circleCoor = circleCoors[i];
    for (j = 0; j < 51; j++)
    {
      var angleR = ((2 * Math.PI) / 50) * j;
      var coorX = Math.cos(angleR) * 10 + circleCoor[0];
      var coorY = Math.sin(angleR) * 10 - circleCoor[1];

      console.log(context.isPointInPath(coorX, coorY));
    }
  }
}

function drawAllTEST()
{

  frames += 1;
  if (frames % 200 == 0) {
    now = new Date();
    msecs = now.getTime() - start.getTime();
    console.log(now.getTime());
    console.log("fps:", (frames / msecs) * 1000);
  }

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
    console.log("fps:", (frames / msecs) * 1000);
  }


  var leftCircles = circleArrays[0];
  var rightCircles = circleArrays[1];

  context.clearRect(0,0,canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fillRect(0,0,canvas.width, canvas.height);

  console.log(leftCircles.length);
  for (i = 0; i < leftCircles.length; i++)
  {
    var currCircle = leftCircles[i];
    drawCircle(currCircle);
    moveObj(currCircle, circleChangeLeft);
    leftCircles[i] = currCircle;
  }

  for (i=0; i < rightCircles.length; i++)
  {
    var currCircle = rightCircles[i];
    drawCircle(currCircle);
    moveObj(currCircle, circleChangeRight);
    rightCircles[i] = currCircle;
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

//var circleArrays = createCircle(canvas.height);
var circleArrays = [canvas.width / 2, canvas.height * 0.75, 10];
var currCircle = 0;

var startRocketCoor = [[canvas.width / 2, canvas.height * 0.9 - 5], [canvas.width / 2 - 10, canvas.height * 0.9 + 30], [canvas.width / 2 + 10, canvas.height * 0.9 + 30]];
var rocket1 = new Rocket(startRocketCoor);

document.addEventListener("keydown", checkKeyDown);
// Fire up the animation engine
window.requestAnimationFrame(drawAllTEST);
