<script setup>
import { computed } from 'vue'
import MainMenuItem from './MainMenuItem.vue'

import { useMainStore } from '../../stores/main'
const store = useMainStore()

const filteredMenu = computed(() =>
  store.main_menu.filter(item =>
	!item.only_logged_in || (item.only_logged_in && store.user != null)
	)
)

</script>

<template>
	<ul class="nav nav-underline flex-column">
		<main-menu-item
			v-for="item in filteredMenu"
			:key="item.to"
			:to="item.to"
			:fa-icon="item.fa_icon"
			:text="item.name"
			:children="item.children"
		 />
		<hr />

		<main-menu-item
			:to="store.user == null ? '/login' : '/logout'"
			:fa-icon="store.user == null ? 'fa-arrow-right-to-bracket' : 'fa-arrow-right-from-bracket'"
			:text="store.user == null ? 'Prihlásenie' : 'Odhlásenie'" />
	</ul>
</template>

<style lang="scss" scoped>

</style>