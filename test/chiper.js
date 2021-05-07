//openssl genrsa -out rsa_4096_priv.pem 4096
//openssl rsa -pubout -in rsa_4096_priv.pem -out rsa_4096_pub.pem
//Per la generazione delle chiavi uso questi comandi su linux
//Funzioni prese da internet pre cifrare e decifrare dati

const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

/* const publicKey = path.resolve(__dirname, 'chiavi/rsa_4096_pub.pem')
const privateKey = path.resolve(__dirname, 'chiavi/rsa_4096_priv.pem')  */

function encrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey)
    const publicKey = fs.readFileSync(absolutePath, 'utf8')
    const buffer = Buffer.from(toEncrypt, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('base64')
}

function decrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
    const privateKey = fs.readFileSync(absolutePath, 'utf8')
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

/* const enc = encrypt('hello', publicKey)
console.log('enc', enc)

const dec = decrypt(enc, privateKey)
console.log('dec', dec)  */

module.exports = { encrypt, decrypt }