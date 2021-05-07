// https://github.com/nodejs/node-v0.x-archive/issues/6386#issuecomment-31817919
// with createCipher / createDecipher (both deprecated) replaced with
// createCipheriv / createDecipheriv and a generated IV passed along.
//var assert = require('assert');
var crypto = require('crypto');

var algorithm = 'aes256';
var inputEncoding = 'utf8';
var outputEncoding = 'hex';
var ivlength = 16  // AES blocksize

//creo una chiave casuale
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

//console.log('Ciphering "%s" with key "%s" using %s', text, key, algorithm);

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

function keyGen(){
  return Buffer.from(makeid(32), 'latin1'); // key must be 32 bytes for aes256
}

//console.log('Result in %s is "%s"', outputEncoding, ciphertext);


//console.log(deciphered);
//assert.strictEqual(deciphered, text, 'Deciphered text does not match!');

function main() {
  var key = keyGen()
  var text = 'prova';
  console.log('Critto')
  var enc = encSim(text, key);
  console.log('Decritto')
  var dec = decSim(enc, key);
  console.log(dec);
}

main();