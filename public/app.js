/*
Game Rules:
Rock Beats Scissors
Paper Beats Rock
Scissors Beats Paper
A tie means players should choose again until someone wins
*/

// const { info } = require("console");

//selecting elements
const opponentIcon = document.getElementById('opponent-icon');
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
let opponentChoice = "";
let playerChoice = "";
let playerNum = 0;
let ready = false;
let opponentReady = false;

//multiplayer variables
let playerChoice1 = "";
let playerChoice2 = "";

//-------------Event Listeners-------------\\
playAgain.addEventListener('click', () => {
    if (gameMode === 'singlePlayer') {
        startSingleplayer();
    } else if (gameMode === 'multiPlayer') {
        startMultiplayer();
    }
});
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
            opponentChoice = "rock";
            break;
        case 2:
            opponentChoice = "paper";
            break;
        case 3:
            opponentChoice = "scissors";
            break;
        default:
            console.log("Not a valid number")
    }
    opponentIcon.classList.add(`fa-hand-${opponentChoice}`);

}

function playerMakeChoice(choice) {
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
    toggleOutcome();
    determineWinner(playerChoice, opponentChoice);
    toggleButtons();
}

// Logic for SinglePlayer and Multiplayer Winner
function determineWinner(choice1, choice2) {
    if (gameMode === 'multiPlayer') {
        playerChoice = choice1;
        opponentChoice = choice2;
    }
    if (playerChoice === "rock" && opponentChoice === "scissors" ||
        playerChoice === "scissors" && opponentChoice === "paper" ||
        playerChoice === "paper" && opponentChoice === "rock") {
        winner.classList.toggle("hidden");
        // console.log("Player 1 Wins");
    } else if (playerChoice === opponentChoice) {
        tie.classList.toggle("hidden");
        // console.log("It's a tie!")
    } else {
        loser.classList.toggle("hidden");
        // console.log("Player 2 wins");
    }
    console.log(playerChoice);
    console.log(opponentChoice);
}

function resetDefaults() {
    playerIcon.classList.remove(`fa-hand-${playerChoice}`);
    opponentIcon.classList.remove(`fa-hand-${opponentChoice}`);
    opponentChoice = "";
    playerChoice = "";
}

//-------------Game Functionality (Multiplayer)-------------\\

//Multiplayer
function startMultiplayer() {
    // toggleOptions();
    toggleOutcome();
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
        document.querySelector(`${player} .wait-connect`).classList.toggle('hidden');


        if (parseInt(num) === playerNum) {
            document.querySelector(`${player}-panel`).classList.toggle('active');
            document.querySelector(`${player}-player-choose`).classList.toggle('hidden');
        }

        console.log(`player: ${player}`);
    }

    //Choice click made (if choice made, player is ready to start multiplayer game and locked in!)
    makeChoice.addEventListener('click', (e) => {
        console.log('click');
        const isButton = e.target.nodeName === 'BUTTON';

        if (!isButton) {
            return;
        }
        console.log(e.target.id);
        playerChoice1 = e.target.id;
        playMultiplayerGame(socket, playerChoice1);

    });

    //setup Event listener for 2nd player's choice
    document.querySelector('.p2-player-choose').addEventListener('click', (e) => {
        console.log('click');
        const isButton = e.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }
        playerChoice2 = e.target.id;
        playMultiplayerGame(socket, playerChoice2);

    });

    //Notify opponent that your ready
    socket.on('opponent-ready', num => {
        opponentReady = true;
        playerReady(num);
        if (ready) {
            playMultiplayerGame(socket)
        }
    });

    //Check player +status
    socket.on('check-players', players => {
        players.forEach((p, i) => {
            if (p.connected) {
                playerConnectedOrDisconnected(i);
            }
            if (p.ready) {
                playerReady(i);
                if (i !== playerNum) {
                    opponentReady = true;
                }
            }
        })
    });

    //opponent receives choice
    socket.on('choice-received', choice => {
        console.log(`${playerNum} choice is: ${choice}`);
        //player 1 num is 1 and player 2 num is 0
        if (playerNum === 1) {
            playerChoice1 = choice;
            document.querySelector('.p1-icon').classList.add(`fa-hand-${choice}`);
        } else if (playerNum === 0) {
            playerChoice2 = choice;
            document.querySelector('.p2-icon').classList.add(`fa-hand-${choice}`);
        }

        if (ready && opponentReady) {
            console.log(`Player 1 choice is: ${playerChoice1} and Player 2 choice is: ${playerChoice2}`);
            determineWinner(playerChoice1, playerChoice2);
            socket.emit('determine-winner');
        }
    });

}



function playMultiplayerGame(socket, choice) {
    // toggleOptions();
    if (!ready) {
        socket.emit('player-ready');
        ready = true;
        socket.emit('choice-received', choice);
        playerReady(playerNum, choice);
    }

}

function playerReady(num, choice) {
    let player = `.p${parseInt(num) + 1}`;
    if (parseInt(num) === playerNum) {
        document.querySelector(`${player}-player-choose`).classList.toggle('hidden');
        document.querySelector(`${player}-icon`).classList.add(`fa-hand-${choice}`);
    }
    document.querySelector(`${player} .locked-choice`).classList.toggle('hidden');
}
