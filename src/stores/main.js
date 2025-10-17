import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {

	const baseUrl = ref(document.getElementById('app').dataset.baseUrl)

	const apiPath = computed(() => baseUrl.value + "api/") // Cesta k API

	const appName = ref("")  // Meno aplikácie

	const links = ref([]) // Pole odkazov

	const dataRetentionDays = ref(0)
			
	const minYear = ref(2000)

	const user = ref(null)
	const token = ref(null)

	const main_menu = ref([
		{
			only_logged_in: false,
			to: '/',
			name: 'Domov',
			fa_icon: 'fa-house-chimney',
			children: null
		},
		{
			only_logged_in: false,
			to: '/units',
			name: 'Jednotky',
			fa_icon: 'fa-thermometer',
			children: null
		},
		{
			only_logged_in: true, // len prihlásený užívateľ
			to: '/user/user',
			name: 'Užívateľ',
			fa_icon: 'fa-user',
			children: null
		},
		{
			only_logged_in: true, // len prihlásený užívateľ
			to: '/devices',
			name: 'Zariadenia',
			fa_icon: 'fa-walkie-talkie',
			children: null
		},
	])

	const devices = ref(null) // Pole zariadení
	const actual_device_id = ref(null) // ID práve zobrazeného zariadenia
	const actual_sensor_id = ref(null) // ID práve zobrazeného senzora

	const addDevicesToMenu = () => {
		main_menu.value[3].children = devices.value
	}

	const setActualDeviceId = (id, ids = null) => {
		actual_device_id.value = id
		actual_sensor_id.value = ids
	}

	const resetActualDeviceId = () => {
		actual_device_id.value = null
		actual_sensor_id.value = null
	}

	watch(() => devices, () => {
		main_menu.value[3].children = devices.value
	})

	return { 
		baseUrl, apiPath, appName, links, dataRetentionDays, minYear, user, token, 
		main_menu, 
		devices, addDevicesToMenu, setActualDeviceId, resetActualDeviceId, actual_device_id, actual_sensor_id
	}
})
