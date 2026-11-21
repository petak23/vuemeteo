<script setup>
/**
 * Prepínač svetlého / tmavého režimu (Bootstrap 5.3 `data-bs-theme` na <html>).
 * Voľba používateľa sa ukladá do localStorage. Kým si používateľ nič nezvolil,
 * režim sa určí podľa času (tmavý od 18:00 do 6:00).
 */
import { ref } from "vue"

const STORAGE_KEY = 'theme'

const getStoredTheme = () => {
	const t = localStorage.getItem(STORAGE_KEY)
	return t === 'dark' || t === 'light' ? t : null
}

const themeByTime = () => {
	const hour = new Date().getHours()
	return hour < 6 || hour >= 18 ? 'dark' : 'light'
}

const applyTheme = (theme) => {
	document.documentElement.setAttribute('data-bs-theme', theme)
}

// Nastaví sa hneď pri vytvorení komponenty (pred vykreslením), aby stránka „neblikla“
const isDarkMode = ref((getStoredTheme() ?? themeByTime()) === 'dark')
applyTheme(isDarkMode.value ? 'dark' : 'light')

const toggleDarkMode = () => {
	isDarkMode.value = !isDarkMode.value
	const theme = isDarkMode.value ? 'dark' : 'light'
	localStorage.setItem(STORAGE_KEY, theme)
	applyTheme(theme)
}
</script>

<template>
	<button class="btn dark-mode-button" @click="toggleDarkMode"
		:class="isDarkMode ? 'btn-light' : 'btn-dark'"
		:title="isDarkMode ? 'Prepni na svetlý mód.' : 'Prepni na tmavý mód.'">
		<i class="fa-solid fa-lg" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
	</button>
</template>

<style scoped>
.dark-mode-button {
	position: fixed;
	bottom: 1rem;
	left: 1rem;
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
}
</style>
