<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { RouterLink } from 'vue-router';
import MainService from '../services/MainService'

import { useRoute } from 'vue-router'
const route = useRoute()

import { useMainStore } from '../stores/main'
const store = useMainStore()

const props = defineProps({
	id: { type: Number, default: 0 },
	edit: { type: Boolean, default: false},
})

const sensor_one = ref(null)
const error_message = ref("")

const setError = (message) => {
	error_message.value = message
	console.error(error_message.value)
}

const  getSensor = async (id) => {
	await MainService.getSensor(id)
		.then(response => {
			if (response.data.status == 200) {
				sensor_one.value = response.data
				store.setActualDeviceId(sensor_one.value.device_id, sensor_one.value.id)
			}
			else {
				setError(response.data.message)
				device_one.value = null
			}
		})
		.catch((error) => {
			setError(error)
			console.error(error)
		})
}

watch(() => props.id, () => {
	if (props.id > 0) getSensor(props.id)
	//else setError("Chybné id: [" + props.id + "] senzoru.(1)")
})

watch(() => route.params.id, (newId) => {
	if (newId > 0) getSensor(newId)
	else setError("Chybné id: [" + newId + "] senzoru.(3)")
})

const sensorWarnMax = computed(() => {
	return sensor_one.value.warn_max == 1 ?
					"Pre &gt;=<b>" + sensor_one.value.warn_max_val+"</b>"+sensor_one.value.unit+" zasielame '<b>"+sensor_one.value.warn_max_text+"</b>'"
					: "-" 
})

const sensorWarnMim = computed(() => {
	return sensor_one.value.warn_min == 1 ?
					"Pre &gt;=<b>" + sensor_one.value.warn_min_val+"</b>"+sensor_one.value.unit+" zasielame '<b>"+sensor_one.value.warn_min_text+"</b>'"
					: "-" 
})

onMounted(()=> {
	if (props.id > 0) getSensor(props.id)
	else if (route.params.id > 0) getSensor(route.params.id) 
	else setError("Chybné id: [" + props.id + "] senzoru.(2)")
})
</script>

<template>

<div class="col-12" v-if="sensor_one != null">
	<div class="pb-3 pt-3 px-2">
				<h1>Senzor {{ sensor_one.name }}</h1>
	</div>

	<div class="row px-2">
				<div class="col-12">
						<h3>Informácie</h3>
				</div>
		</div>
		<div class="row px-2 bg-light-subtle">
				<div class="col-12 col-md-4">Názov:</div>
				<div class="col-12 col-md-8"><b>{{ sensor_one.name }}</b></div>
		</div>
		<div class="row px-2 bg-secondary-subtle">
				<div class="col-12 col-md-4">Popis:</div>
				<div class="col-12 col-md-8"><i>{{ sensor_one.desc }}</i></div>
		</div>

		<div class="row px-2 bg-light-subtle">
				<div class="col-12 col-md-4">Jednotka:</div>
				<div class="col-12 col-md-8">{{ sensor_one.unit }}</div>
		</div>


	<div class="row px-2 bg-secondary-subtle">
		<div class="col-12 col-md-4">Typ meraných dát:</div>
		<div class="col-12 col-md-8"> 
			<p v-if="sensor_one.device_class == 1">
				<b>1</b> - Kontinuálne so sumarizáciou.
				<small>
					<br>Predpokladá sa, že sa meria spojitá veličina ako je napríklad teplota, tlak alebo výška hladiny 
					- t.j. že nameraná hodnota v každom okamihu je to, čo sa má zobrazovať.
					<br>Z nameraných hodnôt sa <b>počítajú sumárne dáta</b> - nájdu sa hodinové a denné maximá a minimá.
					<br>Pre rýchle vykreslenie dlhších grafov je možné používať sumárne dáta.
					<br>Detailné namerané dáta sa po určitej dobe mažú, sumárne dáta zostávajú.
				</small>
			</p>
			<p v-else-if="sensor_one.device_class == 2">	
				<b>2</b> - Kontinuálne bez sumarizácie.
				<small>
					<br>Predpokladá sa, že sa meria spojitá veličina ako je napríklad teplota, tlak alebo výška hladiny. 
					<br>Nepočitajú sa sumárne dáta.
				</small>
			</p>
			<p v-else-if="sensor_one.device_class == 3">
				<b>3</b> - Impulzné dáta so sumarizáciou.
				<small>
					<br>Meria sa impulzná veličina - t.j. počet jednotiek načítaných z plynomera, počet preskočení zrážkomera atď.
					<br>Pre zobrazenie sa namerané hodnoty môžu vynásobiť prepočtovým koeficientom.
					<br>Z nameraných hodnôt sa <b>počítajú sumárne dáta</b> - súčty po hodinách a po dňoch.
					<br>Grafy sa vykresľujú z hodinových alebo denných súčtov.
				</small>
			</p>
		</div>
	</div>

	<div class="row px-2 bg-light-subtle">
		<div class="col-12 col-md-4">Zariadenie:</div>
		<div class="col-12 col-md-8">
			<RouterLink :to="'/device/'+sensor_one.device_id"><b>{{ sensor_one.dev_name }}</b></RouterLink>
			- <i>{{ sensor_one.dev_desc }}</i>
		</div>
	</div>
	<div class="row px-2 bg-secondary-subtle">
		<div class="col-12 col-md-4">Očakávaný maximálny interval dát zo zariadenia:</div>
		<div class="col-12 col-md-8">{{ sensor_one.msg_rate}} sek</div>
	</div>
	<div class="row px-2 bg-light-subtle">
		<div class="col-12 col-md-4">Očakávaný maximálny interval medzi hodnotami pre vykreslenie grafu:</div>
		<div class="col-12 col-md-8">{{ sensor_one.display_nodata_interval }} sek</div>
	</div>
	<div class="row px-2 bg-secondary-subtle">
		<div class="col-12 col-md-4">Násobenie hodnoty:</div>
		<div class="col-12 col-md-8">{{ sensor_one.preprocess_data == 1 ? 'x ' + sensor_one.preprocess_factor : '-' }}</div>
	</div>
	<div class="row px-2 bg-light-subtle">
		<div class="col-12 col-md-4">Upozornenie na maximum:</div>
		<div class="col-12 col-md-8">{{ sensorWarnMax }}</div>
	</div>
	<div class="row px-2 bg-secondary-subtle">
		<div class="col-12 col-md-4">Upozornenie na minimum:</div>
		<div class="col-12 col-md-8">{{ sensorWarnMim }}
		</div>
	</div>

	<div class="row px-2 pt-3">
		<div class="col-12 btn-group"><!-- TODO links ... -->
			<RouterLink :to="'/device/'+sensor_one.device_id" class="btn btn-outline-primary btn-sm" role="button"><i class="fa-solid fa-rotate-left me-1"></i>Späť k zariadeniu</RouterLink>
			<RouterLink to="/devices" class="btn btn-outline-primary btn-sm" role="button"><i class="fa-solid fa-rotate-left me-1"></i>Späť na zoznam zariadení</RouterLink>
			<a n:href=":Chart:sensor $sensor['id'], current: 1" class="btn btn-outline-primary btn-sm disabled" role="button"><i class="fa-solid fa-chart-line me-1"></i>Graf hodnôt</a>
			<a n:href=":Chart:sensorstat $sensor['id']" class="btn btn-outline-primary btn-sm  disabled" ><i class="fa-solid fa-chart-simple me-1"></i>Štatistika dát</a>
			<a n:href="Sensor:edit $sensor['id']" class="btn btn-outline-primary btn-sm disabled" role="button"><i class="fa-solid fa-pencil me-1"></i>Upraviť senzor</a>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>

</style>