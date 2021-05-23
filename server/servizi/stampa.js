//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//import la libreria connessione
const connessione = require('./connessione')
//libreria controllo
const funzioniControllo = require('../funzioniControllo')

//dichiaro la variabile client
var client

//importo la socket dallo script di connessione
function setSocket() {
    //controllo di essere connesso per importare la socket
    if (connessione.getStatus() == 'Connesso alla cassa e autenticato') {
        client = connessione.getSocket()
        return 0
    }
    return 1
}

//funzione per ricevere il body dalla post
function setBody(scontrino) {
    //controllo che ci sia almeno un prodotto prima di inserire il pagamento
    var controllo = 0
    //controllo che ci sia la socket prima di stampare
    if (setSocket() == 0) {
        //eseguo una forEach su body che dovrebbe essere un array per stampare lo scontrino
        //per ogni elemento controllo quali campi ci sono e in base a quelli stampo lo scontrino
        scontrino.forEach(el => {
            if (el.reparto != undefined && funzioniControllo.isNumeric(el.reparto) == true) {
                var stringaArticolo = ''
                if (el.descrizione != undefined && funzioniControllo.isASCII(el.descrizione) == true) {
                    stringaArticolo += '"' + funzioniControllo.rmApici(el.descrizione) + '"'
                }
                if (el.quantita != undefined) {
                    var decimale = el.quantita.split('.')
                    if (decimale[1] != undefined) {
                        if (funzioniControllo.isNumeric(decimale[0]) == true && funzioniControllo.isNumeric(decimale[1])) {
                            stringaArticolo += decimale[0] + '.' + decimale[1] + '*'
                        }
                    } else {
                        if (funzioniControllo.isNumeric(el.quantita) == true) {
                            stringaArticolo += el.quantita + '*'
                        }
                    }
                }
                if (el.prezzo != undefined) {
                    if (funzioniControllo.isNumeric(el.prezzo) == true) {
                        stringaArticolo += el.prezzo + 'H'
                    }
                }
                stringaArticolo += el.reparto + 'R'
                controllo = 1
                client.write(stringaArticolo)
                console.log(stringaArticolo)
            }
            //se l'oggetto è quello del metodo di pagamento avvio uno switch case per inviare il metodo alla cassa
            if (el.pagamento != undefined) {
                //controllo che ci sia almeno un prodotto e poi eseguo il pagamento
                if (controllo == 1) {
                    //console.log(el.pagamento)
                    switch (el.pagamento) {
                        case 'contante':
                            client.write('1T')
                            console.log('1T')
                            break;
                        case 'assegno':
                            client.write('2T')
                            console.log('2T')
                            break;
                        case 'carta':
                            client.write('3T')
                            console.log('3T')
                            break;
                        case 'generico':
                            client.write('4T')
                            console.log('4T')
                            break;
                        case 'buono':
                            client.write('5T')
                            console.log('5T')
                            break;
                        case 'sospensione':
                            client.write('6T')
                            console.log('6T')
                            break;
                        case 'credito':
                            client.write('7T')
                            console.log('7T')
                            break;
                        case 'buono+resto':
                            client.write('21T')
                            console.log('21T')
                            break;
                        default:
                            client.write('4T')
                            console.log('4T')
                    }
                }
            }
        })
    }
    else {
        console.log('Problema con la socket')
    }
}

//espongo le funzioni di questo script
module.exports = { setBody, setSocket }