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
		<header class="row bg-primary-subtle p-0 border-bottom border-primary-subtle d-sm-flex justify-content-sm-between">
			<RouterLink class="col-12 col-sm m-2 text-light-emphasis" to="/">
				VueMeteo
			</RouterLink>
			<div class="col-12 col-sm text-sm-end mt-sm-2 me-3">
				<span class="text-secondary-emphasis me-2">
					<i class="fa-solid fa-user"></i>
					{{ store.user != null ? store.user.prefix : '---' }}
				</span>
			</div>
		</header>
		<main class="row">
			<div class="col-12 col-sm-4 col-lg-3 col-xl-2 overflow-y-auto bg-dark-subtle pb-3 border-end border-dark-subtle">
				<main-menu />
			</div>
			<div class="col-12 col-sm-8 col-lg-9 col-xl-10 d-flex justify-content-between pb-2"> 
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
