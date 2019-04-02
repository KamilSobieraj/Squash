const canvas = document.getElementById("gameCanvas");
const canvasContext = canvas.getContext("2d");
//Ball
const ball = {
  size: 10,
  color: "white",
  xPosition: 50,
  xSpeed: 4,
  yPosition: 50,
  ySpeed: 4
};
//Paddle
const paddle = {
  width: 10,
  height: 100,
  leftYPosition: 250,
  rightYPosition: 250
};
//Score
const score = {
  user: 0,
  computer: 0,
  winning: 11,
  showResult: false,
  resetScore: function(e) {
    if (score.showResult) {
      score.user = 0;
      score.computer = 0;
      score.showResult = false;
    }
  }
};
//Draw
const draw = {
  framesPerSecond: 50,
  rectangle: function(posX, posY, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(posX, posY, width, height);
  },
  ball: function() {
    canvasContext.fillStyle = ball.color;
    canvasContext.beginPath();
    canvasContext.arc(
      ball.xPosition,
      ball.yPosition,
      ball.size,
      0,
      Math.PI * 2,
      true
    );
    canvasContext.fill();
  },
  court: function() {
    //background
    draw.rectangle(0, 0, canvas.width, canvas.height, "black");
    //hotizontal half-line
    draw.rectangle(0, canvas.height / 2 + 50, canvas.width, 2, "white");
    //vertical half-line
    draw.rectangle(
      canvas.width / 2 - 2,
      canvas.height / 2 + 50,
      2,
      canvas.height / 2 + 50,
      "white"
    );
    //service boxes
    draw.rectangle(0, canvas.height / 2 + 170, 152, 2, "white");
    draw.rectangle(
      canvas.width - 150,
      canvas.height / 2 + 170,
      152,
      2,
      "white"
    );
    draw.rectangle(152, canvas.height / 2 + 50, 2, 122, "white");
    draw.rectangle(canvas.width - 150, canvas.height / 2 + 50, 2, 122, "white");
  },
  userPaddel: function() {
    draw.rectangle(
      0,
      paddle.leftYPosition,
      paddle.width,
      paddle.height,
      "white"
    );
  },
  computerPaddel: function() {
    draw.rectangle(
      canvas.width - paddle.width,
      paddle.rightYPosition,
      paddle.width,
      paddle.height,
      "white"
    );
  },
  //Draw - Score
  score: {
    current: function() {
      canvasContext.font = "50px Georgia";
      canvasContext.fillText(`${score.user}`, 100, 100);
      canvasContext.fillText(`${score.computer}`, canvas.width - 100, 100);
    },
    winner: function() {
      canvasContext.font = "30px Georgia";
      canvasContext.textAlign = "center";
      canvasContext.fillText(
        `You won!`,
        canvas.width / 2 - 40,
        canvas.height / 2 - 50
      );
      canvasContext.fillText(
        `Click to continue.`,
        canvas.width / 2 - 35,
        canvas.height / 2 + 50
      );
    },
    loser: function() {
      canvasContext.font = "30px Georgia";
      canvasContext.textAlign = "center";
      canvasContext.fillText(
        `You lost!`,
        canvas.width / 2 - 40,
        canvas.height / 2 - 50
      );
      canvasContext.fillText(
        `Click to continue.`,
        canvas.width / 2 - 35,
        canvas.height / 2 + 50
      );
    }
  },
  everything: function() {
    draw.court();
    //Final Score Display
    if (score.showResult) {
      canvasContext.fillStyle = "white";
      if (score.user >= score.winning && score.user - score.computer > 1) {
        draw.score.winner();
      } else if (
        score.computer >= score.winning &&
        score.computer - score.user > 1
      ) {
        draw.score.loser();
      }
      return;
    }
    draw.computerPaddel();
    draw.userPaddel();
    draw.ball();
    draw.score.current();
  }
};
//Move
const movement = {
  calculateMousePosition: function(e) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseXPos = e.clientX - rect.left - root.scrollLeft;
    let mouseYPos = e.clientY - rect.top - root.scrollTop;
    return {
      x: mouseXPos,
      y: mouseYPos
    };
  },
  userPaddel: function(e) {
    let mousePos = movement.calculateMousePosition(e);
    paddle.leftYPosition = mousePos.y - paddle.height / 2;
  },
  computerPaddel: function() {
    let paddleRightCenter = paddle.rightYPosition + paddle.height / 2;
    if (paddleRightCenter < ball.yPosition - 35) {
      paddle.rightYPosition += 6;
    } else if (paddleRightCenter > ball.yPosition + 35) {
      paddle.rightYPosition -= 6;
    }
  },
  ballPositionReset: function() {
    if (
      (score.user >= score.winning || score.computer >= score.winning) &&
      (score.user - score.computer > 1 || score.computer - score.user > 1)
    ) {
      score.showResult = true;
    }
    ball.xSpeed = -ball.xSpeed;
    ball.ySpeed = 4;
    ball.xPosition = canvas.width / 2;
    ball.yPosition = canvas.height / 2;
  },
  everyting: function() {
    score.showResult;
    movement.computerPaddel();
    ball.xPosition += ball.xSpeed;
    ball.yPosition += ball.ySpeed;
    //Bouncing a ball with a paddle
    //Left paddle
    if (ball.xPosition < 0) {
      if (
        ball.yPosition > paddle.leftYPosition &&
        ball.yPosition < paddle.leftYPosition + paddle.height
      ) {
        ball.xSpeed = -ball.xSpeed;
        let paddleHitPoint =
          ball.yPosition - (paddle.leftYPosition + paddle.height / 2); //Calc in which part of paddle ball is hitting
        ball.ySpeed = paddleHitPoint * 0.2; //Ball change direction depends on what part of paddle P1 hit
      } else {
        score.computer++;
        movement.ballPositionReset();
      }
    }
    //Right paddle
    if (ball.xPosition > canvas.width - ball.size) {
      if (
        ball.yPosition > paddle.rightYPosition &&
        ball.yPosition < paddle.rightYPosition + paddle.height
      ) {
        ball.xSpeed = -ball.xSpeed;
        let paddleHitPoint =
          ball.yPosition - (paddle.rightYPosition + paddle.height / 2); //Calc in which part of paddle ball is hitting
        ball.ySpeed = paddleHitPoint * 0.2; //Ball change direction depends on what part of paddle P1 hit
      } else {
        score.user++;
        movement.ballPositionReset();
      }
    }
    //Top and bottom ball bounce
    if (ball.yPosition < 0) {
      ball.ySpeed = -ball.ySpeed;
    }
    if (ball.yPosition > canvas.height) {
      ball.ySpeed = -ball.ySpeed;
    }
  }
};

function startGame() {
  draw.everything();
  movement.everyting();
}
setInterval(startGame, 1000 / draw.framesPerSecond);

canvas.addEventListener("mousemove", movement.userPaddel);
canvas.addEventListener("mousedown", score.resetScore);
