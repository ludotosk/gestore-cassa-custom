<template>
  <div class="flex flex-col items-center justify-center">
    <div
      class="bg-white shadow p-10 rounded m-10 space-x-2 space-y-2 flex flex-col"
    >
      <select
        class="rounded focus:border-gray-500 focus:bg-white focus:ring-0"
        v-model="selected"
      >
        <option value="">Seleziona metodo di pagamento</option>
        <option value="contante">Contante</option>
        <option value="assegno">Assegno</option>
        <option value="carta">Carta</option>
        <option value="generico" selected>Generico</option>
        <option value="buono">Buono</option>
        <option value="sospensione">Sospensione</option>
        <option value="credito">Credito</option>
        <option value="buono+resto">Buono + Resto</option>
      </select>
      <button
        class="bg-green-500 p-1 rounded hover:bg-green-600"
        @click="stampaScontrino"
      >
        Stampa
      </button>
      <button
        @click="$store.commit('setStampa', false)"
        class="bg-red-500 p-1 rounded hover:bg-red-600"
      >
        Annulla
      </button>
      <p v-if="selezionaMetodo" class="text-red-500">
        Selezionare un metodo di pagamento per poter stampare
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CryttoService from "../CryttoService";
import { mapGetters } from "vuex";

export default {
  name: "pagamento",
  data() {
    return { selezionaMetodo: false, selected: "" };
  },
  methods: {
    async stampaScontrino() {
      if (this.selected == "") {
        this.selezionaMetodo = true;
      } else {
        this.stampa = false;
        var pagamento = this.selected;
        this.$store.commit("aggiungiArticolo", { pagamento });
        var body = {};
        body.token = this.token;
        body.chiave = this.chiave;
        body.scontrino = this.scontrino;
        let enc = await CryttoService.encrypt(
          JSON.stringify(body),
          this.pubkey
        );
        await axios.post("scontrini", enc, {
          headers: { "Content-Type": "text/plain" },
        });
      }
    },
  },
  computed: {
    ...mapGetters({ scontrino: "getScontrino" }),
    ...mapGetters({ pubkey: "getPubkey" }),
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ token: "getToken" }),
  },
};
</script>