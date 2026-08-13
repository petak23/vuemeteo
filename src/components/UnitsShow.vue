<script setup>
import { onMounted, ref } from 'vue'
import MainService from '../services/MainService'

import { useFlashStore } from '../components/FlashMessages/store/flash'
const storeF = useFlashStore()

const items = ref(null)
const modal_view_edit = ref(false)
const modal_view_delete = ref(false)
const unit_name = ref("")
const unit_description = ref("")
const active_unit_id = ref(0)

onMounted(()=> {
	getUnits();
}) 

const doEditModal = (id) => {
	modal_view_edit.value = true
	unit_name.value = id > 0 ? items.value[id].unit : ""
	unit_description.value = id > 0 ? items.value[id].description : ""
	active_unit_id.value = id
}
const doDeleteModal = (id) => {
	if (id <= 0) {
		console.error("Invalid unit id for deletion");
		storeF.showMessage('Chybné ID jednotky.', 'danger', 'Chyba', 5000)
		return
	}
	modal_view_delete.value = true
	unit_name.value = items.value[id].unit
	unit_description.value = items.value[id].description
	active_unit_id.value = id
}
const hideModals = () => {
	modal_view_edit.value = false
	modal_view_delete.value = false
	unit_name.value = ""
	unit_description.value = ""
	active_unit_id.value = 0
}

const getUnits = () => {
	MainService.getUnits()
		.then(response => {
			if (response.data.status == 200)
				items.value = response.data.data
		})
		.catch((error) => {
			storeF.showMessage('Nastala chyba pri načítaní jednotiek.', 'danger', 'Chyba', 5000)
			console.error(error);
		});
}
const saveUnit = (id) => {
	MainService.postSaveUnit(id, { unit: unit_name.value, description: unit_description.value })
		.then(response => {
			if (response.data.status == 200 && response.data.data !== undefined) {
				items.value = response.data.data
				hideModals()
				storeF.showMessage('Jednotka bola úspešne uložená.', 'success', 'Uloženie', 5000)
			} else {
				storeF.showMessage('Nastala chyba pri ukladaní jednotky.', 'danger', 'Chyba', 5000)
				console.error(response.data.message)
			}
		})
		.catch((error) => {
			storeF.showMessage('Nastala chyba pri ukladaní jednotky.', 'danger', 'Chyba', 5000)
			console.log(error);
		});
}
const deleteUnit = (id) => {
	MainService.getDeleteUnit(id)
		.then(response => {
			if (response.data.status == 200 && response.data.data !== undefined) {
				items.value = response.data.data
				hideModals()
				storeF.showMessage('Jednotka bola úspešne zmazaná.', 'success', 'Zmazanie', 5000)
			} else {
				storeF.showMessage('Nastala chyba pri mazaní jednotky.', 'danger', 'Chyba', 5000)
				console.error(response.data.message)
			}
		})
		.catch((error) => {
			storeF.showMessage('Nastala chyba pri mazaní jednotky.', 'danger', 'Chyba', 5000)
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
				<th>Popis</th>
				<th>
					<BButton
						variant="outline-secondary"
						size="sm" 
						@click="doEditModal(0)"
					>
						+ Pridaj
					</BButton>
				</th>
			</tr>
			<tr v-for="item in items" :key="item.id">
				<td>{{ item.id }}</td>
				<td>{{ item.unit }}</td>
				<td>{{ item.description }}</td>
				<td>
					<BButton
						variant="link"
						:title="'Edituj jednotku:' + item.unit"
						size="sm"
						@click="doEditModal(item.id)"
					>
						<i class="fa-solid fa-pencil text-warning-emphasis"></i>
					</BButton>
					<BButton
						variant="link"
						:title="'Zmaž jednotku:' + item.unit"
						size="sm" 
						@click="doDeleteModal(item.id)"
					>
						<i class="fa-solid fa-trash text-danger"></i>
					</BButton>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="alert alert-warning" v-else>Žiadne jednotky ešte nie sú zadané.</div>
	<BModal
    v-model="modal_view_edit"
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
			<label for="unit_description" class="me-2">Uprav popis jednotky:</label>
			<input type="text" id="unit_description" v-model="unit_description" />
		</div>
		<template #footer>
			<BButton variant="secondary" @click="hideModals">Zrušiť</BButton>
			<BButton 
				variant="outline-success" 
				@click="saveUnit(active_unit_id)"
			>Uložiť</BButton>
		</template>
	</BModal>
	<BModal
    v-model="modal_view_delete"
		centered
		body-bg-variant="danger"
		body-text-variant="white"
  >
		<template #title>
			Zmazanie jednotky:
		</template>
		<div class="text-center">
			<div class="alert alert-warning" role="alert">
				<b>Upozornenie:</b>
				Naozaj chcete zmazať jednotku?
			</div>
		</div>
		<template #footer>
			<BButton variant="secondary" @click="hideModals">Zrušiť</BButton>
			<BButton 
				variant="outline-danger" 
				@click="deleteUnit(active_unit_id)"
			>Zmazať</BButton>
		</template>
	</BModal>
</template>


<style lang="scss" scoped>
	.table{
		max-width: 30rem;
	}
</style>