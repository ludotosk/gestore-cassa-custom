<template>
  <div class="lg:h-screen lg:mt-2">
    <!-- colonna lista prodotti -->
    <div
      class="flex flex-row bg-white rounded p-1 shadow lg:relative lg:top-0 bottom-32 fixed w-full"
    >
      <input
        type="text"
        class="m-1 block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 w-full hover:border-blue-300"
        v-model="filtro"
        @keyup.enter="getProdottiFiltrati"
      />
      <button
        v-if="prodotti != null"
        class="bg-blue-300 p-2 rounded block m-1 hover:bg-blue-400"
        @click.prevent="getProdottiFiltrati"
      >
        Cerca
      </button>
      <button
        v-if="prodotti == null"
        class="bg-blue-300 p-2 rounded block m-1 hover:bg-blue-400"
        @click.prevent="getProdotti"
      >
        Carica prodotti
      </button>
    </div>
    <div
      class="flex lg:flex-row flex-col flex-wrap overflow-scroll lg:h-5/6 h-32 lg:relative lg:top-0 bottom-0 fixed w-full bg-blue-50"
    >
      <!-- bottoni -->
      <button
        v-for="prodotto in prodotti"
        :key="prodotto"
        class="box-content h-20 w-20 p-4 bg-white m-2 rounded-md shadow-md hover:bg-gray-100"
        @click.prevent="
          aggiungiArticolo({
            reparto: prodotto.id_reparto,
            quantita: '1',
            descrizione: prodotto.desc_breve,
            prezzo: prodotto.prezzo,
          })
        "
      >
        {{ prodotto.desc_breve }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import CryttoService from "../CryttoService";

export default {
  name: "articoli",
  data() {
    return {
      filtro: "",
    };
  },
  methods: {
    aggiungiArticolo(data) {
      console.log(data);
      if (
        this.isNumeric(data.quantita) &
        this.isNumeric(data.prezzo) &
        this.isNumeric(data.reparto) &
        this.isASCII(data.descrizione)
      ) {
        if (this.scontrino.length > 0) {
          let aggiornato = false;
          this.scontrino.forEach((el) => {
            if (
              (el.reparto == data.reparto) &
              (el.descrizione == data.descrizione) &
              (el.prezzo == data.prezzo)
            ) {
              var somma = parseInt(el.quantita) + parseInt(data.quantita);
              data.quantita = somma.toString();
              this.aggiornaArticolo(this.scontrino.indexOf(el), data);
              aggiornato = true;
            }
          });
          if (!aggiornato) {
            this.$store.commit("aggiungiArticolo", data);
          }
        } else {
          this.$store.commit("aggiungiArticolo", data);
        }
      } else {
        window.alert("I dati inseriti non sono validi.");
      }
    },
    aggiornaArticolo(index, data) {
      this.$store.commit("cancellaArticolo", index);
      this.$store.commit("aggiungiArticolo", data);
    },
    async getProdotti() {
      var body = {};
      body.token = this.token;
      body.chiave = this.chiave;
      //let enc = await CryttoService.encrypt(JSON.stringify(body), this.pubkey);
      let enc = await CryttoService.encSim(
        JSON.stringify(body),
        this.chiaveServer
      );
      var resEnc = await axios.post("db/get/prodotti", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      var res = JSON.parse(
        await CryttoService.decSim(resEnc.data, this.chiave)
      );
      this.$store.commit("setProdotti", res);
    },
    async getProdottiFiltrati() {
      if (this.filtro == "") {
        this.getProdotti();
        return;
      }
      var body = {};
      body.token = this.token;
      body.chiave = this.chiave;
      body.filtro = this.filtro;
      //let enc = await CryttoService.encrypt(JSON.stringify(body), this.pubkey);
      let enc = await CryttoService.encSim(
        JSON.stringify(body),
        this.chiaveServer
      );
      var resEnc = await axios.post("db/get/prodotti_filtrati", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      var res = JSON.parse(
        await CryttoService.decSim(resEnc.data, this.chiave)
      );
      this.$store.commit("setProdotti", res);
    },
    isASCII(str) {
      return /^[\x20-\x7F]*$/.test(str);
    },
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
  },
  watch: {
    chiaveServer: function () {
      this.getProdotti();
    },
  },
  computed: {
    ...mapGetters({ pubkey: "getPubkey" }),
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ token: "getToken" }),
    ...mapGetters({ scontrino: "getScontrino" }),
    ...mapGetters({ chiaveServer: "getChiaveServer" }),
    ...mapGetters({ prodotti: "getProdotti" }),
  },
};
</script>