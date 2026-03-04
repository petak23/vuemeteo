<script setup>
import { RouterLink } from 'vue-router';

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

<div class="px-2 mb-2" >
	<form action="?" method="get">
	<table width="100%" cellspacing="0" cellpadding="3" border="0">
		<tr>
			<td>&nbsp;</td>
			<td align="center">
				Předvolby: 
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&currentday=1">Aktuálny deň.</a>
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&current=1">Posledné tri dni.</a>
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&currentweek=1">Posledný týždeň.</a>
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&currentmonth=1">Posledný mesiac.</a>
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&currentyear=1">Tento rok.</a>
			</td>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td>
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&minus=1"
					alt="Predchádzajúce obdobie"
					title="Predchádzajúce obdobie"
					><i class="fa fa-arrow-circle-left fa-2x"></i></a>
			</td>
			<td align="center">
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&minusYear=1"
					>[- rok]</a>
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&minusMon=1"
					>[- mesiac]</a>
				Zobraz 
				<select name="lenDays">
					<option value="1" {if ($lenDays==1)}selected{/if}>1 deň</option>
					<option value="3" {if ($lenDays==3)}selected{/if}>3 dni</option>
					<option value="8" {if ($lenDays==8)}selected{/if}>týždeň</option>
					<option value="31" {if ($lenDays==31)}selected{/if}>mesiac</option>
					<option value="92" {if ($lenDays==92)}selected{/if}>3 mesiace</option>
					<option value="183" {if ($lenDays==183)}selected{/if}>pol roka</option>
					<option value="366" {if ($lenDays==366)}selected{/if}>rok</option>
				</select>
				od
				<input type="date" name="dateFrom" size=8  value="{$dateFrom}">
				<input type="submit" name="draw" value="Zobraz!">
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&plusMon=1"
					>[+ mesiac]</a>
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&plusYear=1"
					>[+ rok]</a>
			</td>
			<td>
				<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&plus=1"
					alt="Ďalšie obdobie"
					title="Ďalšie obdobie"
					><i class="fa fa-arrow-circle-right fa-2x"></i></a>
			</td>
		</tr>
		{if ($allowCompare)}
			<tr>
				<td>
				</td>
				<td align="center">
					<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&altminus=1"
						>[- rok]</a>
					
					Porovnávací rok: 
					<select name="altYear">
						<option value="" {if ($altYear=="")}selected{/if}></option>
						{foreach $years as $year}
							<option value="{$year}" {if ($altYear==$year)}selected{/if}>{$year}</option>
						{/foreach}
					</select>
					<input type="submit" name="draw" value="Zobraz!">
					<a href="../../../../chart/sensor/show/{$id}/?dateFrom={$dateFrom}&lenDays={$lenDays}&altYear={$altYear}&altplus=1"
						>[+ rok]</a>
				</td>
				<td>
				</td>
			</tr>
		{/if}
	</table>
	</form> 
</div>

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
		</i></li>
	{/if}
	<li>Najstaršie dáta v databáze sú z roku {$minYear}.</li>
	</ul></small>
</div>
</template>