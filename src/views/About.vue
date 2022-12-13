<template>
  <v-card max-width="40rem" class="mx-auto">
    <v-card-title>About</v-card-title>
    <v-card-text>
      <p>Author: Maxime MOREILLON</p>
      <p>Version: {{ version }}</p>
    </v-card-text>
  </v-card>
</template>

<script>
// @ is an alias to /src
import pjson from '../../package.json'
export default {
  name: 'About',

  data(){
    return {
      version: pjson.version,
    }
  },

}

</script>

<style scoped>

</style>
