//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per gestione delle connessioni http
const express = require('express');
//libreria per gestione di sqlite3
var sqlite3 = require('sqlite3').verbose();
//mi serve usare il path per recuperare il file del database
const path = require('path')
const dbPath = path.resolve(__dirname, '../../../database/scatolino.db')
//mi collego al db file
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connessione al database')
});

//funzione per la creazione della pagina scontrini
const router = express.Router();

//get per gestire le richieste via rest api
router.get('/:tabella', (req, res) => {
    var categorie = []
    db.all('SELECT * FROM categoria_prodotto', [], (err, rows) => {
        if (err) {
            res.status(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            console.log(row)
            categorie.push(row)
        })
        res.status(200).send(categorie)
    })
})

//gestore della post
router.post('/', (req, res) => {
    if (req.body.prodotto != undefined) {

    }
    if (req.body.categoria != undefined) {
        db.run('INSERT INTO categoria_prodotto(categoria) VALUES(?)', [req.body.categoria], function (err) {
            if (err) {
                res.status(400).send()
                return console.error(err.message);
            }

            console.log(`Creata riga con ${this.lastID}`)
            res.status(201).send()
        })
    } else {
        res.status(400).send()
    }
})

//esporto il modulo router al file server
module.exports = { router, db };
