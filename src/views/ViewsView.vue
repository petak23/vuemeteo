<script setup>
import { ref, onMounted } from 'vue'
import ViewsSimpleList from '../components/Views/ViewsSimpleList.vue';
import ViewsDetailList from '../components/Views/ViewsDetailList.vue';
import MainService from '../services/MainService.js'

const switchView = ref(false)
const views = ref(null)

onMounted(() => {
	MainService.getViews()
	.then(response => {
		console.log(response.data);
		if (response.data.status == 200)
			views.value = response.data.data
	})
	.catch((error) => {
		console.log(error);
	});
})


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
			<div class="row">
				<div class="col-12" v-if="views == null">
					<div  class="text-center my-5">
						<div class="spinner-border text-primary" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>
				</div>
				<div class="col-12" v-else>
					<views-simple-list v-if="!switchView" :views="views" />
					<views-detail-list v-else :views="views" />
				</div>
			</div>
		</div>
	</div>
</template>