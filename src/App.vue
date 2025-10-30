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
				<!--<BNavbarNav>
					<BNavItem href="#navbar-overview">Link</BNavItem>
					<BNavItem
						href="#navbar-overview"
						disabled
						>Disabled</BNavItem
					>
				</BNavbarNav> -->
				<!-- Right aligned nav items -->
				<BNavbarNav class="ms-auto mb-2 mb-lg-0">
					<BNavItem>
						<RouterLink v-if="store.user != null" class="nav-link text-secondary-emphasis" to="/user/user">
							<i class="fa-solid fa-user me-1"></i>
							{{ store.user.prefix }}
						</RouterLink>
					</BNavItem>
					<BNavItem>
						<RouterLink class="nav-link" :to="store.user == null ? '/login' : '/logout'">
							<i class="fa-solid me-1"
								:class="store.user == null ? 'fa-arrow-right-to-bracket' : 'fa-arrow-right-from-bracket'"
							></i>
							{{ store.user == null ? 'Prihlásenie' : 'Odhlásenie' }}
						</RouterLink>
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
			<div class="col-12 pb-2"
					:class="store.user != null ? 'col-sm-8 col-lg-9 col-xl-10 d-flex justify-content-between' : 'col-sm-8 col-md-6 col-lg-4'"
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
