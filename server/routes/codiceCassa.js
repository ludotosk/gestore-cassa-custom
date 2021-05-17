//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//connessione alla cassa
const connessione = require('../servizi/connessione')
//funzioni mie di controllo
const controllo = require('../funzioniControllo')

//importo jwt da login
const login = require('./login')
const jwt = login.jwt

//questo serve a controllare cosa c'è nella post per validarla o meno
const codiceOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['codice'],
            properties: {
                codice: { type: 'integer' },
            }
        }
    }
}

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

    //gestisco le post
    app.post('/', codiceOptions, async (req, res) => {
        //salvo i valori che si trovano nel json presente nel body
        var codice = req.body.codice
        console.log('Codice ricevuto dalla post: ' + codice)

        // in base a cosa mi è stato inviato nel json se codice oppure indirizzo lancio una delle due funzioni
        if (controllo.isCodice(codice) == true) {
            var autRes = await connessione.autenticazioneWeb(codice)
            if (autRes == 0) {
                res.code(200).send({ Stato: connessione.getStatus() })
            } else {
                res.code(400).send({ Stato: connessione.getStatus() })
            }
        } else {
            res.code(400).send()
        }
    })

    done()
}