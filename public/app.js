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
const choiceIcons = document.querySelector('.player-choose');

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
    optionButtons.classList.toggle("hidden");
}

const revealButtons = () => {
    optionButtons.classList.toggle("hidden");
}

//function to hide players options
const hideOptions = () => {
    choiceIcons.classList.toggle("hidden");
}

//need to add eventlistener for onClick event of the choices and buttons
const makeChoice = () => {

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
    generateComputerChoice();
    console.log("Computer: " + computerChoice);
    determineWinner();
    revealButtons();
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