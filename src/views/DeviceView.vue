<script setup>
import { onMounted, ref, watch, computed} from 'vue'
import { RouterLink } from 'vue-router';
import MainService from '../services/MainService'
import Device from '../components/Devices/DeviceOneInfo.vue'
import DeviceEdit from '../components/Devices/Device_edit.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

import { useMainStore } from '../stores/main'
const store = useMainStore()

const props = defineProps({
	id: { type: Number, default: 0 },
	edit: { type: Boolean, default: false},
})

const device_one = ref(null)
const error_message = ref("")

const setError = (message) => {
	error_message.value = message
	//device_one.value = null
	console.error(error_message.value)
}

const  getDevice = async (id) => {
	await MainService.getDevice(id)
		.then(response => {
			if (response.data.status == 200) {
				//console.log(response.data)
				device_one.value = response.data.data
				//console.log(device_one.value);
				store.actual_device_id = device_one.value.id
				store.actual_sensor_id = null
			}
			else {
				setError(response.data.message)
				device_one.value = null
				store.resetActualDeviceId()
			}
		})
		.catch((error) => {
			setError(error)
			console.error(error)
		})
}

watch(() => props.id, () => {
	if (props.id > 0) getDevice(props.id)
	//else setError("Chybné id: [" + props.id + "] zariadenia.(1)")
})

watch(() => route.params.id, (newId) => {
	if (newId > 0) getDevice(newId)
	else setError("Chybné id: [" + newId + "] zariadenia.(3)")
})

onMounted(()=> {
	if (props.id > 0) getDevice(props.id)
	else if (route.params.id > 0) getDevice(route.params.id) 
	else setError("Chybné id: [" + props.id + "] zariadenia.(2)")
})

const h1_text = computed(() => {

	return props.edit ? (props.id > 0 ? 'Editácia' : 'Pridanie') : 'Info' + "zariadenia:" + (props.id > 0 ? device_one.name : '')
})
</script>

<template>
	<div class="row">
		<div class="col-12 border-bottom" v-if="device_one != null">
			<h1
				class="d-flex justify-content-between"
			>
				{{ props.edit ? 'Editácia' : 'Info' }} zariadenia: {{ device_one.name }}
				<div class="btn-group" role="group" >
					<RouterLink :to="'edit/'+device_one.id" v-if="!props.edit" 
						class="btn btn-outline-secondary border-0 rounded-0" title="Upraviť zariadenie" role="button">
						<i class="fa-solid fa-pen-to-square fa-xl"></i>
					</RouterLink>
					<RouterLink :to="'/device/'+device_one.id" v-else
						class="btn btn-outline-primary border-0 rounded-0" title="Späť na zariadenie" role="button">
						<i class="ms-2 fa-solid fa-rotate-left"></i>
					</RouterLink>
				</div>
			</h1>

		</div>
		<div class="col-12 mt-2 row" v-if="error_message == '' && device_one != null">
			<device v-if="!props.edit" :device_item="device_one" />
			<device-edit v-else :default-values="device_one" />
		</div>
		<div v-else-if="error_message != ''" class="row px-2 py-3">
			<div class="col-12 alert alert-danger" role="alert">{{ error_message }}</div>
		</div>
		<div v-else class="col-12 p-5">
			<div class="spinner-border text-secondary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
		<div v-if="device_one != null" class="col-12 border-top mt-1 pt-2">
			<RouterLink to="/devices" class="btn btn-outline-secondary btn-sm" v-if="!props.edit">
				Späť na zoznam zariadení <i class="ms-2 fa-solid fa-rotate-left"></i>
			</RouterLink>
			<RouterLink :to="'/device/'+device_one.id" v-else
				class="btn btn-outline-secondary btn-sm" title="Späť na zariadenie" role="button">
				Späť na zariadenie <i class="ms-2 fa-solid fa-rotate-left"></i>
			</RouterLink>
		</div>
	</div>
</template>