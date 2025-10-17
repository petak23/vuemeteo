<script setup>
import { ref, computed } from 'vue'
import MainService from '../../services/MainService'

import { useMainStore } from '../../stores/main'
const store = useMainStore()

import { useFlashStore } from '../../components/FlashMessages/store/flash'
const storeF = useFlashStore()

import { useRouter } from 'vue-router'
const router = useRouter()

const form = ref({
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
})

const passwordRules = password =>
	password.length >= 8 &&
	/[A-Z]/.test(password) &&
	/[a-z]/.test(password) &&
	/\d/.test(password)

const newPasswordState = computed(() =>
	form.value.newPassword === ''
		? null
		: passwordRules(form.value.newPassword)
)

const confirmPasswordState = computed(() =>
	form.value.confirmPassword === ''
		? null
		: form.value.newPassword === form.value.confirmPassword
)

const formValid = computed(() =>
	form.value.oldPassword &&
	passwordRules(form.value.newPassword) &&
	form.value.newPassword === form.value.confirmPassword
)

const onSubmit = async () => {
	await MainService.postChangePassword(store.user.id, {
		oldPassword: form.value.oldPassword,
		newPassword: form.value.newPassword
	})
		.then(response => {
			if (response.data.status == 200) {
				store.user = response.data.data
				storeF.showMessage('Údaje boli úspešne zmenené.', 'success', 'OK', 5000)
				router.push('/user')
			}
		})
		.catch((error) => {
			console.log(error)
			storeF.showMessage('Chyba pri zmene údajov: ' + error, 'danger', 'Error', 5000)
		})
	alert('Heslo úspešne zmenené!')
	form.value.oldPassword = ''
	form.value.newPassword = ''
	form.value.confirmPassword = ''
}

const onReset = () => {
	form.value.oldPassword = ''
	form.value.newPassword = ''
	form.value.confirmPassword = ''
	router.push('/user/user')
}
</script>

<template>
	<b-card title="Zmena hesla" class="mx-auto" style="max-width: 400px;">
		<b-form @submit.prevent="onSubmit" @reset="onReset" >
			<b-form-group label="Staré heslo" label-for="oldPassword">
				<b-form-input
					id="oldPassword"
					type="password"
					v-model="form.oldPassword"
					required
					autocomplete="current-password"
				/>
			</b-form-group>

			<b-form-group label="Nové heslo" label-for="newPassword">
				<b-form-input
					id="newPassword"
					type="password"
					v-model="form.newPassword"
					:state="newPasswordState"
					required
					autocomplete="new-password"
				/>
				<b-form-invalid-feedback v-if="newPasswordState === false">
					Heslo musí mať aspoň 8 znakov, obsahovať veľké a malé písmeno a číslo.
				</b-form-invalid-feedback>
			</b-form-group>

			<b-form-group label="Nové heslo znova" label-for="confirmPassword">
				<b-form-input
					id="confirmPassword"
					type="password"
					v-model="form.confirmPassword"
					:state="confirmPasswordState"
					required
					autocomplete="new-password"
				/>
				<b-form-invalid-feedback v-if="confirmPasswordState === false">
					Heslá sa nezhodujú.
				</b-form-invalid-feedback>
			</b-form-group>

			<b-button class="mt-2" type="submit" variant="primary" :disabled="!formValid">Zmeniť heslo</b-button>
			<b-button type="reset" variant="outline-secondary" class="ms-2 mt-2"><i class="fa-solid fa-rotate-left me-1"></i>Späť bez zmeny</b-button>
		</b-form>
	</b-card>
</template>