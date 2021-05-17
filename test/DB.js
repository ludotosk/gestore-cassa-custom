//libreria per gestione di sqlite3
var sqlite3 = require('sqlite3').verbose();
//mi serve usare il path per recuperare il file del database
const path = require('path')
const dbPath = path.resolve(__dirname, '../database/scatolino.db')
//pacchetto per generazione dati casuali
const faker = require('faker')
//mi collego al db file
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connessione al database')
});

var righe = 100000;

/* for (i = 0; i < righe; i++) {
    db.run(`INSERT INTO prodotti(descrizione, desc_breve, data_ins, code, bar_code, oem_code, costo_acq, id_reparto, um, id_categoria) VALUES (?,?,?,?,?,?,?,?,?,?)`, [faker.commerce.productDescription(), faker.commerce.productName(), faker.date.past(), faker.random.word(), faker.random.alphaNumeric(), faker.datatype.number(), faker.commerce.price(), Math.floor(Math.random() * (10000 - 1) + 1), faker.random.word(), Math.floor(Math.random() * (10000 - 1) + 1)], function (err) {
        if (err) {
            return console.error(err.message);
        }

        console.log(`Creata riga con ${this.lastID}`)
    })

    if(i == righe - 1){
        db.close()
    }
} */
  

/* for (i = 0; i < righe; i++) {
    db.run('INSERT INTO categoria_prodotto(categoria) VALUES(?)', [faker.commerce.department()], function (err) {
        if (err) {
            return console.error(err.message);
        }

        console.log(`Creata riga con ${this.lastID}`)
    })

    if (i == righe - 1) {
        db.close()
    }
}
 */

 for (i = 0; i < righe; i++) {
    db.run('INSERT INTO dettaglio(id_prodotti, id_scontrino, prezzo, sc_rc) VALUES(?,?,?,?)', [Math.floor(Math.random() * (31046 - 21046) + 21046), Math.floor(Math.random() * (10000 - 1) + 1), faker.commerce.price(), Math.floor(Math.random() * (90 - 0) + 0)], function (err) {
        if (err) {
            return console.error(err.message);
        }

        console.log(`Creata riga con ${this.lastID}`)
    })

    if (i == righe - 1) {
        db.close()
    }
} 
/* 
for (i = 0; i < righe; i++) {
    db.run('INSERT INTO iva(aliquota_iva, desc_iva) VALUES(?,?)', [Math.floor(Math.random() * (99 - 0) + 0), faker.datatype.string()], function (err) {
        if (err) {
            return console.error(err.message);
        }

        console.log(`Creata riga con ${this.lastID}`)
    })

    if (i == righe - 1) {
        db.close()
    }
} */


/* for (i = 0; i < righe; i++) {
    db.run('INSERT INTO reparto(desc_reparto) VALUES(?)', [faker.commerce.department()], function (err) {
        if (err) {
            return console.error(err.message);
        }

        console.log(`Creata riga con ${this.lastID}`)
    })

    if (i == righe - 1) {
        db.close()
    }
} */
/* 
for (i = 0; i < righe; i++) {
    db.run('INSERT INTO scontrino(data, tot, cf_piva_lot, intestazione, numero_scontrino) VALUES(?,?,?,?,?)', [faker.date.past(), faker.commerce.price(), faker.datatype.string(), faker.company.companyName(), faker.datatype.number()], function (err) {
        if (err) {
            return console.error(err.message);
        }

        console.log(`Creata riga con ${this.lastID}`)
    })

    if (i == righe - 1) {
        db.close()
    }
}
 */

/*
db.run('DELETE FROM prodotti', function (err){
    if (err) {
        return console.error(err.message);
    }

    console.log(`Cancellata riga ${this.lastID}`)
})
 */

/* for (i = 0; i < righe; i++) {
    db.run('INSERT INTO listini(id_prodotto, nome_listino, id_iva, sc_rc, prezzo) VALUES(?,?,?,?,?)', [Math.floor(Math.random() * (31046 - 21046) + 21046), faker.commerce.productDescription(), Math.floor(Math.random() * (10000 - 1) + 1), Math.floor(Math.random() * (90 - 0) + 0), faker.commerce.price()], function (err) {
        if (err) {
            return console.error(err.message);
        }

        console.log(`Creata riga con ${this.lastID}`)
    })

    if (i == righe - 1) {
        db.close()
    }
} */