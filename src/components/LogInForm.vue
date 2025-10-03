<script setup>
import { watch, ref, onMounted } from 'vue'
import MainService from '../services/MainService';
import { useMainStore } from '../stores/main'
const store = useMainStore()

import { useFlashStore } from './FlashMessages/store/flash'
const storeF = useFlashStore()


import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
	logOut: {
		type: Boolean,
		default: false,
	}
})

//const visible = ref(false)
const email = ref("")
const password = ref("")
const form = ref(false)
const loading = ref(false)
const visible_form = ref(true)

const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const state_email = ref(null)
watch(() => email.value, () => {
	state_email.value = pattern.test(email.value)
})
const state_password = ref(null)
watch(() => password.value, () => {
	state_password.value = password.value.length > 3
})
/*const rules = {
	required: value => !!value || 'Pole musíte vyplniť!',
	counter: value => value.length <= 20 || 'Max 20 characters',
	count_password: value => value.length > 3 || 'Heslo muí mať viac ako 3 znaky.',
	email: value => {
		const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return pattern.test(value) || 'Chybný e-mail.'
	}
}*/

function submit_form() {
	if (!email.value && !password.value) return
	//if (!form.value) return
	loading.value = true

	MainService.postLogIn({ email: email.value, password: password.value })
	.then(response => {
		//console.log(response.data);
		store.token = response.data.token
		store.user = response.data.user
		visible_form.value = false
		email.value = ""
		password.value = ""
		// Optionally, redirect to another page or update UI
		loading.value = false
		storeF.showMessage('Úspešne ste sa prihlásili.', 'success', 'Prihlásenie', 5000)
		router.push('/') // Presmerovanie...
	})
	.catch(error => {
		console.error('Login failed:', error);
	});

	setTimeout(() => (loading.value = false), 2000)
}

onMounted(() => {
	if (props.logOut) {
		MainService.getLogOut()
		.then(response => {
			console.log(response.data);
			store.token = null
			store.user = null
			// Optionally, redirect to another page or update UI
			storeF.showMessage('Boli ste odhlásený.', 'secondary', 'Odhlásenie', 5000)
		})
		.catch(error => {
			console.error('Logout failed:', error);
		});
	}
})
</script>

<template>
	<div>
		<BForm
			v-model="form"
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