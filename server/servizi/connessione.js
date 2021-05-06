//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per le socket
var net = require('net')

const controlli = require('../funzioniControllo')

//stato da mandare al web server
var stato = 'Non eseguito'

//variabili di controllo, quando hanno lo stesso valore sono state terminate tutte le scansione e si attiva l'inserimento manuale
var scansioni = 0
var terminate = 0

//variabile per attivazione inserimeneto manuale, in questo caso lo disattiva se viene trovato almeno un indirizzo
var controllo = 0

//variabile controllo risposta cassa
var echo = 0

//genero numero random da visualizzare sulla cassa
const codice = Math.floor(Math.random() * (9999 - 1000) + 1000);

//creo una socket per la connessione alla cassa
var client = new net.Socket();

//funzione per dare lo stato al web server
function getStatus() {
  return stato
}

//imposto lo stato da fuori
function setStatus(status) {
  this.status = status;
}

//passa la socket creata qui agli altri script
function getSocket() {
  return client
}

//controllo che la cassa risponda
function testEcho() {
  if (echo == 0) {
    stato = 'Connession fallita - Chiusura connessione'
    console.log("Connessione alla cassa fallita!\nControllare che la cassa sia in modalità FPU e che l'indirizzo sia corretto\nPremere il tasto x della cassa in modalità FPU per verificare l'indirizzo")
  } else {
    stato = 'Connesso alla cassa eseguire autenticazione'
    echo = 0
  }
}

// autenticazione alla cassa via web
async function autenticazioneWeb(codiceAut) {
  if (controlli.isCodice(codiceAut) == true) {
    stato = 'Autenticazione in corso'
    if (codiceAut == codice) {
      console.log('Autenticazione avvenuta!')
      client.write('""1%')
      client.write('"Benvenuti!"2%')
      setTimeout(testEcho, 1000)
      setTimeout(() => {
        stato = 'Connesso alla cassa e autenticato'
      }, 1000)
      return 0
    } else {
      console.log(codiceAut)
      console.log('Codice errato!\n')
      stato = 'Codice Errato'
      return 1
    }
  } else {
    console.log(codiceAut)
    console.log('Codice errato!\n')
    stato = 'Codice Errato'
    return 1
  }
}

//funzione per la connessione via socket alla cassa se la cassa risponde vuol dire che tutto funziona
//viene chiamato internamente se si trova un indirizzo valido o via web se in caso di inserimento manuale
function testConnessione(indirizzo) {
  if (controlli.isIP(indirizzo) == true) {
    stato = 'Test connessione in corso'

    //connetto la socket alla cassa
    client.connect(9100, indirizzo, function () {
      //assegno 0 a echo perché in caso di risposta verrà cambiato con 1 e allora sarà avvenuta con successo la connessione
      echo = 0
      client.write('"Codice collegamento"1%')
      client.write('"' + codice + '"2%')
      console.log(codice)
      setTimeout(testEcho, 1000)
    });

    //gestisco errori di connessione
    client.on('error', function (ex) {
      stato = 'Errore nella socket - Chiusura connessione'
      console.log("Erorre nella connessione alla cassa: " + indirizzo + "\nL'indirizzo potrebbe essere errato o la cassa potrebbe non essere in modalità FPU\nPremere il tasto x della cassa in modalità FPU per verificare l'indirizzo");
    });

    //evento che gestisce le risposte alla socket
    client.on('data', function (data) {
      //ho ottenuto una risposta dalla cassa allora la connessione ha avuto successo
      echo = 1
      //console.log('\nRisposta dalla cassa: ' + data);
    });

  } else {
    stato = 'Questo non è un indirizzo IP valido'
  }
}

//funzione per controllare la necessità di insersire l'ip manualmente
function testRisultatoScansione() {
  //controllo per usare l'inserimento manuale solo una volta
  if (scansioni == terminate) {
    stato = 'Inserimento manuale'
    console.log(`Eseguire l'inserimento manuale`)
  }
}

//funzione per verificare che l'indirizzo trovato abbia il web server di custom
function testWeb(indirizzo) {
  stato = 'Test server web in corso'
  //codice per la request http preso dal sito di node
  const http = require('http');

  //tento la connessione al web server della cassa
  http.request("http://" + indirizzo, { method: 'HEAD' }, (res) => {
    //controllo che sia il webserver della cassa
    if (res.headers.server == 'CustomWebserver') {
      console.log('Indirizzo cassa trovato: ' + indirizzo)
      testConnessione(indirizzo)
    } else {
      console.log("Web server errato per l'indirizzo: " + indirizzo)
      testRisultatoScansione()
    }
  }).on('error', (err) => {
    //console.error(err);
  }).end();
}

//funzione per ottenere gli indirizzi ip delle schede di rete del server
function indirizzoServer() {
  const { networkInterfaces } = require('os');

  const nets = networkInterfaces();
  const results = []

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push({ "dev": name, "ip": net.address });
      }
    }
  }

  return results
}

async function main() {
  var server = await indirizzoServer()

  if (!server.length) {

  } else {
    server.forEach(async res => {
      //incremento numero scansioni per controllo
      scansioni += 1
      //evilscan libreria per scansione porte 
      const Evilscan = require('evilscan');
      //scompongo l'indiirzzo per ottenre l'indirizzo di rete
      var indirizzo = res.ip.split('.', 3)
      //array di indirizzi con le porte 9100 e 80 aperte
      var indirizzi = []

      //tutto questo codice l'ho preso dalla pagina di evilscan
      //ci inserisco l'indirizzo di rete che ho trovato e setto gli altri paramentri
      const options = {
        target: indirizzo[0] + "." + indirizzo[1] + "." + indirizzo[2] + ".0/24",
        port: '80,9100',
        status: 'O', // Timeout, Refused, Open, Unreachable
        banner: true
      };

      const evilscan = new Evilscan(options);

      evilscan.on('result', data => {
        //salvo uno alla volta gli indirizzi trovati nell'array creato in precedenza
        indirizzi.push(data)
      });

      evilscan.on('error', err => {
        throw new Error(data.toString());
      });

      evilscan.on('done', () => {
        //al termine della scansione cerco gli indirizzi con entrambe le porte aperte
        //per ogni indirizzo trovato lancio testWeb
        indirizzi.forEach(el1 => {
          indirizzi.forEach(el2 => {
            if (el1.ip == el2.ip & el1.port != el2.port) {
              //controllo che la porta sia la 80 per non lanciare due volte lo stesso test sullo stesso indirizzo
              if (el1.port == 80) {
                //console.log(el1)
                controllo = 1
                testWeb(el1.ip)
              }

            }
          })
        })

        //alla fine di ogni scansione incremento il numero di scansioni terminate per il controllo sul incremento manuale
        terminate += 1
        //chiamo incremento manuale se non ho trovato nulla in questa scheda
        if (controllo == 0) {
          testRisultatoScansione()
        }

      });

      console.log('Avvio scansione scheda ' + res.dev)
      stato = 'Avvio scansione scheda ' + res.dev
      evilscan.run();
    })
  }

}

//module exports server a rendere disponibili ad altri js le due funzioni
module.exports = { getStatus, autenticazioneWeb, testConnessione, getSocket, main, setStatus }