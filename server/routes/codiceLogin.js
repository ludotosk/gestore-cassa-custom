//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//importo libreria filesiste per scrivere codice Login su file
const fs = require('fs')
//ottengo la cartella home
const homedir = require('os').homedir();
//genero numero random da visualizzare sulla cassa
var codice = null;
//variabile per gestire i timer, in caso vengano fatte più richieste il timer precendente viene annullato
var timer = null;

//funzione per cancellare il file di modo che lo schermo non mostri più il codice
function deleteCode() {
    //function cancella timer, per la chiusura del server
    if(timer) {
        clearTimeout(timer);
    }
    try {
        fs.unlinkSync(require('path').join(homedir, 'codice.txt'))
        console.log(`File codice eliminato`)
    } catch (err) {
        //console.error(err)
    }
}

//invio il codice per il login
function getCodice() {
    return codice
}

module.exports = function (app, opts, done) {
    app.get('/', function (req, res) {
        //resetto il timer
        if(timer){
            clearTimeout(timer);
            timer = null;
        }
        //genero il codice di sblocco casuale
        codice = Math.floor(Math.random() * (9999 - 1000) + 1000);
        //scrivo il file nella home di modo che python possa trovarlo
        fs.writeFile(require('path').join(homedir, 'codice.txt'), codice.toString(), function (err) {
            if (err) {
                codice = null;
                res.code(500).send();
            }
            timer = setTimeout(deleteCode, 300000);
            console.log('Codice creato');
            res.code(200).send()
        });
    })
    done()
}

module.exports.deleteCode = deleteCode;
module.exports.getCodice = getCodice;