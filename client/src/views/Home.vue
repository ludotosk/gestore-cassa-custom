<template>
  <div>
    <div v-if="stampa">
      <button @click="stampa = false">Annulla</button>
    </div>
    <div class="grid grid-cols-3 bg-blue-50" v-if="!stampa">
      <div class="col-span-3 h-8">
        <!-- nav -->
        Navbar
      </div>
      <div class="lg:col-span-1 lg:h-screen h-4/5 col-span-3">
        <!-- colonna scontrino -->
        <div
          class="flex flex-col space-x-1 space-y-1 bg-white m-2 p-1 rounded shadow-md"
        >
          <div class="flex flex-row">
            <label class="font-semibold mt-2.5">Art: </label>
            <input
              type="text"
              placeholder="Descizione da tastiera"
              class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
              v-model="descrizione_libera"
            />
            <label class="font-semibold mt-2.5">Rep: </label>
            <input
              type="text"
              placeholder="Reparto da tastiera"
              class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
              v-model="reparto_libero"
            />
          </div>
          <div class="flex flex-row">
            <label class="font-semibold mt-2.5">Qta: </label>
            <input
              type="text"
              placeholder="Quantità da tastiera"
              class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
              v-model="quantita_libera"
            />
            <label class="font-semibold mt-2.5">Prezzo: </label>
            <input
              type="text"
              placeholder="Prezzo da tastiera"
              class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
              v-model="prezzo_libero"
            />
            <button
              class="bg-blue-300 rounded p-1 m-1 hover:bg-blue-400"
              @click.prevent="
                aggiungiArticolo({
                  reparto: reparto_libero,
                  quantita: quantita_libera,
                  descrizione: descrizione_libera,
                  prezzo: prezzo_libero,
                })
              "
            >
              aggiungi
            </button>
          </div>
        </div>
        <!-- articoli auto generati -->
        <div class="overflow-scroll lg:h-3/4">
          <div
            class="bg-white m-2 p-1 rounded shadow-md"
            v-for="articolo in scontrino"
            :key="articolo"
          >
            <div class="flex flex-col space-x-1 space-y-1">
              <div class="flex flex-row">
                <label class="font-semibold mt-2.5">Art: </label>
                <input
                  type="text"
                  :placeholder="articolo.descrizione"
                  class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
                  v-model="articolo.descrizione"
                />
                <button
                  class="bg-red-500 p-1 h-8 m-2 rounded hover:bg-red-600"
                  @click.prevent="
                    $store.commit(
                      'cancellaArticolo',
                      scontrino.indexOf(articolo)
                    )
                  "
                >
                  <img src="@/assets/trash-bin.svg" class="h-4" />
                </button>
              </div>
              <div class="flex flex-row">
                <label class="font-semibold mt-2.5">Qta: </label>
                <input
                  type="text"
                  :placeholder="articolo.quantita"
                  class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
                  v-model="articolo.quantita"
                />
                <label class="font-semibold mt-2.5">Prezzo: </label>
                <input
                  type="text"
                  :placeholder="articolo.prezzo"
                  class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
                  v-model="articolo.prezzo"
                />
                <button
                  class="bg-blue-300 rounded p-1 m-1 hover:bg-blue-400"
                  @click.prevent="
                    aggiornaArticolo(scontrino.indexOf(articolo), {
                      descrizione: articolo.descrizione,
                      quantita: articolo.quantita,
                      prezzo: articolo.prezzo,
                      reparto: articolo.reparto,
                    })
                  "
                >
                  aggiorna
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-row lg:relative lg:bottom-0 fixed bottom-44 w-full bg-blue-50"
        >
          <button
            class="w-full bg-red-500 rounded shadow m-1 mb-3 lg:h-12 hover:bg-red-600"
            @click.prevent="cancellaScotrino"
          >
            Cancella scontrino
          </button>
          <button
            class="w-full bg-green-500 rounded shadow m-1 mb-3 lg:h-12 hover:bg-green-600"
            @click.prevent="stampa = true"
          >
            Stampa
          </button>
        </div>
      </div>
      <div class="lg:col-span-2 lg:h-screen col-span-3">
        <!-- colonna lista prodotti -->
        <div
          class="flex flex-row bg-white rounded p-1 shadow lg:relative lg:top-0 bottom-32 fixed w-full"
        >
          <input
            type="text"
            class="m-1 block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 w-full hover:border-blue-300"
            v-model="filtro"
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
                quantita: 1,
                descrizione: prodotto.desc_breve,
                prezzo: prodotto.prezzo,
              })
            "
          >
            {{ prodotto.desc_breve }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CryttoService from "../CryttoService";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      prodotti: null,
      show: false,
      descrizione_libera: "",
      prezzo_libero: "",
      quantita_libera: 1,
      reparto_libero: "",
      filtro: "",
      stampa: false,
    };
  },
  methods: {
    redirect() {
      this.$router.push({ name: "Login" });
    },
    async checkToken() {
      if (localStorage.token) {
        this.$store.commit("setToken", localStorage.token);
      } else {
        this.$router.push({ name: "Login" });
      }
      var body = {};
      body.token = this.token;
      body.chiave = this.chiave;
      let res = await CryttoService.encrypt(JSON.stringify(body), this.pubkey);
      try {
        await axios.post("status", res, {
          headers: { "Content-Type": "text/plain" },
        });
      } catch (error) {
        console.error(error);
        localStorage.removeItem(`token`);
        this.redirect();
      }
    },
    async getProdotti() {
      var body = {};
      body.token = this.token;
      body.chiave = this.chiave;
      let enc = await CryttoService.encrypt(JSON.stringify(body), this.pubkey);
      var resEnc = await axios.post("db/get/prodotti", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      var res = JSON.parse(
        await CryttoService.decSim(resEnc.data, this.chiave)
      );
      this.prodotti = res;
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
      let enc = await CryttoService.encrypt(JSON.stringify(body), this.pubkey);
      var resEnc = await axios.post("db/get/prodotti_filtrati", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      var res = JSON.parse(
        await CryttoService.decSim(resEnc.data, this.chiave)
      );
      this.prodotti = res;
    },
    aggiungiArticolo(data) {
      this.$store.commit("aggiungiArticolo", data);
    },
    aggiornaArticolo(index, data) {
      this.$store.commit("cancellaArticolo", 1);
      this.$store.commit("aggiungiArticolo", data);
    },
    cancellaScotrino() {
      this.$store.commit("cancellaScontrino");
    },
  },
  watch: {
    pubkey: function () {
      this.checkToken(), this.getProdotti();
    },
  },
  computed: {
    ...mapGetters({ pubkey: "getPubkey" }),
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ token: "getToken" }),
    ...mapGetters({ scontrino: "getScontrino" }),
  },
};
</script>
