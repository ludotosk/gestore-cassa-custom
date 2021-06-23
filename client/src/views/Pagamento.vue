<template>
  <div class="flex flex-col items-center justify-center">
    <div class="bg-white shadow p-10 rounded m-10 space-y-2 flex flex-col">
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
      <input
        type="text"
        class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 hover:border-blue-300"
        placeholder="nome cliente"
        v-model="cliente"
      />
      <input
        type="text"
        class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 hover:border-blue-300"
        placeholder="codice fiscale o p.iva"
        v-model="cf"
      />
      <button
        class="bg-green-500 p-1 rounded hover:bg-green-600"
        @click="stampaScontrino"
      >
        Stampa
      </button>
      <button class="bg-red-500 p-1 rounded hover:bg-red-600" @click="annulla">
        Annulla
      </button>
      <!--       <router-link
        to="/Home"
        class="bg-red-500 p-1 rounded hover:bg-red-600 text-center"
        >Annulla</router-link
      > -->
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
      if (this.isASCII(this.cliente) & this.isASCII(this.cf)) {
        if (this.selected == "") {
          this.selezionaMetodo = true;
        } else {
          this.stampa = false;
          var pagamento = this.selected;
          var cliente = this.cliente;
          var cf = this.cf;
          this.$store.commit("aggiungiArticolo", { cliente });
          this.$store.commit("aggiungiArticolo", { cf });
          this.$store.commit("aggiungiArticolo", { pagamento });
          var body = {};
          body.token = this.token;
          body.chiave = this.chiave;
          body.scontrino = this.scontrino;
          let enc = await CryttoService.encSim(
            JSON.stringify(body),
            this.chiaveServer
          );
          await axios.post("scontrini", enc, {
            headers: { "Content-Type": "text/plain" },
          });
        }
      } else {
        window.alert("Caratteri non validi in nome cliente o codice fiscale");
      }
    },
    annulla() {
      console.log(this.scontrino.indexOf(this.selected))
      this.$store.commit("cancellaArticolo", this.scontrino.indexOf(this.selected))
      this.$router.push({ name: "Home" });
    },
    isASCII(str) {
      return /^[\x20-\x7F]*$/.test(str);
    },
  },
  computed: {
    ...mapGetters({ scontrino: "getScontrino" }),
    ...mapGetters({ pubkey: "getPubkey" }),
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ token: "getToken" }),
    ...mapGetters({ chiaveServer: "getChiaveServer" }),
  },
};
</script>