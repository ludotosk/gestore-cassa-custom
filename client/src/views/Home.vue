<template>
  <div>
    <pagamento v-if="stampa"></pagamento>
    <div class="grid grid-cols-3 bg-blue-50" v-if="!stampa">
      <div class="col-span-3 h-8">
        <!-- nav -->
        Navbar
      </div>
      <div class="lg:col-span-1 lg:h-screen h-4/5 col-span-3">
        <!-- colonna scontrino -->
        <scontrino></scontrino>
      </div>
      <div class="lg:col-span-2 lg:h-screen col-span-3">
        <!-- colonna articoli -->
        <articoli></articoli>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CryttoService from "../CryttoService";
import { mapGetters } from "vuex";
import pagamento from "../components/ComponentePagamento";
import scontrino from "../components/ComponenteScontrino";
import articoli from "../components/ComponenteArticoli";

export default {
  name: "Home",
  components: {
    pagamento: pagamento,
    scontrino: scontrino,
    articoli: articoli,
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
    ...mapGetters({ stampa: "getStampa" }),
  },
};
</script>