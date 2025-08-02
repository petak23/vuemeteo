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
		<div class="col-12">
			<h1>
				<i class="fa-solid me-2" :class="!props.logOut ? 'fa-sign-in-alt' : 'fa-arrow-right-from-bracket'"></i>
				{{ !props.logOut ? 'Prihlásenie' : 'Odhlásenie' }}</h1>
		</div>
		<div class="col-12">
			<LogInForm :log-out="props.logOut"/>
		</div>
	</div>
</template>
