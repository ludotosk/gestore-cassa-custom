<template>
  <div id="app" class="bg-blue-50 h-screen" v-bind:class="{ 'lg:overflow-y-hidden': dbpage }">
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  methods: {
    ...mapActions(['setPubkey', 'setChiave'])
  },
  created() {
    this.setPubkey();
    this.setChiave();
  },
  computed: {
    ...mapGetters({dbpage: "getDbpage"})
  }
}
</script>