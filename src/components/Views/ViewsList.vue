<script setup>
import {ref} from 'vue'

const props = defineProps({
	simpleView: {
		type: Boolean,
		default: false
	}
})
</script>

<template>
	<div class="row">
		<div class="col-12">		
			Tu bude {{ !simpleView ? 'Jednoduchý' : 'Detailný' }} výpis grafov používateľa
		</div>
	</div>
</template>