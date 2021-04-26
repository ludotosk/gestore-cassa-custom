//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per gestione delle connessioni http
const express = require('express');
//importo script per la stampa su scontrino
const stampa = require('../stampa')

//funzione per la creazione della pagina scontrini
const router = express.Router();

//gestore della get
router.get('/', (req, res) => {
    res.send('Pagina scontrini')
})

//gestore della post
router.post('/', (req, res) => {
    //controllo che ci sia la socket in stampa per procedere con la stampa
    if (stampa.setSocket() == 0) {
        stampa.setBody(req.body)
        res.status(201).send()
    } else {
        res.status(400).send()
    }
})

//esporto il modulo router al file server
module.exports = router;