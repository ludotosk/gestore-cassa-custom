//libreria per la gestione delle get e delle post
const express = require('express')

//lancio express
const app = express()

// Middleware
app.use(express.json());

//javascript per la gestione delle pagine stato e scontrini
const scontrini = require('./routes/scontrini')
const status = require('./routes/status')

//assegno una route agli script
app.use('/scontrini', scontrini)
app.use('/status', status)

//porta del server
const port = 5000;

//lancio il server
app.listen(port, () => console.log(`Server stated on port ${port}`));