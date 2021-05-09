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
//script con funzioni mie
const controllo = require('./funzioniControllo')
//libreria lettura file
const fs = require('fs')
//recupero la chiave pubblica
const pathPub = path.resolve(__dirname, 'chiavi/rsa_4096_pub.pem')
//copio la chive pubblica in una costante
const pub = fs.readFileSync(pathPub, 'utf8')

//prendo l'oggetto database per poterlo chiudere nella funzione di spegnimento
const dbModule = require('./routes/db')
const db = dbModule.db

//lancio lo script
connessione.main()

// Middleware per le chiamate cross origin
app.register(fastifyCors, {})
// Middleware per inviare file statici
app.register(fastifyStatic, {
    //cartlla file statici
    root: path.join(__dirname + '/public'),
})

//espongo la chiave pubblica per inviare dati al server
app.get('/pubkey', (req, reply) => {
    console.log('Chiave pubblica inviata')
    reply.send(pub)
})

app.register(require('./routes/db'), { prefix: '/db' })
app.register(require('./routes/scontrini'), { prefix: `/scontrini` })
app.register(require('./routes/status'), { prefix: '/status' })
app.register(require('./routes/codice'), { prefix: '/codice' })
app.register(require('./routes/indirizzo'), { prefix: '/indirizzo' })

// Start the server
app.listen(3000, '0.0.0.0', function (err, address) {
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