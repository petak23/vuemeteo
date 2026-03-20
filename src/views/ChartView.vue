<script setup>
import { ref } from 'vue';
import ChartHeader from '../components/Chart/ChartHeader.vue';
const props = defineProps({
	id: { type: Number, default: 0 },
	mode: { type: String, default: 'sensor' }
})
const chartParams = ref({
	current: 'now',
})

const updateCurrent = (val) => {
	chartParams.value.current = val
}

</script>

<template>
	<div class="col-12">
		<div class="pb-3 pt-3 px-2">
			<h1>Grafy</h1>
		</div>
		<ChartHeader :id="props.id" :mode="props.mode" 
			@update:current="updateCurrent"/>
		<div class="text-bg-warning">{{ chartParams.current }}</div>
		<div class="alert alert-info" role="alert">
			V tejto sekcii sa nachádzajú grafy pre jednotlivé senzory. 
			Kliknutím na dátum v tabuľke sa zobrazí graf pre daný deň.
		</div>
	</div>
</template>