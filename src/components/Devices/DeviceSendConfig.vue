<script setup>
const props = defineProps({
	item: { type: Object, default: null }
})
</script>

<template>
NEDOKONČENÉ ...
{control sendconfigForm}

<!--<div class="row px-2  pt-3">
	<div class="col-12">
		<a n:href="Device:show $id" class="btn btn-outline-primary btn-sm" role="button">Zpět beze změny</a>
	</div>
</div>-->

<div class="pb-1 pt-1 px-2">
	<h5>Pomôcky:</h5>
	<p>
		Zapíšte zmeny konfigurácie vo forme<br/>
		<b>&nbsp;&nbsp;&nbsp;MenoPoložky=Obsah<br/>&nbsp;&nbsp;&nbsp;InáPoložka=InýObsah</b>
	</p>
	<p>
		<strong class="text-danger">
			POZOR: Jeden riadok nesmie byť dlhší ako 256 byte a celá zmena nesmie presiahnuť 512 byte.
		</strong>
	</p>
	<p>
		Štandardné konfiguračné položky:
	</p>
	<ul>
		<li><b>wifi_ssid</b> - Meno (SSID) WiFi siete</li>
		<li><b>$wifi_pass</b> - Heslo k WiFi</li>
		<li><b>ra_url</b> - Adresa serveru (bez http:// na začiatku, takže napr.: moj.server.cz/iot/ra )</li>
		<li><b>ra_dev_name</b> - Meno zariadenia</li>
		<li><b>$ra_pass</b> - Heslo zariadenia</li>
		<li><b>log_ship</b> - 1 = zariadenie má posielať logy na server; 0 = neposielať (funguje len pokiaľ je aplikácia skompilovaná s nastavením LOG_SHIPPING)</li>
		<li><b>@restart=1</b> = vykoná reštart zariadenia</li>
	</ul>
</div>
</template>

<style lang="scss" scoped>

</style>