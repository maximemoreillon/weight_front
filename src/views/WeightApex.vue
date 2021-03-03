<template>
  <div class="weight">

    <Loader v-if="loading"/>
    <p class="current_weight_wrapper" v-else>
      Current weight: {{current_weight}} kg
    </p>

    <div
      v-if="!loading"
      class="chart_wrapper">
      <apexchart

        ref="weight_chart"
        width="100%"
        height="100%"
        type="line"
        v-bind:options="options"
        :series="series" />
    </div>



  </div>
</template>

<script>
// @ is an alias to /src
import Loader from '@/components/Loader.vue'

export default {
  name: 'home',
  components: {
    Loader
  },
  data(){
    return {
      loading: false,
      current_weight: null,

      options: {
        chart: {
          id: 'weight-chart',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          }
        },

        xaxis: {
          type: 'datetime'
        },
        /*
        yaxis: {
          min: 0,
          max: 100,
        }
        */

      },
      series: [{
        data: []
      }],

    }
  },
  mounted(){
    this.get_weight_history()
  },
  methods: {
    moving_average(input_array, sample_count){
      sample_count = sample_count ?? 10
      return input_array.map((item, index) => {
        const sub_array = input_array.slice(index-sample_count,index)
        if(!sub_array.length) return item
        const average = sub_array.reduce((a, b) => a + b, 0)/sample_count
        const rounded_average = Math.round(average * 10000) / 10000
        return rounded_average
      })
    },
    get_weight_history(){
      // Loading history
      this.loading = true
      const url = `${process.env.VUE_APP_WEIGHT_API_URL}/history`

      this.axios.get(url)
      .then(response => {

        this.current_weight = response.data[response.data.length-1].weight

        const chart_data = response.data.map((entry) => {
          return {
            x: new Date(entry.time).getTime(),
            y: entry.weight
          }
        })

        const average_data = this.moving_average(response.data.map(x => x.weight),8).map((item, index) => {
          return {
            x: new Date(response.data[index].time).getTime(),
            y: item
          }

        })


        this.series = [
          { name: 'Raw weight', data: chart_data },
          { name: 'Moving average', data: average_data },
        ]



      })
      .catch( error => {
        if(error.response) {
          console.error(error.response.data)
        }
        else {
          console.error(error)
        }
      })
      .finally(() => {this.loading = false})
    }

  },


}

</script>

<style scoped>
.current_weight_wrapper{
  text-align: center;
  font-size: 150%;
}

.chart_wrapper {
  height: 60vh;
}
</style>
