<script setup>
import { onMounted } from 'vue'
import MainService from '../services/MainService'

import { useMainStore } from '../stores/main'
const store = useMainStore()

const getMySettings = async () => {
	await MainService.getMySettings()
		.then(response => {
			//console.log(response.data)
			store.appName = response.data.appName
			store.links = response.data.links
			store.dataRetentionDays = response.data.dataRetentionDays
			store.minYear = response.data.minYear
		})
		.catch((error) => {
			console.error(error)
		})
}

const getActualUser = async () => {
	await MainService.getMyUserData()
		.then(response => {
			console.log(response.data)
			if (response.data.status == 200) {
				store.token = response.data.token
				store.user = response.data.user
				store.user_permission = response.data.permission
			} else {
				store.user = null
				store.token = null
				store.user_permission = null
			}
		})
		.catch((error) => {
			console.error(error)
		})
}

onMounted(() => {
	getMySettings()
	getActualUser()
})
</script>

<template></template>