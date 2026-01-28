<script setup>
import { reactive, computed, toRaw, ref } from 'vue'
import MainService from '../../services/MainService'

const props = defineProps({
	defaultValues: {
		type: Object,
		default: null
	}
})

function generateToken(length = 40) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const id_device = ref(props.defaultValues != null ? props.defaultValues.id : 0)

const form = reactive({
	name: (props.defaultValues != null && props.defaultValues.name_no_prefix) || null,
	passphrase: (props.defaultValues != null && props.defaultValues.passphrase) || null,
	desc: (props.defaultValues != null && props.defaultValues.desc) || null,
	json_token: (props.defaultValues != null && props.defaultValues.json_token) || generateToken(),
	blob_token: (props.defaultValues != null && props.defaultValues.blob_token) || generateToken(),
	monitoring: (props.defaultValues != null && props.defaultValues.monitoring == 1) ? true : false,
})

const validName = computed(() => {
	return form.name == null ? null :	/^[0-9A-Za-z]*$/.test(form.name)
})

const validPassphrase = computed(() => {
	if (form.passphrase == null) return null
	else return form.passphrase.length > 4 && form.passphrase.length <= 15})

const validForm = computed(() => {
	return validName.value && validPassphrase.value
})

const loading = ref(false)
const responseMessage = ref('')
const responseOk = ref(false)

const emits = defineEmits(['update'])

async function handleSubmit() {
	if (!validName.value) {
		responseMessage.value = 'Meno obsahuje nepovolené znaky.'
		responseOk.value = false
		return
	}

	loading.value = true
	responseMessage.value = ''
	responseOk.value = false

	await MainService.postDeviceEdit(id_device.value, toRaw(form))
	.then(response => {
		const data = response.data
		responseOk.value = data.status === 200
		responseMessage.value = data.message || 'Neznáma odpoveď od servera.'
		loading.value = false
		if (responseOk.value) {
			emits('update', response.data.device)
		}
	}).catch(error => {
		console.error(error)
		responseOk.value = false
		if (error.response?.data?.message) {
			responseMessage.value = error.response.data.message
		} else {
			responseMessage.value = 'Chyba spojenia alebo server neodpovedá.'
		}
		loading.value = false
	})
}
</script>

<template>
	<b-form @submit.prevent="handleSubmit">
		<h6 class="pt-1"><strong>Základné údaje:</strong></h6>
		<b-form-group label="Identifikátor(meno):" label-for="name" 
			description="Toto meno doplnené prefixom bude používané pre prihlasovanie zariadenia. (Len znaky 0-9, A-Z, a-z)"
		>
			<b-form-input
				id="name"
				v-model="form.name"
				type="text"
				:state="validName"
				pattern="[0-9A-Za-z]+"
				required
				placeholder="Zadajte meno"
			/>
			<b-form-invalid-feedback>
				Meno môže obsahovať len znaky 0-9, A-Z, a-z.
			</b-form-invalid-feedback>
		</b-form-group>
		<b-form-group label="Komunikačné heslo:" label-for="passphrase"
			description="Dĺžka hesla 4 - 15 znakov."
		>
			<b-form-input
				id="passphrase"
				v-model="form.passphrase"
				type="text"
				:state="validPassphrase"
				required
				placeholder="Zadajte heslo"
			/>
			<b-form-invalid-feedback>
				Dĺžka hesla musí byť v rozmedzí 4 až 15 znakov!
			</b-form-invalid-feedback>
		</b-form-group>
		<b-form-group label="Popis:" label-for="description">
			<b-form-textarea
				id="description"
				v-model="form.desc"
				placeholder="Zadajte popis"
				rows="3"
			/>
		</b-form-group>

		<h6 class="border-top pt-1 mt-3"><strong>Prístup k datám bez prihlásenia:</strong></h6>
		<b-form-group label="Bezpečnostný token pre data:" label-for="jsonToken"
			description="Ak je vyplnený, kdokoľvek so znalosťou správnej adresy sa môže pozrieť na JSON s dátami. Má zmysel len v prípade, že má zariadenie nejaké senzory."
		>
			<b-form-input
				id="jsonToken"
				v-model="form.json_token"
				type="text"
			/>
		</b-form-group>
		<b-form-group label="Bezpečnostný token pre galériu:" label-for="blobToken"
			description="Ak je vyplnený, kdokoľvek so znalosťou správnej adresy sa môže pozrieť na galériu obrázkov. Má zmysel len vtedy, ak zariadenie nahráva obrázky."
		>
			<b-form-input
				id="blobToken"
				v-model="form.blob_token"
				type="text"
			/>
		</b-form-group>

		<h6 class="border-top pt-1 mt-3"><strong>Monitoring:</strong></h6>
		<b-form-group
			description="Pokiaľ zo senzorou zariadenia nebudú chodiť dáta tak často, ako majú, bude poslaná notifikácia."
		>
			<b-form-checkbox v-model="form.monitoring" name="monitoring">
				Zaradiť do funkcie monitoringu
			</b-form-checkbox>
		</b-form-group>

		<div
			v-if="responseMessage"
			class="alert mt-2"
			:class="{ 'alert-success': responseOk, 'alert-danger': !responseOk }"
		>
			{{ responseMessage }}
		</div>

		<b-button type="submit" variant="primary" :disabled="!validForm || loading">
			{{ loading ? 'Odosielam...' : 'Odoslať' }}
		</b-button>
	</b-form>
</template>
