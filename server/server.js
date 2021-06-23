//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per la gestione delle get e delle post
const fastify = require('fastify')
//lancio fastify
const app = fastify({
    //logger: { level: 'trace' }
})
//libreria per le cross origin
const fastifyCors = require("fastify-cors");
//script per la connessione alla cassa
const connessione = require('./servizi/connessione')
//prendo l'oggetto database per poterlo chiudere nella funzione di spegnimento
const dbModule = require('./routes/db')
const db = dbModule.db
//importo funzione per cancellare il codice all'avvio e alla chiusura del server
const login = require('./routes/codiceLogin')
//libreria con funzioni varie
const funzioniControllo = require(`./funzioniControllo`)

// Middleware per le chiamate cross origin
app.register(fastifyCors, {})

app.register(require('./static'), { prefix: '/' })
app.register(require('./routes/db'), { prefix: '/db' })
app.register(require('./routes/scontrini'), { prefix: `/scontrini` })
app.register(require('./routes/status'), { prefix: '/status' })
//app.register(require('./routes/codiceCassa'), { prefix: '/codice' })
app.register(require('./routes/indirizzo'), { prefix: '/indirizzo' })
app.register(require('./routes/login'), { prefix: '/login' })
app.register(require('./routes/pubkey'), { prefix: '/pubkey' })
app.register(require('./routes/codiceLogin'), { prefix: '/codice' })
app.register(require('./routes/keyServer'), { prefix: '/key' })

// Start the server
app.listen(3000, '0.0.0.0', function (err, address) {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening on ${address}`)
})

//con questa chiudo la connessione al database prima di chiudere il programma
app.addHook('onClose', (instance, done) => {
    // Some code
    db.close(() => {
        console.log('Chiusura database');
        done()
    })
    dbModule.cancellaTimer();
    login.deleteCode()
})

//qui lancio una serie di funzioni all'avvio del server
app.addHook('onReady', function (done) {
    //controllo che ci siano le chiavi di crittografia
    funzioniControllo.checkKey()
    //cancello il file codice in caso di spegnimento del server senza close
    login.deleteCode()
    //carico la tabella filtro per poter fare ricerche regex nel db
    dbModule.caricaVirtualTable()
    done()
})

//funzione che chiude il server
function handle() {
    console.info('SIGTERM or SIGINT signal received.');
    console.log('Closing http server.');
    app.close(() => {
        console.log('Http server closed.');
    });
}

//gestisco il segnale di chiusura del server
process.on('SIGTERM', handle);
process.on('SIGINT', handle);