<template>
  <div class="weight">

    <div
      v-if="loading"
      class="loader_wrapper">
      <Loader  />
    </div>


    <div class="plot_wrapper" v-if="!loading">

      <div class="current_weight_wrapper">
        <div class="current_weight">
          Current weight: {{current_weight}} kg
        </div>
        <div class="last_retrieved">
          Retrieved {{last_retrieved}}
        </div>
      </div>

      <div class="zoom_buttons_wrapper">
        <button
          id="one_month"
          @click="updateData('one_month')"
          :class="{active: selection==='one_month'}">
          1M
        </button>

          <button
            id="six_months"
            @click="updateData('six_months')"
            :class="{active: selection==='six_months'}">
            6M
          </button>

          <button
            id="one_year"
            @click="updateData('one_year')"
            :class="{active: selection==='one_year'}">
            1Y
          </button>

          <button
            id="all"
            @click="updateData('all')"
            :class="{active: selection==='all'}">
            ALL
          </button>
        </div>

      <div
        class="chart_wrapper">
        <apexchart
          ref="chart"
          width="100%"
          height="100%"
          :options="options"
          :series="series" />
      </div>
    </div>




  </div>
</template>

<script>
// @ is an alias to /src
import Loader from '@/components/Loader.vue'

export default {
  name: 'Weight',
  components: {
    Loader
  },
  data(){
    return {
      loading: false,
      current_weight: null,
      last_retrieved: null,
      selection: 'all',

      options: {
        chart: {
          id: 'weight-chart',
          type: 'line',
          /*
          zoom: {
            autoScaleYaxis: true
          },
          */
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
        stroke: {
          curve: 'straight',
        },

        colors: ['#c00000', '#444444'],

        xaxis: {
          type: 'datetime'
        },
        dataLabels: {
          enabled: false
        },

      },
      // Initialized as empty data
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
        const rounded_average = Math.round(average * 100) / 100
        return rounded_average
      })
    },
    get_weight_history(){
      // Loading history
      this.loading = true
      const url = `${process.env.VUE_APP_WEIGHT_API_URL}/history`

      this.axios.get(url)
      .then(({data}) => {

        this.current_weight = data[data.length-1].weight
        this.last_retrieved = new Date(data[data.length-1].time).toLocaleString()

        const chart_data = data.map((entry) => {
          return {
            x: new Date(entry.time).getTime(),
            y: entry.weight
          }
        })


        const average_data = this.moving_average(data.map(x => x.weight),8).map((item, index) => {
          return {
            x: new Date(data[index].time).getTime(),
            y: item
          }
        })


        this.series = [
          { name: 'Weight', data: chart_data },
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
        alert(`Something went wrong`)
      })
      .finally(() => {this.loading = false})
    },

    updateData(timeline){
      this.selection = timeline

      switch (timeline) {
        case 'one_month':
          this.$refs.chart.zoomX( new Date().setMonth(new Date().getMonth() - 1), new Date() )
          break
        case 'six_months':
          this.$refs.chart.zoomX( new Date().setMonth(new Date().getMonth() - 6), new Date() )
          break
        case 'one_year':
          this.$refs.chart.zoomX( new Date().setMonth(new Date().getMonth() - 12), new Date() )
          break
        case 'all':
          this.$refs.chart.zoomX( this.series[0].data[0][0], new Date() )
          break
        default:
          this.$refs.chart.zoomX( this.series[0].data[0][0], new Date() )
      }
    }
  },
  computed: {
  }
}

</script>

<style scoped>

.plot_wrapper {
  margin-top: 3em;
}

.loader_wrapper {
  margin-top: 10vh;
}

.current_weight_wrapper{
  text-align: center;
}

.current_weight{
  font-size: 150%;
  margin: 0.25em;
}

.last_retrieved {
  color: #666666;
}

.chart_wrapper {
  height: 60vh;
}

.zoom_buttons_wrapper button:not(:last-child) {
  margin-right: 0.5em;
}

.zoom_buttons_wrapper button.active {
  color: white;
  background-color: #c00000;
  border-color: #c00000;
}
</style>
