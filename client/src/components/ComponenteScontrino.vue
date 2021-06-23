<template>
  <div class="h-screen">
    <div
      class="flex flex-col space-x-1 space-y-1 bg-white m-2 p-1 rounded shadow-md"
    >
      <div class="flex flex-row">
        <label class="font-semibold mt-2.5">Art: </label>
        <input
          type="text"
          placeholder="Descizione manuale"
          class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
          v-model="descrizione_libera"
        />
        <label class="font-semibold mt-2.5">Rep: </label>
        <input
          type="text"
          placeholder="Reparto manuale"
          class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
          v-model="reparto_libero"
        />
      </div>
      <div class="flex flex-row">
        <label class="font-semibold mt-2.5">Qta: </label>
        <input
          type="text"
          placeholder="Quantità manuale"
          class="w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 m-1 hover:border-blue-300"
          v-model="quantita_libera"
        />
        <label class="font-semibold mt-2.5">Unità: </label>
        <input
          type="text"
          placeholder="Prezzo manuale"
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
                $store.commit('cancellaArticolo', scontrino.indexOf(articolo))
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
            <label class="font-semibold mt-2.5">Unità: </label>
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
      v-if="prodotti != null"
    >
      <button
        class="w-full bg-red-500 rounded shadow m-1 mb-3 lg:h-12 hover:bg-red-600"
        @click.prevent="cancellaScotrino"
      >
        Cancella scontrino
      </button>
      <router-link
        to="/Pagamento"
        class="w-full bg-green-500 rounded shadow m-1 mb-3 lg:h-12 hover:bg-green-600 text-center p-3"
        >Stampa</router-link
      >
      <p
        class="w-full bg-blue-500 rounded shadow m-1 mb-3 lg:h-12 text-center p-3"
      >
        Sub: {{ sub }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "scontrino",
  data() {
    return {
      prezzo_libero: "",
      quantita_libera: "",
      descrizione_libera: "",
      reparto_libero: "",
    };
  },
  methods: {
    aggiungiArticolo(data) {
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
              data.quantita = el.quantita + data.quantita;
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
    cancellaScotrino() {
      this.$store.commit("cancellaScontrino");
    },
    isASCII(str) {
      return /^[\x20-\x7F]*$/.test(str);
    },
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
  },
  computed: {
    ...mapGetters({ scontrino: "getScontrino" }),
    ...mapGetters({ prodotti: "getProdotti" }),
    sub: function () {
      if (this.scontrino.length > 0) {
        let sub = 0;
        this.scontrino.forEach((el) => {
          sub = sub + el.prezzo * el.quantita;
        });
        return sub.toFixed(2);
      } else {
        return 0;
      }
    },
  },
};
</script>