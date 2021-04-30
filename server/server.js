//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per la gestione delle get e delle post
const express = require('express')
//libreria per le chiamate cross origin
const cors = require('cors')
//script per la connessione alla cassa
const connessione = require('./servizi/connessione')

//lancio lo script
connessione.main()

//lancio express
const app = express()

// Middleware
app.use(express.json());
app.use(cors());

//javascript per la gestione delle pagine stato, scontrini e db
const scontrini = require('./routes/api/scontrini')
const status = require('./routes/api/status')
const db = require('./routes/api/db')

//assegno una route agli script
app.use('/api/scontrini', scontrini)
app.use('/api/status', status)
app.use('/api/db', db.router)

// cartella file statici
app.use(express.static(__dirname + '/public/'));

//risponde a tutte le get con la cartella statica
//ma avendo messo sopra le api quelle vengono comunque servite
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

//porta del server
const port = 5000;

//lancio il server
var server = app.listen(port, () => console.log(`Server stated on port ${port}`));

//funzione che chiude il server
function handle() {
    console.info('SIGTERM or SIGINT signal received.');
    console.log('Closing http server.');
        db.db.close(() => {
        console.log('Chiusura database')
    })
    server.close(() => {
        console.log('Http server closed.');
    });
}


//gestisco il segnale di chiusura del server
process.on('SIGTERM', handle);
process.on('SIGINT', handle);