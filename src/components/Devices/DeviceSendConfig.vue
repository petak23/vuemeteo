<script setup>
/**
 * Formulár na odoslanie zmeny konfigurácie do zariadenia.
 * Uloží config_data a zvýši config_ver (rovnako ako pôvodný IoT-server).
 * Zariadenie si zmenu stiahne pri najbližšom prihlásení.
 */
import { ref, computed } from 'vue'
import MainService from '../../services/MainService'
import { useFlashStore } from '../FlashMessages/store/flash'
const storeF = useFlashStore()

const props = defineProps({
	item: { type: Object, default: null }
})

const emits = defineEmits(['update'])

const MAX_LINE_BYTES = 256
const MAX_TOTAL_BYTES = 512

const config_data = ref('')
const sending = ref(false)
const error_message = ref('')

const byteLength = (str) => new TextEncoder().encode(str).length

const totalBytes = computed(() => byteLength(config_data.value))
const longLines = computed(() =>
	config_data.value.split('\n')
		.map((line, i) => ({ nr: i + 1, bytes: byteLength(line) }))
		.filter(l => l.bytes > MAX_LINE_BYTES)
)
const validConfig = computed(() =>
	config_data.value.trim() !== '' && totalBytes.value <= MAX_TOTAL_BYTES && longLines.value.length === 0
)

const sendConfig = async () => {
	if (!validConfig.value || sending.value || props.item == null) return
	sending.value = true
	error_message.value = ''

	const data = {
		name: props.item.name_no_prefix,	// API vyžaduje meno; ostatné polia sa nemenia
		config_data: config_data.value,
		config_ver: (parseInt(props.item.config_ver) || 0) + 1,
	}

	await MainService.postDeviceEdit(props.item.id, data)
		.then(response => {
			if (response.data.status == 200) {
				config_data.value = ''
				storeF.showMessage('Zmena konfigurácie bola uložená. Zariadenie si ju stiahne pri najbližšom prihlásení.', 'success', 'Konfigurácia', 5000)
				emits('update')
			} else {
				error_message.value = response.data.message || 'Konfiguráciu sa nepodarilo uložiť.'
			}
		})
		.catch(error => {
			console.error(error)
			error_message.value = 'Chyba spojenia alebo server neodpovedá.'
		})
		.finally(() => {
			sending.value = false
		})
}
</script>

<template>
	<div class="pb-1 pt-1 px-2">
		<label for="config_data" class="form-label">Zmena konfigurácie:</label>
		<textarea
			id="config_data"
			v-model="config_data"
			rows="4"
			class="form-control font-monospace"
			:class="config_data === '' ? '' : (validConfig ? 'is-valid' : 'is-invalid')"
			placeholder="MenoPoložky=Obsah"
		></textarea>
		<div class="form-text" :class="totalBytes > MAX_TOTAL_BYTES ? 'text-danger' : ''">
			{{ totalBytes }} z max. {{ MAX_TOTAL_BYTES }} byte
		</div>
		<div v-if="longLines.length" class="text-danger small">
			Príliš dlhé riadky (max. {{ MAX_LINE_BYTES }} byte):
			<span v-for="l in longLines" :key="l.nr" class="me-2">#{{ l.nr }} ({{ l.bytes }} B)</span>
		</div>
		<div v-if="error_message" class="alert alert-danger mt-2 py-2" role="alert">{{ error_message }}</div>
		<BButton class="mt-2" variant="primary" :disabled="!validConfig || sending" @click="sendConfig">
			{{ sending ? 'Odosielam…' : 'Odoslať konfiguráciu' }}
		</BButton>
	</div>

	<div class="pb-1 pt-3 px-2">
		<h5>Pomôcky:</h5>
		<p>
			Zapíšte zmeny konfigurácie vo forme<br/>
			<b>&nbsp;&nbsp;&nbsp;MenoPoložky=Obsah<br/>&nbsp;&nbsp;&nbsp;InáPoložka=InýObsah</b>
		</p>
		<p>
			<strong class="text-danger">
				POZOR: Jeden riadok nesmie byť dlhší ako 256 byte a celá zmena nesmie presiahnuť 512 byte.
			</strong>
		</p>
		<p>
			Štandardné konfiguračné položky:
		</p>
		<ul>
			<li><b>wifi_ssid</b> - Meno (SSID) WiFi siete</li>
			<li><b>$wifi_pass</b> - Heslo k WiFi</li>
			<li><b>ra_url</b> - Adresa serveru (bez http:// na začiatku, takže napr.: moj.server.cz/iot/ra )</li>
			<li><b>ra_dev_name</b> - Meno zariadenia</li>
			<li><b>$ra_pass</b> - Heslo zariadenia</li>
			<li><b>log_ship</b> - 1 = zariadenie má posielať logy na server; 0 = neposielať (funguje len pokiaľ je aplikácia skompilovaná s nastavením LOG_SHIPPING)</li>
			<li><b>@restart=1</b> = vykoná reštart zariadenia</li>
		</ul>
	</div>
</template>
