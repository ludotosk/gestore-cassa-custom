//import la libreria connessione
const connessione = require('./connessione')

//importo la socket dallo script di connessione
function setSocket() {
    if (connessione.getStatus() == 'Connesso alla cassa e autenticato') {
        client = connessione.getSocket()
        return 0
    }
    return 1
}

//funzione per ricevere il body dalla post
function setBody(body) {
    //console.log(body);
    if (setSocket() == 0) {
        client.write(body.reparto + 'R')
    }
    else {
        console.log('Problema con la socket')
    }
}

//espongo le funzioni di questo script
module.exports = { setBody }