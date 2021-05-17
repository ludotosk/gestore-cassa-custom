//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//script con funzioni mie
const controllo = require('../funzioniControllo')

//libreria per la gestione degli utenti
const jwt = require('jsonwebtoken');

module.exports = function (app, opts, done) {
    //funzione per modificare il body delle richieste prima che venga letto
    app.addHook('preValidation', async (request, reply) => {
        var decBody = await controllo.decrypt(request.body)
        request.body = JSON.parse(decBody)
    })

    //il payload è la risposta che esce dalla post e qui lo cripto per mandarlo
    app.addHook('preSerialization', async (request, reply, payload) => {
        var encRes = await controllo.encSim(JSON.stringify(payload), request.body.chiave)
        reply.header('Content-Type', 'text/plain')
        return encRes
    })

    app.post('/', (req, res) => {
        // Mock user
        const user = {
            id: 1,
            username: 'brad',
            email: 'brad@gmail.com'
        }

        jwt.sign({ user }, 'secretkey', (err, token) => {
            res.send({ token })
        });
    })

    done()
}

module.exports.jwt = jwt;