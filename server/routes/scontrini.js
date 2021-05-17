//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//importo script per la stampa su scontrino
const stampa = require('../servizi/stampa')
//script con funzioni mie
const controllo = require('../funzioniControllo')

//importo jwt da login
const login = require('./login')
const jwt = login.jwt


//opzione per controllare che la post sia validato
const scontrinoOptions = {
    schema: {
        body: {
            type: "object",
            required: ["scontrino"],
            scontrino: {
                type: "array"
            }
        }
    }
}

//esporto il modulo router al file server
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

    //gestore della post
    app.post('/', scontrinoOptions, (req, res) => {
        //controllo che ci sia la socket in stampa per procedere con la stampa
        if (stampa.setSocket() == 0) {
            stampa.setBody(req.body.scontrino)
            res.status(201).send()
        } else {
            res.status(400).send()
        }
    })

    done()
}