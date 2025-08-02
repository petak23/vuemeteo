<script setup>
import { onMounted, ref } from 'vue'
import MainService from '../../services/MainService'
import dayjs from 'dayjs'; //https://day.js.org/docs/en/display/format
import Device_popover from './Device_popover.vue';
import SensorTab from './SensorTab.vue';

const items = ref(null)

onMounted(()=> {
	getDevices();
})

		
const format_date = (value) => {
	if (value == null) return "---"
	const date = dayjs(value);
	// Then specify how you want your dates to be formatted
	return date.format('D.M.YYYY HH:mm:ss')
}

const getDevices = () => {
	MainService.getDevices()
		.then(response => {
			//console.log(response.data)
			items.value = response.data
		})
		.catch((error) => {
			console.log(error);
		});
}
</script>

<template v-if="items != null">
	<div v-for="item in items" :key="item.id" class="device">
		<div class="row px-2 bg-secondary-subtle device-head" >
			<div class="col-4 col-md-3">Zariadenie</div>
			<div class="col-12 col-md-4">Popis</div>
			<div class="col-6 col-md-2">Prvé prihlásenie</div>
			<div class="col-6 col-md-2">Posledné prihlásenie</div>
			
		</div>

		<div class="row my-0 px-2 bg-primary-subtle">
			<div class="col-4 col-md-3 ">
				<RouterLink :to="'device/' + item.id" class="text-light-emphasis me-2"><b>{{ item.name }}</b></RouterLink>
				<Device_popover v-if="item.problem_mark"
					fa_icon="exclamation-triangle text-warning"
					:text="'Zariadenie má problém s prihlásením. Posledné neúspešné prihlásenie: ' + format_date(item.last_bad_login) + '.'"
				/>
				<Device_popover v-if="item.config_data != null"
					fa_icon="share-square text-warning"
					text="Pre zariadenie čaká zmena konfigurácie."
				/>
			</div>
			<div class="col-12 col-md-4"><i>{{ item.desc }}</i></div>
			<div class="col-6 col-md-2">{{ format_date(item.first_login) }}</div>
			<div class="col-6 col-md-2">{{ format_date(item.last_login) }}</div>
			<div class="col-12 col-md-1 text-white d-flex justify-content-end">
				<RouterLink :to="'device/edit/'+item.id" class="text-warning" role="button" title="Editácia zariadenia">
					<i class="fa-solid fa-pencil"></i>
				</RouterLink>
			</div>
		</div>
		
		<SensorTab 
			:sensors="item.sensors"
		/>
		
	</div>
</template>


<style lang="scss" scoped>
.device {
	border-bottom: 1px solid  #aaa;
	padding-bottom: 1rem;
}
.device:last-child {
	border-bottom: 0;
	padding-bottom: 0;
}
.device-head {
	background-color: #eee;
}
.sensor-head {
	background-color: #eee;
}
.sensor-odd {
	background-color: #ddd;
}
</style>