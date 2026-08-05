<script setup>
import { ref } from "vue"
import DevicesInfo from '../components/Devices/DevicesInfo.vue'

import { useMainStore } from '../stores/main'
const store = useMainStore()

const props = defineProps({
	edit: { type: Boolean, default: false},
})



const error = ref(null)
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
			<devices-info 
				@error="error = $event"	
			/>
			<div v-if="error != null" class="alert alert-danger mt-2" role="alert">
				<h4 class="alert-heading">Chyba: {{ error.status }}</h4>
				<p>{{ error.message }}</p>
			</div>
		</div>
	</div>
</template>