//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

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
    if (str == str.replace(/\"/, '')){
        return str
    } else {
        return rmApici(str.replace(/\"/, ''))
    }
}

module.exports = { isASCII, rmApici, isIP, isNumeric, isCodice }