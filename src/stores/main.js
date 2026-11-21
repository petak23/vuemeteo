import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import MainService from '../services/MainService'

export const useMainStore = defineStore('main', () => {

	const appName = ref("")  // Meno aplikácie

	const links = ref([]) // Pole odkazov

	const dataRetentionDays = ref(0)
			
	const minYear = ref(2000)

	const user = ref(null)
	const user_permission = ref(null)
	const is_logged_in = computed(() => user.value !== null)

	const token = ref(null)

	const user_loaded = ref(false)	// true, keď už je známe, či je niekto prihlásený
	let userPromise = null					// prebiehajúce načítanie užívateľa (zdieľané medzi volaniami)

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

	// Položka hlavného menu, do ktorej sa pridávajú zariadenia (hľadá sa podľa cesty, nie indexu)
	const devicesMenuItem = () => main_menu.value.find(item => item.to === '/devices')

	const addDevicesToMenu = () => {
		const menuItem = devicesMenuItem()
		if (devices.value === null || menuItem === undefined) return

		menuItem.children = []
		for (const device of Object.values(devices.value)) {
			let children = null
			if (device.sensors != null) {
				children = []
				for (const sensor of Object.values(device.sensors)) {
					children.push({
						id: sensor.id,
						only_logged_in: true,
						to: '/sensor/' + sensor.id,
						name: sensor.name,
						fa_icon: null,
						children: null
					})
				}
			}
			menuItem.children.push({
				id: device.id,
				only_logged_in: true,
				to: '/device/' + device.id,
				name: device.name,
				fa_icon: null,
				children: children
			})
		}
	}

	const clearDevicesMenu = () => {
		const menuItem = devicesMenuItem()
		if (menuItem !== undefined) menuItem.children = null
	}

	const setActualDeviceId = (id, ids = null) => {
		actual_device_id.value = id
		actual_sensor_id.value = ids
	}

	const resetActualDeviceId = () => {
		actual_device_id.value = null
		actual_sensor_id.value = null
	}

	/**
	 * Zistí, či má prihlásený užívateľ oprávnenie k zdroju (resource) a akcii.
	 * Záznam s action == null povoľuje všetky akcie zdroja.
	 */
	const checkUserPermission = (resource, action = null) => {
		if (user.value == null || user.value.id == undefined) return false
		if (!Array.isArray(user_permission.value)) return false

		return user_permission.value.some(item =>
			item.resource == resource &&
			(item.action == null || (Array.isArray(item.action) && item.action.includes(action)))
		)
	}

	/** Nastaví (alebo pri null vymaže) údaje prihláseného užívateľa podľa odpovede API */
	const setUserData = (data = null) => {
		user_loaded.value = true
		if (data != null && data.status == 200 && data.user != null) {
			user.value = data.user
			token.value = data.token ?? null
			user_permission.value = data.permission ?? null
		} else {
			user.value = null
			token.value = null
			user_permission.value = null
			clearDevicesMenu()
		}
	}

	/** Načíta aktuálne prihláseného užívateľa (API vráti status 401, ak nie je nikto prihlásený) */
	const getActualUser = () => {
		userPromise = MainService.getMyUserData()
			.then(response => {
				setUserData(response.data)
			})
			.catch((error) => {
				console.error(error)
				user_loaded.value = true
			})
		return userPromise
	}

	/** Zaručí, že je užívateľ načítaný (načíta ho len raz, ďalšie volania čakajú na ten istý request) */
	const ensureUser = () => {
		if (user_loaded.value) return Promise.resolve()
		return userPromise ?? getActualUser()
	}

	let devicesRequestNr = 0	// poradové číslo požiadavky – staršie (pomalšie) odpovede sa ignorujú

	const getDevices = () => {
		const requestNr = ++devicesRequestNr
		const logged = is_logged_in.value
		MainService.getDevices(logged)
			.then(response => {
				if (requestNr !== devicesRequestNr) return	// medzitým bola odoslaná novšia požiadavka
				if (response.data.status == 200) {
					devices.value = response.data.data
					if (logged) addDevicesToMenu()
				}
				else {
					devices.value = null
					console.error(response.data.message)
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}

	return { 
		appName, links, dataRetentionDays, minYear, user, is_logged_in, token, 
		main_menu, 
		devices, addDevicesToMenu, clearDevicesMenu, setActualDeviceId, resetActualDeviceId, actual_device_id, actual_sensor_id,
		checkUserPermission, setUserData, getActualUser, ensureUser, user_loaded, user_permission,
		getDevices
	}
})
