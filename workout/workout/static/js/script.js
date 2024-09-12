const video5 = document.querySelector('.input_video5');
let windowactive = true
const canvas5 = document.querySelector('.output5');
const canvasCtx5 = canvas5.getContext('2d');
const exerlist = ["Setup","Alternate Toe Touch", "Spot Jogging", "Squats", "Push-Ups", "Plank"]
let excercises = [false, false, false, false, false]
let itr = [false, false]
let i = 0, count = 0, score = 0
let animae = false
let total = 30
let seconds = 30
let backendkeypoints = []
let output = {}
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
  }
});

pose.onResults(onResultsPose);

const camera = new Camera(video5, {
  onFrame: async () => {
    await pose.send({ image: video5 });
  },
  width: 640,
  height: 480
});

camera.start();

function drawLine(ctx, a, b, stroke = 'yellow', width = 3) {

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}
function drawCircle(context, x, y, color, radius) {
  if (color == null) {
    color = '#FFF';
  }
  if (radius == null) {
    radius = 25;
  }

  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI); // Draw a circle path
  context.fillStyle = color;
  context.fill();
  context.closePath();
}
function calculateangle(ctx, a, b, c) {
  let m1 = (b.y - a.y) / (b.x - a.x)
  let m2 = (b.y - c.y) / (b.x - c.x)
  let tan = (m2 - m1) / (1 - m1 * m2)

  let theta = Math.atan(tan)
  if (theta < 0) {
    theta = theta * -1
  }
  let angle = (theta * 180 / Math.PI).toFixed()


  ctx.font = "30px Arial";
  ctx.strokeText(angle, b.x + 10, b.y);
  return angle
}
function counter() {
  setInterval(updatecouunter, 1000);
}
function updatecouunter() {
  if (seconds > 0) {
    seconds -= 1
    document.getElementById("timer").innerHTML = seconds
    document.getElementById("circularbar").style.strokeDashoffset = 427 - (427 * (seconds / total) * 100) / 100
  }
  else {
    if (animae) {
      total = 30
      seconds = 30
      windowactive = true
      document.getElementById("gif").classList.add("active")
      document.getElementById("gif").classList.remove("active")
      document.getElementById("circularbar").classList.remove("active")
      document.getElementById("ourcanva").classList.remove("active")
      animae = false
      i = 0

    }

    else
      animae = true

  }



}
function distance(a, b) {
  return Math.sqrt(((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)))
}
function fetchdata() {
  fetch("/testpoints/" + exerlist[count], { method: 'GET' }).then(response => response.json()).then(data => {
    output = data.Output
    console.log(output.Criteria.distance)
    backendkeypoints = data.Output.Keypoints
  })
}
function onResultsPose(results) {
  if (windowactive) {
    canvasCtx5.clearRect(0, 0, canvas5.width, canvas5.height);
    canvasCtx5.drawImage(results.image, 0, 0, canvas5.width, canvas5.height);

    const landmarks = results.poseLandmarks;
    let keypoints = [];

    for (let i = 0; i < 33; i++) {
      const coordinates = {
        x: landmarks[i].x * 1280,
        y: landmarks[i].y * 720,
        z: landmarks[i].z * 1280
      };

      keypoints.push(coordinates);
    }
    if (backendkeypoints.length == 0)
      fetchdata()
    if (animae) {

      if (i < 1) {
        windowactive = false
        count = count + 1
        backendkeypoints = []
        total = 15
        seconds = 15
        document.getElementById("gif").classList.remove("active")
        document.getElementById("gif").classList.add("active")
        document.getElementById("circularbar").classList.add("active")
        document.getElementById("ourcanva").classList.add("active")
        score = 0
        document.getElementById("angle").innerHTML = ""
        i = i + 1
      }



    }



    if (landmarks[27].visibility > 0.97) {


      for (let i = 0; i < backendkeypoints.length; i++) {
        drawCircle(canvasCtx5, keypoints[backendkeypoints[i]].x, keypoints[backendkeypoints[i]].y, "yellow", 5)
      }
    }
    else {


      for (let i = 0; i < backendkeypoints.length; i++) {
        drawCircle(canvasCtx5, keypoints[backendkeypoints[i]].x, keypoints[backendkeypoints[i]].y, "red", 5)
      }

    }
    document.getElementById("angle1").innerHTML = exerlist[count]
    if (exerlist[count] == "Setup"){
      let audio = new Audio("static/audio/orientation.mp3")
      audio.play()
    }
    if (exerlist[count] == "Alternate Toe Touch") {
      if (calculateangle(canvasCtx5, keypoints[23], keypoints[11], keypoints[15]) > 60 && calculateangle(canvasCtx5, keypoints[25], keypoints[23], keypoints[11]) && keypoints[11].y < keypoints[15].y && distance(keypoints[11], keypoints[26]) < output.Criteria.distance && keypoints[16].x < keypoints[24].x - 25) {
        score = score + 0.5
        document.getElementById("angle").innerHTML = score
      }
      if (calculateangle(canvasCtx5, keypoints[24], keypoints[12], keypoints[16]) > 60 && calculateangle(canvasCtx5, keypoints[26], keypoints[24], keypoints[12]) && keypoints[12].y < keypoints[16].y && distance(keypoints[12], keypoints[25]) < output.Criteria.distance && keypoints[15].x < keypoints[23].x - 25) {
        score = score + 0.5
        document.getElementById("angle").innerHTML = score
      }
    }
    if (exerlist[count] == "Spot Jogging") {
      if (calculateangle(canvasCtx5, keypoints[11], keypoints[23], keypoints[25]) > output.Criteria.angle && keypoints[27].y < keypoints[28].y) {
        score = score + 0.5
        document.getElementById("angle").innerHTML = score

      }
      if (calculateangle(canvasCtx5, keypoints[12], keypoints[24], keypoints[26]) > output.Criteria.angle && keypoints[27].y > keypoints[28].y) {
        score = score + 0.5
        document.getElementById("angle").innerHTML = score

      }

    }
    if (exerlist[count] == "Squats") {
      //angle of hip distance between trunk and ankle
      console.log("Ankle knee angle", calculateangle(canvasCtx5, keypoints[31], keypoints[27], keypoints[25]))
      console.log("Hip angle", calculateangle(canvasCtx5, keypoints[11], keypoints[23], keypoints[25]))
      console.log("distance", distance(keypoints[23], keypoints[27]))
      if (calculateangle(canvasCtx5, keypoints[31], keypoints[27], keypoints[25]) < output.Criteria.angle && calculateangle(canvasCtx5, keypoints[11], keypoints[23], keypoints[25]) > output.Criteria.angle && distance(keypoints[23], keypoints[27]) > output.Criteria.distance) {
        score = score + 1
        document.getElementById("angle").innerHTML = score
      }
    }
    if (exerlist[count] == "Push-Ups") {
      console.log(calculateangle(canvasCtx5, keypoints[17], keypoints[31], keypoints[11]))
      if (itr[0] && itr[1]) {
        score = score + 1
        itr[0] = false
        itr[1] = false
      }
      if (itr[0] && calculateangle(canvasCtx5, keypoints[17], keypoints[31], keypoints[11]) > 18) {
        itr[1] = true
      }
      else {
        if (calculateangle(canvasCtx5, keypoints[17], keypoints[31], keypoints[11]) < 10) {
          itr[0] = true
        }
      }
      document.getElementById("angle").innerHTML = score
    }
    if (exerlist[count] == "Plank") {
      if (calculateangle(canvasCtx5, keypoints[17], keypoints[31], keypoints[11]) > 7 && calculateangle(canvasCtx5, keypoints[17], keypoints[31], keypoints[11]) < 9) {
        score = score + 0.5

      }
      document.getElementById("angle").innerHTML = score

    }

  }



}

counter()

