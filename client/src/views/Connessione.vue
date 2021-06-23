<template>
  <div class="flex flex-row items-center justify-center bg-blue-50">
    <div
      class="bg-white shadow m-10 p-4 rounded grid justify-items-center space-x-4 space-y-2"
    >
      <p class="font-semibold">Connessione alla cassa</p>
      <div class="flex flex-row bg-red-400 p-2 rounded shadow">
        <input class="bg-gray-100 rounded w-8" v-model="ind1" />.
        <input class="bg-gray-100 rounded w-8" v-model="ind2" />.
        <input class="bg-gray-100 rounded w-8" v-model="ind3" />.
        <input class="bg-gray-100 rounded w-8" v-model="ind4" />
      </div>
      <div class="flex flex-row space-x-2">
        <button class="bg-green-400 hover:bg-green-500 p-1 rounded shadow" @click="connetti">
          Connetti
        </button>
        <button
          class="bg-blue-400 hover:bg-blue-500 p-1 rounded shadow"
          @click="auto"
        >
          Auto
        </button>
        <router-link
          to="/Home"
          class="bg-red-400 hover:bg-red-500 rounded shadow p-1"
          >Annulla</router-link
        >
      </div>
      <p class="text-red-500">Istruzioni per connettersi alla cassa</p>
      <p>
        Se nella pagina principale in alto a sinistra c'è scritto
        <em class="font-semibold">"cassa disconnessa"</em> seguire le seguenti
        istruzioni.
      </p>
      <div class="h-18 font-semibold">
        <p v-if="show == 0" class="text-red-500 font-medium">
          Premere avanti per le istruzioni.
        </p>
        <p v-if="show == 1">1. Controllare che la cassa sia accesa.</p>
        <p v-if="show == 2">
          2. Controllare che sullo schermo della cassa ci sia scritto FPU. In
          tal caso passare al punto 5.
        </p>
        <p v-if="show == 3">
          3. Premere il tasto chiave sulla cassa fino a quando non compare una R
          nello schermo in alto a sinistra.
        </p>
        <p v-if="show == 4">
          4. Premere tre volte il tasto 2 poi il tasto chiave. Una volta fatto
          ciò dovrebbe comparire la scritta FPU.
        </p>
        <p v-if="show == 5">
          5. Se sullo schermo della cassa c'è scritto FPU premete il tasto X,
          dovrebbe comparire l'indirizzo ip.
        </p>
        <p v-if="show == 6">
          6. Inserire l'indirizzo presente nello schermo della cassa
          nell'apposito box rosso. Oppure premere il tasto auto e il computerino
          proverà a connettersi da solo.
        </p>
      </div>
      <div class="flex flex-row w-full">
        <button
          class="bg-blue-400 hover:bg-blue-500 p-1 rounded shadow"
          v-if="show > 0"
          @click="show = show - 1"
        >
          Indietro
        </button>
        <div class="flex-grow">
          <!-- This item will grow -->
        </div>
        <button
          class="bg-blue-400 hover:bg-blue-500 p-1 rounded shadow"
          v-if="show < 6"
          @click="show = show + 1"
        >
          Avanti
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CryttoService from "../CryttoService";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      show: 0,
      ind1: "",
      ind2: "",
      ind3: "",
      ind4: "",
    };
  },
  methods: {
    async connetti() {
      var indirizzo = this.ind1 + "." + this.ind2 + "." + this.ind3 + "." + this.ind4;
      if (this.isIP(indirizzo)) {
        var body = {};
        body.chiave = this.chiave;
        body.token = this.token;
        body.indirizzo = indirizzo;
        let enc = await CryttoService.encSim(
          JSON.stringify(body),
          this.chiaveServer
        );
        var res = await axios.post("indirizzo", enc, {
          headers: { "Content-Type": "text/plain" },
        });
      } else {
        window.alert("Inserire un indirizzo valido!");
      }
      if(res.status == 200){
        window.alert('Aspettare qualche secondo e la cassa sarà connessa.')
        this.$router.push({ name: "Home" });
      } else {
        window.alert(`C'è stato un problema nella connessione, riprovare.`)
      }
    },
    async auto() {
      var body = {};
      body.chiave = this.chiave;
      body.token = this.token;
      let enc = await CryttoService.encSim(
        JSON.stringify(body),
        this.chiaveServer
      );
      let res = await axios.post("indirizzo/auto", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      if (res.status == 200) {
        window.alert(
          "Tentativo di connessione automatica, attendere qualche secondo prima di riprovare."
        );
        this.$router.push({ name: "Home" });
      } else {
        window.alert("Errore nel tentativo di connessione, ritentare.");
      }
    },
    isIP(indirizzo) {
      return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        indirizzo
      );
    },
  },
  computed: {
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ token: "getToken" }),
    ...mapGetters({ chiaveServer: "getChiaveServer" }),
  },
};
</script>