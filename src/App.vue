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
		<header class="row bg-primary-subtle p-0 border-bottom border-primary-subtle">
			<RouterLink class="col-12 m-2 text-light-emphasis" to="/">
				VueMeteo {{ (store.user == null ? '' : (' - ' + store.user.prefix)) }}
			</RouterLink>
		</header>
		<main class="row">
			<div class="col-12 col-sm-4 col-md-3 col-lg-2 overflow-y-auto bg-dark-subtle pb-3 border-end border-dark-subtle">
				<main-menu />
			</div>
			<div class="col-12 col-sm-8 col-md-9 col-lg-10 d-flex justify-content-between pb-2"> 
				<RouterView />
			</div>
		</main>
		<footer class="row bg-black bg-gradient border-top border-warning-subtle text-secondary text-end pe-3">
			<app-footer class="col-12 m-2"/>
		</footer> 
	</div>   
	<dark-mode-button />
</template>

<style scoped>

</style>
