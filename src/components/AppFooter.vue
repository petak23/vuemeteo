<script setup>
import { useMainStore } from "../stores/main"
const store = useMainStore()

</script>

<template>
	<small>
		<a v-for="(li, index) in store.links" :key="index" :href="li.link" target="_blank" class="me-2">
			{{ li.name }}
		</a>
		|&nbsp;Project s
		<a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
		<a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
	</small>
</template>

<style scoped>
small {
	font-size: 80%;
}
</style>
