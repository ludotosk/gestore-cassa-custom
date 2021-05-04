//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per la gestione delle get e delle post
const fastify = require('fastify')
//lancio fastify
const app = fastify()
//libreria per le cross origin
const fastifyCors = require("fastify-cors");
//libreria per i file statici
const fastifyStatic = require("fastify-static")
//api node per il percorso
const path = require('path')
//script per la connessione alla cassa
const connessione = require('./servizi/connessione')

const dbModule = require('./routes/api/db')
const db = dbModule.db

//lancio lo script
connessione.main()

// Middleware per le chiamate cross origin
app.register(fastifyCors, {})
app.register(fastifyStatic, {
    //cartlla file statici
    root: path.join(__dirname + '/public'),
})

app.register(require('./routes/api/db'), { prefix: '/api/db' })
app.register(require('./routes/api/scontrini'), { prefix: `/api/scontrini` })
app.register(require('./routes/api/status'), { prefix: '/api/status' })


// Start the server
app.listen(5000, '0.0.0.0', function (err, address) {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening on ${address}`)
})

//funzione che chiude il server
function handle() {
    console.info('SIGTERM or SIGINT signal received.');
    console.log('Closing http server.');
    db.close(() => {
            console.log('Chiusura database');
        })
    app.close(() => {
        console.log('Http server closed.');
    });
}



//gestisco il segnale di chiusura del server
process.on('SIGTERM', handle);
process.on('SIGINT', handle);