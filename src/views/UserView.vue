<script setup>
import UserInfo from '../components/UserInfo.vue';
import { useMainStore } from '../stores/main'
const store = useMainStore()
</script>

<template>
  <div class="row">
		<div class="col-12">
			<h1>Užívateľ</h1>
		</div>
		<div class="col-12">
			<user-info />
			<div v-if="store.user == null" class="alert alert-danger mt-2" role="alert">
				<h4 class="alert-heading">Chyba: 401</h4>
				<p>Užívateľ nie je prihlásený. Prihláste sa, prosím!</p>
			</div>
		</div>
  </div>
</template>
