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
          v-for="(p, index) in periods"
          :key="index"
          @click="period = p"
          :class="{active: !!period && period.value === p.value}">
          {{ p.text }}
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
      period: null,
      periods: [
        { text: '1M', value: 1 },
        { text: '6M', value: 6 },
        { text: '1Y', value: 12 },
        { text: 'All', value: null },
      ],

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
    this.period = this.periods[1]
  },
  watch: {
    period(){
      this.get_weight_history()
    }
  },
  methods: {
    addMonths(date, months) {
      date.setMonth(date.getMonth() + months);
      return date;
    },
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

      this.loading = true
      const url = `/points`
      const params = { limit: 0 } // No subsampling

      if (this.period.value) params.start = this.addMonths(new Date(), - this.period.value)

      this.axios.get(url, {params})
      .then(({data}) => {

        this.current_weight = data[data.length-1]._value
        this.last_retrieved = new Date(data[data.length-1]._time).toLocaleString()

        const chart_data = data.map((entry) => ({
            x: new Date(entry._time).getTime(),
            y: entry._value
          })
        )


        const average_data = this.moving_average(data.map(x => x._value),8).map((item, index) => ({
            x: new Date(data[index]._time).getTime(),
            y: item
          }) )


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

  },

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
