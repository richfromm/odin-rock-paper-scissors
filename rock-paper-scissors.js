// we will convert all text to lowercase
const SELECTIONS = ['rock', 'paper', 'scissors'];

const PLAYER_COLOR = 'blue';
const COMPUTER_COLOR = 'red';
// keep consistent with body color in style.css
const DEFAULT_COLOR = 'brown';

const BOLD = 'bold';
const BIG = 'larger';

// Return a random integer between 0 (inclusive) and max (exclusive)
// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getComputerChoice() {
    return SELECTIONS[getRandomInt(3)];
}

// Canonicalize selection to all lowercase with no excess whitespace
function canonicalizeSelection(selection) {
    return selection.trim().toLowerCase();
}

// Format selection for output
// Remove whitespace, leading caps only
function formatSelection(selection) {
    selection = selection.trim();
    return selection.slice(0, 1).toUpperCase() + selection.slice(1).toLowerCase();
}

// Is the selection legal, return a boolean
function isSelectionLegal(selection) {
    return selection == null ? false : SELECTIONS.includes(canonicalizeSelection(selection));
}

// Computer the results for a single round of the game
// Return 1 if player wins, -1 if computer wins, 0 for a tie
//
// The rules are:
// * rock beats scissors
// * scissors beats paper
// * paper beats rock
//
// Assume that the selections are legal selections
function computeRound(playerSelection, computerSelection) {
    playerSelection = canonicalizeSelection(playerSelection);
    computerSelection = canonicalizeSelection(computerSelection);
    console.debug(`player=${playerSelection} computer=${computerSelection}`);

    // tie
    if (playerSelection === computerSelection) {
        console.debug("tie: return 0");
        return 0;
    }

    // player win
    if (playerSelection === "rock" && computerSelection == "scissors"
        || playerSelection === "scissors" && computerSelection == "paper"
        || playerSelection === "paper" && computerSelection == "rock") {
        console.debug("player: return 1");
        return 1;
    }

    // only option left should be computer win, but verify that's true
    console.assert(computerSelection === "rock" && playerSelection == "scissors"
                   || computerSelection === "scissors" && playerSelection == "paper"
                   || computerSelection === "paper" && playerSelection == "rock",
                   "There's a bug in the computeRound() function. Sorry.");
    console.debug("computer: return -1");
    return -1;
}

function updateText(
    elementId, text,
    color = DEFAULT_COLOR,
    fontWeight = 'normal',
    fontSize = undefined)
{
    document.getElementById(elementId).textContent = text;
    document.getElementById(elementId).style.color = color;
    document.getElementById(elementId).style.fontWeight = fontWeight;
    if (fontSize) {
        document.getElementById(elementId).style.fontSize = fontSize;
    }
}

// Play a single round of the game
// Player choice is via the custom data attribute "move" on the button element attached to this function
// (as a click event listener)
// Computer choice is random
// Compute the result, log meaningful messages, and check the score of the game
function playRound() {
    // this is the button element
    let playerSelection = this.dataset["move"]
    let computerSelection = getComputerChoice();
    console.log(`You chose ${playerSelection}, computer chose ${computerSelection}`);
    let result = computeRound(playerSelection, computerSelection);

    let msgTop1, msgTop2, color1;
    if (result > 0) {
        msgTop1 = "You Win!";
        color1 = PLAYER_COLOR;
        msgTop2 = `${formatSelection(playerSelection)} beats ${formatSelection(computerSelection)}`;
        playerScore++;
    } else if (result < 0) {
        msgTop1 = "You Lose!";
        color1 = COMPUTER_COLOR;
        msgTop2 = `${formatSelection(computerSelection)} beats ${formatSelection(playerSelection)}`;
        computerScore++;
    } else {
        console.assert(result == 0, "There's a bug in the playRound() function. Sorry.");
        msgTop1 = "Tie!";
        msgTop2 = `You both chose ${formatSelection(computerSelection)}. Try again.`;
        // no need to adjust either score
    }
    console.log(msgTop1, msgTop2);
    updateText('msgTop1', msgTop1, color1, BOLD, BIG);
    updateText('msgTop2', msgTop2);
    outputScore(playerScore, computerScore);

    // will end game if appropriate
    checkScore();
}

function outputScore(playerScore, computerScore) {
    console.log(`SCORE: Player: ${playerScore} Computer: ${computerScore}`);
    updateText('playerScore', playerScore);
    updateText('computerScore', computerScore);
}

function showPlayButton() {
    console.log("Showing play button, hiding other buttons");
    document.querySelector('div#play1').style.display = 'flex';
    document.querySelector('div#move').style.display = 'none';
    document.querySelector('div#play2').style.display = 'none';
}

function showMoveButtons() {
    console.log("Showing move buttons, hiding other button");
    document.querySelector('div#play1').style.display = 'none';
    document.querySelector('div#move').style.display = 'flex';
    document.querySelector('div#play2').style.display = 'none';
}

function showReplayButton() {
    console.log("Showing replay button, hiding other buttons");
    document.querySelector('div#play1').style.display = 'none';
    document.querySelector('div#move').style.display = 'none';
    document.querySelector('div#play2').style.display = 'flex';
}

function resetScore() {
    playerScore = 0;
    computerScore = 0;
    outputScore(playerScore, computerScore);
}

function clearBottom() {
    updateText('msgBottom1', "");
    updateText('msgBottom2', "");
}

function firstTime() {
    console.clear();
    console.log("First time");

    resetScore();
    clearBottom();

    let msgTop1 = "Welcome to the classic game of Rock, Paper, Scissors.";
    let msgTop2 = `We are going to play best of ${NUM_ROUNDS}. Ties do over.`;
    updateText('msgTop1', msgTop1);
    updateText('msgTop2', msgTop2);

    showPlayButton();
}

function playGame() {
    console.log("Play game");

    resetScore();
    clearBottom();

    updateText('msgTop1', "");
    updateText('msgTop2', "Make your first move...");

    showMoveButtons();
}

// Play NUM_ROUNDS complete rounds of the game
// We don't count rounds in which there is a tie
function checkScore() {
    if (playerScore + computerScore >= NUM_ROUNDS) {
        gameOver();
    }
}

function gameOver() {
    let msgBottom1 = "Game Over!";
    console.log(msgBottom1);
    updateText('msgBottom1', msgBottom1, DEFAULT_COLOR, BOLD, BIG);

    let msgBottom2, color2;
    if (playerScore > computerScore) {
        msgBottom2 = "Congratulations! You won the game!";
        color2 = PLAYER_COLOR;
    } else if (playerScore < computerScore) {
        msgBottom2 = "Sorry, you lost the game. Better luck next time.";
        color2 = COMPUTER_COLOR;
    } else {
        msgBottom2 = "Somehow you both tied, that's not supposed to be able to happen";
    }
    console.log(msgBottom2);
    updateText('msgBottom2', msgBottom2, color2);

    showReplayButton();
}

// We *don't* need to call this repeatedly, even when hiding/showing buttons
function addEventListeners() {
    // Even though the listeners are always in effect (we don't remove them),
    // it's not effectively possible to do click differnt button types at the
    // same time, b/c only one of these types is showing at any moment in time.
    document.querySelectorAll('button.move').forEach(
        button => button.addEventListener('click', playRound));
    document.querySelectorAll('button.play').forEach(
        button => button.addEventListener('click', playGame));
}

// XXX are global variables bad?

let playerScore, computerScore;

const NUM_ROUNDS = 5;
// don't allow an even number or rounds, so we can force a winner
console.assert(NUM_ROUNDS % 2 == 1, "Please set an odd number of rounds, to force a winner.");

addEventListeners();
firstTime();
