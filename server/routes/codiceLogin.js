//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//importo libreria filesiste per scrivere codice Login su file
const fs = require('fs')
//ottengo la cartella home
const homedir = require('os').homedir();
//genero numero random da visualizzare sulla cassa
var codice = null;

module.exports = function (app, opts, done) {
    app.get('/', function (req, res) {
        codice = Math.floor(Math.random() * (9999 - 1000) + 1000);
        fs.writeFile(require('path').join(homedir, 'codice.txt'), codice.toString(), function (err) {
            if (err) {
                codice = null;
                res.code(500).send();
            }
            console.log('Codice creato');
            res.code(200).send()
        });
    })
    done()
}
