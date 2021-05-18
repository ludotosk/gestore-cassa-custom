//serve per capire in quale cartella mi trovo
const path = require('path');

//imposto cartella di output per il client
//imposto un proxy per quando sono in sviluppo
module.exports = { 
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy: {
            '/': {
                target: 'localhost:3000'
            }
        }
    }
};