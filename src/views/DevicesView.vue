<script setup>
import DevicesInfo from '../components/Devices/DevicesInfo.vue'

import { useMainStore } from '../stores/main'
const store = useMainStore()

const props = defineProps({
	edit: { type: Boolean, default: false},
})
</script>

<template>
	<div class="row">
		<div class="col-12 border-bottom d-flex justify-content-between">
			<h1>Zoznam zariadení:</h1>
			<RouterLink to="device/edit/0" v-if="!store.checkUserPermission('devices', 'add')" 
				class="btn btn-outline-secondary btn-sm my-2" title="Pridať zariadenie" role="button">
				<i class="fa-solid fa-pen-to-square fa-xl me-2"></i>Pridanie
			</RouterLink>
		</div>
		<div class="col-12 mt-2">
			<devices-info v-if="store.devices != null"/>
			<div class="alert alert-warning" v-else>
				<b>Zatiaľ neexistuje žiadne zariadenie!</b><br />
				Prosím, pridajte nejaké.
			</div>
		</div>
	</div>
</template>