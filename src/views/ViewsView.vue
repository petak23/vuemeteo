<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ViewsSimpleList from '../components/Views/ViewsSimpleList.vue';
import ViewsDetailList from '../components/Views/ViewsDetailList.vue';
import ViewEditForm from '../components/Views/ViewEditForm.vue';
import MainService from '../services/MainService.js'

const router = useRouter()
const switchView = ref(false)
const views = ref(null)

const props = defineProps({
	id: { type: Number, default: 0 },
	mode: { type: String, default: 'view' }
})

const getViews = () => {
	MainService.getViews()
	.then(response => {
		//console.log(response.data);
		if (response.data.status == 200)
			views.value = response.data.data
	})
	.catch((error) => {
		console.log(error);
	});
}

// views.views je objekt kľúčovaný id grafu (nie pole)
const viewsCount = computed(() => views.value?.views ? Object.keys(views.value.views).length : 0)
const editedView = computed(() => props.id > 0 ? views.value?.views?.[props.id] : undefined)

const onUpdateView = () => {
	getViews()
	router.push('/views')
}

onMounted(() => {
	getViews()
})
</script>

<template>
	<div class="row">
		<div class="col-12" v-if="props.mode === 'view'">
			<h1>
				Moje grafy
				<small class="ms-2">(Aktuálne zobrazený je {{ !switchView ? 'jednoduchý' : 'detailný' }} výpis grafov)</small>
			</h1>
			Prepni na: 
			<button class="btn btn-link m-0 p-0 mb-1" @click="switchView = !switchView">
				<strong>{{ switchView ? 'Jednoduchý' : 'Detailný' }}</strong>
			</button>
			výpis grafov.
			<RouterLink class="btn btn-secondary btn-sm mb-1" to="/view/new" type="button">
				<strong>Nový graf</strong>
			</RouterLink>
		</div>
		<div class="col-12" v-else-if="props.mode === 'edit'">
			<h1>
				{{ props.id === 0 ? 'Pridanie nového grafu' : 'Editácia grafu s ID: ' + props.id }}
			</h1>
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
				<div class="col-12" v-else-if="props.mode === 'view'">
					<views-simple-list v-if="!switchView" :views="views" />
					<views-detail-list v-else :views="views" />
				</div>
				<div class="col-12" v-else-if="props.mode === 'edit' && props.id > 0 && editedView === undefined">
					<div class="alert alert-danger" role="alert">
						Graf s ID {{ props.id }} neexistuje alebo k nemu nemáte prístup.
					</div>
				</div>
				<div class="col-12" v-else-if="props.mode === 'edit'">
					<view-edit-form 
						:view="editedView"
						:id="props.id"
						@update-view="onUpdateView"
						@cancel="router.push('/views')"
					/>
				</div>
				<div class="col-12" v-if="views != null && viewsCount == 0 && props.mode === 'view'">
					<div class="alert alert-warning" role="alert">
						<strong>Upozornenie:</strong> Zatiaľ neexistujú žiadne grafy.
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	h1 > small {
		font-size: 0.5em;
	}
</style>