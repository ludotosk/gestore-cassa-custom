//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//esporto il modulo router al file server
module.exports = function (app, opts, done) {
    //importo script per la stampa su scontrino
    const stampa = require('../../servizi/stampa')

    //gestore della post
    app.post('/', (req, res) => {
        //controllo che ci sia la socket in stampa per procedere con la stampa
        if (req.body.scontrino != undefined) {
            if (stampa.setSocket() == 0) {
                stampa.setBody(req.body.scontrino)
                res.status(201).send()
            } else {
                res.status(400).send()
            }
        } else {
            res.status(400).send()
        }
    })

}