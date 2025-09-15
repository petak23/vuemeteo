import axios from 'axios'

//const baseUrl = document.getElementById('app').dataset.baseUrl + "/api/"
//const baseUrl = "http://localhost/~petak23/vuemeteo/api/"
const baseUrl = "http://localhost/~petak23/apimeteo/"
//const baseUrl = "http://localhost/apimeteo/"
//const baseUrl = "http://apimeteo.echo-msz.eu/"

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
	getUnits() {
		return apiClient.get('units')
	},
	getMyUserData() {
		return apiClient.get('user')
	},
	postDeviceEdit(id_device, data) {
		console.log(data)
		return apiClient.post('device/' + id_device + '/edit', data)
	},
	postLogIn(data) {
		return apiClient.post('/login', data)
	},
	getLogOut() {
		return apiClient.get('/logout')
	}
}