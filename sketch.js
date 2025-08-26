let playerChoice;
let computerChoice;
let winner;
let playerScore = 0;
let computerScore = 0;
let gameState = 'start';
let timer;
let choices = ['rock', 'paper', 'scissors'];

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER);
  textSize(32);
  rectMode(CENTER);
  ellipseMode(CENTER);
}

function draw() {
  background(240, 240, 255); // Light blue-ish background for polish
  
  if (gameState !== 'start') {
    fill(100);
    textSize(24);
    text(`Player: ${playerScore}   Computer: ${computerScore}`, width / 2, height - 30);
    textSize(32);
  }
  
  if (gameState === 'start') {
    fill(50);
    text('Rock Paper Scissors', width / 2, height / 2 - 100);
    
    // Play button with hover effect
    let playHover = mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 20 && mouseY < height / 2 + 80;
    fill(playHover ? 100 : 150, 200, 100);
    rect(width / 2, height / 2 + 50, 200, 60, 20);
    fill(255);
    text('Play', width / 2, height / 2 + 60);
  } else if (gameState === 'choose') {
    fill(50);
    text('Choose Your Move', width / 2, 80);
    
    drawOption('rock', width / 4, height / 2 + 50);
    drawOption('paper', width / 2, height / 2 + 50);
    drawOption('scissors', 3 * width / 4, height / 2 + 50);
  } else if (gameState === 'reveal') {
    fill(50);
    text('VS', width / 2, height / 2);
    
    let shake = sin(frameCount * 0.3) * 5;
    drawHand('closed', width / 4 + shake, height / 2);
    drawHand('closed', 3 * width / 4 - shake, height / 2);
    
    fill(100);
    textSize(20);
    text('You', width / 4, height / 2 + 150);
    text('Computer', 3 * width / 4, height / 2 + 150);
    textSize(32);
    
    if (frameCount - timer > 90) { // 1.5 seconds delay
      winner = determineWinner();
      gameState = 'result';
    }
  } else if (gameState === 'result') {
    drawHand(playerChoice, width / 4, height / 2);
    drawHand(computerChoice, 3 * width / 4, height / 2);
    
    fill(100);
    textSize(20);
    text('You', width / 4, height / 2 + 150);
    text('Computer', 3 * width / 4, height / 2 + 150);
    textSize(32);
    
    fill(50);
    if (winner === 'tie') {
      text("It's a Tie!", width / 2, 80);
    } else if (winner === 'player') {
      text("You Win!", width / 2, 80);
    } else {
      text("Computer Wins!", width / 2, 80);
    }
    
    // Play again button with hover effect
    let againHover = mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height - 100 && mouseY < height - 40;
    fill(againHover ? 100 : 150, 200, 100);
    rect(width / 2, height - 70, 200, 60, 20);
    fill(255);
    text('Play Again', width / 2, height - 60);
  }
}

function mousePressed() {
  if (gameState === 'start') {
    let playHover = mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 20 && mouseY < height / 2 + 80;
    if (playHover) {
      gameState = 'choose';
    }
  } else if (gameState === 'choose') {
    // Check clicks on options
    if (isOverOption(width / 4, height / 2 + 50)) {
      playerChoice = 'rock';
      startReveal();
    } else if (isOverOption(width / 2, height / 2 + 50)) {
      playerChoice = 'paper';
      startReveal();
    } else if (isOverOption(3 * width / 4, height / 2 + 50)) {
      playerChoice = 'scissors';
      startReveal();
    }
  } else if (gameState === 'result') {
    let againHover = mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height - 100 && mouseY < height - 40;
    if (againHover) {
      gameState = 'choose';
      playerChoice = null;
      computerChoice = null;
    }
  }
}

function startReveal() {
  computerChoice = random(choices);
  timer = frameCount;
  gameState = 'reveal';
}

function determineWinner() {
  if (playerChoice === computerChoice) {
    return 'tie';
  }
  if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    playerScore++;
    return 'player';
  } else {
    computerScore++;
    return 'computer';
  }
}

function drawOption(choice, x, y) {
  let hover = isOverOption(x, y);
  fill(hover ? 200 : 255, 220, 255);
  rect(x, y, 150, 200, 20);
  drawHand(choice, x, y - 20);
  fill(50);
  textSize(24);
  text(choice.charAt(0).toUpperCase() + choice.slice(1), x, y + 110);
  textSize(32);
}

function isOverOption(x, y) {
  return mouseX > x - 75 && mouseX < x + 75 && mouseY > y - 100 && mouseY < y + 100;
}

function drawHand(choice, x, y) {
  noStroke();
  fill(255, 224, 189); // Skin color
  
  // Arm/wrist for all
  rect(x, y + 80, 50, 120, 20);
  
  if (choice === 'closed' || choice === 'rock') {
    // Fist
    ellipse(x, y + 20, 80, 80);
    // Thumb overlay
    push();
    translate(x - 40, y + 20);
    rotate(-PI / 6);
    ellipse(0, 0, 40, 60);
    pop();
  } else if (choice === 'paper') {
    // Flat hand (palm)
    rect(x, y, 100, 90, 20);
    // Finger separations (lines)
    stroke(200, 150, 100);
    strokeWeight(2);
    line(x - 40, y - 45, x - 40, y + 45);
    line(x - 15, y - 45, x - 15, y + 45);
    line(x + 15, y - 45, x + 15, y + 45);
    line(x + 40, y - 45, x + 40, y + 45);
    noStroke();
  } else if (choice === 'scissors') {
    // Palm base
    ellipse(x, y + 30, 70, 70);
    // Index and middle fingers (blades)
    push();
    translate(x - 15, y - 30);
    rotate(-PI / 12);
    rect(0, 0, 25, 100, 10);
    pop();
    push();
    translate(x + 15, y - 30);
    rotate(PI / 12);
    rect(0, 0, 25, 100, 10);
    pop();
    // Thumb
    push();
    translate(x - 40, y + 40);
    rotate(PI / 3);
    rect(0, 0, 25, 60, 10);
    pop();
  }
  
  // Add subtle shadow for polish
  fill(0, 0, 0, 50);
  ellipse(x + 10, y + 100, 60, 20); // Shadow under arm
}
