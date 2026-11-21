<script setup>
import { onMounted } from 'vue'
import LogInForm from '../components/LogInForm.vue'
import { useMainStore } from '../stores/main'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()

const props = defineProps({
	logOut: {
		type: Boolean,
		default: false,
	}
})

// Už prihláseného užívateľa presmeruj z prihlasovacej stránky na Homepage.
// Pri odhlásení presmerovanie rieši LogInForm až po dokončení odhlásenia.
// Po úspešnom prihlásení presmerúva LogInForm.
onMounted(async () => {
	if (props.logOut) return
	await store.ensureUser()
	if (store.is_logged_in) router.replace('/')
})
</script>

<template>
	<div class="row">
		<div class="col-12 w-100">
			<h1 class="mt-4">
				<i class="fa-solid me-2" :class="!props.logOut ? 'fa-sign-in-alt' : 'fa-arrow-right-from-bracket'"></i>
				{{ props.logOut ? 'Odhlásenie' : 'Prihlásenie' }}
			</h1>
			<LogInForm 
				class="mt-4 mb-5"
				:log-out="props.logOut"
			/>
		</div>
	</div>
</template>
