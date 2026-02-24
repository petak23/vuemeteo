<script setup>
import { computed } from 'vue'

const props = defineProps({
	sensor_one: {
		type: Object,
		default: null
	}
})

const sensorName = computed(() => props.sensor_one.name || 'N/A')
const sensorValue = computed(() => props.sensor_one.value || 0)
const sensorUnit = computed(() => props.sensor_one.unit || '')
const sensorStatus = computed(() => props.sensor_one.status || 'inactive')
</script>

<template>
	<div class="px-2 mb-3" >
		<small>{{ props.sensor_one.desc }}</small>
	</div>

	<div class="px-2 mb-3" >

		<h3>Detailné dáta</h3>	

		<b>Štatistika</b>: 

		<span v-if="props.sensor_one.measureStats && props.sensor_one.measureStats.count > 0">
			Je tu 
			<b>{{ props.sensor_one.measureStats.count }}</b> záznamov od 
			<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$measureStats->min_time |date:'Y-m-d'}&lenDays={$lenDays}&altYear={$altYear}"
			>{{ props.sensor_one.measureStats.min_time }}</a> <!--| date:'d.m.Y'--> 
			do 
			<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$measureStats->max_time |date:'Y-m-d'}&lenDays={$lenDays}&altYear={$altYear}"
			>{{ props.sensor_one.measureStats.max_time }}</a>.<!--| date:'d.m.Y'-->
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
	<div class="px-2 mb-3" >

		<h3>Sumárne dáta</h3>	

		<b>Štatistika:</b>
		<span v-if="props.sensor_one.sumdataStats && props.sensor_one.sumdataStats.min_time != null">
			Je tu
			<b>{{ props.sensor_one.sumdataCount.hour }}</b> hodinových a 
			<b>{{ props.sensor_one.sumdataCount.day }}</b> denných záznamov 
			od
			<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$sumdataStats->min_time |date:'Y-m-d'}&lenDays={$lenDays}&altYear={$altYear}"
			>{{ props.sensor_one.sumdataStats.min_time }}</a> 
			do 
			<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$sumdataStats->max_time |date:'Y-m-d'}&lenDays={$lenDays}&altYear={$altYear}"
			>{{ props.sensor_one.sumdataStats.max_time }}</a>.
		</span>
		<span v-else-if="$sensor['device_class']==2">
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
<!--
	{if isset($mesicniSumarizace) }
	<div class="px-2 mb-3" >

		<h3>Mesačná sumarizácia</h3>	

		{if $sensor->device_class==3 }

			{foreach $mesicniSumarizace as $rok => $rocniHodnoty}
				{if $iterator->first}
				<table  class="table table-striped table-bordered table-hover table-sm " >
					<thead class="thead-light">
					<tr>
						<th>Rok</th>
						<th>Jednotka</th>
						<th class="text-right">Suma</th>
						{for $i = 1; $i <= 12; $i++}
							<th class="text-right">{$i|padLeft: 2, '0'}</th>
						{/for}
					</tr>
					</thead>
				{/if}
				<tr>
					<td><b>{$rok}</b></td>
					<td>{$sensor->unit}</td>
					<td class="text-right"><b>{$rocniHodnoty['celkem'] |number:1, ',', ' ' }</b></td>
					{for $i = 1; $i <= 12; $i++}
						<td class="text-right">
							{if isset($rocniHodnoty[$i])}
								{$rocniHodnoty[$i] |number:1, ',', ' ' }
							{else}
							{/if}
						</td>
					{/for}
				</tr>
				{if $iterator->last}
					</table>
				{/if}
			{/foreach}

		{else}

			{foreach $mesicniSumarizace as $rok => $rocniHodnoty}
				{if $iterator->first}
				<table  class="table table-striped table-bordered table-hover table-sm " >
					<thead class="thead-light">
					<tr>
						<th>Rok</th>
						<th>Jednotka</th>
						{for $i = 1; $i <= 12; $i++}
							<th class="text-right">{$i|padLeft: 2, '0'}</th>
						{/for}
					</tr>
					</thead>
				{/if}
				<tr>
					<td><b>{$rok}</b></td>
					<td>{$sensor->unit}</td>
					{for $i = 1; $i <= 12; $i++}
						<td class="text-right">
							{if isset($rocniHodnoty[$i])}
								<span class="text-danger">{$rocniHodnoty[$i]['max'] |number:1, ',', ' ' }</span>
								<br>
								{$rocniHodnoty[$i]['avg'] |number:1, ',', ' ' }
								<br>
								<span class="text-primary">{$rocniHodnoty[$i]['min'] |number:1, ',', ' ' }</span>
							{else}
							{/if}
						</td>
					{/for}
				</tr>
				{if $iterator->last}
					</table>
				{/if}
			{/foreach}

		{/if}

	</div>
	{/if}
-->
	<div class="px-2 mb-3" >
		<RouterLink :to="'/sensor/' + props.sensor_one.id" class="btn btn-primary btn-sm" role="button">Späť</RouterLink>
	</div>

	<div class="px-2 mb-2" >
		<small>
		Vysvetlivky a poznámky:
		<ul>
		{foreach $devices as $device}
			<li><b>{$device['name']}</b> - {$device['desc']}</li>
		{/foreach}
		<li>Najstaršie dáta v databáze sú z roku {$minYear}.</li>
		</ul></small>
	</div>
</template>