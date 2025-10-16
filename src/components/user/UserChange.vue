<script setup>
import { ref, onMounted, watch } from 'vue';
import { useMainStore } from '../../stores/main'
const store = useMainStore()

import MainService from '../../services/MainService'

import { useFlashStore } from '../../components/FlashMessages/store/flash'
const storeF = useFlashStore()

import { useRouter } from 'vue-router'
const router = useRouter()

const email = ref('');
const monitoring_token = ref('');

const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const state_email = ref(null)
watch(() => email.value, () => {
	state_email.value = pattern.test(email.value)
})

onMounted(() => {
	if (store.user) {
		email.value = store.user.email || '';
		monitoring_token.value = store.user.monitoring_token || '';
	}
});

const submitForm = async () => {
	
		await MainService.postSaveUser(store.user.id, { email: email.value, monitoring_token: monitoring_token.value })
		.then(response => {
			if (response.data.status == 200) {
				store.user = response.data.data
				storeF.showMessage('Údaje boli úspešne zmenené.', 'success', 'OK', 5000)
				router.push('/user')
			}
		})
		.catch((error) => {
			console.log(error)
			storeF.showMessage('Chyba pri zmene údajov. ' + error, 'danger', 'Error', 5000)
		})
		

}
const onReset = () => {
	if (store.user) {
		email.value = store.user.email || '';
		monitoring_token.value = store.user.monitoring_token || '';
		router.push('/user')
	}
}
</script>

<template>
	<b-form @submit.prevent="submitForm" @reset="onReset" class="needs-validation" novalidate>
		<b-form-group label="Nový email:" label-for="email" class="mb-3"
			description="Túto e-mailovu adresu použijete pri prihlásení a posielajú sa na ňu notifikácie."
		>
			<b-form-input
				id="email"
				type="email"
				v-model="email"
				:state="state_email"
				required
				placeholder="Zadajte nový email"
			/>
			<BFormInvalidFeedback id="input-live-feedback">Zadajte platný e-mail.</BFormInvalidFeedback>
		</b-form-group>
		<b-form-group label="Bezpečnostný monitoring_token pre výstup monitoringu:" label-for="monitoring_token" 
			class="mb-3"
			description="Tento monitoring_token je potrebný pre prístup k monitoringu cez API. Pokiaľ nie je vyplnený, data nie sú bez autorizácie dostupné."
		>
			<b-form-input
				id="monitoring_token"
				type="text"
				v-model="monitoring_token"
				placeholder="Zadajte nový monitoring_token"
		/>
		</b-form-group>
		<b-button type="submit" variant="primary">Uložiť zmeny</b-button>
		<b-button type="reset" variant="outline-secondary" class="ms-2"><i class="fa-solid fa-rotate-left me-1"></i>Späť bez zmeny</b-button>
	</b-form>
</template>

<style scoped>
</style>
