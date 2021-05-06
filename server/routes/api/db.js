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

//funzioni per le select
function selectCategoria_prodotto(res) {
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
}

function selectProdotti(res) {
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
}

function selectListini(res) {
    var listini = []
    db.all('SELECT * FROM listini', [], (err, rows) => {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            listini.push(row)
        })
        console.log(`Select su listini`)
        res.code(200).send(listini)
    })
}

function selectIva(res) {
    var iva = []
    db.all('SELECT * FROM iva', [], (err, rows) => {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            iva.push(row)
        })
        console.log(`Select su iva`)
        res.code(200).send(iva)
    })
}

function selectDettaglio(res) {
    var dettaglio = []
    db.all('SELECT * FROM dettaglio', [], (err, rows) => {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            dettaglio.push(row)
        })
        console.log(`Select su dettaglio`)
        res.code(200).send(dettaglio)
    })
}

function selectReparto(res) {
    var reparto = []
    db.all('SELECT * FROM reparto', [], (err, rows) => {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            reparto.push(row)
        })
        console.log(`Select su reparto`)
        res.code(200).send(reparto)
    })
}

function selectScontrino(res) {
    var scontrino = []
    db.all('SELECT * FROM scontrino', [], (err, rows) => {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            scontrino.push(row)
        })
        console.log(`Select su scontrino`)
        res.code(200).send(scontrino)
    })
}

function selectProva(res) {
    var righe = []
    db.all('SELECT descrizione, numero_scontrino, data FROM dettaglio INNER JOIN prodotti ON prodotti.id_prodotto = dettaglio.id_prodotti INNER JOIN scontrino ON scontrino.id_scontrino = dettaglio.id_scontrino ORDER BY numero_scontrino ASC, data ASC', [], function (err ,rows) {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            righe.push(row)
        })
        console.log(`Select su scontrino`)
        res.code(200).send(righe)
    })
}

//schemi di validazione dei json
const optProdotti = {
    schema: {
        body: {
            type: 'object',
            required: ['prodotto'],
            properties: {
                prodotto: { type: 'object' },
            }
        }
    }
}

const optCategoria = {
    schema: {
        body: {
            type: 'object',
            required: ['categoria'],
            properties: {
                categoria: { type: 'object' },
            }
        }
    }
}

const optIva = {
    schema: {
        body: {
            type: 'object',
            required: ['iva'],
            properties: {
                iva: { type: 'object' },
            }
        }
    }
}

const optListini = {
    schema: {
        body: {
            type: 'object',
            required: ['listini'],
            properties: {
                listini: { type: 'object' },
            }
        }
    }
}

const optDettaglio = {
    schema: {
        body: {
            type: 'object',
            required: ['dettaglio'],
            properties: {
                dettaglio: { type: 'object' },
            }
        }
    }
}

const optReparto = {
    schema: {
        body: {
            type: 'object',
            required: ['reparto'],
            properties: {
                reparto: { type: 'object' },
            }
        }
    }
}

const optScontrino = {
    schema: {
        body: {
            type: 'object',
            required: ['scontrino'],
            properties: {
                scontrino: { type: 'object' },
            }
        }
    }
}

//esporto il modulo router al file server
module.exports = function (app, opts, done) {

    //creo una post per tabella
    app.post('/prodotti', optProdotti, (req, res) => {
        var prodotto = req.body.prodotto;
        db.run(`INSERT INTO prodotti(descrizione, desc_breve, data_ins, code, bar_code, oem_code, costo_acq, id_reparto, um, id_categoria) VALUES (?,?,?,?,?,?,?,?,?,?)`, [prodotto.descrizione, prodotto.desc_breve, prodotto.data_ins, prodotto.code, prodotto.bar_code, prodotto.oem_code, prodotto.costo_acq, prodotto.id_reparto, prodotto.um, prodotto.id_categoria], function (err) {
            if (err) {
                res.code(400).send()
                return console.error(err.message);
            }

            console.log(`Creata riga con ${this.lastID}`)
            res.code(201).send()
        })
    })

    app.post('/categoria_prodotto', optCategoria, (req, res) => {
        db.run('INSERT INTO categoria_prodotto(categoria) VALUES(?)', [req.body.categoria], function (err) {
            if (err) {
                res.code(400).send()
                return console.error(err.message);
            }

            console.log(`Creata riga con ${this.lastID}`)
            res.code(201).send()
        })
    })

    app.post('/iva', optIva, (req, res) => {
        var iva = req.body.iva;
        db.run('INSERT INTO iva(aliquota_iva, desc_iva) VALUES(?,?)', [iva.aliquota_iva, iva.desc_iva], function (err) {
            if (err) {
                res.code(400).send()
                return console.error(err.message);
            }

            console.log(`Creata riga con ${this.lastID}`)
            res.code(201).send()
        })
    })

    app.post('/listini', optListini, (req, res) => {
        var listini = req.body.listini;
        db.run('INSERT INTO listini(id_prodotto, nome_listino, id_iva, sc_rc, prezzo) VALUES(?,?,?,?,?)', [listini.id_prodotto, listini.nome_listino, listini.id_iva, listini.sc_rc, listini.prezzo], function (err) {
            if (err) {
                res.code(400).send();
                return console.error(err.message);
            }

            console.log(`Creata riga con ${this.lastID}`);
            res.code(201).send();
        });
    })

    app.post('/dettaglio', optDettaglio, (req, res) => {
        var dettaglio = req.body.dettaglio;
        db.run('INSERT INTO dettaglio(id_prodotti, id_scontrino, prezzo, sc_rc) VALUES(?,?,?,?)', [dettaglio.id_prodotti, dettaglio.id_scontrino, dettaglio.prezzo, dettaglio.sc_rc], function (err) {
            if (err) {
                res.code(400).send();
                return console.error(err.message);
            }

            console.log(`Creata riga con ${this.lastID}`);
            res.code(201).send();
        })
    })

    app.post('/reparto', optReparto, (req, res) => {
        var reparto = req.body.reparto;
        db.run('INSERT INTO reparto(desc_reparto) VALUES(?,?)', [reparto.desc_reparto], function (err) {
            if (err) {
                res.code(400).send();
                return console.error(err.message);
            }

            console.log(`Creata riga con ${this.lastID}`);
            res.code(201).send();
        })
    });

    app.post('/scontrino', optScontrino, (req, res) => {
        var scontrino = req.body.scontrino;
        db.run('INSERT INTO scontrino(data, numero_scontrino, tot, cf_piva_lot, intestazione) VALUES(?,?,?,?,?)', [scontrino.data, scontrino.numero_scontrino, scontrino.tot, scontrino.cf_piva_lot, scontrino.intestazione], function (err) {
            if (err) {
                res.code(400).send();
                return console.error(err.message);
            }

            console.log(`Creata riga con ${this.lastID}`);
            res.code(201).send();
        })
    })

    //quel tabella è un parametro che viene passato via url
    app.get('/:tabella', (req, res) => {
        var tabella = req.params.tabella
        switch (tabella) {
            case "categoria_prodotto":
                selectCategoria_prodotto(res)
                break;
            case "prodotti":
                selectProdotti(res)
                break;
            case "listini":
                selectListini(res)
                break;
            case "iva":
                selectIva(res)
                break;
            case "dettaglio":
                selectDettaglio(res)
                break;
            case "reparto":
                selectReparto(res)
                break;
            case "scontrino":
                selectScontrino(res)
                break;
            case "prova":
                selectProva(res)
                break;
            default:
                res.status(400).send('Selezionare una tabella valida')
        }
    })

    done()
}

module.exports.db = db;