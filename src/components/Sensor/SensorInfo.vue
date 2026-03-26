<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router';

const props = defineProps({
  sensor: {type: Object, default: null}
})

const sensorWarnMax = computed(() => {
	return props.sensor.warn_max == 1 ?
					"Pre &gt;=<b>" + props.sensor.warn_max_val+"</b>"+props.sensor.unit+" zasielame '<b>"+props.sensor.warn_max_text+"</b>'"
					: "-" 
})

const sensorWarnMim = computed(() => {
	return props.sensor.warn_min == 1 ?
					"Pre &gt;=<b>" + props.sensor.warn_min_val+"</b>"+props.sensor.unit+" zasielame '<b>"+props.sensor.warn_min_text+"</b>'"
					: "-" 
})
</script>

<template>
  <div class="row px-2 bg-light-subtle">
			<div class="col-12 col-md-4">Názov:</div>
			<div class="col-12 col-md-8"><b>{{ props.sensor.name }}</b></div>
	</div>
	<div class="row px-2 bg-secondary-subtle">
			<div class="col-12 col-md-4">Popis:</div>
			<div class="col-12 col-md-8"><i>{{ props.sensor.desc }}</i></div>
	</div>

	<div class="row px-2 bg-light-subtle">
			<div class="col-12 col-md-4">Jednotka:</div>
			<div class="col-12 col-md-8">{{ props.sensor.unit }}</div>
	</div>


	<div class="row px-2 bg-secondary-subtle">
		<div class="col-12 col-md-4">Typ meraných dát:</div>
		<div class="col-12 col-md-8"> 
			<p v-if="props.sensor.device_class == 1">
				<b>1</b> - Kontinuálne so sumarizáciou.
				<small>
					<br>Predpokladá sa, že sa meria spojitá veličina ako je napríklad teplota, tlak alebo výška hladiny 
					- t.j. že nameraná hodnota v každom okamihu je to, čo sa má zobrazovať.
					<br>Z nameraných hodnôt sa <b>počítajú sumárne dáta</b> - nájdu sa hodinové a denné maximá a minimá.
					<br>Pre rýchle vykreslenie dlhších grafov je možné používať sumárne dáta.
					<br>Detailné namerané dáta sa po určitej dobe mažú, sumárne dáta zostávajú.
				</small>
			</p>
			<p v-else-if="props.sensor.device_class == 2">	
				<b>2</b> - Kontinuálne bez sumarizácie.
				<small>
					<br>Predpokladá sa, že sa meria spojitá veličina ako je napríklad teplota, tlak alebo výška hladiny. 
					<br>Nepočítajú sa sumárne dáta.
				</small>
			</p>
			<p v-else-if="props.sensor.device_class == 3">
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
			<RouterLink :to="'/device/'+props.sensor.device_id"><b>{{ props.sensor.dev_name }}</b></RouterLink>
			- <i>{{ props.sensor.dev_desc }}</i>
		</div>
	</div>
	<div class="row px-2 bg-secondary-subtle">
		<div class="col-12 col-md-4">Očakávaný maximálny interval dát zo zariadenia:</div>
		<div class="col-12 col-md-8">{{ props.sensor.msg_rate}} sek</div>
	</div>
	<div class="row px-2 bg-light-subtle">
		<div class="col-12 col-md-4">Očakávaný maximálny interval medzi hodnotami pre vykreslenie grafu:</div>
		<div class="col-12 col-md-8">{{ props.sensor.display_nodata_interval }} sek</div>
	</div>
	<div class="row px-2 bg-secondary-subtle">
		<div class="col-12 col-md-4">Násobenie hodnoty:</div>
		<div class="col-12 col-md-8">{{ props.sensor.preprocess_data == 1 ? 'x ' + props.sensor.preprocess_factor : '-' }}</div>
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
		<div class="col-12 btn-group">
			<RouterLink :to="'/device/'+props.sensor.device_id" class="btn btn-outline-primary btn-sm" role="button"><i class="fa-solid fa-rotate-left me-1"></i>Späť k zariadeniu</RouterLink>
			<RouterLink to="/devices" class="btn btn-outline-primary btn-sm" role="button"><i class="fa-solid fa-rotate-left me-1"></i>Späť na zoznam zariadení</RouterLink>
			<RouterLink :to="'/chart/sensor/' + props.sensor.id" class="btn btn-outline-primary btn-sm" role="button"><i class="fa-solid fa-chart-line me-1"></i>Graf hodnôt</RouterLink>
			<RouterLink :to="'/sensor/stat/'+props.sensor.id" class="btn btn-outline-primary btn-sm" role="button"><i class="fa-solid fa-chart-simple me-1"></i>Štatistika dát</RouterLink>
			<RouterLink :to="'/sensor/edit/'+props.sensor.id" class="btn btn-outline-primary btn-sm" role="button"><i class="fa-solid fa-pencil me-1"></i>Upraviť senzor</RouterLink>
		</div>
	</div>
</template>