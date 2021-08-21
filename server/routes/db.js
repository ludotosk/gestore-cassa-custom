//copiare dati nella tabella virtuale
/* INSERT INTO tabella_filtro(id,desc_breve)
SELECT id_prodotto, desc_breve
FROM prodotti
 */

//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//script con funzioni mie
const controllo = require('../funzioniControllo')

//importo jwt da login
const login = require('./login')
const jwt = login.jwt

//libreria per gestione di sqlite3
var sqlite3 = require('sqlite3').verbose();
//mi serve usare il path per recuperare il file del database
const path = require('path')
const dbPath = path.resolve(__dirname, '../../database/scatolino.db')
//mi collego al db file
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connessione al database')
});

//prendo l'id del timer per poterlo cancellaren
//carico più volte la tabella per poter avere i dati aggiornati
var idTimer = setInterval(caricaVirtualTable, 3600000)

//cancello il timer per poter chiudere il programma
function cancellaTimer() {
    clearInterval(idTimer)
}

//creo le tabelle nel db nel caso in cui il file sia vuoto
function creaTabelle() {
    console.log(`Creo tabelle db`)
    let i = 8;
    db.run(`CREATE TABLE "categoria_prodotto" (
        "id_categoria"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        "categoria"	TEXT
    )`, [], function () {
        i--;
        if (i == 0) {
            caricaVirtualTable()
        }
    })
    db.run(`CREATE TABLE "iva" (
        "id_iva"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        "aliquota_iva"	REAL,
        "desc_iva"	TEXT
    )`, [], function () {
        i--;
        if (i == 0) {
            caricaVirtualTable()
        }
    })
    db.run(`CREATE TABLE "prodotti" (
        "id_prodotto"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        "descrizione"	TEXT,
        "desc_breve"	TEXT,
        "data_ins"	TEXT,
        "code"	TEXT,
        "bar_code"	TEXT,
        "oem_code"	TEXT,
        "costo_acq"	REAL,
        "id_reparto"	INTEGER,
        "um"	TEXT,
        "id_categoria"	INTEGER
    )`, [], function () {
        i--;
        if (i == 0) {
            caricaVirtualTable()
        }
    })
    db.run(`CREATE TABLE "reparto" (
        "id_reparto"	INTEGER NOT NULL UNIQUE,
        "desc_reparto"	TEXT,
        PRIMARY KEY("id_reparto")
    )`, [], function () {
        i--;
        if (i == 0) {
            caricaVirtualTable()
        }
    })
    db.run(`CREATE TABLE "scontrino" (
        "id_scontrino"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        "data"	TEXT NOT NULL,
        "tot"	INTEGER NOT NULL,
        "cf_piva_lot"	TEXT,
        "intestazione"	TEXT,
        "numero_scontrino"	INTEGER NOT NULL UNIQUE
    )`, [], function () {
        i--;
        if (i == 0) {
            caricaVirtualTable()
        }
    })
    db.run(`CREATE VIRTUAL TABLE tabella_virtuale
    USING FTS5(id_prodotto, descrizione, desc_breve, id_reparto, prezzo_iva, vendite)`, [], function () {
        i--;
        if (i == 0) {
            caricaVirtualTable()
        }
    })
    db.run(`CREATE TABLE "dettaglio" (
        "id_dettaglio"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        "id_prodotti"	INTEGER,
        "id_scontrino"	INTEGER NOT NULL,
        "prezzo"	INTEGER NOT NULL,
        "sc_rc"	INTEGER,
        FOREIGN KEY("id_scontrino") REFERENCES "scontrino"("id_scontrino"),
        FOREIGN KEY("id_prodotti") REFERENCES "prodotti"("id_prodotto")
    )`, [], function () {
        i--;
        if (i == 0) {
            caricaVirtualTable()
        }
    })
    db.run(`CREATE TABLE "listini" (
        "id_listino"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        "id_prodotto"	INTEGER,
        "nome_listino"	TEXT,
        "id_iva"	INTEGER,
        "sc_rc"	INTEGER,
        "prezzo"	INTEGER,
        FOREIGN KEY("id_iva") REFERENCES "iva"("id_iva"),
        FOREIGN KEY("id_prodotto") REFERENCES "prodotti"("id_prodotto")
    )`, [], function () {
        i--;
        if (i == 0) {
            caricaVirtualTable()
        }
    })
}

//creo la tabella virtuale per leggere i dati nel client
function caricaVirtualTable() {
    console.log('Controllo numero prodotti vendite')
    var prodotti = [];
    db.all('SELECT * FROM dettaglio GROUP BY id_prodotti', [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        rows.forEach((row) => {
            prodotti.push(row)
        })
        console.log(`Numero di prodotti venduti: ` + prodotti.length)
        if (prodotti.length >= 100) {
            console.log('Carico tabella virtuale ordinata per vendite')
            db.run(`INSERT INTO tabella_virtuale(id_prodotto, descrizione, desc_breve, id_reparto, prezzo_iva, vendite)
            SELECT prodotti.id_prodotto, descrizione, desc_breve, id_reparto, (listini.prezzo + (listini.prezzo * iva.aliquota_iva/100)) AS prezzo, COUNT(prodotti.id_prodotto) AS vendite
            FROM prodotti 
            INNER JOIN dettaglio 
            ON prodotti.id_prodotto = dettaglio.id_prodotti
            INNER JOIN listini
            ON prodotti.id_prodotto = listini.id_prodotto
            INNER JOIN iva
            ON listini.id_iva = iva.id_iva
            GROUP BY prodotti.id_prodotto
            `, [], function (err) {
                if (err) {
                    //qui vado a usare fs per leggere i dati del database se vedo che ha peso 0 creo le tabelle al suo interno
                    //all'apertura del db se non c'è il file viene creato quindi troverò sempre un file a questo punto
                    const fs = require('fs');
                    var db = fs.statSync(dbPath)
                    if (db.size == 0) {
                        creaTabelle()
                    }
                    return console.error(err.message);
                }

                console.log('Tabella virtuale caricata')
            })
        } else {
            console.log('Tabella virtuale senza vendite')
            db.run(`INSERT INTO tabella_virtuale(id_prodotto, descrizione, desc_breve, id_reparto, prezzo_iva)
            SELECT prodotti.id_prodotto, descrizione, desc_breve, id_reparto, (listini.prezzo + (listini.prezzo * iva.aliquota_iva/100)) AS prezzo
            FROM prodotti 
            INNER JOIN listini
            ON prodotti.id_prodotto = listini.id_prodotto
            INNER JOIN iva
            ON listini.id_iva = iva.id_iva
            GROUP BY prodotti.id_prodotto
            `, [], function (err) {
                if (err) {
                    //qui vado a usare fs per leggere i dati del database se vedo che ha peso 0 creo le tabelle al suo interno
                    //all'apertura del db se non c'è il file viene creato quindi troverò sempre un file a questo punto
                    const fs = require('fs');
                    var db = fs.statSync(dbPath)
                    if (db.size == 0) {
                        creaTabelle()
                    }
                    return console.error(err.message);
                }

                console.log('Tabella virtuale caricata')
            })
        }
    })
}

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

function selectProdottiRaw(res) {
    var prodotti = []
    db.all(`SELECT * FROM prodotti`, [], (err, rows) => {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            prodotti.push(row)
        })
        console.log(`Select su prodotti non elaborati`)
        res.code(200).send(prodotti)
    })
}

function selectProdotti(res) {
    var prodotti = []
    db.all(`SELECT id_prodotto, descrizione, desc_breve, id_reparto, prezzo_iva AS prezzo FROM tabella_virtuale
    ORDER BY vendite DESC
    LIMIT 100;`, [], (err, rows) => {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            prodotti.push(row)
        })
        console.log(`Select su prodotti da tabella virtuale`)
        res.code(200).send(prodotti)
    })
}

function selectProdottiFiltrata(res, filtro) {
    var prodotti = []
    db.all(`SELECT id_prodotto, descrizione, desc_breve, id_reparto, prezzo_iva AS prezzo FROM tabella_virtuale
    WHERE desc_breve MATCH ?
    ORDER BY vendite DESC
    LIMIT 100;`, [filtro], (err, rows) => {
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
    db.all('SELECT descrizione, numero_scontrino, data FROM dettaglio INNER JOIN prodotti ON prodotti.id_prodotto = dettaglio.id_prodotti INNER JOIN scontrino ON scontrino.id_scontrino = dettaglio.id_scontrino ORDER BY numero_scontrino ASC, data ASC LIMIT 100', [], function (err, rows) {
        if (err) {
            res.code(400).send()
            return console.error(err.message);
        }
        rows.forEach((row) => {
            righe.push(row)
        })
        console.log(`Select di prova`)
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
                categoria: { type: 'string' },
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
    //funzione per modificare il body delle richieste prima che venga letto
    app.addHook('preValidation', async (request, reply) => {
        var decBody = await controllo.decSim(request.body)
        //var decBody = await controllo.decrypt(request.body)
        request.body = JSON.parse(decBody)
    })


    //il payload è la risposta che esce dalla post e qui lo cripto per mandarlo
    app.addHook('preSerialization', async (request, reply, payload) => {
        var encRes = await controllo.encSim(JSON.stringify(payload), request.body.chiave)
        reply.header('Content-Type', 'text/plain')
        return encRes
    })

    //controllo che l'utente sia loggato
    app.addHook('preHandler', (request, reply, done) => {
        if (request.body.token) {
            jwt.verify(request.body.token, 'chiaveacaso', (err, authData) => {
                if (err) {
                    reply.code(403)
                    done()
                } else {
                    done()
                }
            });
        } else {
            reply.code(403)
            done()
        }
    })

    //creo una post per tabella
    app.post('/prodotti', optProdotti, (req, res) => {
        var prodotto = req.body.prodotto;
        db.run(`INSERT INTO prodotti(descrizione, desc_breve, data_ins, code, bar_code, oem_code, costo_acq, id_reparto, um, id_categoria) VALUES (?,?,?,?,?,?,?,?,?,?)`, [prodotto.descrizione, prodotto.desc_breve, prodotto.data_ins, prodotto.code, prodotto.bar_code, prodotto.oem_code, prodotto.costo_acq, prodotto.id_reparto, prodotto.um, prodotto.id_categoria], function (err) {
            if (err) {
                res.code(400).send()
                return console.error(err.message);
            }

            console.log(`Creata riga con id ${this.lastID}`)
            res.code(201).send()
        })
    })

    app.post('/categoria_prodotto', optCategoria, (req, res) => {
        console.log('Insert in categoria')
        db.run('INSERT INTO categoria_prodotto(categoria) VALUES(?)', [req.body.categoria], function (err) {
            if (err) {
                res.code(400).send()
                return console.error(err.message);
            }

            console.log(`Creata categoria con id ${this.lastID}`)
            res.code(201).send()
        })
    })

    app.post('/iva', optIva, (req, res) => {
        console.log('Insert iva')
        var iva = req.body.iva;
        if (!controllo.isNumeric(iva.aliquota_iva)) {
            res.code(400).send(`Aliquota iva dev'essere numerica`)
        }
        db.run('INSERT INTO iva(aliquota_iva, desc_iva) VALUES(?,?)', [iva.aliquota_iva, iva.desc_iva], function (err) {
            if (err) {
                res.code(400).send()
                return console.error(err.message);
            }

            console.log(`Creata Iva con id ${this.lastID}`)
            res.code(201).send()
        })
    })

    app.post('/listini', optListini, (req, res) => {
        var listini = req.body.listini;
        db.run('INSERT INTO listini(id_prodotto, nome_listino, id_iva, sc_rc, prezzo) VALUES(?,?,?,?,?)', [listini.id_prodotto, listini.nome, listini.id_iva, listini.sconto, listini.prezzo], function (err) {
            if (err) {
                res.code(400).send();
                return console.error(err.message);
            }

            console.log(`Creata riga con id ${this.lastID}`);
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

            console.log(`Creata riga con id ${this.lastID}`);
            res.code(201).send();
        })
    })

    app.post('/reparto', optReparto, (req, res) => {
        var reparto = req.body.reparto;
        if (!controllo.isNumeric(reparto.id_reparto)) {
            res.code(400).send(`Numero reparto dev'essere numerico`);
        }
        db.run('INSERT INTO reparto(id_reparto, desc_reparto) VALUES(?,?)', [reparto.id_reparto, reparto.desc_reparto], function (err) {
            if (err) {
                res.code(400).send();
                return console.error(err.message);
            }

            console.log(`Creata riga con id ${this.lastID}`);
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

            console.log(`Creata riga con id ${this.lastID}`);
            res.code(201).send();
        })
    })

    app.post('/get/:tabella', (req, res) => {
        var tabella = req.params.tabella
        switch (tabella) {
            case "categoria_prodotto":
                selectCategoria_prodotto(res)
                break;
            case "prodotti":
                selectProdotti(res)
                break;
            case "prodottiRaw":
                selectProdottiRaw(res)
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
            case "prodotti_filtrati":
                selectProdottiFiltrata(res, req.body.filtro)
                break;
            default:
                res.status(400).send('Selezionare una tabella valida')
        }
    })

    done()
}

module.exports.db = db;
module.exports.caricaVirtualTable = caricaVirtualTable;
module.exports.cancellaTimer = cancellaTimer;