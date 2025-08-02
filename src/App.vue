<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
import MainMenu from './components/MainMenu/MainMenu.vue'
import DarkModeButton from './components/DarkModeButton.vue'
import MySettings from './components/MySettings.vue'

import { useMainStore } from './stores/main'
const store = useMainStore()
</script>

<template>   
	<div class="container-fluid">
		<flash-message />
		<my-settings />
		<header class="row bg-primary-subtle p-0">
			<RouterLink class="col-12 m-2 text-light-emphasis" to="/">
				VueMeteo {{ (store.user == null ? '' : (' - ' + store.user.prefix)) }}
			</RouterLink>
		</header>
		<main class="row">
			<div class="col-12 col-sm-3 col-xl-2 overflow-y-auto bg-warning-subtle bg-opacity-25 pb-3">
				<main-menu />
			</div>
			<div class="col-12 col-sm-9 col-xl-10 d-flex justify-content-between pb-2"> 
				<RouterView />
			</div>
		</main>
		<footer class="row bg-secondary-subtle">
			<app-footer class="col-12 m-2"/>
		</footer> 
	</div>   
	<dark-mode-button />
</template>

<style scoped>

</style>
