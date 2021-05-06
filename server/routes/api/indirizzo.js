//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

const connessione = require('../../servizi/connessione')
const controllo = require('../../funzioniControllo')

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