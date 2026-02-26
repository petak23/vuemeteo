<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import SensorInfo from '../components/Sensor/SensorInfo.vue'
import SensorStat from '../components/Sensor/SensorStat.vue'
import SensorEdit from '../components/Sensor/SensorEdit.vue'
import MainService from '../services/MainService'

import { useRoute } from 'vue-router'
const route = useRoute()

import { useMainStore } from '../stores/main'
const store = useMainStore()

const props = defineProps({
	id: { type: Number, default: 0 },
	edit: { type: Boolean, default: false},
	mode: { type: String, default: 'view' }
})

//const h1_text = ref('Informácie')
const sensor_one = ref(null)
const error_message = ref("")

const setError = (message) => {
	error_message.value = message
	console.error(error_message.value)
}

const  getSensor = async (id) => {
	await MainService.getSensor(id)
		.then(response => {
			if (response.data.status == 200) {
				sensor_one.value = response.data
				store.setActualDeviceId(sensor_one.value.device_id, sensor_one.value.id)
			}
			else {
				setError(response.data.message)
				device_one.value = null
			}
		})
		.catch((error) => {
			setError(error)
			console.error(error)
		})
}

watch(() => props.id, () => {
	if (props.id > 0) getSensor(props.id)
	//else setError("Chybné id: [" + props.id + "] senzoru.(1)")
})

watch(() => route.params.id, (newId) => {
	if (newId > 0) getSensor(newId)
	else setError("Chybné id: [" + newId + "] senzoru.(3)")
})

const h1_text = computed(() => {
	return props.mode == 'stat' ? "Štatistika" : "Informácie" 
})

onMounted(()=> {
	if (props.id > 0) getSensor(props.id)
	else if (route.params.id > 0) getSensor(route.params.id) 
	else setError("Chybné id: [" + props.id + "] senzoru.(2)")
})
</script>

<template>

<div class="col-12" v-if="sensor_one != null">
	<div class="pb-3 pt-3 px-2">
		<h1>Senzor {{ sensor_one.dev_name }}:{{ sensor_one.name }} - <small>{{ h1_text }}</small></h1>
	</div>

	<sensor-info 
		:sensor="sensor_one" 
		v-if="props.mode == 'view'"
	/>
	<sensor-stat 
		:sensor_one="sensor_one" 
		v-else-if="props.mode == 'stat'"
	/>
	<sensor-edit 
		:sensor="sensor_one" 
		v-else-if="props.mode == 'edit'"
		@save="getSensor(props.id)"
	/>
	
</div>
</template>

<style lang="scss" scoped>

</style>