//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

const connessione = require('../../servizi/connessione')
const controllo = require('../../funzioniControllo')

//questo serve a controllare cosa c'è nella post per validarla o meno
const codiceOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['codice'],
            properties: {
                codice: { type: 'integer' },
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    Stato: { type: 'string' }
                }
            }
        },
        response: {
            400: {
                type: 'object',
                properties: {
                    Stato: { type: 'string' }
                }
            }
        }
    }
}

//con questo ritorno il router al server che mi ha importato lo script
module.exports = function (app, opts, done) {
    app.addHook("onRequest", async (request, reply) => {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.send(err)
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