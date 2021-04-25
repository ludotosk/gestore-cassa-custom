//importo express e lo script per la connessione
const express = require('express');
const connessione = require('../connessione')

//il router server per gestire le pagine
const router = express.Router();

//gestisco le get e ritorno lo stato della connessione
router.get('/', (req, res) => {
    res.send('Stato: ' + connessione.getStatus())
})

//gestisco le post
router.post('/', async (req, res) => {
    //salvo i valori che si trovano nel json presente nel body
    var codice = req.body.codice
    var indirizzo = req.body.indirizzo
    console.log('Codice ricevuto dalla post: ' + codice)
    console.log('Indirizzo ricevuto dalla post: ' + indirizzo)
    // in base a cosa mi è stato inviato nel json se codice oppure indirizzo lancio una delle due funzioni
    if (codice != undefined) {
        connessione.autenticazioneWeb(codice)
        res.status(201).send()
    } else if (indirizzo != undefined) {
        connessione.testConnessione(indirizzo)
        res.status(201).send()
    } else {
        res.status(400).send()
    }
})

//con questo ritorno il router al server che mi ha importato lo script
module.exports = router;