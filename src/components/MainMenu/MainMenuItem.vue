<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps({
	to: {
		type: String,
		required: true,
	},
	faIcon: {
		type: String,
		default: ''
	},
	text: {
		type: String,
		required: true
	},
	children: {
		type: Object,
		default: null
	},
	to_main: {
		type: String,
		default: ""
	}
})

const childrenCount = computed(() => {
    return props.children == null ? '' : '(' + Object.keys(props.children).length + ')'
})
</script>

<template>
	<li class="nav-item">
		<RouterLink 
			class="nav-link"
			:to="props.to_main + props.to"
			active-class="active"
		>
			<i 
				class="fa-solid me-1"
				:class="props.faIcon"
			></i>
			{{ props.text }} {{ childrenCount }}
		</RouterLink>
		<ul v-if="props.children != null" class="nav flex-column ms-3">
			<main-menu-item
				v-for="(item, index) in props.children"
				:key="index"
				:to="String(item.id)"
				fa-icon="fa-hard-drive"
				:text="item.name"
				:children="item.sensors"
				:to_main="item.passphrase != undefined ? '/device/' : '/sensor/'"
			/>
		</ul>
	</li>
</template>


<style lang="scss" scoped>

</style>