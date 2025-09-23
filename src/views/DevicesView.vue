<script setup>
import { ref } from "vue"
import DevicesInfo from '../components/Devices/DevicesInfo.vue'

const error = ref(null)
</script>

<template>
	<div class="row">
		<div class="col-12">
			<h1>Zariadenia:</h1>
		</div>
		<div class="col-12">
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