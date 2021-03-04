<template>
  <div id="app">

    <AppTemplate applicationName="Weight"/>

  </div>
</template>

<script>

import AppTemplate from '@moreillon/vue_application_template'

export default {
  name: 'App',
  components: {
    AppTemplate,
  },
  mounted(){

  },
}
</script>
<style>
button,
.button {
  font-size: 85%;
  text-decoration: none;
  color: currentColor;
  border: 1px solid #444444;
  border-radius: 0.33em;
  padding: 0.33em;
  background-color: transparent;

  transition: 0.25s;
  cursor: pointer;
}

button:hover,
.button:hover {
  border-color: #c00000;
  color: #c00000;
}
</style>
