//libreria per fare get e post
import axios from 'axios';

//metto l'url del server 
const url = "scontrini";

class ClientService {
    //funzione per l'invio dello scontrino
    static inviaScontrino(scontrino) {
        return axios.post(url, {
            scontrino
        });
    }
}

//permetto di visualizzare la classe da fuori
export default ClientService;