var readline = require('readline')
var io = readline.createInterface(
    process.stdin, process.stdout);

function testCustom(indirizzo) {
    var net = require('net')

    var client = new net.Socket();
    client.connect(9100, indirizzo, function () {
        console.log('Conesso alla cassa: ' + indirizzo);
        client.write('Prova')
        inviaTesto()
    });

    client.on('error', function (ex) {
        console.error(ex)
    });

    client.on('data', function (data) {
        console.log('\nRisposta dalla cassa: ' + data);
        //client.destroy(); // kill client after server's response
    });

    function inviaTesto(){
        io.question('Inserire testo: ', (testo) => {
            client.write(testo)
            inviaTesto();
        })
    }

}
testCustom('192.168.0.5')