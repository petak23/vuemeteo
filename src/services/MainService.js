import axios from 'axios'

//const baseUrl = "http://localhost/~petak23/apimeteo/"
const baseUrl = "http://localhost/apimeteo/"
//const baseUrl = "https://apimeteo.echo-msz.eu/"

//console.log(window.location.origin)
//const baseUrl = (window.location.origin.includes('localhost')) ? "http://localhost/apimeteo/" : "https://apimeteo.echo-msz.eu/" 
console.log("Base URL: " + baseUrl)

axios.defaults.withCredentials = true;

const apiClient = axios.create({
	baseURL: baseUrl,
	withCredentials: true, //false, // This is the default
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	timeout: 10000
})

export default {
	getBaseUrl() {
		return baseUrl
	},

	getMySettings() {
		return apiClient.get('homepage/myappsettings')
	},
	getDevices() {
		return apiClient.get('devices')
	},
	getDevice(id_device) {
		return apiClient.get('device/' + id_device)
	},
	getSensor(id) {	
		return apiClient.get('sensor/' + id)
	},
	getSensorStats(id) {
		return apiClient.get('sensorstat/' + id)
	},
	getUnits() {
		return apiClient.get('units')
	},
	
	postDeviceEdit(id_device, data) {
		//console.log(data)
		return apiClient.post('device/' + id_device + '/edit', data)
	},
	postDeviceDelete(id_device) {
		return apiClient.post('device/' + id_device + '/delete')
	},
	postSensorEdit(id_sensor, data) { // TODO Over v API
		return apiClient.post('sensor/' + id_sensor + '/edit', data)
	},
	postSensorDelete(id_sensor) {			// TODO Over v API
		return apiClient.post('sensor/' + id_sensor + '/delete')
	},

	// User
	postLogIn(data) {
		return apiClient.post('/login', data)
	},
	getLogOut() {
		return apiClient.get('/logout')
	},
	getMyUserData() {
		return apiClient.get('user/user')
	},
	postSaveUser(id_user, data) {
		return apiClient.post('user/save/' + id_user, data)
	},
	postChangePassword(id_user, data) {
		return apiClient.post('user/passwordchange/' + id_user, data)
	},

	// Views
	getViews() {
		return apiClient.get('views')
	},

	// Chart
	getChartSensor($id_sensor, params) {
		return apiClient.get('chart/sensor/' + $id_sensor, { params: params })
	}
}