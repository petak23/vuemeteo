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
	const user_permission = ref(null)

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

	const checkUserPermission = (resource, action = null) => {
		let edit_enabled = false
		if (user.value != null && user.value.id != undefined) {
			user_permission.value.forEach(function check(item) {
				if (item.resource == resource) {
					let p = false
					if (item.action == null) {
						p = true
					} else if (Array.isArray(item.action) && item.action.includes(action)) {
						p = true
					}
					edit_enabled = p
				}
			}, this)
		}

		return edit_enabled
	}

	const getActualUser = () => {
		MainService.getMyUserData()
			.then(response => {
				if (response.data.status == 200) {	// Prihlásený v poriadku
					user.value = response.data.user
					user_permission.value = response.data.user.permission
				} else if (response.data.status == 401) { // Neprihlásený užívateľ
					user.value = null
					user_permission.value = response.data.user.permission
				} else {
					user.value = null
					user_permission.value = null
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return { 
		baseUrl, apiPath, appName, links, dataRetentionDays, minYear, user, token, 
		main_menu, 
		devices, addDevicesToMenu, setActualDeviceId, resetActualDeviceId, actual_device_id, actual_sensor_id,
		checkUserPermission, getActualUser, user_permission
	}
})
