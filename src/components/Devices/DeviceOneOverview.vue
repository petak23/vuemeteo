<script setup>
import { toRaw } from 'vue'
//import dayjs from 'dayjs'; //https://day.js.org/docs/en/display/format
import DevicesSpec from './DevicesSpec.vue'
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

const options = {
  responsive: true,
  maintainAspectRatio: false
}

const props = defineProps({
	device: { 
		type: Object, default: null 
	},
	is_logged_in: { 
		type: Boolean, default: false 
	}
})

/*const format_date = (value) => {
	const date = dayjs(value);
	// Then specify how you want your dates to be formatted
	return date.format('D.M.YYYY HH:mm:ss');
}*/

const export_data = (records, name) => {
	//console.log(props.device.id, records, name)
	const reversed = [...records].reverse() // kópia poľa, originál sa nezmení
	const labels = reversed.map(r => r.rec_hour)
	const datasets = {
		label: name,
		data: reversed.map(r => r.avg_val),
		borderColor: 'rgba(75, 192, 192, 1)',
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		tension: 0.5
	}
	//console.log('export_data', labels, datasets)
	return { labels: labels, datasets: [datasets] }
}

</script>

<template>
	<div class="card h-100 bg-light-subtle border-warning">
		<h5 class="card-header">
			{{ props.device.name }}
		</h5>
		<div class="card-body">
			<p class="card-text"><small>
				{{ props.device.desc }}<br />{{ Object.keys(props.device.sensors).length }} senzorov.<br />
				<span v-if="Object.keys(props.device.sensors).length">
					Posledné meranie:<br />{{ Object.values(props.device.sensors)[0].last_data_time }}
				</span>
				<span v-else class="text-danger">Nemám hodnoty o meraniach!</span>
			</small></p>
			<h6 class="card-title" v-if="Object.keys(props.device.sensors).length">Posledné hodnoty zo senzorov:</h6>
			<ul class="list-group list-group-flush" v-if="Object.keys(props.device.sensors).length">
				<li 
					v-for="sen in props.device.sensors"
					:key="sen.id"
					class="list-group-item text-primary-emphasis"
				>
					{{ sen.desc }} [<span class="text-muted fs-7">{{ sen.name }}</span>] ( {{ sen.last_data_time }} ): <strong>{{ sen.last_out_value.toFixed(2) }} {{ sen.value_unit }}</strong>
					
					<Line
					 	v-if="props.device.id == 1" 
						:data="export_data(toRaw(sen.sumdata), sen.desc)"
						:options="options"
						class="sensor-chart"/>
				</li>
			</ul>
			<DevicesSpec v-if="props.device.id == 1 && Object.keys(props.device.sensors).length" :sensors="props.device.sensors" 
				:temperature="props.device.sensors[19].last_out_value"
				:humidity="props.device.sensors[20].last_out_value"
				:wind-speed="props.device.sensors[16].last_out_value"
			/>
		</div>
		<div class="card-footer" v-if="props.is_logged_in">
			<div class="d-flex justify-content-end pt-2">
				<RouterLink :to="'props.device/' + props.device.id" class="btn btn-outline-secondary">
					Viac info <i class="fa-solid fa-angles-right"></i>
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.fs-7 {
	font-size: 0.8rem
}
.sensor-chart {
	max-height: 10em;
}
</style>