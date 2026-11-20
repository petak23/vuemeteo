<script setup>
import { ref } from 'vue'
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

const handleFileChange = (event) => {
	const selectedFile = event.target.files && event.target.files[0]
	form.value.file = selectedFile || null
}

const emits = defineEmits(['update'])

async function submit() {
  if (!form.value.file) return false

  const data = new FormData()
  data.append('fromVersion', form.value.fromVersion)
  data.append('file', form.value.file)

  await MainService.postDeviceUpdate(props.id_device, data)
	.then(response => {
		const data = response.data
		if (data.status === 200) {
			emits('update')
			form.value.fromVersion = ''
			form.value.file = null
			storeF.showMessage('Aktualizácia bola úspešne uložená.', 'success', 'Uloženie', 5000)
		} else {
			storeF.showMessage('Nastala chyba pri odosielaní aktualizácie. ' + (data.message || ''), 'danger', 'Chyba', 5000)
			emits('update')
		}
	})
	.catch(error => {
		storeF.showMessage('Nastala chyba pri odosielaní aktualizácie. ' + (error.message || 'Neznáma chyba'), 'danger', 'Chyba', 5000)
		emits('update')
	})

  return true
}

defineExpose({ submit })
</script>

<template>
<div class="pb-1 pt-1 px-2">
	<div class="mb-3">
    <label for="inputFromVersion" class="form-label">ID verzie aplikácie, z ktorej sa aktualizuje:</label>
    <input type="text" class="form-control" id="inputFromVersion" aria-describedby="FromVersionHelp" v-model="form.fromVersion">
    <div id="fromVersion" class="form-text">
			Len písmena, čísla a znaky .-_
			<br/>ID aktuálnej verzie aplikácie; je uvedené v hranatých zátvorkách na začiatku mena aplikácie.
		</div>
  </div>
	<div class="mb-3">
		<BFormFile v-model="form.file" label="Súbor s aktualizáciou:" @change="handleFileChange" />
		<div id="fileHelp" class="form-text">
			Súbor s aktualizáciou aplikácie, ktorý sa má poslať do zariadenia.<br />
			Platí len pre zariadenia, ktoré majú povolené OTA aktualizácie aplikácie.<br />
			Platná prípona súboru: .bin
		</div>
		<div class="mt-3">
			Files: <strong>{{ form.file?.name || 'Nie je vybratý žiadny súbor' }}</strong>
		</div>
    
  </div>
	
</div>
</template>

<style lang="scss" scoped>

</style>