import axios from 'axios'

//const baseUrl = document.getElementById('app').dataset.baseUrl + "/api/"
//const baseUrl = "http://localhost/~petak23/vuemeteo/api/"
//const baseUrl = "http://localhost/~petak23/apimeteo/"
//const baseUrl = "http://localhost/apimeteo/"
//const baseUrl = "http://apimeteo.echo-msz.eu/"

console.log(window.location.origin)
const baseUrl = (window.location.origin.includes('localhost')) ? "http://localhost/apimeteo/" : "http://apimeteo.echo-msz.eu/" 

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
	getUnits() {
		return apiClient.get('units')
	},
	
	postDeviceEdit(id_device, data) {
		console.log(data)
		return apiClient.post('device/' + id_device + '/edit', data)
	},

	// User
	postLogIn(data) {
		return apiClient.post('/login', data)
	},
	getLogOut() {
		return apiClient.get('/logout')
	},
	getMyUserData() {
		return apiClient.get('user')
	},
	postSaveUser(id_user, data) {
		return apiClient.post('user/save/' + id_user, data)
	}
}