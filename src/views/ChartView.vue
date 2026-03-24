<script setup>
import { ref } from 'vue';
import ChartHeader from '../components/Chart/ChartHeader.vue';
const props = defineProps({
	id: { type: Number, default: 0 },
	mode: { type: String, default: 'sensor' }
})
const chartParams = ref({
	current: 'now',
	minus: 'now',
	plus: 'now',
	dateFrom: new Date().toISOString().split('T')[0],
	lenDays: 1,
})

const updateCurrent = (val) => {
	chartParams.value.current = val
}
const updateMinus = (val) => {
	chartParams.value.minus = val
}
const updatePlus = (val) => {
	chartParams.value.plus = val
}
const updateDateFrom = (val) => {
	chartParams.value.dateFrom = val
}
const updateLenDays = (val) => {
	chartParams.value.lenDays = val
}


/* -------------- Príklad ----------- */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, 40]
    }
  ]
}
const options = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
	<div class="col-12">
		<div class="pb-3 pt-3 px-2">
			<h1>Grafy</h1>
		</div>
		<ChartHeader 
			:id="props.id"
			:mode="props.mode"
			:date-from="chartParams.dateFrom"
			:len-days="chartParams.lenDays" 
			@update:current="updateCurrent"
			@update:minus="updateMinus"
			@update:plus="updatePlus"
			@update:dateFrom="updateDateFrom"
			@update:lenDays="updateLenDays"
		/>
		<div class="alert alert-warning" role="alert">
			Current: {{ chartParams.current }}, Minus: {{ chartParams.minus }}, Plus: {{ chartParams.plus }}
			<br>
			Date From: {{ chartParams.dateFrom }}, Len Days: {{ chartParams.lenDays }}
		</div>
		<div>
			<Line :data="data" :options="options" />
		</div>
	</div>
</template>