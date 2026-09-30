<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useMainStore } from '../../stores/main'
const store = useMainStore()
const route = useRoute()
const props = defineProps({
	id: {
		type: Number,
		required: true
	},
	to: {
		type: String,
		required: true,
	},
	fa_icon: {
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
	}
})

const childrenCount = computed(() => {
    return props.children == null ? '' : '(' + Object.keys(props.children).length + ')'
})

const isActiveLink = computed(() => {
	return route.path === props.to
})

const viewSubmenu = computed(() => {
	if (props.to == "/devices" && props.children != null && route.path.startsWith("/devices")) {
		return true
	}	else if (props.to.startsWith("/device/")) {	
		return props.children != null && store.actual_device_id == props.id
	} else if (route.path.startsWith("/device/") || route.path.startsWith("/sensor/")) {
		return true
	}
	return false
})
</script>

<template>
	<li class="nav-item">
		<RouterLink 
			class="nav-link"
			:to="props.to"
			active-class="active"
		>
			<i 
				class="fa-solid me-1"
				:class="props.fa_icon"
			></i>
			{{ props.text }} {{ childrenCount }}
		</RouterLink>
		<ul v-if="viewSubmenu" class="nav flex-column ms-3">
			<main-menu-item
				v-for="(item, index) in props.children"
				:key="index"
				:to="item.to"
				:fa_icon="item.fa_icon"
				:text="item.name"
				:children="item.children"
				:id="item.id"
			/>
		</ul>
	</li>
</template>