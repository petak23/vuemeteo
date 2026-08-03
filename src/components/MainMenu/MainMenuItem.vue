<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useMainStore } from '../../stores/main'
const store = useMainStore()
const route = useRoute()
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

const isActiveLink = computed(() => {
	const linkPath = props.to_main + props.to
	return route.path === linkPath || route.path.startsWith(linkPath + '/')
})

const viewSubmenu = computed(() => {
	if (props.to_main == "/device/") {
		return props.children != null && (store.actual_device_id == props.to || isActiveLink.value)
	} else if (props.to_main == "/sensor/") {
		return props.children != null && (store.actual_sensor_id == props.to || isActiveLink.value)
	} else if (props.to_main == "" && (props.to != "/devices" || store.actual_device_id == null)) {
		return false
	} else {
		return props.children != null || isActiveLink.value
	}
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
		<ul v-if="viewSubmenu" class="nav flex-column ms-3">
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