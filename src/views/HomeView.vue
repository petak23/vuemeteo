<script setup>
import { ref } from "vue"
import UserOverview from '../components/Homepage/UserOverview.vue'
import Devices_overview from '../components/Devices/DevicesOverview.vue'

const error = ref(null)
</script>

<template>
  <div class="row">
		<div class="col-12">
			<h1>Homepage</h1>
		</div>
		<div class="col-12 row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4">
			<user-overview />
			<devices_overview 
				@error="error = $event"
			/>			
		</div>
		<div class="col-12 mb-4 border-bottom">
			<p>Meteorologická búdka - PV</p>
		</div>
		<div v-if="error != null" class="col-12 alert alert-warning ms-2 mt-2" role="alert">
			<h5 class="alert-heading">Chyba: {{ error.status }}</h5>
			<p>{{ error.message }}</p>
		</div>
  </div>
</template>
