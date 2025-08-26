let playerChoice;
let computerChoice;
let winner;
let playerScore = 0;
let computerScore = 0;
let gameState = 'start';
let timer;
let choices = ['rock', 'paper', 'scissors'];
let emojiMap = {
  'rock': '✊',
  'paper': '🖐️',
  'scissors': '✌️'
};

function setup() {
  createCanvas(windowWidth, windowHeight); // Use full window size for mobile
  textAlign(CENTER, CENTER);
  textSize(32);
  rectMode(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas on window change
}

function draw() {
  background(240, 240, 255); // Light blue-ish background for polish
  
  // Scale text and elements based on screen width
  let scaleFactor = min(width / 800, 1); // Base on 800px width
  textSize(32 * scaleFactor);
  
  if (gameState !== 'start') {
    fill(100);
    textSize(24 * scaleFactor);
    text(`Player: ${playerScore}   Computer: ${computerScore}`, width / 2, height - 30 * scaleFactor);
    textSize(32 * scaleFactor);
  }
  
  if (gameState === 'start') {
    fill(50);
    text('Rock Paper Scissors', width / 2, height / 2 - 100 * scaleFactor);
    
    // Play button with hover/touch effect
    let playHover = isOverButton(width / 2, height / 2 + 50 * scaleFactor, 200 * scaleFactor, 60 * scaleFactor);
    fill(playHover ? 100 : 150, 200, 100);
    rect(width / 2, height / 2 + 50 * scaleFactor, 200 * scaleFactor, 60 * scaleFactor, 20 * scaleFactor);
    fill(255);
    text('Play', width / 2, height / 2 + 50 * scaleFactor);
  } else if (gameState === 'choose') {
    fill(50);
    text('Choose Your Move', width / 2, 80 * scaleFactor);
    
    // Adjust layout for mobile: vertical stack if width < 600
    if (width < 600) {
      drawOption('rock', width / 2, height / 2 - 150 * scaleFactor, scaleFactor); // Increased spacing
      drawOption('paper', width / 2, height / 2, scaleFactor);
      drawOption('scissors', width / 2, height / 2 + 150 * scaleFactor, scaleFactor); // Increased spacing
    } else {
      drawOption('rock', width / 5, height / 2 + 50 * scaleFactor, scaleFactor); // Increased horizontal spacing
      drawOption('paper', width / 2, height / 2 + 50 * scaleFactor, scaleFactor);
      drawOption('scissors', 4 * width / 5, height / 2 + 50 * scaleFactor, scaleFactor); // Increased horizontal spacing
    }
  } else if (gameState === 'reveal') {
    fill(50);
    text('VS', width / 2, height / 2);
    
    let shake = sin(frameCount * 0.3) * 5 * scaleFactor;
    drawEmoji('rock', width / 4 + shake, height / 2, scaleFactor); // Use rock emoji for closed hand
    drawEmoji('rock', 3 * width / 4 - shake, height / 2, scaleFactor);
    
    fill(100);
    textSize(20 * scaleFactor);
    text('You', width / 4, height / 2 + 150 * scaleFactor);
    text('Computer', 3 * width / 4, height / 2 + 150 * scaleFactor);
    textSize(32 * scaleFactor);
    
    if (frameCount - timer > 90) { // 1.5 seconds delay
      gameState = 'result';
      winner = determineWinner(); // Call determineWinner once during state transition
    }
  } else if (gameState === 'result') {
    drawEmoji(playerChoice, width / 4, height / 2, scaleFactor);
    drawEmoji(computerChoice, 3 * width / 4, height / 2, scaleFactor);
    
    fill(100);
    textSize(20 * scaleFactor);
    text('You', width / 4, height / 2 + 150 * scaleFactor);
    text('Computer', 3 * width / 4, height / 2 + 150 * scaleFactor);
    textSize(32 * scaleFactor);
    
    fill(50);
    if (winner === 'tie') {
      text("It's a Tie!", width / 2, 80 * scaleFactor);
    } else if (winner === 'player') {
      text("You Win!", width / 2, 80 * scaleFactor);
    } else {
      text("Computer Wins!", width / 2, 80 * scaleFactor);
    }
    
    // Play again button - positioned to avoid score overlap
    let againHover = isOverButton(width / 2, height - 120 * scaleFactor, 200 * scaleFactor, 60 * scaleFactor);
    fill(againHover ? 100 : 150, 200, 100);
    rect(width / 2, height - 120 * scaleFactor, 200 * scaleFactor, 60 * scaleFactor, 20 * scaleFactor);
    fill(255);
    text('Play Again', width / 2, height - 120 * scaleFactor);
  }
}

function mousePressed() {
  handleInteraction();
}

function touchStarted() {
  handleInteraction();
  return false; // Prevent default touch behavior
}

function handleInteraction() {
  let scaleFactor = min(width / 800, 1);
  if (gameState === 'start') {
    if (isOverButton(width / 2, height / 2 + 50 * scaleFactor, 200 * scaleFactor, 60 * scaleFactor)) {
      gameState = 'choose';
    }
  } else if (gameState === 'choose') {
    if (width < 600) {
      if (isOverOption(width / 2, height / 2 - 150 * scaleFactor, scaleFactor)) {
        playerChoice = 'rock';
        startReveal();
      } else if (isOverOption(width / 2, height / 2, scaleFactor)) {
        playerChoice = 'paper';
        startReveal();
      } else if (isOverOption(width / 2, height / 2 + 150 * scaleFactor, scaleFactor)) {
        playerChoice = 'scissors';
        startReveal();
      }
    } else {
      if (isOverOption(width / 5, height / 2 + 50 * scaleFactor, scaleFactor)) {
        playerChoice = 'rock';
        startReveal();
      } else if (isOverOption(width / 2, height / 2 + 50 * scaleFactor, scaleFactor)) {
        playerChoice = 'paper';
        startReveal();
      } else if (isOverOption(4 * width / 5, height / 2 + 50 * scaleFactor, scaleFactor)) {
        playerChoice = 'scissors';
        startReveal();
      }
    }
  } else if (gameState === 'result') {
    if (isOverButton(width / 2, height - 120 * scaleFactor, 200 * scaleFactor, 60 * scaleFactor)) {
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

function drawOption(choice, x, y, scaleFactor) {
  let hover = isOverOption(x, y, scaleFactor);
  fill(hover ? 200 : 255, 220, 255);
  rect(x, y, 150 * scaleFactor, 200 * scaleFactor, 20 * scaleFactor);
  drawEmoji(choice, x, y - 20 * scaleFactor, scaleFactor);
  fill(50);
  textSize(24 * scaleFactor);
  text(choice.charAt(0).toUpperCase() + choice.slice(1), x, y + 110 * scaleFactor);
  textSize(32 * scaleFactor);
}

function drawEmoji(choice, x, y, scaleFactor) {
  textSize(80 * scaleFactor);
  text(emojiMap[choice], x, y);
  textSize(32 * scaleFactor);
}

function isOverOption(x, y, scaleFactor) {
  return dist(mouseX, mouseY, x, y) < 75 * scaleFactor;
}

function isOverButton(x, y, w, h) {
  return mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;
}
