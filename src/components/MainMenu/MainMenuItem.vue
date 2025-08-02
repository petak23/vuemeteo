<script setup>
import { RouterLink } from 'vue-router'
const props = defineProps({
	to: {
		type: String,
		required: true,
	},
	faIcon: {
		type: String,
		default: ''
	},
	text: {
		type: String,
		required: true
	}
})
// d-flex align-items-center gap-2
</script>

<template>
	<li class="nav-item">
		<RouterLink 
			class="nav-link"
			:to="props.to"
			active-class="active"
		>
			<i 
				class="fa-solid me-1"
				:class="props.faIcon"
			></i>
			{{ props.text }}
		</RouterLink>
	</li>
</template>


<style lang="scss" scoped>

</style>