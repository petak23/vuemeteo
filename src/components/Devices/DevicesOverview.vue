<script setup>
import { onMounted, onUnmounted } from 'vue'
import DeviceOneOverview from './DeviceOneOverview.vue'


import { useMainStore } from '../../stores/main.js'
const store = useMainStore()

let devicesRefreshInterval

onMounted(() => { // Každých 5 minút sa obnovia dáta o zariadeniach, aby sa zobrazovali aktuálne hodnoty senzorov
	devicesRefreshInterval = setInterval(() => store.getDevices(), 5 * 60 * 1000)
})

onUnmounted(() => {
	clearInterval(devicesRefreshInterval)
})
</script>

<template v-if="store.devices != null">
	<div v-for="item in store.devices" :key="item.id" class="col">
		<DeviceOneOverview 
			:device="item" 
			:is_logged_in="store.is_logged_in" 
		/>
	</div>
</template>

<style lang="scss" scoped>

</style>