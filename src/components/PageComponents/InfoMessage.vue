<script setup lang="ts">
import {ref} from 'vue'
const visible = ref(false)

const randomCode = ref(Math.random().toString(36).slice(2, 7))
</script>

<template>
	<BButton
		:class="visible ? null : 'collapsed'"
		:aria-expanded="visible ? 'true' : 'false'"
		:aria-controls="randomCode"
		@click="visible = !visible"
		variant="link"
		class="pt-0 ps-0"
	>
		<i class="fa-solid fa-circle-info fa-lg"></i>
	</BButton>

	<BCollapse :id="randomCode" v-model="visible">
		<BCard class="m-0 p-0 border-0" bg-variant="info-subtle">
			<p class="card-text description">
				<slot></slot>
			</p>
		</BCard>
	</BCollapse>
</template>

<style scoped>
	p.description {
		font-size: 70%;
		line-height: 1.2em;
		font-style: italic;
	}
</style>
