//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

const connessione = require('../../servizi/connessione')

//questo serve a dire cosa c'è nella get per ottimizzare i tempi di risposta
const getOptions = {
    schema: {
        response: {
            200: {
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

    //gestisco le get e ritorno lo stato della connessione
    app.get('/', getOptions, (req, res) => {
        res.send({ Stato: connessione.getStatus() })
    })

    done()
}