<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue';

const order = ref(-1)
</script>

<template>
	<v-layout class="rounded rounded-md">
		<v-navigation-drawer color="grey-darken-2" permanent>
			<v-nav>
				<v-list-item>
					<template v-slot:prepend>
						<i class="fa-solid fa-house-chimney"></i>
					</template>
					<template v-slot:default>
						<RouterLink to="/">&nbsp;Home</RouterLink>
					</template>
				</v-list-item>
				<v-list-item>
					<template v-slot:prepend>
						<i class="fa-solid fa-thermometer"></i>
					</template>
					<template v-slot:default>
						<RouterLink to="/units">&nbsp;Jednotky</RouterLink>
					</template>
				</v-list-item>
				<v-list-item>
					<template v-slot:prepend>
						<i class="fa-solid fa-arrow-right-to-bracket"></i>
					</template>
					<template v-slot:default>
						<RouterLink to="/login">&nbsp;Prihlásenie</RouterLink>
					</template>
				</v-list-item>
			</v-nav>
		</v-navigation-drawer>

		<v-app-bar
			:order="order"
			color="grey-lighten-2"
			flat
			title="VueMeteo - petak23"
		>
			<template v-slot:append>
				<v-switch
					v-model="order"
					hide-details
					inset
					label="Toggle order"
					true-value="-1"
					false-value="0"
				></v-switch>
			</template>
		</v-app-bar>

		<v-main class="text-center">
			<RouterView />
		</v-main>
		<app-footer />
	</v-layout>
</template>

<style scoped>

</style>
