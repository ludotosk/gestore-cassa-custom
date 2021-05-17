//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//api node per il percorso
const path = require('path')
//libreria lettura file
const fs = require('fs')
//recupero la chiave pubblica
const pathPub = path.resolve(__dirname, '../chiavi/rsa_4096_pub.pem')
//copio la chive pubblica in una costante
const pub = fs.readFileSync(pathPub, 'utf8')

module.exports = function (app, opts, done) {
    //espongo la chiave pubblica per inviare dati al server
    app.get('/', (req, reply) => {
        console.log('Chiave pubblica inviata')
        reply.send(pub)
    })

    done()
}