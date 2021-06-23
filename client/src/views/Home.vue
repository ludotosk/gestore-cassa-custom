<template>
  <div>
    <div class="grid grid-cols-3 bg-blue-50">
      <div class="col-span-3 lg:h-12 h-8">
        <!-- nav -->
        <navbar></navbar>
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
import scontrino from "../components/ComponenteScontrino";
import articoli from "../components/ComponenteArticoli";
import navbar from "../components/ComponenteNav";

export default {
  name: "Home",
  components: {
    scontrino: scontrino,
    articoli: articoli,
    navbar: navbar,
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
      //let res = await CryttoService.encrypt(JSON.stringify(body), this.pubkey);
      let enc = await CryttoService.encSim(
        JSON.stringify(body),
        this.chiaveServer
      );
      try {
        await axios.post("status", enc, {
          headers: { "Content-Type": "text/plain" },
        });
      } catch (error) {
        console.error(error);
        localStorage.removeItem(`token`);
        this.redirect();
      }
    },
    async getChiaveServer() {
      if (this.chiaveServer == "") {
        var body = {};
        body.token = localStorage.token;
        body.chiave = this.chiave;
        let enc = await CryttoService.encrypt(
          JSON.stringify(body),
          this.pubkey
        );
        try {
          let resEnc = await axios.post("key", enc, {
            headers: { "Content-Type": "text/plain" },
          });
          let res = JSON.parse(
            await CryttoService.decSim(resEnc.data, this.chiave)
          );
          this.$store.commit("setChiaveServer", res.chiaveServer);
        } catch (error) {
          console.error(error);
        }
      }
    },
    async auto() {
      var body = {};
      body.chiave = this.chiave;
      body.token = this.token;
      let enc = await CryttoService.encSim(
        JSON.stringify(body),
        this.chiaveServer
      );
      await axios.post("indirizzo/auto", enc, {
        headers: { "Content-Type": "text/plain" },
      });
    },
  },
  watch: {
    chiaveServer: function () {
      this.checkToken();
      this.auto();
    },
    pubkey: function () {
      this.getChiaveServer();
    },
  },
  computed: {
    ...mapGetters({ pubkey: "getPubkey" }),
    ...mapGetters({ chiave: "getChiave" }),
    ...mapGetters({ token: "getToken" }),
    ...mapGetters({ chiaveServer: "getChiaveServer" }),
  },
};
</script>