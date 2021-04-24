const express = require('express');
const connessione = require('../../connessione')

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Stato: ' + connessione.stato)
})

module.exports = router;