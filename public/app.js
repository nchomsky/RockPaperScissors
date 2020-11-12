/*
Game Rules:
Rock Beats Scissors
Paper Beats Rock
Scissors Beats Paper
A tie means players should choose again until someone wins
*/

//initializing variables
const computerIcon = document.getElementById('opponent-icon');
const playerIcon = document.getElementById('player-icon');
// Not assigning const to these variables because they change
let computerChoice = "";
let playerChoice = "rock";

//Add event listener for onClick on button

const hideChoices = () => {
    document.querySelector(".player-choice").style.visibility = 'hidden';
    document.querySelector(".opponent-choice").style.visibility = 'hidden';
}

// Basic logic for Game Rules right now
//Will add variables for DOM output later
function determineWinner() {
    if (playerChoice === "rock" && computerChoice === "scissors" ||
        playerChoice === "scissors" && computerChoice === "rock" ||
        playerChoice === "paper" && computerChoice === "rock") {
        console.log("Player 1 Wins");
    } else if (playerChoice === computerChoice) {
        console.log("It's a tie!")
    } else {
        console.log("Player 2 wins");
    }
}

//Select Gamemode
if (gameMode === "singlePlayer") {
    startSingleplayer();
} else {
    startMultiplayer();
}

//SinglePlayer
function startSingleplayer() {
    hideChoices();
    generateComputerChoice();
    console.log("Computer: " + computerChoice);
    determineWinner();
}

function generateComputerChoice() {
    //generate a number between 1 and 3
    const number = Math.floor(Math.random() * 3) + 1;

    switch (number) {
        case 1:
            computerChoice = "rock";
            break;
        case 2:
            computerChoice = "paper";
            break;
        case 3:
            computerChoice = "scissors";
            break;
        default:
            console.log("Not a valid number")
    }
    computerIcon.classList.add(`fa-hand-${computerChoice}`)
    document.querySelector(".opponent-choice").style.visibility = '';
}

function choiceDOM() {
}

//Multiplayer
function startMultiplayer() {
    hideChoices();
}