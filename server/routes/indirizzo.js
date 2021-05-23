//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//connessione alla cassa
const connessione = require('../servizi/connessione')
//funzioni di utilità
const controllo = require('../funzioniControllo')

//importo jwt da login
const login = require('./login')
const jwt = login.jwt

//questo serve a controllare cosa c'è nella post per validarla o meno
const indirizzoOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['indirizzo'],
            properties: {
                indirizzo: { type: 'string' }
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
            jwt.verify(request.body.token, 'chiaveacaso', (err, authData) => {
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

    //post per settare sul server l'indirizzo corretto della cassa
    app.post('/', indirizzoOptions, (req, res) => {
        //salvo il valore presente nel body
        var indirizzo = req.body.indirizzo
        console.log('Indirizzo ricevuto dalla post: ' + indirizzo)

        if (controllo.isIP(indirizzo) == true) {
            connessione.testConnessione(indirizzo)
            res.code(200).send()
        } else {
            connessione.setStatus('Questo non è un indirizzo IP valido')
            res.code(400).send({ Stato: 'Questo non è un indirizzo IP valido' })
        }
    })

    done()
}