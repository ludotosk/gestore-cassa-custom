//uso axios per le get e le post
const axios = require('axios')
//libreria crittografia
const crypto = require('crypto')

var base = 'http://localhost:3000/'
//var base = 'http://192.168.1.65:3000/'
//var base = 'http://192.168.1.59:3000/'

var chiave = makeid(32)

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

//funzione per cifrare
function encrypt(toEncrypt, publicKey) {
    const buffer = Buffer.from(toEncrypt, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('base64')
}

function decSim(enc, key) {
    var components = enc.split(':');
    var iv_from_ciphertext = Buffer.from(components.shift(), 'hex');
    var decipher = crypto.createDecipheriv('aes256', key, iv_from_ciphertext);
    var deciphered = decipher.update(components.join(':'), 'hex', 'utf8');
    deciphered += decipher.final('utf8');
    return deciphered
}

async function getKey() {
    try {
        const response = await axios.get(base + 'pubkey');
        //console.log(response.data);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

async function postCifrata(enc, route) {
    try {
        const response = await axios.post(base + route, enc, { headers: { 'content-type': 'text/plain' } })
        //console.log(response)
        return response.data
    } catch (error) {
        console.error(error);
        console.log(`Errore parte test`)
    }
}

async function main() {
    var pubkey = await getKey();
    var testo = await encrypt(JSON.stringify({ chiave: chiave }), pubkey)
    const inizio = Date.now();
    var risposta = await postCifrata(testo, 'login')
    const fine = (Date.now() - inizio) / 1000;
    //console.log(risposta)
    console.log(JSON.parse(decSim(risposta.toString('base64'), chiave)))
    var richiesta = JSON.parse(decSim(risposta.toString('base64'), chiave))
    richiesta.chiave = chiave
    var testo2 = await encrypt(JSON.stringify(richiesta), pubkey)
    //console.log(richiesta)
    var risposta2 = await postCifrata(testo2, 'db/get/prova')
    var richiesta2 = JSON.parse(decSim(risposta2.toString('base64'), chiave))
    console.log(richiesta2)
    console.log(`Indirizzo server`, base)
    console.log('tempo in secondi', fine);
}

main();