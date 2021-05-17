//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per la connessione alla cassa
const connessione = require('../servizi/connessione')
//script con funzioni mie
const controllo = require('../funzioniControllo')
//importo jwt da login
const login = require('./login')
const jwt = login.jwt

//con questo ritorno il router al server che mi ha importato lo script
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

    //controllo che l'utente sia loggato
    app.addHook('preHandler', (request, reply, done) => {
        if (request.body.token) {
            jwt.verify(request.body.token, 'secretkey', (err, authData) => {
                if (err) {
                    reply.code(403)
                    done()
                } else {
                    done()
                }
            });
        } else {
            reply.code(403)
            done()
        }
    })

    //comunico via post solo per implementare la crittografia
    app.post('/', (req, res) => {
        res.send({ Stato: connessione.getStatus() })
    })

    done()
}