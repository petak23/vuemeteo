<script setup>
import { ref, watch, computed } from 'vue'
import SensorInfo from '../components/Sensor/SensorInfo.vue'
import SensorStat from '../components/Sensor/SensorStat.vue'
import SensorEdit from '../components/Sensor/SensorEdit.vue'
import MainService from '../services/MainService'

import { useRouter } from 'vue-router'
const router = useRouter()

import { useMainStore } from '../stores/main'
const store = useMainStore()

const props = defineProps({
	id: { type: Number, default: 0 },
	mode: { type: String, default: 'view' }
})

const sensor_one = ref(null)
const error_message = ref("")

const setError = (message) => {
	error_message.value = String(message)
	console.error(error_message.value)
}

const getSensor = async (id) => {
	error_message.value = ""
	await MainService.getSensor(id)
		.then(response => {
			if (response.data.status == 200) {
				sensor_one.value = response.data.sensor
				// console.log(sensor_one.value)
				store.setActualDeviceId(sensor_one.value.device_id, sensor_one.value.id)
			}
			else {
				setError(response.data.message)
				sensor_one.value = null
			}
		})
		.catch((error) => {
			setError(error)
		})
}

const getSavedSensor = (sensor) => {
	sensor_one.value = sensor

	if (sensor?.id) {
		router.push(`/sensor/${sensor.id}`)
	}
}

// Jediný zdroj id je prop z routera (nie route.params), takže pri odchode
// na inú trasu (napr. /device/3) sa nenačíta senzor so zlým id.
watch(() => props.id, (id) => {
	if (id > 0) getSensor(id)
	else {
		sensor_one.value = null
		setError("Chybné id: [" + id + "] senzoru.")
	}
}, { immediate: true })

const h1_text = computed(() => {
	return props.mode == 'stat' ? "Štatistika" : "Informácie" 
})

</script>

<template>

	<div class="col-12" v-if="sensor_one != null">
		<div class="pb-3 pt-3 px-2">
			<h1>Senzor {{ sensor_one.dev_name }}: <b>{{ sensor_one.name }}</b> - <small>{{ h1_text }}</small></h1>
		</div>

		<sensor-info 
			:sensor="sensor_one" 
			v-if="props.mode == 'view'"
		/>
		<sensor-stat 
			:sensor="sensor_one" 
			v-else-if="props.mode == 'stat'"
		/>
		<sensor-edit 
			:sensor="sensor_one" 
			v-else-if="props.mode == 'edit'"
			@save="getSavedSensor"
			@cancel="router.push('/sensor/' + sensor_one.id)"
			@delete="router.push('/device/' + sensor_one.device_id)"
		/>
		
	</div>
	<div class="col-12" v-else>
		<div class="pb-3 pt-3 px-2">
			<h1>Senzor - <small>{{ h1_text }}</small></h1>
		</div>
		<div class="alert alert-danger" role="alert">
			{{ error_message }}
		</div>
	</div>

</template>

<style lang="scss" scoped>
h1 > small {
	font-size: 70%;
}
</style>