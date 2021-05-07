//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per cifrare dati
const crypto = require('crypto')

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
    return /^[\x00-\x7F]*$/.test(str);
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

//cifratura dati con chiave pubblica
function encrypt(toEncrypt, publicKey) {
    const buffer = Buffer.from(toEncrypt, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('base64')
}

//decifratura con chiave privata
function decrypt(toDecrypt, privateKey) {
    const buffer = Buffer.from(toDecrypt, 'base64')
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey.toString(),
            passphrase: '',
        },
        buffer,
    )
    return decrypted.toString('utf8')
}

//funzioni cifratura simmetrici
function encSim(text, key) {
    var iv = crypto.randomBytes(16);
    var cipher = crypto.createCipheriv('aes256', key, iv);
    var ciphered = cipher.update(text, 'utf8', 'hex');
    ciphered += cipher.final('hex');
    var ciphertext = iv.toString('hex') + ':' + ciphered
    return ciphertext;
}

function decSim(enc, key) {
    var components = enc.split(':');
    var iv_from_ciphertext = Buffer.from(components.shift(), 'hex');
    var decipher = crypto.createDecipheriv('aes256', key, iv_from_ciphertext);
    var deciphered = decipher.update(components.join(':'), 'hex', 'utf8');
    deciphered += decipher.final('utf8');
    return deciphered
}

module.exports = { isASCII, rmApici, isIP, isNumeric, isCodice, makeid, encrypt, decrypt, encSim, decSim };