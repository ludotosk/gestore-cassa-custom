//libreria per fare get e post
import axios from 'axios';

//metto l'url del server 
const url = "api/status";

class StatoService {
    //mi da lo stato del server
    static async getStatus() {
        try {
            const res = await axios.get(url)
            return res.data
        } catch (e) {
            console.log(e)
        }
    }

    //funzione per l'invio dello scontrino
    static inviaCodice(codice) {
        return axios.post(url, {
            codice
        });
    }
}

//permetto di visualizzare la classe da fuori
export default StatoService;