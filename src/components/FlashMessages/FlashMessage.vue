<script setup>
/**
 * Komponenta pre vypísanie flash správ.
 * Posledna zmena 21.11.2026
 *
 * @author     Ing. Peter VOJTECH ml. <petak23@gmail.com>
 * @copyright  Copyright (c) 2012 - 2025 Ing. Peter VOJTECH ml.
 * @license
 * @link       http://petak23.echo-msz.eu
 * @version    1.0.8
 */

import { ref, watch } from 'vue'
import { useFlashStore } from './store/flash'
import { storeToRefs } from 'pinia'

const storeF = useFlashStore()
const { flashMessages } = storeToRefs(storeF)

const mess = ref([])	// pole aktuálne zobrazených správ
let nextId = 0				// jedinečný kľúč pre každú zobrazenú správu

const hide = (id) => {
	mess.value = mess.value.filter(m => m.id !== id)
}

// Presunie všetky čakajúce správy zo store do zobrazených (nie len prvú)
watch(() => flashMessages.value.length, (len) => {
	if (len === 0) return
	const pending = flashMessages.value.splice(0)
	for (const fm of pending) {
		const id = nextId++
		mess.value.push({ ...fm, id })
		const timeout = parseInt(fm.timeout)
		if (timeout > 0) {
			setTimeout(() => hide(id), timeout)
		}
	}
}, { immediate: true })

</script>

<template>
	<TransitionGroup tag="ul" name="fade" class="alert-container">
		<li v-for="m in mess" :key="m.id">
			<div
				class="alert alert-dismissible"
				:class="'alert-' + m.type"
				role="alert"
			>
				<h4 class="alert-heading" v-if="m.heading">{{ m.heading }}</h4>
				<div>{{ m.message }}</div>
				<button type="button" class="btn-close" aria-label="Close" @click="hide(m.id)"></button>
			</div>
		</li>
	</TransitionGroup>
</template>

<style lang="scss" scoped>
.alert-container {
	position: fixed;
	right: 2em;
	bottom: 2em;
	max-width: 50vw;
	z-index: 2000;
	margin: 0;
	padding: 0;

	li {
		list-style: none;
	}
}
.alert {
  font-size: 0.9rem;
	border-width: .25rem;
}
.alert-heading {
	font-weight: bold;
	border-bottom: 1px solid #999;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>