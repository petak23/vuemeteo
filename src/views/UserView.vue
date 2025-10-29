<script setup>
import { computed } from 'vue'
import UserInfo from '../components/user/UserInfo.vue'
import UserChange from '../components/user/UserChange.vue'
import PasswordChange from '../components/user/PasswordChange.vue'

import { useMainStore } from '../stores/main'
const store = useMainStore()

const props = defineProps({
	edit: { type: Number, default: 0},
})

const h1_text = computed(() => {
	return props.edit ? 'Zmena nastavenia účtu' : 'Užívateľ'
})
</script>

<template>
  <div class="row">
		<div class="col-12 border-bottom">
			<h1>{{ h1_text }}</h1>
		</div>
		<div class="col-12 mt-2">
			<user-info v-if="store.user != null && props.edit == 0" />
			<user-change v-else-if="store.user != null && props.edit == 1" />
			<password-change v-else-if="store.user != null && props.edit == 2" />
			<div v-if="store.user == null" class="alert alert-danger mt-2" role="alert">
				<h4 class="alert-heading">Chyba: 401</h4>
				<p>Užívateľ nie je prihlásený. Prihláste sa, prosím!</p>
			</div>
		</div>
  </div>
</template>
