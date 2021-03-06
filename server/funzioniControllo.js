//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per cifrare dati
const crypto = require('crypto')
//libreria lettura file
const fs = require('fs')
//api node per il percorso
const path = require('path')
//recupero la chiave pubblica
const pathPub = path.resolve(__dirname, 'chiavi/rsa_4096_pub.pem')
//recupero chiave privata
const pathPriv = path.resolve(__dirname, 'chiavi/rsa_4096_priv.pem')
//copio la chive pubblica in una costante
var pub = null;
//copio la chive privata in una costante
var priv = null;
//libreria per eseguire programmi in bash
const { exec } = require("child_process");

//controllo che l'indirizzo inserito sia un ip valido
function isIP(indirizzo) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(indirizzo)
}

//controllo che il codice sia un intero da quattro numeri positivo
function isCodice(codice) {
    return /^\d{4}$/.test(codice)
}

//controllo con una regex se la stringa contiene un numero positivo intero
function isNumeric(value) {
    return /^\d+$/.test(value);
}

//controllo con una regex se i caratteri che ho ricevuto sono in ascii
function isASCII(str) {
    return /^[\x20-\x7F]*$/.test(str);
}

//elimino doppi apici in maniera ricorsiva
function rmApici(str) {
    if (str == str.replace(/\"/, '')) {
        return str
    } else {
        return rmApici(str.replace(/\"/, ''))
    }
}

//funzione per generare stringhe casuali
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

//creo la chiave crittografica per comunicazione client server
const chiaveServer = makeid(32)

//cifratura dati con chiave pubblica
function encrypt(toEncrypt) {
    const buffer = Buffer.from(toEncrypt, 'utf8')
    const encrypted = crypto.publicEncrypt(pub, buffer)
    return encrypted.toString('base64')
}

//decifratura con chiave privata
function decrypt(toDecrypt) {
    const buffer = Buffer.from(toDecrypt, 'base64')
    const decrypted = crypto.privateDecrypt(
        {
            key: priv.toString(),
            passphrase: '',
        },
        buffer,
    )
    return decrypted.toString('utf8')
}

//cifratura chiave simmetrica
function encSim(text, key) {
    var iv = crypto.randomBytes(16);
    var cipher = crypto.createCipheriv('aes256', key, iv);
    var ciphered = cipher.update(text, 'utf8', 'hex');
    ciphered += cipher.final('hex');
    var ciphertext = iv.toString('hex') + ':' + ciphered
    return ciphertext;
}

//decifratura chiave simmetrica
//modificata per usare la chiave del server, prima prendeva la chiave come parametro
function decSim(enc) {
    var components = enc.split(':');
    var iv_from_ciphertext = Buffer.from(components.shift(), 'hex');
    var decipher = crypto.createDecipheriv('aes256', chiaveServer, iv_from_ciphertext);
    var deciphered = decipher.update(components.join(':'), 'hex', 'utf8');
    deciphered += decipher.final('utf8');
    return deciphered
}

//controllo l'esistenza della chiave privata (senza non va neanche la pubblica), nel caso non ci fosse la genero
function checkKey() {
    fs.access(pathPriv, fs.F_OK, (err) => {
        if (err) {
            console.log(`Genero chiavi crittografia`)
            var pathChiavi = path.resolve(__dirname, 'chiavi')
            exec("openssl genrsa -out rsa_4096_priv.pem 4096 && openssl rsa -pubout -in rsa_4096_priv.pem -out rsa_4096_pub.pem", { cwd: pathChiavi }, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            //console.error(err)
            return
        }
        console.log(`Trovate chiavi crittografia`)
        pub = fs.readFileSync(pathPub, 'utf8')
        priv = fs.readFileSync(pathPriv, 'utf8')
        return
        //file exists
    })
}

//funzione per condividere chiave pubblica
function getPubkey(){
    return pub
}

//funzione per condividere chiave simmetrica server
function getChiaveServer(){
    return chiaveServer
}

module.exports = { isASCII, rmApici, isIP, isNumeric, isCodice, makeid, encrypt, decrypt, encSim, decSim, checkKey, getPubkey, getChiaveServer };