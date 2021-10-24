<template>
  <AppTemplate :options="options" />
</template>

<script>
//import AppTemplate from '@/components/vue_application_template/AppTemplate.vue'
import AppTemplate from '@moreillon/vue_application_template'



export default {
  name: 'app',
  components: {
    AppTemplate,

  },


  data(){
    return {
      options: {
        title: 'Weight',
        authenticate: true,
        login_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/login`,
        identification_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/whoami`
      },
    }
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
