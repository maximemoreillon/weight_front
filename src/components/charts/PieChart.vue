<script>
// @ is an alias to /src
import { Pie } from 'vue-chartjs'

export default {
  name: 'PieChart',
  props: ['data'],
  mixins: [Pie],
  mounted(){
    this.renderChart(this.data, {
      // Options come here
      maintainAspectRatio: false
    });
  }
}
</script>
