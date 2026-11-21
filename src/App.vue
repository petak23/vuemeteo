<script setup>
import { RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
import MainMenu from './components/MainMenu/MainMenu.vue'
import DarkModeButton from './components/DarkModeButton.vue'
import { watch, onMounted } from 'vue'
import MainService from './services/MainService'

import { useMainStore } from './stores/main'
const store = useMainStore()

const getMySettings = () => {
	MainService.getMySettings()
		.then(response => {
			store.appName = response.data.appName
			store.links = response.data.links
			store.dataRetentionDays = response.data.dataRetentionDays
			store.minYear = response.data.minYear
		})
		.catch((error) => {
			console.error(error)
		})
}

// Zariadenia sa načítajú raz po zistení, kto je prihlásený, a potom pri každom
// prihlásení / odhlásení (zmena id užívateľa). Uloženie profilu (rovnaké id) ich nenačíta znova.
watch(() => [store.user_loaded, store.user?.id], ([loaded]) => {
	if (loaded) store.getDevices()
})

onMounted(() => {
	getMySettings()
	store.ensureUser()
})
</script>

<template>   
	<div class="container-fluid">
		<flash-message />
		<BNavbar
			v-b-color-mode="'dark'"
			toggleable="sm"
			variant="primary"
			class="row bg-primary-subtle p-0 border-bottom border-primary-subtle"
		>
  		<BNavbarBrand to="/">VueMeteo</BNavbarBrand>
  		<BNavbarToggle target="nav-collapse" />
			<BCollapse
				id="nav-collapse"
				is-nav
			>
				<!-- Right aligned nav items -->
				<BNavbarNav class="ms-auto mb-2 mb-lg-0">
					<BNavItem v-if="store.user != null" to="/user/user">
						<i class="fa-solid fa-user me-1"></i>
						{{ store.user.prefix }}
					</BNavItem>
					<BNavItem :to="store.user == null ? '/login' : '/logout'">
						<i class="fa-solid me-1"
							:class="store.user == null ? 'fa-arrow-right-to-bracket' : 'fa-arrow-right-from-bracket'"
						></i>
						{{ store.user == null ? 'Prihlásenie' : 'Odhlásenie' }}
					</BNavItem>
				</BNavbarNav>
			</BCollapse>
		</BNavbar>
		<main class="row"
			:class="store.user != null ? '' : 'justify-content-center'"
		>
			<div v-if="store.user != null"
				class="col-12 col-sm-4 col-lg-3 col-xl-2 overflow-y-auto bg-dark-subtle pb-3 border-end border-dark-subtle">
				<main-menu />
			</div>
			<div class="col-12 col-sm-8 pb-2"
					:class="store.user != null ? 'col-lg-9 col-xl-10' : 'col-md-6 col-lg-8'"
			> 
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
