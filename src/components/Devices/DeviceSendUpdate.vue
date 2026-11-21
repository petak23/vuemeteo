<script setup>
import { ref, computed } from 'vue'
import MainService from '../../services/MainService'

import { useFlashStore } from '../FlashMessages/store/flash'
const storeF = useFlashStore()

const props = defineProps({
	id_device: { type: Number, default: 0 }
})

const form = ref({
	fromVersion: '',
	file: null
})

const emits = defineEmits(['update'])

const VERSION_PATTERN = /^[0-9A-Za-z._-]+$/
const validVersion = computed(() => form.value.fromVersion === '' ? null : VERSION_PATTERN.test(form.value.fromVersion))
const validFile = computed(() => form.value.file == null ? null : /\.bin$/i.test(form.value.file.name))
const error_message = ref('')

/**
 * Odošle aktualizáciu. Vráti true len ak ju server prijal (status 200),
 * aby rodič (DeviceOtaUpdate) zavrel modal iba pri úspechu.
 */
async function submit() {
	error_message.value = ''
	if (!validVersion.value) {
		error_message.value = 'Zadajte platné ID verzie (len písmená, čísla a znaky .-_).'
		return false
	}
	if (!form.value.file) {
		error_message.value = 'Vyberte súbor s aktualizáciou.'
		return false
	}
	if (!validFile.value) {
		error_message.value = 'Súbor musí mať príponu .bin.'
		return false
	}

	const data = new FormData()
	data.append('fromVersion', form.value.fromVersion)
	data.append('file', form.value.file)

	let ok = false
	await MainService.postDeviceUpdate(props.id_device, data)
		.then(response => {
			const data = response.data
			if (data.status === 200) {
				ok = true
				form.value.fromVersion = ''
				form.value.file = null
				storeF.showMessage('Aktualizácia bola úspešne uložená.', 'success', 'Uloženie', 5000)
			} else {
				error_message.value = 'Nastala chyba pri odosielaní aktualizácie. ' + (data.message || '')
			}
		})
		.catch(error => {
			error_message.value = 'Nastala chyba pri odosielaní aktualizácie. ' + (error.message || 'Neznáma chyba')
		})

	emits('update')
	return ok
}

defineExpose({ submit })
</script>

<template>
<div class="pb-1 pt-1 px-2">
	<div class="mb-3">
    <label for="inputFromVersion" class="form-label">ID verzie aplikácie, z ktorej sa aktualizuje:</label>
    <input type="text" class="form-control" id="inputFromVersion" aria-describedby="fromVersionHelp"
			v-model.trim="form.fromVersion"
			:class="validVersion === null ? '' : (validVersion ? 'is-valid' : 'is-invalid')">
    <div id="fromVersionHelp" class="form-text">
			Len písmena, čísla a znaky .-_
			<br/>ID aktuálnej verzie aplikácie; je uvedené v hranatých zátvorkách na začiatku mena aplikácie.
		</div>
  </div>
	<div class="mb-3">
		<BFormFile v-model="form.file" label="Súbor s aktualizáciou:" accept=".bin" :state="validFile" />
		<div id="fileHelp" class="form-text">
			Súbor s aktualizáciou aplikácie, ktorý sa má poslať do zariadenia.<br />
			Platí len pre zariadenia, ktoré majú povolené OTA aktualizácie aplikácie.<br />
			Platná prípona súboru: .bin
		</div>
		<div class="mt-3">
			Súbor: <strong>{{ form.file?.name || 'Nie je vybratý žiadny súbor' }}</strong>
		</div>
		<div v-if="error_message" class="alert alert-danger mt-3 py-2" role="alert">{{ error_message }}</div>
    
  </div>
	
</div>
</template>

<style lang="scss" scoped>

</style>