<template>
  <div class="container mx-auto space-y-4 px-1">
    <h1 class="text-gray-700">Login</h1>

    <h2 class="text-gray-500">
      Il codice login è disponible sullo schermo del computerino.
    </h2>

    <form>
      <div class="space-x-4 w-full bg-red-300 p-4 rounded shadow-md">
        <div class="inline-block ml-4">
          <label class="font-semibold">Codice </label>
        </div>
        <div class="inline-block w-4/5">
          <input
            class="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 hover:border-red-400"
            type="text"
            placeholder="Inserire il codice mostrato sullo schermo del computerino"
            v-model="codice"
          />
        </div>
        <button
          class="bg-gray-300 p-2 rounded block m-4 hover:bg-gray-400"
          @click.prevent="login"
        >
          Sign in
        </button>
      </div>
    </form>
    <div v-if="code == 200" class="text-red-600">
      Il codice verrà mostrato per 5 minuti, ricaricare la pagina per mostrane
      un'altro.
    </div>
    <div v-else-if="code == 500" class="text-red-600">
      Sì è generato un erroe nella creazione del codice.
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CryttoService from "../CryttoService";
import { mapGetters } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      codice: null,
      code: null,
    };
  },
  async created() {
    if (localStorage.token) {
      this.redirect();
    }
  },
  async mounted() {
    if (!localStorage.token) {
      try {
        let res = await axios.get("/codice");
        this.code = res.status;
      } catch (e) {
        console.error(e);
        this.code = 500;
      }
    }
  },
  methods: {
    async login() {
      if (this.isCodice(this.codice)) {
        var body = {};
        body.codice = this.codice;
        body.chiave = this.chiave;
        let res = await CryttoService.encrypt(
          JSON.stringify(body),
          this.pubkey
        );
        var response = await axios.post("login", res, {
          headers: { "Content-Type": "text/plain" },
        });
        if (response.status == 200) {
          var rispostaDec = JSON.parse(
            await CryttoService.decSim(response.data, this.chiave)
          );
          this.$store.commit("setToken", rispostaDec.token);
          this.redirect();
        } else {
          this.code = 500;
        }
      } else {
        window.alert('Inserire un codice valido')
      }
    },
    isCodice(codice) {
      return /^\d{4}$/.test(codice);
    },
    redirect() {
      this.$router.push({ name: "Home" });
    },
  },
  computed: {
    ...mapGetters({ pubkey: "getPubkey" }),
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ token: "getToken" }),
  },
};
</script>
