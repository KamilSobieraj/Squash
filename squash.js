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
  width: 100,
  height: 10,
  leftXPosition: 50,
  rightXPosition: 350,
  userTurn: true
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
      paddle.leftXPosition,
      canvas.height - paddle.height,
      paddle.width,
      paddle.height,
      "red"
    );
  },
  computerPaddel: function() {
    draw.rectangle(
      paddle.rightXPosition,
      canvas.height - paddle.height,
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
        `You win!`,
        canvas.width / 2,
        canvas.height / 2 - 100
      );
      canvasContext.textAlign = "center";
      canvasContext.fillText(
        `Click to continue.`,
        canvas.width / 2,
        canvas.height / 2
      );
    },
    loser: function() {
      canvasContext.font = "30px Georgia";
      canvasContext.textAlign = "center";
      canvasContext.fillText(
        `You lose!`,
        canvas.width / 2,
        canvas.height / 2 - 100
      );
      canvasContext.fillText(
        `Click to continue.`,
        canvas.width / 2,
        canvas.height / 2
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
    paddle.leftXPosition = mousePos.x - paddle.width / 2;
  },
  computerPaddel: function() {
    let paddleRightCenter = paddle.rightXPosition + paddle.width / 2;
    if (paddleRightCenter < ball.xPosition - 35) {
      paddle.rightXPosition += 6;
    } else if (paddleRightCenter > ball.xPosition + 35) {
      paddle.rightXPosition -= 6;
    }
  },
  ballPositionReset: function() {
    if (
      (score.user >= score.winning || score.computer >= score.winning) &&
      (score.user - score.computer > 1 || score.computer - score.user > 1)
    ) {
      score.showResult = true;
    }
    //ball.xSpeed = -ball.xSpeed;
    ball.xSpeed = -4;
    ball.ySpeed = -4;
    //ball.ySpeed = -ball.ySpeed;
    ball.xPosition = canvas.width / 2;
    ball.yPosition = canvas.height / 2 - 100;
  },
  changeTurn: function() {
    paddle.userTurn = !paddle.userTurn;
  },
  everyting: function() {
    score.showResult;
    movement.computerPaddel();
    ball.xPosition += ball.xSpeed;
    ball.yPosition += ball.ySpeed;
    //Bouncing a ball with a paddle
    //User paddle turn

    if (paddle.userTurn === true) {
      if (ball.yPosition > canvas.height) {
        //if bounced
        if (
          ball.xPosition > paddle.leftXPosition - 5 &&
          ball.xPosition < paddle.leftXPosition + paddle.width + 5
        ) {
          ball.ySpeed = -ball.ySpeed;
          let paddleHitPoint =
            ball.xPosition - (paddle.leftXPosition + paddle.width / 2); //Calc in which part of paddle ball is hitting
          ball.xSpeed = paddleHitPoint * 0.2; //Ball change direction depends on what part of paddle P1 hit
          movement.changeTurn();
        } else {
          score.computer++;
          movement.ballPositionReset();
        }
      }
    } else {
      //Computer paddle
      if (ball.yPosition > canvas.height) {
        if (
          ball.xPosition > paddle.rightXPosition &&
          ball.xPosition < paddle.rightXPosition + paddle.width
        ) {
          ball.ySpeed = -ball.ySpeed;
          let paddleHitPoint =
            ball.xPosition - (paddle.rightXPosition + paddle.width / 2); //Calc in which part of paddle ball is hitting
          ball.xSpeed = paddleHitPoint * 0.2; //Ball change direction depends on what part of paddle P1 hit
          movement.changeTurn();
        } else {
          score.user++;
          movement.ballPositionReset();
        }
      }
    }

    //Top and bottom ball bounce
    if (ball.yPosition < 0) {
      ball.ySpeed = -ball.ySpeed;
    }
    if (ball.xPosition < 0) {
      ball.xSpeed = -ball.xSpeed;
    }
    if (ball.xPosition > canvas.width) {
      ball.xSpeed = -ball.xSpeed;
    }
  }
};

function startGame() {
  draw.everything();
  movement.everyting();
  console.log(paddle.userTurn);
}
setInterval(startGame, 1000 / draw.framesPerSecond);

canvas.addEventListener("mousemove", movement.userPaddel);
canvas.addEventListener("mousedown", score.resetScore);
