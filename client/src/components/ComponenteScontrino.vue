<template>
  <div>
    <label for="inserisci-descrizione">Descrizione articolo: </label>
    <input
      type="text"
      id="inserisci-descrizione"
      v-model="descrizione"
      placeholder="Facoltativa"
    />
    <br />
    <label for="inserisci-quantita">Quantita: </label>
    <input
      type="text"
      id="inserici-quantita"
      v-model="quantita"
      placeholder="Facoltativa"
    />
    <br />
    <label for="inserisci-reparto">Reparto: </label>
    <input
      type="text"
      id="inserisci-reparto"
      v-model="reparto"
      placeholder="Obbligatorio"
    />
    <br />
    <label for="inserisci-prezzo">Prezzo: </label>
    <input
      type="text"
      id="inserisci-prezzo"
      v-model="prezzo"
      placeholder="Facoltativo"
    />
    <br />
    <label for="inserisci-pagamento">Pagamento: </label>
    <input type="text" id="inserisci-pagamento" v-model="pagamento" />
    <br>
    <button v-on:click="aggiungiArticolo">Aggiungi articolo</button>
    <button v-on:click="inviaScontrino">Invia</button>
  </div>
</template>

<script>
import ClientService from "../ClientService";

export default {
  name: "ComponenteScontrino",
  data() {
    return {
      error: "",
      quantita: "",
      prezzo: "",
      descrizione: "",
      reparto: "",
      pagamento: "",
      scontrino: [],
    };
  },
  methods: {
    async aggiungiArticolo() {
      var articolo = {};
      if (this.reparto != "") {
        articolo.reparto = this.reparto;
        if (this.quantita != "") {
          articolo.quantita = this.quantita;
        }
        if (this.descrizione != "") {
          articolo.descrizione = this.descrizione;
        }
        if (this.prezzo != "") {
          articolo.prezzo = this.prezzo;
        }
        this.scontrino.push(articolo);
      }
      console.log(JSON.stringify(this.scontrino));
    },
    async inviaScontrino() {
      var pagamento = {};
      pagamento.pagamento = this.pagamento;
      this.scontrino.push(pagamento)
      await ClientService.inviaScontrino(this.scontrino);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
