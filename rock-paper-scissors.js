// we will convert all text to lowercase
const SELECTIONS = ["rock", "paper", "scissors"];

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

function updateText(elementId, text) {
    document.getElementById(elementId).textContent = text;
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

    let msgRound = "";
    if (result > 0) {
        msgRound = `You Win! ${formatSelection(playerSelection)} beats ${formatSelection(computerSelection)}`;
        playerScore++;
    } else if (result < 0) {
        msgRound = `You Lose! ${formatSelection(computerSelection)} beats ${formatSelection(playerSelection)}`;
        computerScore++;
    } else {
        console.assert(result == 0, "There's a bug in the playRound() function. Sorry.");
        msgRound = `Tie! You both chose ${formatSelection(computerSelection)}. Try again.`;
        // no need to adjust either score
    }
    console.log(msgRound);
    updateText('msgRound', msgRound);
    outputScore(playerScore, computerScore);

    // will end game if appropriate
    checkScore();
}

function outputScore(playerScore, computerScore) {
    console.log(`SCORE: Player: ${playerScore} Computer: ${computerScore}`);
    updateText('playerScore', playerScore);
    updateText('computerScore', computerScore);
}

function resetGame() {
    console.clear();
    let msgGame = "Hello, welcome to the classic game of Rock, Paper, Scissors.\n" +
        `We are going to play best of ${NUM_ROUNDS}. Ties do over.\n` +
        "\n" +
        "Make your move...\n";
    updateText('msgGame', msgGame);

    playerScore = 0;
    computerScore = 0;
    outputScore(playerScore, computerScore);
}

// Play NUM_ROUNDS complete rounds of the game
// We don't count rounds in which there is a tie
function checkScore() {
    if (playerScore + computerScore >= NUM_ROUNDS) {
        // XXX really we should allow you to play again
        document.querySelectorAll('button.move').forEach(button => button.removeEventListener('click', playRound));

        let msgGame = "Game Over!\n";
        if (playerScore > computerScore) {
            msgGame += "Congratulations! You won the game!";
        } else if (playerScore < computerScore) {
            msgGame += "Sorry, you lost the game. Better luck next time.";
        } else {
            msgGame += "Somehow you both tied, that's not supposed to be able to happen";
        }
        console.log(msgGame);
        updateText('msgGame', msgGame);
    }
}

// XXX are global variables bad?
let playerScore, computerScore;
const NUM_ROUNDS = 5;
// don't allow an even number or rounds, so we can force a winner
console.assert(NUM_ROUNDS % 2 == 1, "Please set an odd number of rounds, to force a winner.");
resetGame();

document.querySelectorAll('button.move').forEach(button => button.addEventListener('click', playRound));
