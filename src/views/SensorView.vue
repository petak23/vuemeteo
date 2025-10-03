
<script setup>
import { onMounted, ref, watch} from 'vue'
import { RouterLink } from 'vue-router';
import MainService from '../services/MainService'
//import Device from '../components/Devices/DeviceOneInfo.vue'
//import DeviceEdit from '../components/Devices/Device_edit.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
				console.log(response.data)
				sensor_one.value = response.data
				console.log(sensor_one.value);
				
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
	<div class="row px-2 bg-light">
		<div class="col-12 col-md-4">Názov:</div>
		<div class="col-12 col-md-8"><b>{{ sensor_one.name }}</b></div>
	</div>
	<div class="row px-2">
		<div class="col-12 col-md-4">Popis:</div>
		<div class="col-12 col-md-8"><i>{{ sensor_one.desc }}</i></div>
	</div>

	<div class="row px-2 bg-light">
		<div class="col-12 col-md-4">Jednotka:</div>
		<div class="col-12 col-md-8">{{ sensor_one.unit }}</div>
	</div>


<div class="row px-2">
	<div class="col-12 col-md-4">Typ meraných dát:</div>
	<div class="col-12 col-md-8"><b>{{ sensor_one.id_device_classes }}</b> - 
		<p v-if="sensor_one.id_device_classes == 1">
			Kontinuálne so sumarizací.
			<small>
			<br>Předpokládá se, že se měří spojitá veličina jako je například teplota, tlak, nebo výška hladiny 
			- tj. že naměřená hodnota v každém okamžiku je to, co se má zobrazovat.
			<br>Z naměřených hodnot se <b>počítají sumární data</b> - najdou se hodinová a denní maxima a minima.
			<br>Pro rychlé vykreslení delších grafů je možné používat sumární data.
			<br>Detailní naměřená data se po určité době mažou, sumární data zůstávají.
			</small>
		</p>
		{if ($sensor->id_device_classes == 1) }
			
		{elseif ($sensor->id_device_classes == 2) }
			Kontinuální bez sumarizace.
			<small>
			<br>Předpokládá se, že se měří spojitá veličina jako je například teplota, tlak, nebo výška hladiny. 
			<br>Nepočítají se sumární data.
			</small>
		{elseif ($sensor->id_device_classes == 3) }
			Impulzní data se sumarizací.
			<small>
			<br>Měří se impulzní veličina - tj. počet jednotek načtených z plynoměru, počet přeskočení srážkoměru atd.
			<br>Pro zobrazení se naměřené hodnoty mohou vynásobit přepočtovým koeficientem.
			<br>Z naměřených hodnot se <b>počítají sumární data</b> - součty po hodinách a po dnech.
			<br>Grafy se vykreslují z hodinových nebo denních součtů.
			</small>
		{/if}
	</div>
</div>

<div class="row px-2 bg-light">
	<div class="col-12 col-md-4">Zariadenie:</div>
	<div class="col-12 col-md-8"><b>
		<a n:href="Device:show $sensor->device_id">{{ sensor_one.device_name }}</a></b>
		 - <i>{{ sensor_one.device_desc }}</i></div>
</div>
<div class="row px-2">
	<div class="col-12 col-md-4">Očekávaný maximální interval dat ze zařízení:</div>
	<div class="col-12 col-md-8">{{ sensor_one.msg_rate}} sec</div>
</div>
<div class="row px-2 bg-light">
	<div class="col-12 col-md-4">Očekávaný maximální interval mezi hodnotami pro vykreslení grafu:</div>
	<div class="col-12 col-md-8">{{ sensor_one.display_nodata_interval }} sec</div>
</div>
<div class="row px-2">
	<div class="col-12 col-md-4">Násobení hodnoty:</div>
	<div class="col-12 col-md-8">
		{if ($sensor->preprocess_data == 1)}
			x {{ sensor_one.preprocess_factor }}
		{else}
			-
		{/if}
	</div>
</div>
<div class="row px-2 bg-light">
	<div class="col-12 col-md-4">Upozornění na maximum:</div>
	<div class="col-12 col-md-8">
		{if ($sensor->warn_max == 1)}
			Pro &gt;=<b>{{ sensor_one.warn_max_val }}</b> {{ sensor_one.unit }} zasíláme '<b>{{ sensor_one.warn_max_text }}</b>'
		{else}
			-
		{/if}
	</div>
</div>
<div class="row px-2">
	<div class="col-12 col-md-4">Upozornění na minimum:</div>
	<div class="col-12 col-md-8">
		{if ($sensor->warn_min == 1)}
			Pro &lt;=<b>{{ sensor_one.warn_min_val }}</b> {{ sensor_one.unit }} zasíláme '<b>{{ sensor_one.warn_min_text }}</b>'
		{else}
			-
		{/if}
	</div>
</div>

<div class="row px-2 pt-3">
  <div class="col-12">
	<a n:href="Device:show $sensor['device_id']" class="btn btn-outline-primary btn-sm" role="button">Zpět k zařízení</a>
	<a n:href="Device:list" class="btn btn-outline-primary btn-sm" role="button">Seznam zařízení</a>
	<a n:href=":Chart:sensor $sensor['id'], current: 1" class="btn btn-outline-primary btn-sm" role="button">Graf hodnot</a>
	<a n:href=":Chart:sensorstat $sensor['id']" class="btn btn-outline-primary btn-sm" >Statistika dat</a>
	<a n:href="Sensor:edit $sensor['id']" class="btn btn-outline-primary btn-sm" role="button">Upravit senzor</a>
  </div>
</div>
</div>
</template>

<style lang="scss" scoped>

</style>