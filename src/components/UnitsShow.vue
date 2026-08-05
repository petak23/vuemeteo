<script setup>
import { onMounted, ref } from 'vue'
import MainService from '../services/MainService'


const items = ref(null)
const modal_view = ref(false)
const unit_name = ref("")
const active_unit_id = ref(0)

onMounted(()=> {
	getUnits();
}) 

const getUnits = () => {
	MainService.getUnits()
		.then(response => {
			if (response.data.status == 200)
				items.value = response.data.data
		})
		.catch((error) => {
			console.error(error);
		});
}

const doEditModal = (id) => {
	console.log(id)
	modal_view.value = true
	unit_name.value = items.value[id]
	active_unit_id.value = id
}
const hideModals = () => {
	modal_view.value = false
	unit_name.value = ""
	active_unit_id.value = 0
}
const saveUnit = (id) => {
	MainService.postSaveUnit(id, unit_name.value)
		.then(response => {
			if (response.data.status == 200 && response.data.units !== undefined) {
				items.value = response.data.units
				hideModals()
			} else {
				console.error(response.data.message)
			}
		})
		.catch((error) => {
			console.log(error);
		});
}
</script>

<template>
	<table v-if="items != null" class="table">
		<tbody>
			<tr>
				<th>Id</th>
				<th>Meno</th>
				<th><button class="btn btn-outline-secondary btn-sm">+ Pridaj</button></th>
			</tr>
			<tr v-for="(unit, id) in items" :key="id">
				<td>{{ id }}</td>
				<td>{{ unit }}</td>
				<td>
					<BButton
						variant="link"
						:title="'Edituj jednotku:' + unit"
						class="btn-sm text-warning-emphasis" 
						@click="doEditModal(id)"
					>
						<i class="fa-solid fa-pencil"></i>
					</BButton>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="alert alert-warning" v-else>Žiadne jednotky ešte nie sú zadané.</div>
	<BModal
    v-model="modal_view"
		centered
		body-bg-variant="primary"
		body-text-variant="white"
  >
		<template #title>
			Úprava jednotky:
		</template>
		<div class="text-center">
			<div class="alert alert-warning" role="alert">
				<b>Upozornenie:</b>
				Zmena názvu jednotky sa prejaví vo všetkých senzoroch, ktoré ju používajú.
			</div>
			<label for="unit_name" class="me-2">Uprav názov jednotky:</label>
			<input type="text" id="unit_name" v-model="unit_name" />
		</div>
		<template #footer>
			<BButton variant="secondary" @click="hideModals">Zrušiť</BButton>
			<BButton 
				variant="outline-success" 
				@click="saveUnit(active_unit_id)"
			>Uložiť</BButton>
		</template>
	</BModal>
</template>


<style lang="scss" scoped>
	.table{
		max-width: 20rem;
	}
</style>