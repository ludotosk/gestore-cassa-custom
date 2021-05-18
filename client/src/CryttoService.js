//libreria per fare get e post
import axios from 'axios';
import crypto from 'crypto';

//metto l'url del server 
const url = "pubkey";

class CryttoService {
    //prendo dal server la chiave pubblica
    static async getPubkey() {
        try {
            const res = await axios.get(url)
            return res.data
        } catch (e) {
            console.log(e)
        }
    }

    //decifratura chiave simmetrica
    static async decSim(enc, key) {
        var components = enc.split(':');
        var iv_from_ciphertext = Buffer.from(components.shift(), 'hex');
        var decipher = crypto.createDecipheriv('aes256', key, iv_from_ciphertext);
        var deciphered = decipher.update(components.join(':'), 'hex', 'utf8');
        deciphered += decipher.final('utf8');
        return deciphered
    }

    //cifratura dati con chiave pubblica
    static async encrypt(toEncrypt, pub) {
        const buffer = Buffer.from(toEncrypt, 'utf8')
        const encrypted = crypto.publicEncrypt(pub, buffer)
        return encrypted.toString('base64')
    }

    //funzione per creare stringhe casuali
    static async makeid(length) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        return result.join('');
    }
    

}

//permetto di visualizzare la classe da fuori
export default CryttoService;