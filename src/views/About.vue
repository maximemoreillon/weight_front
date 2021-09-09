<template>
  <div class="about">
    <h1>About</h1>
    <p>Author: Maxime MOREILLON</p>
    <p>Version: {{version}}</p>





  </div>
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
