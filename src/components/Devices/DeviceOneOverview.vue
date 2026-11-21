<script setup>
import { toRaw, computed } from 'vue'
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

// Senzory zariadenia použité pre výpočet pocitovej teploty a rosného bodu (len zariadenie s id 1)
const SPEC_DEVICE_ID = 1
const SPEC_SENSOR = { temperature: 19, humidity: 20, windSpeed: 16 }

const sensorList = computed(() => props.device?.sensors ? Object.values(props.device.sensors) : [])
const sensorCount = computed(() => sensorList.value.length)

/** Posledná hodnota senzora s daným id alebo null, ak senzor / hodnota neexistuje */
const sensorValue = (id) => {
	const v = props.device?.sensors?.[id]?.last_out_value
	return v === null || v === undefined || isNaN(Number(v)) ? null : Number(v)
}

const showSpec = computed(() => props.device?.id == SPEC_DEVICE_ID && sensorCount.value > 0)

const formatValue = (v) => (v === null || v === undefined || isNaN(Number(v)) ? '---' : Number(v).toFixed(2))

const export_data = (records, name) => {
	const reversed = Array.isArray(records) ? [...records].reverse() : [] // kópia poľa, originál sa nezmení
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
				{{ props.device.desc }}<br />{{ sensorCount }} senzorov.<br />
				<span v-if="sensorCount">
					Posledné meranie:<br />{{ sensorList[0].last_data_time }}
				</span>
				<span v-else class="text-danger">Nemám hodnoty o meraniach!</span>
			</small></p>
			<h6 class="card-title" v-if="sensorCount">Posledné hodnoty zo senzorov:</h6>
			<ul class="list-group list-group-flush" v-if="sensorCount">
				<li 
					v-for="sen in sensorList"
					:key="sen.id"
					class="list-group-item text-primary-emphasis"
				>
					{{ sen.desc }} [<span class="text-muted fs-7">{{ sen.name }}</span>] ( {{ sen.last_data_time }} ): <strong>{{ formatValue(sen.last_out_value) }} {{ sen.value_unit }}</strong>
					
					<Line
					 	v-if="props.device.id == 1" 
						:data="export_data(toRaw(sen.sumdata), sen.desc)"
						:options="options"
						class="sensor-chart"/>
				</li>
			</ul>
			<DevicesSpec v-if="showSpec"
				:temperature="sensorValue(SPEC_SENSOR.temperature)"
				:humidity="sensorValue(SPEC_SENSOR.humidity)"
				:wind-speed="sensorValue(SPEC_SENSOR.windSpeed)"
			/>
		</div>
		<div class="card-footer" v-if="props.is_logged_in">
			<div class="d-flex justify-content-end pt-2">
				<RouterLink :to="'/device/' + props.device.id" class="btn btn-outline-secondary">
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