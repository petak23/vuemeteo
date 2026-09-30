import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import MainService from '../services/MainService'

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
			name: 'Kódy jednotiek',
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
		{
			only_logged_in: true, // len prihlásený užívateľ
			to: '/views',
			name: 'Moje grafy',
			fa_icon: 'fa-chart-line',
			children: null
		}
	])

	const devices = ref(null) // Pole zariadení
	const actual_device_id = ref(null) // ID práve zobrazeného zariadenia
	const actual_sensor_id = ref(null) // ID práve zobrazeného senzora

	const addDevicesToMenu = () => {
		if (devices.value !== null) {
			console.log("Adding devices to menu...")
			console.log(devices.value)
			main_menu.value[3].children = []
			for (const device of Object.values(devices.value)) {
				if (device.sensors !== null) {
					device.children = []
					for (const sensor of Object.values(device.sensors)) {
						device.children.push({
							id: sensor.id,
							only_logged_in: true,
							to: '/sensor/' + sensor.id,
							name: sensor.name,
							fa_icon: null,
							children: null
						})
					}
				} else {
					device.children = null
				}
				main_menu.value[3].children.push({
					id: device.id,
					only_logged_in: true,
					to: '/device/' + device.id,
					name: device.name,
					fa_icon: null,
					children: device.children
				})
			}
		}
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

	const getDevices = () => {
		MainService.getDevices()
			.then(response => {
				if (response.data.status == 200) {
					devices.value = response.data.data
					addDevicesToMenu()
				}
				else {
					devices.value = null
					// emit('error', response.data)
					console.error(response.data.message)
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}


	return { 
		baseUrl, apiPath, appName, links, dataRetentionDays, minYear, user, token, 
		main_menu, 
		devices, addDevicesToMenu, setActualDeviceId, resetActualDeviceId, actual_device_id, actual_sensor_id,
		checkUserPermission, getActualUser, user_permission,
		getDevices
	}
})
