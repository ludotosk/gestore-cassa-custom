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
//libreria per loggin
const fastifyJwt = require("fastify-jwt")
//api node per il percorso
const path = require('path')
//script per la connessione alla cassa
const connessione = require('./servizi/connessione')
//libreria lettura file
const fs = require('fs')
//recupero la chiave pubblica
const pathPub = path.resolve(__dirname, 'chiavi/rsa_4096_pub.pem')
//recupero chiave privata
const pathPriv = path.resolve(__dirname, 'chiavi/rsa_4096_priv.pem')
//copio la chive pubblica in una costante
const pub = fs.readFileSync(pathPub, 'utf8')
//copio la chive privata in una costante
const priv = fs.readFileSync(pathPriv, 'utf8')
//script con funzioni mie
const controllo = require('./funzioniControllo')

//prendo l'oggetto database per poterlo chiudere nella funzione di spegnimento
const dbModule = require('./routes/api/db')
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
// Libreria per la gestione dei token di autenticazione
app.register(fastifyJwt, {
    secret: 'supersecret'
})

//funzione login che genera il token di autenticazione
app.post('/login', (req, reply) => {
    // Mock user
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }

    // some code
    const token = app.jwt.sign({ user })
    reply.send({ token })
})

//espongo la chiave pubblica per inviare dati al server
app.get('/pubkey', (req, reply) => {
    console.log('Chiave pubblica inviata')
    reply.send(pub)
})

//test per verificare la decifratura
app.post('/testkey', async (req, reply) => {
    //console.log(req.body.enc)
    //console.log(priv)
    var testo = await controllo.decrypt(req.body.enc, priv)
    console.log('Testo cifrato: ' + testo)
    reply.code(200).send()
})

app.register(require('./routes/api/db'), { prefix: '/api/db' })
app.register(require('./routes/api/scontrini'), { prefix: `/api/scontrini` })
app.register(require('./routes/api/status'), { prefix: '/api/status' })
app.register(require('./routes/api/codice'), { prefix: '/api/codice' })
app.register(require('./routes/api/indirizzo'), { prefix: '/api/indirizzo' })

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