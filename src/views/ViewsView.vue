<script setup>
import {ref} from 'vue'
import ViewsList from '../components/Views/ViewsList.vue';
const switchView = ref(false)
</script>

<template>
	<div class="row">
		<div class="col-12">
			<h1>Moje grafy</h1>
			<button class="btn btn-secondary btn-sm me-2" @click="switchView = !switchView">
				<strong>{{ switchView ? 'Jednoduchý' : 'Detailný' }}</strong> výpis grafov
			</button>
			<button class="btn btn-secondary btn-sm" disabled type="button">
				<strong>Nový graf</strong>
			</button>
		</div>
		<div class="col-12">		
			<views-list :simpleView="switchView" />
		</div>
	</div>
</template>