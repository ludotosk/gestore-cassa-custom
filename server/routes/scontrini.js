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
    stampa.setBody(req.body)
    res.status(201).send()
})

//esporto il modulo router al file server
module.exports = router;