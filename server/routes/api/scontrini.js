//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//importo script per la stampa su scontrino
const stampa = require('../../servizi/stampa')

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
    app.addHook("onRequest", async (request, reply) => {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.send(err)
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