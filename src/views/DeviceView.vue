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
const mode_edit = ref(props.edit ? (props.id > 0 ? 1 : 2) : 0) // 0 = info, 1 = edit, 2 = add new
const viewModalDelete = ref(false)

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

const updateViewAfterEdit = (device = null) => {
	if (device = null) getDevice(props.id)
	else {
		console.log("Updating device view after edit:", device)
		device_one.value = device
		store.actual_device_id = device_one.value.id
		store.actual_sensor_id = null
}
	mode_edit.value = 0
}

watch(() => props.edit, () => {
	if (props.id > 0) getDevice(props.id)
	mode_edit.value = props.edit ? (props.id > 0 ? 1 : 2) : 0;
})

watch(() => props.id, () => {
	if (props.id > 0) getDevice(props.id)
	mode_edit.value = props.edit ? (props.id > 0 ? 1 : 2) : 0;
	//else setError("Chybné id: [" + props.id + "] zariadenia.(1)")
})

watch(() => route.params.id, (newId) => {
	if (newId > 0) getDevice(newId)
	mode_edit.value = props.edit ? (newId > 0 ? 1 : 2) : 0;
	//else setError("Chybné id: [" + newId + "] zariadenia.(3)")
})

onMounted(()=> {
	if (props.id > 0) getDevice(props.id)
	//else if (route.params.id > 0) getDevice(route.params.id) 
	mode_edit.value = props.edit ? (props.id > 0 ? 1 : 2) : 0;
	//else setError("Chybné id: [" + props.id + "] zariadenia.(2)")
})

const h1_text = computed(() => {
	return mode_edit.value == 2 ? 'Pridanie zariadenia' : ((mode_edit.value == 1 ? 'Editácia zariadenia' : 'Info o zariadení') + ":" + (device_one.value != null ? device_one.value.name : ''))
})
</script>

<template>
	<div class="row">
		<div class="col-12 border-bottom" >
			<h1 class="d-flex justify-content-between">
				{{ h1_text }}
				<div class="btn-group" role="group" v-if="props.id > 0 && device_one != null">
					<RouterLink :to="'edit/'+device_one.id" v-if="mode_edit == 0" 
						class="btn btn-outline-secondary border-0 rounded-0" title="Upraviť zariadenie" role="button">
						<i class="fa-solid fa-pen-to-square fa-xl"></i>
					</RouterLink>
					<RouterLink :to="'/device/'+device_one.id" v-else-if="mode_edit == 1"
						class="btn btn-outline-primary border-0 rounded-0" title="Späť na zariadenie" role="button">
						<i class="ms-2 fa-solid fa-rotate-left"></i>
					</RouterLink>
				</div>
			</h1>

		</div>
		<div class="col-12 mt-2 row" v-if="error_message == '' && (device_one != null || mode_edit == 2)">
			<device v-if="mode_edit == 0" :device_item="device_one" />
			<device-edit v-else :default-values="device_one" 
				@update="updateViewAfterEdit"
			/>
		</div>
		
		<div v-else-if="error_message != ''" class="col-10 alert alert-danger mx-auto mt-4" role="alert">
			<i class="fa-solid fa-triangle-exclamation me-2"></i>{{ error_message }}
		</div>
		
		<!-- <div v-else class="col-12 p-5">
			<div class="spinner-border text-secondary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div> -->
		<div class="col-12 border-top mt-1 pt-2">
			<RouterLink to="/devices" class="btn btn-outline-secondary btn-sm" >
				Späť na zoznam zariadení <i class="ms-2 fa-solid fa-rotate-left"></i>
			</RouterLink>
			<RouterLink :to="'/device/'+device_one.id" v-if="mode_edit == 1 && device_one != null"
				class="btn btn-outline-secondary btn-sm" title="Späť na zariadenie" role="button">
				Späť na zariadenie <i class="ms-2 fa-solid fa-rotate-left"></i>
			</RouterLink>
			<button
				@click="viewModalDelete = true" 
				:to="'/device/delete'+device_one.id" v-if="mode_edit == 0 && device_one != null"
				class="ms-4 btn btn-outline-danger btn-sm" title="Odstránenie zariadenia" role="button"
			>
				<i class="fa-solid fa-circle-exclamation me-2"></i> Odstránenie zariadenia 
				<i class="fa-solid fa-trash-can ms-2"></i>
			</button>
		</div>
	</div>
	<BModal
    v-model="viewModalDelete"
    title="Odstránenie zariadenia!"
  >
    Foobar?
  </BModal>
</template>