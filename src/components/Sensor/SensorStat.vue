<script setup>
import { ref, onMounted, watch} from 'vue'
import MainService from '../../services/MainService'

const props = defineProps({
	sensor: {
		type: Object,
		default: null
	}
})

const sensorStats = ref(null)

const setError = (message) => {
	//error_message.value = message
	console.error(message)
}

const getSensorStats = async (id) => {
	await MainService.getSensorStats(id)
		.then(response => {
			if (response.data.status == 200) {
				sensorStats.value = response.data
			}
			else {
				setError(response.data.message)
			}
		})
		.catch((error) => {
			setError(error)
			console.error(error)
		})
}

watch(() => props.sensor, () => {
	if (props.sensor && props.sensor.id > 0) getSensorStats(props.sensor.id)
	else setError("Chybné id: [" + props.sensor.id + "] senzoru.(1)")
})

onMounted(() => {
	if (props.sensor && props.sensor.id > 0) getSensorStats(props.sensor.id)
	else setError("Chybné id: [" + props.sensor.id + "] senzoru.(2)")
})

/*
const sensorName = computed(() => props.sensor.name || 'N/A')
const sensorValue = computed(() => props.sensor.value || 0)
const sensorUnit = computed(() => props.sensor.unit || '')
const sensorStatus = computed(() => props.sensor.status || 'inactive')*/
</script>

<template>
	<div class="px-2 mb-3" v-if="props.sensor != null">
		<small>{{ props.sensor.desc }}</small>
	</div>

	<div class="px-2 mb-3" v-if="sensorStats != null">

		<h3>Detailné dáta</h3>	

		<b>Štatistika</b>: 

		<span v-if="sensorStats.measureStats && sensorStats.measureStats.count > 0">
			Je tu 
			<b>{{ sensorStats.measureStats.count }}</b> záznamov od 
			<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$measureStats->min_time |date:'Y-m-d'}&lenDays={$lenDays}&altYear={$altYear}"
				class="btn btn-link disabled p-0" aria-disabled="true"
				>{{ sensorStats.measureStats.min_time }}</a> <!--| date:'d.m.Y'--> 
			do 
			<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$measureStats->max_time |date:'Y-m-d'}&lenDays={$lenDays}&altYear={$altYear}"
				class="btn btn-link disabled p-0" aria-disabled="true"
			>{{ sensorStats.measureStats.max_time }}</a>.<!--| date:'d.m.Y'-->
		</span>
		<span v-else>
			Nie sú dostupné žiadne detailné dáta.
		</span>

		<p>
			<i><small>
				"Detailné dáta" sú primárne záznamy zo zariadenia. Sú uložené tak, ako prišli zo zariadenia. Pretože ich môže byť príliš veľa, 
				nedrží sa všetky za celú históriu - urobia sa z nich sumárne záznamy (pre každú hodinu minimum a maximum vrátane času, kedy boli namerané)
				a detailné dáta staršie ako nastavený čas sú vymazané. 
				Posledných niekoľko mesiacov je tak pokryté detailnými dátami, staršie obdobie len sumárnymi.
			</small></i>
		</p>

	</div>
	<div class="px-2 mb-3" v-if="sensorStats != null">

		<h3>Sumárne dáta</h3>	

		<b>Štatistika:</b>
		<span v-if="sensorStats.sumdataStats && sensorStats.sumdataStats.min_date != null">
			Je tu
			<b>{{ sensorStats.sumdataCount.hour }}</b> hodinových a 
			<b>{{ sensorStats.sumdataCount.day }}</b> denných záznamov 
			od
			<!-- TODO links -->
			<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$sumdataStats->min_time |date:'Y-m-d'}&lenDays={$lenDays}&altYear={$altYear}"
			>{{ sensorStats.sumdataStats.min_date }}</a> 
			do 
			<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$sumdataStats->max_time |date:'Y-m-d'}&lenDays={$lenDays}&altYear={$altYear}"
			>{{ sensorStats.sumdataStats.max_date }}</a>.
		</span>
		<span v-else-if="props.sensor.device_class == 2">
			Pre toto zariadenie nie sú počítané sumárne dáta.
		</span>
		<span v-else>
			Nie sú dostupné žiadne sumárne dáta.
		</span>
		<p>
			<i><small>
				Zo zaznamenaných hodnôt (detailných dát) sa automaticky počítajú sumárne dáta.
				Pre bežné typy hodnôt (teplota, tlak,...) sa z každej hodiny uloží minimálna a maximálna hodnota (vrátane času, kedy v hodine bolo danej hodnoty dosiahnuté). 
				Pre rýchlejšie vykreslenie dlhých grafov sa ďalej nájde aj denné maximum a minimum.
				Pre impulzné meradlá (napríklad plynomer, zrážky) sa ako sumárne dáta počítajú súčty za hodinu a za deň.
			</small></i>
		</p>

	</div>

	<div class="px-2 mb-3" v-if="sensorStats != null && sensorStats.mesicniSumarizace != null">

		<h3>Mesačná sumarizácia</h3>	

		<table 
			v-if="props.sensor.device_class == 3"
			class="table table-striped table-bordered table-hover table-sm "
		>
			<thead class="thead-light">
				<tr>
					<th>Rok</th>
					<th>Jednotka</th>
					<th class="text-right">Suma</th>
					<th v-for="i in 12" :key="i" class="text-right">{{ String(i).padStart(2, '0') }}</th>
				</tr>
			</thead>

				<tr v-for="(rokData, rok) in sensorStats.mesicniSumarizace" :key="rok">
					<td><b>{{ rok }}</b></td>
					<td>{{ props.sensor.unit}}</td>
					<td class="text-right"><b>{{ rokData.celkem }}</b></td>
					<td class="text-right" v-for="i in 12" :key="i">
						<span v-if="rokData[i] != undefined">{{ rokData[i] }}</span>
					</td>
				</tr>
				
		</table>
		
		<table 
			v-else-if="props.sensor.device_class != 3"
			class="table table-striped table-bordered table-hover table-sm " >
			<thead class="thead-light">
				<tr>
					<th>Rok</th>
					<th>Jednotka</th>
					<th v-for="i in 12" :key="i" class="text-right">{{ String(i).padStart(2, '0') }}</th>
				</tr>
			</thead>
			<tr v-for="(rokData, rok) in sensorStats.mesicniSumarizace" :key="rok">
				<td><b>{{ rok }}</b></td>
				<td>{{ props.sensor.unit}}</td>
				<td class="text-right" v-for="i in 12" :key="i">
					<div v-if="rokData[i] != undefined" class="text-danger py-0 my-0">{{ rokData[i].max }}</div>
					<div v-if="rokData[i] != undefined" class="text-secondary py-0 my-0">{{ rokData[i].avg }}</div>
					<div v-if="rokData[i] != undefined" class="text-primary py-0 my-0">{{ rokData[i].min }}</div>
				</td>
			</tr>
		</table>


	</div>

	<div class="px-2 mb-3" >
		<RouterLink :to="'/sensor/' + props.sensor.id" class="btn btn-primary btn-sm" role="button">Späť</RouterLink>
	</div>

	<div class="px-2 mb-2" v-if="sensorStats != null">
		<small>
			Vysvetlivky a poznámky:
			<ul>
				<li v-for="de in sensorStats.devices" :key="de.name">
					<b>{{ de.name }}</b> - {{ de.desc }}
				</li>
				<li>Najstaršie dáta v databáze sú z roku {{ sensorStats.years.slice(-1)[0] }}.</li>
			</ul>
		</small>
	</div>
</template>