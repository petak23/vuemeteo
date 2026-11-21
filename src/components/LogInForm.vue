<script setup>
import { watch, ref, onMounted } from 'vue'
import MainService from '../services/MainService';
import { useMainStore } from '../stores/main'
const store = useMainStore()

import { useFlashStore } from './FlashMessages/store/flash'
const storeF = useFlashStore()


import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const props = defineProps({
	logOut: {
		type: Boolean,
		default: false,
	}
})

const email = ref("")
const password = ref("")
const loading = ref(false)
const visible_form = ref(!props.logOut)
const error_message = ref("")

const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const state_email = ref(null)
watch(() => email.value, () => {
	state_email.value = pattern.test(email.value)
})
const state_password = ref(null)
watch(() => password.value, () => {
	state_password.value = password.value.length >= 6 // backend vyžaduje min. 6 znakov
})

// Po prihlásení sa vráť na stránku, ktorá prihlásenie vyžadovala (router guard pridá ?redirect=)
const redirectTarget = () => {
	const r = route.query.redirect
	return typeof r === 'string' && r.startsWith('/') && !r.startsWith('//') ? r : '/'
}

const submit_form = async () => {
	if (!email.value || !password.value) return
	loading.value = true
	error_message.value = ""

	await MainService.postLogIn({ email: email.value, password: password.value })
		.then(response => {
			if (response.data.status == 200 && response.data.user != null) {
				store.setUserData(response.data)
				visible_form.value = false
				email.value = ""
				password.value = ""
				storeF.showMessage('Úspešne ste sa prihlásili.', 'success', 'Prihlásenie', 5000)
				router.push(redirectTarget())
			} else {
				error_message.value = response.data.message || 'Prihlásenie sa nepodarilo.'
			}
		})
		.catch(error => {
			console.error('Login failed:', error)
			error_message.value = 'Chyba spojenia alebo server neodpovedá.'
		})
		.finally(() => {
			loading.value = false
		})
}

onMounted(() => {
	if (props.logOut) {
		MainService.postLogOut()
			.then(() => {
				store.setUserData(null)
				storeF.showMessage('Boli ste odhlásený.', 'secondary', 'Odhlásenie', 5000)
			})
			.catch(error => {
				console.error('Logout failed:', error)
				storeF.showMessage('Odhlásenie sa nepodarilo.', 'danger', 'Odhlásenie', 5000)
			})
			.finally(() => {
				router.push('/')
			})
	}
})
</script>

<template>
	<div>
		<div v-if="props.logOut" class="text-secondary">Odhlasujem…</div>
		<BForm
			@submit.prevent="submit_form"
			v-if="visible_form"
		>
			<BFormFloatingLabel
				label="Email address"
				label-for="floatingEmail"
				class="my-2"
			>
				<BFormInput
					id="floatingEmail"
					type="email"
					placeholder="Email address"
					v-model="email"
					:state="state_email"
					required
				/>
			</BFormFloatingLabel>
			<BFormFloatingLabel
				label="Password"
				label-for="floatingPassword"
				class="my-2"
			>
				<BFormInput
					id="floatingPassword"
					type="password"
					placeholder="Password"
					v-model="password"
					required
				/>
			</BFormFloatingLabel>
			<div v-if="error_message" class="alert alert-danger py-2" role="alert">
				{{ error_message }}
			</div>
			<BButton
				type="submit"
				variant="outline-success"
				:disabled="!(state_email && state_password)"
				loading-text="Prihlasujem..."
				:loading="loading"
			>
				Prihlás sa
			</BButton>
		</BForm>
	</div>
</template>