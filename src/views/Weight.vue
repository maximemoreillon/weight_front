<template>
  <v-card :loading="loading">
    <v-container fluid>
      <v-row dense align="center" justify="space-between">
        <v-col cols="12" md="6">
          <v-card-title>{{current_weight}} kg</v-card-title>
          <v-card-subtitle>As of {{last_retrieved}}</v-card-subtitle>
        </v-col>
        <v-col cols="auto">
          <v-btn-toggle v-model="periodIndex" mandatory dense>
            <v-btn v-for="(p, index) in periods" :key="index">
              {{ p.text }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-container>
    <v-card-text>
      <apexchart ref="chart" width="100%" height="500px" :options="options" :series="series" />
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'Weight',
  data(){
    return {
      loading: false,
      current_weight: null,
      last_retrieved: null,
      periodIndex: 0,
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
    this.get_weight_history()
  },
  watch: {
    periodIndex(){
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

      const period = this.periods[this.periodIndex]
      if (period.value) params.start = this.addMonths(new Date(), - period.value)

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


