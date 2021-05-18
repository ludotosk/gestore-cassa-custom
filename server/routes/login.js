//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//script con funzioni mie
const controllo = require('../funzioniControllo')
//importo script per la generazione del codice
const codiceLogin = require('./codiceLogin')

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
        var code = req.body.codice;
        console.log('Post login in arrivo, codice: ' + JSON.stringify(code))
        if (code == codiceLogin.getCodice()) {
            console.log('Effettuato login')
            
            // Utente finto necessario per generare un token
            const ip = req.ip;
            
            jwt.sign({ ip }, 'chiaveacaso', (err, token) => {
                //elimino il codice quando inviio il token per liberare lo schermo
                //codiceLogin.deleteCode()
                res.send({ token })
            });
        } else {
            console.log('Tentato login')
            res.code(400).send()
        }
    })

    done()
}

module.exports.jwt = jwt;