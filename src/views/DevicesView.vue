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
		<div class="col-12 border-bottom">
			<h1 class="d-flex justify-content-between">
				Zariadenia:
				<div class="btn-group" role="group" >
					<RouterLink to="device/edit/0" v-if="!store.checkUserPermission('devices', 'add')" 
						class="btn btn-outline-secondary border-0 rounded-0" title="Pridať zariadenie" role="button">
						<i class="fa-solid fa-pen-to-square fa-xl"></i>
					</RouterLink>
				</div>
			</h1>
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