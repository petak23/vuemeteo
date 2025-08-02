<script setup>
import MainMenuItem from './MainMenuItem.vue'

import { useMainStore } from '../../stores/main'
const store = useMainStore()

</script>

<template>
	<ul class="nav nav-underline flex-column">
		<main-menu-item
			to="/"
			fa-icon="fa-house-chimney"
			text="Domov" />
		<main-menu-item
			to="/units"
			fa-icon="fa-thermometer"
			text="Jednotky" />
		<main-menu-item
			v-if="store.user != null"
			to="/user"
			fa-icon="fa-user"
			text="Užívateľ" />
		<main-menu-item
			v-if="store.user != null"
			to="/devices"
			fa-icon="fa-walkie-talkie"
			text="Zariadenia" />
		<hr />

		<main-menu-item
			:to="store.user == null ? '/login' : '/logout'"
			:fa-icon="store.user == null ? 'fa-arrow-right-to-bracket' : 'fa-arrow-right-from-bracket'"
			:text="store.user == null ? 'Prihlásenie' : 'Odhlásenie'" />
	</ul>
</template>

<style lang="scss" scoped>

</style>