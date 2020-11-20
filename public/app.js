/*
Game Rules:
Rock Beats Scissors
Paper Beats Rock
Scissors Beats Paper
A tie means players should choose again until someone wins
*/

//selecting elements
const computerIcon = document.getElementById('opponent-icon');
const playerIcon = document.getElementById('player-icon');
const winner = document.getElementById('win');
const loser = document.getElementById('lose');
const tie = document.getElementById('tie');
const optionButtons = document.querySelector('.btn-end');
const makeChoice = document.querySelector('.player-choose');

// Not assigning const to these variables because they change
let computerChoice = "";
let playerChoice = "rock";

const hideChoices = () => {
    document.querySelector(".player-choice").style.visibility = 'hidden';
    document.querySelector(".opponent-choice").style.visibility = 'hidden';
}

//function to hide end of game elements
const hideElements = () => {
    winner.classList.toggle("hidden");
    loser.classList.toggle("hidden");
    tie.classList.toggle("hidden");
    toggleButtons();
}

//toggles end of game option buttons (Play again and Main Menu)
const toggleButtons = () => {
    optionButtons.classList.toggle("hidden");
}

//function to toggle player's options
const toggleOptions = () => {
    makeChoice.classList.toggle("hidden");
}

function playerMakeChoice(choice) {
    console.log("click");
    if (choice === "rock") {
        playerChoice = "rock";
    } else if (choice === "paper") {
        playerChoice = "paper";
    } else {
        playerChoice = "scissors";
    }
    //remove the option to make another choice
    toggleOptions();
    playerIcon.classList.add(`fa-hand-${playerChoice}`)
    document.querySelector(".player-choice").style.visibility = '';
    console.log(playerChoice);
}

// Basic logic for Game Rules right now
function determineWinner() {
    if (playerChoice === "rock" && computerChoice === "scissors" ||
        playerChoice === "scissors" && computerChoice === "rock" ||
        playerChoice === "paper" && computerChoice === "rock") {
        winner.classList.toggle("hidden");
        console.log("Player 1 Wins");
    } else if (playerChoice === computerChoice) {
        tie.classList.toggle("hidden");
        console.log("It's a tie!")
    } else {
        loser.classList.toggle("hidden");
        console.log("Player 2 wins");
    }
    console.log(playerChoice);
    console.log(computerChoice);
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
    hideElements();
    resetDefaults();
    playSinglePlayer();
}

function playSinglePlayer() {
    generateComputerChoice();
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
    computerIcon.classList.add(`fa-hand-${computerChoice}`);
    document.querySelector(".opponent-choice").style.visibility = '';
}

function resetDefaults() {
    playerIcon.classList.remove(`fa-hand-${playerChoice}`);
    computerIcon.classList.remove(`fa-hand-${computerChoice}`);
    computerChoice = "";
    playerChoice = "";
}

//Multiplayer
function startMultiplayer() {
    hideChoices();
}