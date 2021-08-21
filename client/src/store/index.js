import Vue from 'vue'
import Vuex from 'vuex'
import CryttoService from "../CryttoService";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pubkey: '',
    chiave: '',
    token: '',
    scontrino: [],
    chiaveServer: '',
    prodotti: null,
    dbpage: true,
  },
  mutations: {
    setPubkey(state,payload) {
      state.pubkey = payload;
    },
    setChiave(state,payload) {
      state.chiave = payload;
    },
    setToken(state,payload) {
      localStorage.token = payload;
      state.token = payload;
    },
    aggiungiArticolo(state,payload){
      state.scontrino.push(payload);
    },
    cancellaScontrino(state){
      state.scontrino = [];
    },
    cancellaArticolo(state,payload){
      state.scontrino.splice(payload, 1);
    },
    setChiaveServer(state,payload){
      state.chiaveServer = payload;
    },
    setProdotti(state,payload){
      state.prodotti = payload;
    },
    setDbpage(state,payload){
      state.dbpage = payload;
    }
  },
  actions: {
    async setPubkey(state) {
      const pubkey = await CryttoService.getPubkey();
      state.commit('setPubkey', pubkey);
    },
    async setChiave(state) {
      const chiave = await CryttoService.makeid(32);
      state.commit('setChiave', chiave)  
    }
  },
  modules: {
  },
  getters: {
    getPubkey: state => state.pubkey,
    getChiave: state => state.chiave,
    getToken: state => state.token,
    getScontrino: state => state.scontrino,
    getChiaveServer: state => state.chiaveServer,
    getProdotti: state => state.prodotti,
    getDbpage: state => state.dbpage
  }
})
