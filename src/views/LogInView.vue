<script setup>
import LogInForm from '../components/LogInForm.vue'
const props = defineProps({
	logOut: {
		type: Boolean,
		default: false,
	}
})
</script>

<template>
	<div class="row">
		<div class="col-12 w-100">
			<h1 class="mt-4">
				<i class="fa-solid me-2" :class="!props.logOut ? 'fa-sign-in-alt' : 'fa-arrow-right-from-bracket'"></i>
				{{ 'Prihlásenie' }}
			</h1>
			<LogInForm 
				class="mt-4 mb-5"
				:log-out="props.logOut"
			/>
		</div>
	</div>
</template>
