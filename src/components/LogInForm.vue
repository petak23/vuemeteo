<script setup>
import { ref } from 'vue'
import MainService from '../services/MainService';
import { useMainStore } from '../stores/main'

const visible = ref(false)
const email = ref("")
const password = ref("")
const form = ref(false)
const loading = ref(false)
const visible_form = ref(true)

const store = useMainStore()

const rules = {
	required: value => !!value || 'Pole musíte vyplniť!',
	counter: value => value.length <= 20 || 'Max 20 characters',
	count_password: value => value.length > 3 || 'Heslo muí mať viac ako 3 znaky.',
	email: value => {
		const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return pattern.test(value) || 'Chybný e-mail.'
	}
}

function submit_form() {
	if (!form.value) return
	loading.value = true

	MainService.postLogIn({ email: email, password: password })
	.then(response => {
		store.token = response.data.token
		store.user = response.data.user
		visible_form.value = false
		// Optionally, redirect to another page or update UI
	})
	.catch(error => {
		console.error('Login failed:', error);
	});

	setTimeout(() => (loading.value = false), 2000)
}
</script>

<template>
	<div>
		<!--v-img
			class="mx-auto my-6"
			max-width="228"
			src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
		></v-img-->
	<v-form
		v-model="form"
		@submit.prevent="submit_form"
		v-if="visible_form"
	>
		<v-card
			class="mx-auto pa-12 pb-8"
			elevation="8"
			max-width="448"
			rounded="lg"
		>
			<div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
				Email
			</div>

			<v-text-field
				v-model="email"
				density="compact"
				placeholder="Zadaj svoj email"
				prepend-inner-icon="mdi-email-outline"
				variant="outlined"
				type="email"
				:rules="[rules.required, rules.email]"
			></v-text-field>

			<div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
				Heslo

				<a
					class="text-caption text-decoration-none text-blue"
					href="forgotten_password"
					rel="noopener noreferrer"
					target="_blank"
				>
					Zabudnuté heslo?</a>
			</div>

			<v-text-field
				v-model="password"
				:append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
				:type="visible ? 'text' : 'password'"
				density="compact"
				placeholder="Zadaj svoje heslo"
				prepend-inner-icon="mdi-lock-outline"
				variant="outlined"
				@click:append-inner="visible = !visible"
				:rules="[rules.required, rules.count_password]"
			></v-text-field>

			<v-btn
				block
				class="mb-8"
				color="success"
				size="large"
				variant="elevated"
				:disabled="!form"
				:loading="loading"
				type="submit"
			>
				Prihlás sa...
			</v-btn>

			<!--
			<v-card
				class="mb-12"
				color="surface-variant"
				variant="tonal"
			>
				<v-card-text class="text-medium-emphasis text-caption">
					Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
				</v-card-text>
			</v-card>
			-->
			
		</v-card>
	</v-form>
	</div>
</template>