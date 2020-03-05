<script>
// @ is an alias to /src
import { Doughnut } from 'vue-chartjs'

export default {
  name: 'DoughnutChart',
  props: ['data'],
  mixins: [Doughnut],
  mounted(){
    this.renderChart(this.data, {
      // Options come here
      maintainAspectRatio: false
    });
  }
}
</script>
