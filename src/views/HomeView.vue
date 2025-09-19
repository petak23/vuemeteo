<script setup>
import UserOverview from '../components/Homepage/UserOverview.vue';
import Devices_overview from '../components/Devices/DevicesOverview.vue';
</script>

<template>
  <div class="row">
		<div class="col-12">
			<h1>Homepage</h1>
		</div>
		<div class="col-12 row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4">
			<user-overview />
			<devices_overview />
		</div>
  </div>
</template>
