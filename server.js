const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

//Handle a socket connection request from web client (Socket is client that is connecting)
const connections = [null, null];
io.on('connection', (socket) => {
    // console.log('a user connected');

    //Find available player number
    let playerIndex = -1;
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i;
            break;
        }
    }

    //Tell connecting client what player number they are
    socket.emit('player-number', playerIndex);

    console.log(`Player ${playerIndex} has connected`);

    //Ignore PLayer 3
    if (playerIndex === -1) {
        return;
    }

    connections[playerIndex] = false;

    //Tell everyone what player number connected
    socket.broadcast.emit('player-connection', playerIndex);

    //Handle Disconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected`)
        connections[playerIndex] = null;
        //tell what player disconnected
        socket.broadcast.emit('player-connection', playerIndex)
    });

    //on ready (player's made a choice)
    socket.on('player-ready', (choice) => {
        socket.broadcast.emit('opponent-ready', playerIndex);
        connections[playerIndex] = true;
        console.log(`${playerIndex} choice is ${choice}`);
        console.log(`${playerIndex} is ready`);
    });

    //check player connections
    socket.on('check-players', () => {
        const players = [];
        for (const i in connections) {
            connections[i] === null ? players.push({ connected: false, ready: false }) :
                players.push({ connected: true, ready: connections[i] });
        }
        socket.emit('check-players', players);

    })

    //choice received
    socket.on('choice-received', choice => {
        console.log(`Choice received from ${playerIndex}`, choice);

        //Emit choice to other player
        socket.broadcast.emit('choice-received', choice);
    });

    //Receive both choices from players and determine winner
    socket.on('determine-winner', (playerChoice1, playerChoice2) => {
        console.log(`server: p1: ${playerChoice1} p2: ${playerChoice2}`);
        let winner = "";
        let tie = false;
        //if playerChoices aren't equal figit commitgure out who won... otherwise it's a tie
        if (playerChoice1 !== playerChoice2) {
            if (playerChoice1 === "rock" && playerChoice2 === "scissors" ||
                playerChoice1 === "scissors" && playerChoice2 === "paper" ||
                playerChoice1 === "paper" && playerChoice2 === "rock") {
                winner = "player1";
                console.log(winner);
            } else {
                winner = "player2";
                console.log(winner);
            }
        } else {
            tie = true;
            console.log('its a tie');
        }
        //emitting the winner (or if it is a tie) to all clients
        io.emit('determine-winner', winner, tie, playerChoice1, playerChoice2);
    });

    // Timeout connection (5 min limit until timeout)
    setTimeout(() => {
        connections[playerIndex] = null
        socket.emit('timeout')
        socket.disconnect()
    }, 300000)
});