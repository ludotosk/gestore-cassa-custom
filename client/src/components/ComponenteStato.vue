<template>
    <div>
        <h1>Stato: {{stato.Stato}}</h1>
        <button v-on:click="aggiornaStato">Aggiorna stato</button>
        <br>
        <label for="codice">Codice login: </label>
        <input type="text" v-model="codice" id="codice" />
        <button v-on:click="inviaCodice">Invia codice</button>
        <hr>
        <p v-if="error">{{error}}</p>
    </div>
</template>

<script>
import StatoService from "../StatoService.js"

export default {
  name: "ComponenteStato",
  data() {
    return {
      error: "",
      stato: "",
      codice: "",
    };
  },
  async created() {
      try {
          this.stato = await StatoService.getStatus();
      } catch (err){
          this.error = err.message;
      }
  },
  methods: {
      async aggiornaStato() {
          this.stato = await StatoService.getStatus();
      },
      async inviaCodice() {
          await StatoService.inviaCodice(this.codice);
          setTimeout(async () => {
              this.stato = await StatoService.getStatus();
          }, 1000)
      }
  }
};
</script>
