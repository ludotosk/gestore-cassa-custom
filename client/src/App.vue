<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <ComponenteStato />
    <ComponenteScontrino />
  </div>
</template>

<script>
import ComponenteScontrino from './components/ComponenteScontrino.vue'
import ComponenteStato from './components/ComponenteStato.vue'

export default {
  name: 'App',
  components: {
    ComponenteScontrino,
    ComponenteStato
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
