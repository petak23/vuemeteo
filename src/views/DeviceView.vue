<script setup>
import { ref, watch, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import MainService from '../services/MainService'
import Device from '../components/Devices/DeviceOneInfo.vue'
import DeviceEdit from '../components/Devices/Device_edit.vue'

import { useMainStore } from '../stores/main'
const store = useMainStore()

import { useFlashStore } from '../components/FlashMessages/store/flash'
const storeF = useFlashStore()

const router = useRouter()

const props = defineProps({
	id: { type: Number, default: 0 },
	edit: { type: Boolean, default: false },
})

const device_one = ref(null)
const error_message = ref("")
const viewModalDelete = ref(false)
const deleting = ref(false)

// 0 = info, 1 = edit, 2 = add new – odvodené z URL (props), nie samostatný stav
const mode_edit = computed(() => props.edit ? (props.id > 0 ? 1 : 2) : 0)

const setError = (message) => {
	error_message.value = String(message)
	console.error(error_message.value)
}

const getDevice = async (id) => {
	error_message.value = ""
	await MainService.getDevice(id)
		.then(response => {
			if (response.data.status == 200) {
				device_one.value = response.data.data
				store.setActualDeviceId(device_one.value.id)
			}
			else {
				setError(response.data.message)
				device_one.value = null
				store.resetActualDeviceId()
			}
		})
		.catch((error) => {
			setError(error)
		})
}

// Jediný watcher: pri zmene id alebo režimu (a hneď pri vytvorení) načítaj zariadenie
watch(() => [props.id, props.edit], () => {
	if (props.id > 0) {
		getDevice(props.id)
	} else {
		device_one.value = null
		error_message.value = ""
		store.resetActualDeviceId()
	}
}, { immediate: true })

/** Po uložení formulára: obnov zoznam zariadení (menu) a prejdi na detail zariadenia */
const updateViewAfterEdit = (device = null) => {
	store.getDevices()
	const id = props.id > 0 ? props.id : device?.id
	if (id) router.push('/device/' + id)
	else router.push('/devices')
}

const deleteDevice = async () => {
	if (device_one.value == null || deleting.value) return
	deleting.value = true
	await MainService.postDeviceDelete(device_one.value.id)
		.then(response => {
			if (response.data.status == 200) {
				viewModalDelete.value = false
				storeF.showMessage(response.data.message || 'Zariadenie bolo odstránené.', 'success', 'Odstránenie', 5000)
				store.resetActualDeviceId()
				store.getDevices()
				router.push('/devices')
			} else {
				storeF.showMessage('Zariadenie sa nepodarilo odstrániť: ' + (response.data.message || 'neznáma chyba'), 'danger', 'Chyba', 5000)
			}
		})
		.catch((error) => {
			console.error(error)
			storeF.showMessage('Zariadenie sa nepodarilo odstrániť: ' + (error.message || 'neznáma chyba'), 'danger', 'Chyba', 5000)
		})
		.finally(() => {
			deleting.value = false
		})
}

const h1_text = computed(() => {
	return mode_edit.value == 2 ? 'Pridanie zariadenia' : ((mode_edit.value == 1 ? 'Editácia zariadenia' : 'Info o zariadení') + ": " + (device_one.value != null ? device_one.value.name : ''))
})
</script>

<template>
	<div class="row">
		<div class="col-12 border-bottom" >
			<h1 class="d-flex justify-content-between">
				{{ h1_text }}
				<div class="btn-group" role="group" v-if="props.id > 0 && device_one != null">
					<RouterLink :to="'/device/edit/' + device_one.id" v-if="mode_edit == 0" 
						class="btn btn-outline-secondary border-0 rounded-0" title="Upraviť zariadenie" role="button">
						<i class="fa-solid fa-pen-to-square fa-xl"></i>
					</RouterLink>
					<RouterLink :to="'/device/' + device_one.id" v-else-if="mode_edit == 1"
						class="btn btn-outline-primary border-0 rounded-0" title="Späť na zariadenie" role="button">
						<i class="ms-2 fa-solid fa-rotate-left"></i>
					</RouterLink>
				</div>
			</h1>

		</div>
		<div class="col-12 mt-2 row" v-if="error_message == '' && (device_one != null || mode_edit == 2)">
			<device v-if="mode_edit == 0" :device_item="device_one" @update="getDevice(props.id)"/>
			<device-edit v-else :key="device_one?.id ?? 0" :default-values="device_one" 
				@update="updateViewAfterEdit"
			/>
		</div>
		
		<div v-else-if="error_message != ''" class="col-10 alert alert-danger mx-auto mt-4" role="alert">
			<i class="fa-solid fa-triangle-exclamation me-2"></i>{{ error_message }}
		</div>
		
		<div class="col-12 border-top mt-1 pt-2">
			<RouterLink to="/devices" class="btn btn-outline-secondary btn-sm" >
				Späť na zoznam zariadení <i class="ms-2 fa-solid fa-rotate-left"></i>
			</RouterLink>
			<RouterLink :to="'/device/' + device_one.id" v-if="mode_edit == 1 && device_one != null"
				class="btn btn-outline-secondary btn-sm" title="Späť na zariadenie" role="button">
				Späť na zariadenie <i class="ms-2 fa-solid fa-rotate-left"></i>
			</RouterLink>
			<button
				type="button"
				@click="viewModalDelete = true" 
				v-if="mode_edit == 0 && device_one != null"
				class="ms-4 btn btn-outline-danger btn-sm" title="Odstránenie zariadenia"
			>
				<i class="fa-solid fa-circle-exclamation me-2"></i> Odstránenie zariadenia 
				<i class="fa-solid fa-trash-can ms-2"></i>
			</button>
		</div>
	</div>
	<BModal
		v-model="viewModalDelete"
		title="Odstránenie zariadenia!"
		centered
		body-bg-variant="danger"
		body-text-variant="white"
	>
		<div class="text-center" v-if="device_one != null">
			Naozaj chcete odstrániť zariadenie <b>{{ device_one.name }}</b>?<br />
			<b>Budú vymazané aj všetky jeho senzory a namerané dáta.</b> Po vymazaní sa už nedá obnoviť.
		</div>
		<template #footer>
			<BButton variant="secondary" @click="viewModalDelete = false">Zrušiť</BButton>
			<BButton variant="danger" :disabled="deleting" @click="deleteDevice">Odstrániť</BButton>
		</template>
	</BModal>
</template>
