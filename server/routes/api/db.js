//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

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

//esporto il modulo router al file server
module.exports = function (app, opts, done) {

    //gestore della post
    app.post('/', (req, res) => {
        if (req.body.prodotto != undefined) {
            var prodotto = req.body.prodotto;
            db.run(`INSERT INTO prodotti(descrizione, desc_breve, data_ins, code, bar_code, oem_code, costo_acq, id_reparto, um, id_categoria) VALUES (?,?,?,?,?,?,?,?,?,?)`, [prodotto.descrizione, prodotto.desc_breve, prodotto.data_ins, prodotto.code, prodotto.bar_code, prodotto.oem_code, prodotto.costo_acq, prodotto.id_reparto, prodotto.um, prodotto.id_categoria], function (err) {
                if (err) {
                    res.code(400).send()
                    return console.error(err.message);
                }

                console.log(`Creata riga con ${this.lastID}`)
                res.code(201).send()
            })
        } else if (req.body.categoria != undefined) {
            db.run('INSERT INTO categoria_prodotto(categoria) VALUES(?)', [req.body.categoria], function (err) {
                if (err) {
                    res.code(400).send()
                    return console.error(err.message);
                }

                console.log(`Creata riga con ${this.lastID}`)
                res.code(201).send()
            })
        } else if (req.body.iva != undefined) {
            var iva = req.body.iva;
            db.run('INSERT INTO iva(aliquota_iva, desc_iva) VALUES(?,?)', [iva.aliquota_iva, iva.desc_iva], function (err) {
                if (err) {
                    res.code(400).send()
                    return console.error(err.message);
                }

                console.log(`Creata riga con ${this.lastID}`)
                res.code(201).send()
            })
        } else if (req.body.listini != undefined) {
            var listini = req.body.listini;
            db.run('INSERT INTO listini(id_prodotto, nome_listino, id_iva, sc_rc, prezzo) VALUES(?,?,?,?,?)', [listini.id_prodotto, listini.nome_listino, listini.id_iva, listini.sc_rc, listini.prezzo], function (err) {
                if (err) {
                    res.code(400).send();
                    return console.error(err.message);
                }

                console.log(`Creata riga con ${this.lastID}`);
                res.code(201).send();
            });
        } else if (req.body.select != undefined) {
            var select = req.body.select;
            if (select == `categoria_prodotto`) {
                var categorie = []
                db.all('SELECT * FROM categoria_prodotto', [], (err, rows) => {
                    if (err) {
                        res.code(400).send()
                        return console.error(err.message);
                    }
                    rows.forEach((row) => {
                        categorie.push(row)
                    })
                    console.log(`Select su categoria_prodotto`)
                    res.code(200).send(categorie)
                })
            } else if (select == `prodotti`) {
                var prodotti = []
                db.all('SELECT * FROM prodotti', [], (err, rows) => {
                    if (err) {
                        res.code(400).send()
                        return console.error(err.message);
                    }
                    rows.forEach((row) => {
                        prodotti.push(row)
                    })
                    console.log(`Select su prodotti`)
                    res.code(200).send(prodotti)
                })
            } else if (select == `listini`) {
                var listini = []
                db.all('SELECT * FROM listini', [], (err, rows) => {
                    if (err) {
                        res.code(400).send()
                        return console.error(err.message);
                    }
                    rows.forEach((row) => {
                        prodotti.push(row)
                    })
                    console.log(`Select su listini`)
                    res.code(200).send(prodotti)
                })
            } else {
                console.log(`Select errata`)
                res.code(400).send()
            }
        } else {
            console.log(`Post a db errata`)
            res.code(400).send()
        }
    })

    done()
}

module.exports.db = db;