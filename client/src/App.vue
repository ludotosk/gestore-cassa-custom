<template>
  <div id="app" class="bg-blue-50 h-screen lg:overflow-y-hidden">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(['setPubkey', 'setChiave'])
  },
  created() {
    this.setPubkey();
    this.setChiave();
  },
}
</script>