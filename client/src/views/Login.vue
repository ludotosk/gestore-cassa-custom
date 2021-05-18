<template>
  <div class="container mx-auto space-y-4 px-1">
    <h1 class="text-9xl text-gray-700 font-sans font-semibold antialiased">
      Login
    </h1>

    <h2 class="text-4xl text-gray-500">
      Il codice login è disponible sullo schermo del computerino.
    </h2>

    <form>
      <div class="space-x-4 w-full bg-red-300 p-4 rounded shadow-md">
        <div class="inline-block ml-4">
          <label class="font-semibold">Codice </label>
        </div>
        <div class="inline-block w-4/5">
          <input
            class="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            type="text"
            placeholder="Inserire il codice mostrato sullo schermo del computerino"
            v-model="codice"
          />
        </div>
        <button
          class="bg-gray-300 p-2 rounded block m-4"
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

export default {
  data() {
    return {
      token: "",
      codice: null,
      pubkey: null,
      chiave: null,
      code: null,
    };
  },
  async created() {
    if (localStorage.token){
      this.redirect();
    }
  },
  async mounted() {
    try {
      let res = await axios.get("/codice");
      this.code = res.status;
    } catch (e) {
      console.error(e);
      this.code = 500;
    }
    if (localStorage.pubkey) {
      this.pubkey = localStorage.pubkey;
    } else {
      this.pubkey = await CryttoService.getPubkey();
    }
    this.chiave = await CryttoService.makeid(32);
  },
  methods: {
    async login() {
      var body = {};
      body.codice = this.codice;
      body.chiave = this.chiave;
      if (!this.pubkey) {
        this.pubkey = await CryttoService.getPubkey();
      }
      let res = await CryttoService.encrypt(JSON.stringify(body), this.pubkey);
      var response = await axios.post("login", res, {
        headers: { "Content-Type": "text/plain" },
      });
      if (response.status == 200) {
        var rispostaDec = JSON.parse(
          await CryttoService.decSim(response.data, this.chiave)
        );
        this.token = rispostaDec.token;
        this.redirect();
      } else {
        this.code = 500;
      }
    },
    redirect() {
      this.$router.push({ name: "Home" });
    },
  },
  watch: {
    pubkey: function (key) {
      localStorage.pubkey = key;
    },
    token: function (token) {
      localStorage.token = token;
    },
  },
};
</script>
