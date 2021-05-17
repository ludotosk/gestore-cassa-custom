//modalità strict non permette l'utilizzo di variabili senza assegnazione
"use strict";

//libreria per i file statici
const fastifyStatic = require("fastify-static")
//api node per il percorso
const path = require('path')

module.exports = function (app, opts, done) {
    // Middleware per inviare file statici
    app.register(fastifyStatic, {
        //cartlla file statici
        root: path.join(__dirname + '/public'),
    })

    done()
}