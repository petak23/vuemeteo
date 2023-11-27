import axios from 'axios'

//const baseUrl = document.getElementById('app').dataset.baseUrl + "/api/"
//const baseUrl = "http://localhost/~petak23/vuemeteo/api/"
//const baseUrl = "http://localhost/~petak23/apimeteo/"
const baseUrl = "http://apimeteo.echo-msz.eu/"

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
	/*getEvents(perPage, page) {
		return apiClient.get('/events?_limit=' + perPage + '&_page=' + page)
	},*/
	/*postLogIn(event) {
		return apiClient.post('/events', event)
	},*/
	postLogIn(data) {
		return apiClient.post('/login', data)
	}
}