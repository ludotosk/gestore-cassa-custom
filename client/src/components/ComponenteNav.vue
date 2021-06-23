<template>
  <div class="h-full flex flex-row bg-white shadow">
    <p
      class="lg:p-2 m-1 h-6 px-1 lg:h-10 font-semibold"
      v-for="obj in stateArray"
      :key="obj.id"
    >
      Cassa {{ obj.stato }}
    </p>
    <router-link
      to="/Connessione"
      class="m-1 lg:p-2 h-6 lg:h-10 bg-blue-300 rounded px-1 hover:bg-blue-400 shadow"
      >Connetti</router-link
    >
    <router-link
      to="/Database"
      class="m-1 lg:p-2 h-6 lg:h-10 bg-blue-300 rounded px-1 hover:bg-blue-400 shadow"
      >Database</router-link
    >
    <router-link
      to="/"
      class="m-1 lg:p-2 h-6 lg:h-10 bg-blue-300 rounded px-1 hover:bg-blue-400 shadow"
      ><img src="@/assets/setting.svg" class="h-4 m-1"
    /></router-link>
  </div>
</template>

<script>
import axios from "axios";
import CryttoService from "../CryttoService";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      stateArray: [{ stato: "disconnessa", id: 0 }],
      id: 1,
    };
  },
  mounted() {
    if (this.chiaveServer != "") {
      setInterval(this.getStato, 1000);
    }
  },
  methods: {
    async getStato() {
      var body = {};
      body.token = this.token;
      body.chiave = this.chiave;
      //let res = await CryttoService.encrypt(JSON.stringify(body), this.pubkey);
      let enc = await CryttoService.encSim(
        JSON.stringify(body),
        this.chiaveServer
      );
      try {
        let resEnc = await axios.post("status", enc, {
          headers: { "Content-Type": "text/plain" },
        });
        let res = JSON.parse(
          await CryttoService.decSim(resEnc.data, this.chiave)
        );
        console.log(res);
        this.id += 1;
        this.stateArray = [{ stato: res.stato, id: this.id }];
      } catch (error) {
        console.error(error);
      }
    },
  },
  computed: {
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ chiaveServer: "getChiaveServer" }),
    ...mapGetters({ token: "getToken" }),
  },
  watch: {
    chiaveServer: function () {
      setInterval(this.getStato, 1000);
    },
  },
};
</script>