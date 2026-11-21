<script setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import ChartHeader from '../components/Chart/ChartHeader.vue'
import MainService from '../services/MainService'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useMainStore } from '../stores/main'
const store = useMainStore()
const route = useRoute()
const router = useRouter()

const props = defineProps({
	id: { type: Number, default: 0 },
	mode: { type: String, default: 'sensor' }
})

// Parametre grafu – hneď na začiatku sa prevezmú z URL (?dateFrom=&lenDays=&altYear=)
const parseAltYear = (v) => {
	const n = parseInt(v)
	return isNaN(n) ? null : n
}
// dateFrom môže prísť aj s časom (napr. zo štatistiky "2025-01-01 12:00:00") – použije sa len dátum
const parseDateFrom = (v) => {
	const d = String(v ?? '').slice(0, 10)
	return /^\d{4}-\d{2}-\d{2}$/.test(d) && dayjs(d).isValid() ? d : dayjs().format('YYYY-MM-DD')
}
const chartParams = ref({
	dateFrom: parseDateFrom(route.query.dateFrom),
	lenDays: parseInt(route.query.lenDays) || 3,
	altYear: parseAltYear(route.query.altYear),
})

const chartData = ref(null)

const updateParams = (val) => {
	chartParams.value = { ...val }
	// Parametre sa premietnu aj do URL, aby šlo stránku obnoviť / zdieľať
	router.replace({
		query: {
			dateFrom: val.dateFrom,
			lenDays: val.lenDays,
			...(val.altYear ? { altYear: val.altYear } : {}),
		}
	})
}

const imglink = computed(() => {
	return MainService.getBaseUrl() + "chart/sensorchart/"
				 + props.id + "?dateFrom=" + chartParams.value.dateFrom + 
				 "&lenDays=" + chartParams.value.lenDays + 
				 (chartParams.value.altYear ? "&altYear=" + chartParams.value.altYear : "")
})

// Údaje o senzore a zoznam rokov – načítajú sa pri každej zmene id senzora
watch(() => props.id, (id) => {
	chartData.value = null
	if (!(id > 0)) return
	MainService.getChartSensor(id, chartParams.value)
		.then(response => {
			if (response.data.status == 200) {
				chartData.value = response.data
				store.setActualDeviceId(response.data.sensor.device_id, response.data.sensor.id)
			}
		})
		.catch((error) => {
			console.error(error)
		})
}, { immediate: true })

// Odkazy späť – prednostne z načítaného senzora, inak zo store
const backDeviceId = computed(() => chartData.value?.sensor?.device_id ?? store.actual_device_id)
const backSensorId = computed(() => chartData.value?.sensor?.id ?? store.actual_sensor_id ?? (props.id || null))
</script>

<template>
	<div class="col-12">
		<div class="pb-3 pt-3 px-2 d-flex justify-content-between align-items-center">
			<h1>Grafy</h1>
			<div class="btn-group">
				<RouterLink v-if="backDeviceId" :to="'/device/' + backDeviceId" class="btn btn-outline-primary btn-sm">
					Späť na zariadenie
					<i class="ms-2 fa-solid fa-rotate-left"></i>
				</RouterLink>
				<RouterLink v-if="backSensorId" :to="'/sensor/' + backSensorId" class="btn btn-outline-primary btn-sm">
					Späť na senzor
					<i class="ms-2 fa-solid fa-rotate-left"></i>
				</RouterLink>
			</div>
		</div>
		<ChartHeader 
			:id="props.id"
			:mode="props.mode"
			:date-from="chartParams.dateFrom"
			:len-days="chartParams.lenDays"
			:alt-year="chartParams.altYear"
			:years="chartData && chartData.years ? chartData.years : []"
			@update:params="updateParams"
		/>
		<div>
			<img :src="imglink" alt="Graf senzora" class="img-fluid" />
		</div>

	</div>
</template>