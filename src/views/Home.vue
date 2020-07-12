<template>
  <div class="home">
    <div v-if="dataCollection.loaded">

      <div class="current_weight_wrapper">
        Current weight: {{dataCollection.datasets[0].data[dataCollection.datasets[0].data.length-1]}} kg
      </div>

      <LineChart
        class="chart"
        v-if="dataCollection.loaded"
        v-bind:data="dataCollection"/>

    </div>

    <Loader v-else/>
  </div>
</template>

<script>
// @ is an alias to /src
import LineChart from '@/components/charts/LineChart.vue'
import Loader from '@/components/Loader.vue'

export default {
  name: 'home',
  components: {
    LineChart,
    Loader
  },
  data(){
    return {

      dataCollection: {
        loaded: false,
        labels: [], // filled by API call

        datasets: [
          {
            label: 'Weight',
            data: [], // filled by API call
            borderColor: '#c00000',
            fill: false,
            pointRadius: 0,
            pointHitRadius: 3,
            pointHoverRadius: 3,
            borderWidth: 2,
          }
        ],
      }
    }
  },
  methods: {
    get_weight_history(){
      // Loading history
      this.dataCollection.loaded = false
      let url = `${VUE_APP_WEIGHT_API_URL}/history`

      this.axios.get(url)
      .then(response => {
        // Empty array
        this.dataCollection.labels.splice(0,this.dataCollection.labels.length)
        this.dataCollection.datasets[0].data.splice(0,this.dataCollection.datasets[0].data.length)
        // repopulate
        response.data.forEach(entry => {
          this.dataCollection.datasets[0].data.push(Number(entry.weight))
          this.dataCollection.labels.push(new Date(entry.time))
        })

        this.dataCollection.loaded = true;
      })
      .catch( error => console.log(error.response.data))
    }

  },
  mounted(){

    this.get_weight_history();
  }

}

</script>

<style scoped>
.current_weight_wrapper{
  text-align: center;
  margin: 15px;
  font-size: 150%;
}
</style>
