//interfaccia per lettura tastiera la dichiaro qui per tutto il programma
var readline = require('readline')
var io = readline.createInterface(
  process.stdin, process.stdout);

//funzione per la connessione via socket alla cassa
function testConnessione(indirizzo) {
  var net = require('net')

  //genero numero random da visualizzare sulla cassa
  const codice = Math.floor(Math.random() * (9999 - 1000) + 1000);

  //connetto la socket alla cassa e stampo il codice di autenticazione
  var client = new net.Socket();
  client.connect(9100, indirizzo, function () {
    console.log('Conesso alla cassa: ' + indirizzo);
    client.write('"Codice collegamento"1%')
    client.write('"' + codice + '"2%');
    domanda()
  });

/*   client.on('data', function (data) {
    console.log('Risposta dalla cassa: ' + data);
    //client.destroy(); // kill client after server's response
  });
 */

  //autenticazione alla cassa
  function domanda() {
    io.question('Inserire il codice comparso sulla cassa lato cliente: ', (risposta) => {
      if (risposta == codice) {
        console.log('Autenticazione avvenuta!')
        client.write('""1%')
        client.write('"Benvenuti!"2%')
        process.exit(0)
      } else {
        console.log('Codice errato!\n')
        domanda()
      }
    })
  }

}

//funzione per inserimento manuale del indirizzo in caso serva
function inserimentoManuale() {
  io.question("Vuoi inserire l'indirizzo manualmente? ", (risposta) => {
    if (risposta == 'Sì') {
      console.log("Con la cassa in modalità FPU premere il tasto x per leggere l'ip")
      io.question("Digita l'indirizzo: ", (res2) => {
        testConnessione(res2)
      })
    } else if (risposta == 'No') {
      process.exit(0)
    } else {
      console.log("Risposta non valida!\nRispondere: 'Sì' oppure 'No'")
      inserimentoManuale()
    }
  })
}

//funzione per verificare che l'indirizzo trovato abbia il web server di custom
function testWeb(indirizzo) {
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

function main() {
  //libreria per ottenere indirizzo server
  var ip = require('ip');
  //evilscan libreria per scansione porte 
  const Evilscan = require('evilscan');
  //scompongo l'indiirzzo per ottenre l'indirizzo di rete
  const indirizzo = ip.address().split('.', 3)
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
    //in caso non ce ne siano col bit di controllo notifico il problema
    var controllo = 0

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

    //inserimento manuale dell'indirizzo
    if (controllo != 1) {
      console.log('Nessun indirizzo trovato!')
      inserimentoManuale()
    }
  });

  console.log('Avvio scansione')
  evilscan.run();
}
main()