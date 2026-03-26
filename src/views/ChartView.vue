<script setup>
import { computed, ref, onMounted } from 'vue';
import ChartHeader from '../components/Chart/ChartHeader.vue';
import MainService from '../services/MainService'
const props = defineProps({
	id: { type: Number, default: 0 },
	mode: { type: String, default: 'sensor' }
})
const chartParams = ref({
	current: null,
	minus: null,
	plus: null,
	dateFrom: new Date().toISOString().split('T')[0],
	lenDays: 3,
	altYear: null,
})

const chartData = ref(null)

import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.query) // Access param

const updateLink = (val) => {
	console.log(val);
	
	chartParams.value.dateFrom = val.dateFrom
	chartParams.value.lenDays = val.lenDays
	chartParams.value.altYear = val.altYear
}

const imglink = computed(() => {
	return MainService.getBaseUrl() + "chart/sensorchart/"
				 + props.id + "?dateFrom=" + chartParams.value.dateFrom + 
				 "&lenDays=" + chartParams.value.lenDays + 
				 (chartParams.value.altYear ? "&altYear=" + chartParams.value.altYear : "")
})

onMounted(() => {
	MainService.getChartSensor(props.id, chartParams.value)
	.then(response => {
		console.log(response.data);
		if (response.data.status == 200)
			chartData.value = response.data
	})
	.catch((error) => {
		console.log(error);
	});
	chartParams.value.dateFrom = route.query.dateFrom || chartParams.value.dateFrom
	chartParams.value.lenDays = parseInt(route.query.lenDays) || chartParams.value.lenDays
	if (route.query.altYear === "null") {
		chartParams.value.altYear = null
	}
	else {
		chartParams.value.altYear = route.query.altYear || chartParams.value.altYear
	}
})

/* -------------- Príklad ----------- */
/*import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, 40]
    }]
}
const options = {
  responsive: true,
  maintainAspectRatio: false
}*/
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
			:alt-year="chartParams.altYear"
			:years="chartData && chartData.years ? chartData.years : []"
			@update:link="updateLink"
			@update:alt-year="updateLink"
		/>
		<div class="alert alert-warning" role="alert">
			Current: {{ chartParams.current }}, Minus: {{ chartParams.minus }}, Plus: {{ chartParams.plus }}
		</div>
		<div>
			<img :src="imglink" alt="Placeholder Chart" class="img-fluid" />
		</div>

		<!--div>
			<Line :data="data" :options="options" />
		</div-->
	</div>
</template>