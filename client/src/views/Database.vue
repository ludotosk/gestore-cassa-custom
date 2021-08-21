<template>
  <div class="space-y-2 p-1">
    <h2 class="text-center">Inserimento dati</h2>
    <div class="bg-white rounded shadow p-1">
      <h3 class="m-1">Categoria</h3>
      <div class="flex flex-col space-y-1">
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Inserire una categoria"
          v-model="categoria"
        />
        <button class="bg-green-400 rounded w-20 h-8" @click="inviaCategoria">
          Aggiungi
        </button>
      </div>
    </div>
    <div class="bg-white rounded shadow p-1">
      <h3 class="m-1">Iva</h3>
      <div class="flex flex-col space-y-1">
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Aliquota iva"
          v-model="iva.aliquota_iva"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Descrizione iva"
          v-model="iva.desc_iva"
        />
        <button class="bg-green-400 rounded px-1 h-8 w-20" @click="inviaIva">
          Aggiungi
        </button>
      </div>
    </div>
    <div class="bg-white rounded shadow p-1">
      <h3 class="m-1">Reparto</h3>
      <div class="flex flex-col space-y-1">
        <p class="text-red-500 text-sm mx-1">
          Non inserire numeri reparto già esistenti! (Puoi trovare i numeri già
          esistenti in prodotto)
        </p>
        <p class="text-red-500 text-sm mx-1">
          Il numero reparto corrisponde a quello della cassa.
        </p>
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Numero reparto"
          v-model="reparto.id_reparto"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Descrizione reparto"
          v-model="reparto.desc_reparto"
        />
        <button class="bg-green-400 rounded h-8 w-20" @click="inviaReparto">
          Aggiungi
        </button>
      </div>
    </div>
    <div class="bg-white rounded shadow p-1">
      <h3 class="m-1">Prodotto</h3>
      <div class="flex flex-col space-y-1">
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Descrizione"
          v-model="prodotto.descrizione"
        />
        <p class="text-red-500 text-sm mx-1">
          Desc breve corrisponde al nome prodotto stampato sullo scontrino
        </p>
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Descrizione breve"
          v-model="prodotto.desc_breve"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Data inserimento"
          v-model="Oggi"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Code"
          v-model="prodotto.code"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Oem code"
          v-model="prodotto.oem_code"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Costo acquisto"
          v-model="prodotto.costo_acq"
        />
        <select
          class="rounded focus:border-gray-500 focus:bg-white focus:ring-0 w-80"
          v-model="prodotto.id_reparto"
        >
          <option value="">Reparto</option>
          <option
            v-for="reparto in reparti"
            :key="reparto.id_reparto"
            v-bind:value="reparto.id_reparto"
          >
            {{ reparto.id_reparto }}: {{ reparto.desc_reparto }}
          </option>
        </select>
        <select
          class="rounded focus:border-gray-500 focus:bg-white focus:ring-0 w-80"
          v-model="prodotto.id_categoria"
        >
          <option value="">Categoria</option>
          <option
            v-for="categoria in categorie"
            :key="categoria.id_categoria"
            v-bind:value="categoria.id_categoria"
          >
            {{ categoria.categoria }}
          </option>
        </select>
        <button class="bg-green-400 rounded h-8 w-20" @click="inviaProdotto">
          Aggiungi
        </button>
      </div>
    </div>
    <div class="bg-white rounded shadow p-1 flex flex-col space-y-1">
      <h3 class="m-1">Listini</h3>
      <input
        class="
          h-8
          block
          rounded-md
          bg-gray-100
          border-transparent
          focus:border-gray-500
          focus:ring-0
          w-80
          hover:border-blue-300
          mx-1
        "
        placeholder="Nome listino"
        v-model="listino.nome"
      />
      <select
        class="rounded focus:border-gray-500 focus:bg-white focus:ring-0 w-80"
        v-model="listino.id_prodotto"
      >
        <option value="">Prodotto</option>
        <option
          v-for="prodotto in prodotti"
          :key="prodotto.id_prodotto"
          v-bind:value="prodotto.id_prodotto"
        >
          {{ prodotto.id_prodotto }}: {{ prodotto.desc_breve }}
        </option>
      </select>
      <select
        class="rounded focus:border-gray-500 focus:bg-white focus:ring-0 w-80"
        v-model="listino.id_iva"
      >
        <option value="">Iva</option>
        <option
          v-for="iva in ArrayIva"
          :key="iva.id_iva"
          v-bind:value="iva.id_iva"
        >
          {{ iva.id_iva }}: {{ iva.desc_iva }}
        </option>
      </select>
      <input
        class="
          h-8
          block
          rounded-md
          bg-gray-100
          border-transparent
          focus:border-gray-500
          focus:ring-0
          w-80
          hover:border-blue-300
          mx-1
        "
        placeholder="Sconto"
        v-model="listino.sconto"
      />
      <input
        class="
          h-8
          block
          rounded-md
          bg-gray-100
          border-transparent
          focus:border-gray-500
          focus:ring-0
          w-80
          hover:border-blue-300
          mx-1
        "
        placeholder="Prezzo"
        v-model="listino.prezzo"
      />
      <button class="bg-green-400 rounded h-8 w-20" @click="inviaListino">
        Aggiungi
      </button>
    </div>
  </div>
</template>

<script>
const data = new Date();
import axios from "axios";
import { mapGetters } from "vuex";
import CryttoService from "../CryttoService";

export default {
  data() {
    return {
      categorie: [],
      reparti: [],
      prodotti: [],
      ArrayIva: [],
      categoria: "",
      iva: {
        aliquota_iva: "",
        desc_iva: "",
      },
      reparto: {
        id_reparto: "",
        desc_reparto: "",
      },
      prodotto: {
        descrizione: "",
        desc_breve: "",
        data_ins: "",
        code: "",
        bar_code: "",
        oem_code: "",
        costo_acq: "",
        id_reparto: "",
        id_categoria: "",
      },
      listino: {
        nome: "",
        prezzo: "",
        sconto: "",
        id_prodotto: "",
        id_iva: "",
      },
    };
  },
  computed: {
    Oggi: function () {
      var giorno = data.getDate();
      var month = data.getMonth() + 1;
      var fullYear = data.getFullYear();
      return giorno + "/" + month + "/" + fullYear;
    },
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ token: "getToken" }),
    ...mapGetters({ chiaveServer: "getChiaveServer" }),
  },
  methods: {
    async scaricaDatiSelect() {
      var body = {};
      body.token = this.token;
      body.chiave = this.chiave;
      let enc = await CryttoService.encSim(
        JSON.stringify(body),
        this.chiaveServer
      );
      let resCat = await axios.post("db/get/categoria_prodotto", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      this.categorie = JSON.parse(
        await CryttoService.decSim(resCat.data, this.chiave)
      );
      let resRep = await axios.post("db/get/reparto", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      this.reparti = JSON.parse(
        await CryttoService.decSim(resRep.data, this.chiave)
      );
      let resProd = await axios.post("db/get/prodottiRaw", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      this.prodotti = JSON.parse(
        await CryttoService.decSim(resProd.data, this.chiave)
      );
      let resIva = await axios.post("db/get/iva", enc, {
        headers: { "Content-Type": "text/plain" },
      });
      this.ArrayIva = JSON.parse(
        await CryttoService.decSim(resIva.data, this.chiave)
      );
    },
    isASCII(str) {
      return /^[\x20-\x7F]*$/.test(str);
    },
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    async inviaDati(indirizzo, tipo, body) {
      body.token = this.token;
      body.chiave = this.chiave;
      let enc = await CryttoService.encSim(
        JSON.stringify(body),
        this.chiaveServer
      );
      let res = await axios
        .post(indirizzo, enc, {
          headers: { "Content-Type": "text/plain" },
        })
        .catch((err) => {
          if (err.response) {
            window.alert(
              "Errore, dati non inseriti \nPotrebbe essere stato inserito un dato errato in un campo"
            );
          }
        });
      if (res.status == 201) {
        window.alert(tipo);
      }
    },
    async inviaCategoria() {
      var body = {};
      body.categoria = this.categoria;
      this.inviaDati("db/categoria_prodotto", "Categoria creata!", body);
      this.scaricaDatiSelect();
    },
    async inviaIva() {
      if (this.isNumeric(this.iva.aliquota_iva)) {
        var body = {};
        body.iva = this.iva;
        this.inviaDati("db/iva", "Iva creata!", body);
      } else {
        window.alert("Inserire un valore valido per aliquota iva");
      }
    },
    async inviaReparto() {
      if (this.isNumeric(this.reparto.id_reparto)) {
        var body = {};
        body.reparto = this.reparto;
        this.inviaDati("db/reparto", "Reparto creato!", body);
        this.scaricaDatiSelect();
      } else {
        window.alert("Inserire un numero reparto valido");
      }
    },
    async inviaProdotto() {
      if (this.prodotto.id_categoria == "") {
        window.alert("Selezionare una categoria!");
        return 0;
      }
      if (this.prodotto.id_reparto == "") {
        window.alert("Selezionare un reparto!");
        return 0;
      }
      if (!this.isASCII(this.prodotto.desc_breve)) {
        window.alert("Non sono ammessi caratteri speciali in desc breve!");
        return 0;
      }
      this.prodotto.data_ins = this.Oggi;
      var body = {};
      body.prodotto = this.prodotto;
      this.inviaDati("db/prodotti", "Prodotto creato!", body);
    },
    async inviaListino() {
      if (this.listino.nome == "") {
        window.alert("Inserire un nome listino!");
        return 0;
      }
      if (this.listino.prezzo == "") {
        window.alert("Inserire un prezzo nel listino!");
        return 0;
      }
      if (this.listino.id_iva == "") {
        window.alert("Inserire iva nel listino!");
        return 0;
      }
      if (this.listino.sconto == "") {
        window.alert("Inserire uno sconto nel listino!");
        return 0;
      }
      if (this.listino.id_prodotto == "") {
        window.alert("Inserire un prodotto nel listino!");
        return 0;
      }
      console.log(this.listino.id_prodotto);
      var body = {};
      body.listini = this.listino;
      this.inviaDati("db/listini", "Listino creato!", body);
    },
  },
  async created() {
    this.scaricaDatiSelect();
    this.$store.commit("setDbpage", false);
  },
};
</script>