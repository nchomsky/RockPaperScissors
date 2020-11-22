/*
Game Rules:
Rock Beats Scissors
Paper Beats Rock
Scissors Beats Paper
A tie means players should choose again until someone wins
*/

// const { info } = require("console");

//selecting elements
const computerIcon = document.getElementById('opponent-icon');
const opponentIconFull = document.querySelector(".opponent-choice");
const playerIcon = document.getElementById('player-icon');
const playerIconFull = document.querySelector(".player-choice");
const winner = document.getElementById('win');
const loser = document.getElementById('lose');
const tie = document.getElementById('tie');
const playAgain = document.querySelector('.again');
const mainMenu = document.querySelector('.menu');
const makeChoice = document.querySelector('.player-choose');

//helpful for deciding which buttons to toggle when resetting game
const possibleOutcomes = [winner, loser, tie];

// Not assigning const to these variables because they change
let computerChoice = "";
let playerChoice = "";
let playerNum = 0;
let ready = false;
let opponentReady = false;
let choiceMade = false;

//-------------Event Listeners-------------\\
playAgain.addEventListener('click', startSingleplayer);
mainMenu.addEventListener('click', () => {
    window.location = "/";
});


//-------------Toggle Functions-------------\\

const toggleOutcome = () => {
    playerIconFull.classList.toggle("hidden");
    opponentIconFull.classList.toggle("hidden");
}

//function to hide end of game elements
const hideElements = () => {
    possibleOutcomes.forEach(el => {
        if (!el.classList.contains("hidden")) {
            el.classList.toggle("hidden");
        }
    });
    toggleButtons();
}

//toggles end of game option buttons (Play again and Main Menu)
const toggleButtons = () => {
    playAgain.classList.toggle("hidden");
    mainMenu.classList.toggle("hidden");
}

//function to toggle player's options
const toggleOptions = () => {
    makeChoice.classList.toggle("hidden");
}

//-------------Game Functionality (SinglePlayer)-------------\\

//Select Gamemode
if (gameMode === "singlePlayer") {
    startSingleplayer();
} else {
    startMultiplayer();
}

//SinglePlayer
function startSingleplayer() {
    toggleOutcome();
    hideElements();
    resetDefaults();
    if (makeChoice.classList.contains("hidden")) {
        toggleOptions();
    }
    generateComputerChoice();
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

}

function playerMakeChoice(choice) {
    if (choice === "rock") {
        playerChoice = "rock";
    } else if (choice === "paper") {
        playerChoice = "paper";
    } else {
        playerChoice = "scissors";
    }
    choiceMade = true;
    //remove the option to make another choice
    toggleOptions();
    playerIcon.classList.add(`fa-hand-${playerChoice}`)
    toggleOutcome();
    determineWinner();
    toggleButtons();
}

// Logic for SinglePlayer Winner
function determineWinner() {
    if (playerChoice === "rock" && computerChoice === "scissors" ||
        playerChoice === "scissors" && computerChoice === "paper" ||
        playerChoice === "paper" && computerChoice === "rock") {
        winner.classList.toggle("hidden");
        // console.log("Player 1 Wins");
    } else if (playerChoice === computerChoice) {
        tie.classList.toggle("hidden");
        // console.log("It's a tie!")
    } else {
        loser.classList.toggle("hidden");
        // console.log("Player 2 wins");
    }
    console.log(playerChoice);
    console.log(computerChoice);
}

function resetDefaults() {
    playerIcon.classList.remove(`fa-hand-${playerChoice}`);
    computerIcon.classList.remove(`fa-hand-${computerChoice}`);
    computerChoice = "";
    playerChoice = "";
}

//-------------Game Functionality (Multiplayer)-------------\\

//Multiplayer
function startMultiplayer() {
    toggleOutcome();
    toggleOptions();
    hideElements();

    //-------------Socket.io Setup-------------\\

    // Connecting socket.io
    const socket = io();

    //Get player number
    socket.on('player-number', num => {
        if (num === -1) {
            // infoDisplay.innerHTML = "Sorry, the server is full";
        } else {
            playerNum = parseInt(num);
            if (playerNum === 1) {
                currentPlayer = "opponent";
            }
            console.log(playerNum);

            //Get other player status
            socket.emit('check-players');
        }
    })
    //A player connected or disconnected
    socket.on('player-connection', (num) => {
        console.log(`Player number ${num} has connected or disconnected`);
        playerConnectedOrDisconnected(num);
    })

    function playerConnectedOrDisconnected(num) {
        let player = `.p${parseInt(num) + 1}`;
        document.querySelector(`${player} .connected span`).classList.toggle('green');
        if (parseInt(num) === playerNum) {
            // document.querySelector(`${player} .connected span`).classList.toggle('green');
        }
        console.log(`player: ${player}`);
    }

    //Check player status
    socket.on('check-players', players => {
        players.forEach((p, i) => {
            if (p.connected) {
                playerConnectedOrDisconnected(i);
            }
        })
    })

}

function playMultiplayerGame() {
    toggleOptions();
}