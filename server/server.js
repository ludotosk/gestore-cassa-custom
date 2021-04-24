const express = require('express')
const cors = require('cors')
const connessione = require('./connessione')

const app = express()

// Avvio connessione cassa
connessione.main()

// Middleware
app.use(express.json());
app.use(cors());

const scontrini = require('./routes/api/scontrini')
const status = require('./routes/api/status')

app.use('/scontrini', scontrini)
app.use('/status', status)

const port = 5000;

app.listen(port, () => console.log(`Server stated on port ${port}`));