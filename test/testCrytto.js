//uso axios per le get e le post
const axios = require('axios')
//libreria crittografia
const crypto = require('crypto')


//funzione per cifrare
function encrypt(toEncrypt, publicKey) {
    const buffer = Buffer.from(toEncrypt, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('base64')
}

async function getKey() {
    try {
        const response = await axios.get('http://localhost:3000/pubkey');
        console.log(response.data);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

async function postCifrata(enc) {
    axios.post('http://localhost:3000/testkey', {
        enc
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function main() {
    var pubkey = await getKey();
    var testo = await encrypt('Ciao', pubkey)
    postCifrata(testo)
}

main();