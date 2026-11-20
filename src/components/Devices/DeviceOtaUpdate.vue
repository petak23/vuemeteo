<script setup>
import { ref } from 'vue'
import DeviceSendUpdate from './DeviceSendUpdate.vue'
import MainService from '../../services/MainService'

import { useFlashStore } from '../FlashMessages/store/flash'
const storeF = useFlashStore()

const props = defineProps({
	item: {
		type: Object,
		default: null
	}
})

const emits = defineEmits(['update'])
const viewUpdateModal = ref(false)
const updateForm = ref(null)
const viewDeleteModal = ref(false)
const deleteId = ref(0)

async function sendUpdate() {
	const sent = await updateForm.value?.submit()
	if (sent) viewUpdateModal.value = false
}

const handleUpdate = () => {
	emits('update')
}

const viewModalDeleteData = (id) => {
	viewDeleteModal.value = id > 0
	deleteId.value = id
}

const sendDelete = async () => {
	if (deleteId == 0) return false
	viewDeleteModal.value = false
	console.log(deleteId)
	const data = new FormData()
  data.append('delete', true)
  data.append('update_id', deleteId.value)

  await MainService.postDeviceUpdate(props.item.id, data)
	.then(response => {
		const data = response.data
		if (data.status === 200) {
			emits('update')
			deleteId.value = 0
			storeF.showMessage('Aktualizácia bola vymazaná.', 'success', 'Uloženie', 5000)
		} else {
			storeF.showMessage('Nastala chyba pri mazaní aktualizácie. ' + (data.message || ''), 'danger', 'Chyba', 5000)
			emits('update')
		}
	})
	.catch(error => {
		storeF.showMessage('Nastala chyba pri mazaní aktualizácie. ' + (error.message || 'Neznáma chyba'), 'danger', 'Chyba', 5000)
		emits('update')
	})

  return true
	
}
</script>

<template>
	<h3 class="border-top pt-2 mt-1 d-flex justify-content-between">
		OTA aktualizácia aplikácie
		<BButton
			@click="viewUpdateModal = true" title="Poslať OTA aktualizáciu aplikácie"
			variant="outline-primary"
			class="btn-sm me-1"
		>
			<i class="fa-solid fa-cloud-arrow-down"></i><span class="d-none d-sm-inline ms-2">Poslať OTA aktualizáciu aplikácie</span>
		</BButton>
	</h3>

	<div class="col-12" v-if="props.item.updates">
		<div class="row text-secondary">
			<div class="col col-md-1">ID</div>
			<div class="col-4 col-md-2">Z verzie</div>
			<div class="col-4 col-md-2">Nahrané</div>
			<div class="col-4 col-md-2">Stiahnuté</div>
			<div class="col-4 col-md-2">Súbor</div>
			<div class="col col-md-1">&nbsp;</div>
		</div>
		<div
			v-for="(upd, index) in props.item.updates"
			:key="upd.id"
			class="row"
			:class="index % 2 ? 'bg-light-subtle' : 'bg-secondary-subtle'"
		>
			<div class="col col-md-1">{{ upd.id }}</div>
			<div class="col-4 col-md-2">{{ upd.fromVersion }}</div>
			<div class="col-4 col-md-2">{{ upd.inserted }}</div>
			<div class="col-4 col-md-2">{{ upd.downloaded }}</div>
			<div class="col-4 col-md-2">{{ upd.filename }}</div>
			<div class="col col-md-1">
				<BButton @click="viewModalDeleteData(upd.id)" :title="'Vymazanie aktualizácie: ' + upd.id" variant="link">
					<i class="fa-solid fa-trash text-danger-emphasis"></i>
				</BButton>
			</div>
		</div>
	</div>

	<div class="col-12" v-else>Aktualizácie ešte neexistujú.</div>

	<BModal
		v-model="viewUpdateModal"
		:title="'Poslať update pre zariadenie ' + props.item.name"
		centered
		class="modal-xl"
	>
		<device-send-update :id_device="props.item.id" ref="updateForm" @update="handleUpdate" />

		<template #footer>
			<BButton variant="secondary" @click="viewUpdateModal = false">
				Zrušiť
			</BButton>
			<BButton variant="primary" @click="sendUpdate">
				Odoslať
			</BButton>
		</template>
	</BModal>

	<BModal
		v-model="viewDeleteModal"
		:title="'Vymazať update s id: ' + deleteId"
		centered
		class="modal-md"
		variant="danger"
	>
		Naozaj chcete zmazať update s id:<br />
		<strong>{{ deleteId }}</strong>

		<template #footer>
			<BButton variant="secondary" @click="viewModalDeleteData(0)">
				Zrušiť
			</BButton>
			<BButton variant="danger" @click="sendDelete">
				Zmazať
			</BButton>
		</template>
	</BModal>
</template>

<style lang="scss" scoped>

</style>