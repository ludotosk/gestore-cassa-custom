//interfaccia per lettura tastiera la dichiaro qui per tutto il programma
var readline = require('readline')
var io = readline.createInterface(
  process.stdin, process.stdout);

var stato = 'non eseguito'

//variabili di controllo, quando hanno lo stesso valore sono state terminate tutte le scansione e si attiva l'inserimento manuale
var scansioni = 0
var terminate = 0

//variabile per attivazione inserimeneto manuale, in questo caso lo disattiva se viene trovato almeno un indirizzo
var controllo = 0

//variabile controllo risposta cassa
var echo = 0

//controllo che la cassa risponda
function testEcho() {
  if (echo == 0) {
    stato = 'Connession fallita'
    console.log("Connessione alla cassa fallita!\nControllare che la cassa sia in modalità FPU e che l'indirizzo sia corretto\nPremere il tasto x della cassa in modalità FPU per verificare l'indirizzo")
    //process.exit(1)
  } else {
    stato = 'Connesso alla cassa e autenticato'
    echo = 0
  }
}

//funzione per la connessione via socket alla cassa
function testConnessione(indirizzo) {
  stato = 'Test connessione in corso'

  var net = require('net')

  //genero numero random da visualizzare sulla cassa
  const codice = Math.floor(Math.random() * (9999 - 1000) + 1000);

  //connetto la socket alla cassa e stampo il codice di autenticazione
  var client = new net.Socket();
  client.connect(9100, indirizzo, function () {
    client.write('"Codice collegamento"1%')
    client.write('"' + codice + '"2%');
    console.log(codice)
    echo = 0
    setTimeout(testEcho, 1000)
    setTimeout(domanda, 1000)
  });

  client.on('error', function (ex) {
    stato = 'Errore nella socket'
    console.log("Erorre nella connessione alla cassa: " + indirizzo + "\nL'indirizzo potrebbe essere errato o la cassa potrebbe non essere in modalità FPU\nPremere il tasto x della cassa in modalità FPU per verificare l'indirizzo");
    //process.exit(1)
  });

/*   client.on('data', function (data) {
    echo = 1
    console.log('\nRisposta dalla cassa: ' + data);
    //client.destroy(); // kill client after server's response
  }); */

  //autenticazione alla cassa
  function domanda() {
    stato = 'Autenticazione in corso'
    io.question('Inserire il codice comparso sulla cassa lato cliente: ', (risposta) => {
      if (risposta == codice) {
        console.log('Autenticazione avvenuta!')
        client.write('""1%')
        client.write('"Benvenuti!"2%')
        setTimeout(testEcho, 1000)
        //stampaScontrino()
        //io.close()
      } else {
        console.log('Codice errato!\n')
        domanda()
      }
    })
  }



/*   function stampaScontrino() {
    io.question('Inserire prezzo articolo: ', (prezzo) => {
      io.question('Inserire reparto articolo: ', (rep) => {
        client.write(prezzo + 'H' + rep + 'R')
        io.question('Aggiungo altri articoli ? [sì|no] ', (stampa) => {
          if (stampa == 'sì') {
            stampaScontrino()
          } else if (stampa == 'no') {
            client.write('1T')
            //process.exit(1)
          } else {
            client.write('1T')
            //process.exit(1)
          }
        })
      })
    })

  } */

}

//funzione per inserimento manuale del indirizzo in caso serva
function inserimentoManuale() {
  //controllo per usare l'inserimento manuale solo una volta
  if (scansioni == terminate) {
    stato = 'Inserimento manuale'
    io.question("Vuoi inserire l'indirizzo manualmente? [sì|no]", (risposta) => {
      if (risposta == 'sì') {
        console.log("Con la cassa in modalità FPU premere il tasto x per leggere l'ip")
        io.question("Digita l'indirizzo: ", (res2) => {
          testConnessione(res2)
        })
      } else if (risposta == 'no') {
        //process.exit(0)
      } else {
        console.log("Risposta non valida!\nRispondere: 'sì' oppure 'no'")
        inserimentoManuale()
      }
    })
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
      inserimentoManuale()
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
    inserimentoManuale()
  } else {
    server.forEach(async res => {
      //incremento numero scansioni per controllo
      scansioni += 1
      //evilscan libreria per scansione porte 
      const Evilscan = require('evilscan');
      //scompongo l'indiirzzo per ottenre l'indirizzo di rete
      indirizzo = res.ip.split('.', 3)
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
              //ho lo stesso indirizzo con due porte, qui ne elimino uno di modo che venga scoperto una volta sola
              indirizzi.pop(el2)
              controllo = 1
              testWeb(el1.ip)
            }
          })
        })

        //alla fine di ogni scansione incremento il numero di scansioni terminate per il controllo sul incremento manuale
        terminate += 1
        //chiamo incremento manuale se non ho trovato nulla in questa scheda
        if (controllo == 0) {
          inserimentoManuale()
        }

      });

      console.log('Avvio scansione scheda ' + res.dev)
      stato = 'Inizio scansione'
      evilscan.run();
    })
  }

}
main()

module.exports = { stato, main }