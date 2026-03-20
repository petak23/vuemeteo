<script setup>
import { RouterLink } from 'vue-router';
import ChartHeader from '../Chart/ChartHeader.vue';

const props = defineProps({
	sensor: {
		type: Object,
		default: null
	}
})

</script>

<template>
<h1 class="mt-1 px-2 ">{{ props.sensor.name }}</h1>

<div class="px-2 mb-3" >
	<small>{{ props.sensor.desc }}</small>
</div>

<div class="px-2 mb-3" >
	<RouterLink :to="'/sensor/' + props.sensor.id" class="btn btn-primary btn-sm" role="button">Späť</RouterLink>

	<RouterLink :to="'/sensor/stat/' + props.sensor.id + '/?dateFrom=' + props.dateFrom + '&lenDays=' + props.lenDays + '&altYear=' + props.altYear" class="btn btn-outline-primary btn-sm" role="button">
    Zobraziť štatistiku
  </RouterLink>
</div>

<chart-header
	:dateFrom="props.dateFrom"
	:lenDays="props.lenDays"
	:altYear="props.altYear"
	@update:dateFrom="(value) => props.dateFrom = value"
	@update:lenDays="(value) => props.lenDays = value"
	@update:altYear="(value) => props.altYear = value"
	@submit="submitForm"
/>

<div class="px-2 mb-2" >
	<img 
		width="{$chW}" height="{$chH}" border="0" 
		src="../../../../chart/sensorchart/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}"
	>
</div>

<div class="px-2 mb-4" >
	<table width="100%" cellspacing="0" cellpadding="3" border="0">
	{foreach $items as $row}
		<tr>
			<td>
				{if ($row['axis']==1)}
					<table><tr><td width="15px" height="15px" bgcolor="{$row['color']}">
						{if ($row['nr']==1)}
							&nbsp;
						{else}
							<table><tr><td width="10px" height="10px" bgcolor="#ffffff">&nbsp;</td></tr></table>
						{/if}
					</td></tr></table>
				{else}
					&nbsp;
				{/if}
			</td>
			<td  align="{if ($row['axis']==1)}left{else}right{/if}"><font color="{$row['color']}">
				{$row['name']}. <small>Od <b>{$row['date']}. </b> [{$row['sensor_name']}; {$row['unit']}; <b>{$row['source_desc']}</b>]</small>
			</font></td>
			<td >
				{if ($row['axis']==2)}
					<table><tr><td width="15px" height="15px" bgcolor="{$row['color']}">
						{if ($row['nr']==1)}
							&nbsp;
						{else}
							<table><tr><td width="10px" height="10px" bgcolor="#ffffff">&nbsp;</td></tr></table>
						{/if}
					</td></tr></table>
				{else}
					&nbsp;
				{/if}
			</td>
		</tr>
	{/foreach}
	</table>
</div>

<div class="px-2 mb-2" >
	<small>
	Vysvetlenia a poznámky:
	<ul>
	{foreach $devices as $device}
		<li><b>{$device['name']}</b> - {$device['desc']}</li>
	{/foreach}
	{if ($isKompozit)}
		<li><b>Kompozit</b> - Spracovávajú sa dáta z viacerých senzorov a použijú sa tie, ktoré sú dostupné.</li>
	{/if}
	{if ($source1) }
	<li><b>Automatické dáta</b> - Pre úseky dlhšie než 90 dní sa vykreslí len maximum a minimum v každom dni. 
				Pre úseky od 6 do 90 dní sa zobrazujú maximá a minimá v každej hodine - na výsledných grafoch to takmer nie je rozlišiteľné oproti priamym dátam. 
				Pre kratšie úseky sa pre ne-kompozitné dáta stará maximálne {$dataRetentionDays} dní použijú priamo namerané hodnoty; pre kompozitnú sériu (z viacerých senzorov)
				alebo dáta staršie než limit sa použijú hodinové maximá a minimá.
	</li>
	{/if}
	<li>Najstaršie dáta v databáze sú z roku {$minYear}.</li>
	</ul></small>
</div>
</template>