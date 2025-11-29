<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import SensorTab from './SensorTab.vue'
import DeviceSendConfig from './DeviceSendConfig.vue'

const props = defineProps({
	device_item: { 
		type: Object, default: null 
	}
})

const item = ref({id: 0, name: 'none'})
const viewConfigModal = ref(false)

onMounted(()=> {
	console.log(props)
	if (props.device_item != null) item.value = props.device_item
	console.log(item.value)
})

watch(() => props.device_item, () => {
	item.value = props.device_item
});

const rssiComputed = computed(() => {
	let out = ""
	if (item.value.rssi > -50) out = "- výborná kvalita signálu."
	else if (item.value.rssi > -60 ) out = "- dobrá kvalita signálu, malo by fungovať aj posielanie súborov a logov."
	else if (item.value.rssi > -70 ) out = '<i class="text-warning fas fa-exclamation-triangle"></i> Omedzená kvalita signálu - data prejdú, ale pri súboroch a logoch očakávajte problémy.'
	else out = '<i class="text-danger fas fa-exclamation-triangle"></i> Zlá kvalita signálu - očakávajte problémy.'
	return out
})
</script>

<template>
	<div class="col-12">
		<h3>Konfigurácia zariadenia</h3>
		<i>Po stisku tlačítka sa zobrazí konfigurácia, 
			ktorú je potrebné nastaviť do zariadenia v konfiguračnom portály zariadenia.</i>
	</div>
	<div class="col-12">
		<BAccordion lazy>
			<BAccordionItem title="Zobraziť konfiguráciu">
				<div class="row px-2">
					<div class="col-12">
						<i>Túto konfiguráciu nastavte v zariadení.</i>
					</div>
				</div>
				<div class="row px-2 bg-secondary-subtle">
					<div class="col-12 col-md-3">RA URL:</div>
					<div class="col-12 col-md-9"><b>{{ item.url }}</b></div>
				</div>
				<div class="row px-2 bg-light-subtle">
					<div class="col-12 col-md-3">RA device name:</div>
					<div class="col-12 col-md-9"><b>{{ item.name }}</b></div>
				</div>
				<div class="row px-2 bg-secondary-subtle">
					<div class="col-12 col-md-3">RA passphrase:</div>
					<div class="col-12 col-md-9"><b>{{ item.passphrase }}</b></div>
				</div>
			</BAccordionItem>
		</BAccordion>
	</div>
	
	<div class="col-12"><h3>Informácie</h3></div>
	<div class="col-12 col-md-2 bg-secondary-subtle">Popis:</div>
	<div class="col-12 col-md-10 bg-secondary-subtle">{{ item.desc }}</div>

	<div class="col-12 col-md-2 bg-light-subtle">Prevádzkovaná aplikácia:</div>
	<div class="col-12 col-md-10 bg-light-subtle">{{ item.app_name }}</div>

	<div class="col-12 col-md-2 bg-secondary-subtle">Prvné prihlásenie:</div>
	<div class="col-12 col-md-10 bg-secondary-subtle">
		<i v-if="item.first_login == null" class="text-danger">
			Zariadenie sa ešte neprihlásilo cez prihlasovacie rozhranie, 
			preto nebude vypísané v monitoringu.
		</i>
		<span v-else>{{ item.first_login }}</span>
	</div>

	<div class="col-12 col-md-2 bg-light-subtle">Posledné prihlásenie:</div>
	<div class="col-12 col-md-10 bg-light-subtle text-danger" v-if="item.problem_mark">
		<b>
			<i class="text-danger fas fa-exclamation-triangle"></i>
			Zariadenie má problém s prihlásením. Posledné neúspešné prihlásenie: 
			{{ item.last_bad_login }}.
		</b>
	</div>
	<div class="col-12 col-md-10 bg-light-subtle" v-else><b>{{ item.last_login }}</b></div>

	<div class="col-12 col-md-2 bg-secondary-subtle">Posledná komunikácia:</div>
	<div class="col-12 col-md-10 bg-secondary-subtle"><b>{{ item.last_data_time }}</b></div>

	<div class="col-12 col-md-2" v-if="item.uptime">Uptime:</div>
	<div class="col-12 col-md-10" v-if="item.uptime"><b>{{ item.uptime_readable }}</b> (pri poslednej komunikácii)</div>

	<div class="col-12 col-md-2 bg-secondary-subtle" v-if="item.rssi">Sila WiFi signálu:</div>
	<div class="col-12 col-md-10 bg-secondary-subtle" v-if="item.rssi">
		<b>{{ item.rssi }} dBm</b> (pri poslednom prihlásení)
		<span v-html="rssiComputed"></span>
	</div>
	
	<div class="col-12 col-md-2 bg-light-subtle">Bezp. token pre JSON data:</div>
	<div class="col-12 col-md-10 bg-light-subtle">{{ item.json_token }}</div>
	
	<div class="col-12 col-md-2 bg-secondary-subtle">Bezp. token pre galériu:</div>
	<div class="col-12 col-md-10 bg-secondary-subtle">{{ item.blob_token }}</div>
	
	<div class="col-12 col-md-2 bg-light-subtle">Kontrolovať v monitoringu:</div>
	<div class="col-12 col-md-10 bg-light-subtle">{{ item.monitoring ==1 ? 'áno' : 'ne' }}</div>

	<h3 class="border-top pt-2 mt-1 d-flex justify-content-between">
		OTA aktualizácia aplikácie
		<a href="Device:update $device['id']" class="disabled btn btn-outline-primary btn-sm me-1" role="button" disabled>Poslať OTA aktualizáciu aplikácie</a>
	</h3>
	
	<div class="col-12" v-if="item.updates">
		<div class="row text-secondary">
				<div class="col   col-md-1">ID</div>
				<div class="col-6 col-md-3">Z verzie</div>
				<div class="col-6 col-md-3">Nahrané</div>
				<div class="col-6 col-md-3">Stiahnuté</div>
				<div class="col   col-md-1">&nbsp;</div>
		</div>
		<div v-for="(upd, index) in item.updates" :key="upd.id" class="row" :class="index % 2 ? 'bg-light-subtle': 'bg-secondary-subtle'">
				<div class="col   col-md-1">{$update['id']}</div>
				<div class="col-6 col-md-3">{$update['fromVersion']}</div>
				<div class="col-6 col-md-3">{$update['inserted']}</div>
				<div class="col-6 col-md-3">{$update['downloaded']}</div><!-- TODO odkazy -->
				<div class="col   col-md-1"><a href="Device:deleteupdate $device['id'], $update['id']">Zmazať</a></div>
		</div>
	</div>

	<div class="col-12" v-else>Aktualizácie ešte neexistujú.</div>
	

	<div class="col-12 border-top mt-1 pt-2">
		<h3 class="d-flex justify-content-between">
			Zmena konfigurácie
			<BButton 
				@click="viewConfigModal = true" title="Poslať zmenu konfigurácie"
				variant="outline-secondary"
			>
				<i class="fa-solid fa-gears"></i><span class="d-none d-sm-inline ms-2">Poslať zmenu konfigurácie</span>
			</BButton>
		</h3>
	</div>
	<div class="col-12" v-if="item.config_data">
		<i class="far fa-share-square text-danger"></i>&nbsp;Pre zariadenie čaká zmena konfigurácie:
		<div class="px-4 py-0">
			<i><pre>{{ item.config_data }}</pre></i>
		</div>
	</div>
	<div class="col-12" v-else>
		Žiadna konfigurácia ešte nebola zaslaná.
	</div>
	<BModal
		v-model="viewConfigModal"
		:title="'Poslať zmenu konfigurácie pre zariadenie ' + item.name"
		centered
		class="modal-xl"
	>
		<device-send-config :item="item" />
	</BModal>

	<sensor-tab 
		:sensors="item.sensors"
	/>
	
	<div class="col-12 border-top mt-1 pt-2" v-if="item.json_token">
		<h3>Data zariadenia</h3>
		Data zo senzorov zariadenia vo forme JSON sú dostupné tu: 
		<br><small><a :href="item.jsonUrl">{{ item.jsonUrl }}</a></small>
		<br>Pokiaľ je zariadenie meteostanice so senzormi teploty a zrážok, je možné získať data pre display meteostanice tu:
		<br><small><a :href="item.jsonUrl2">{{ item.jsonUrl2 }}</a></small>
		<br><small>Každý, kdo pozná tieto URL, si môže data zobraziť. Prístup k JSON súboru už <b>nie je chránený heslom</b>.</small>
	</div>

	<div class="col-12 border-top mt-1 pt-2" v-if="item.blob_token">
		<h3>Galéria obrázkov</h3>
		Galéria obrázkov (pokiaľ ju zariadenie generuje) je dostupná tu: 
		<br><small><a :href="item.blobUrl">{{ item.blobUrl }}</a></small>
		<br><small>Každý, kdo pozná túto URL, si môže obrázky zobraziť. Prístup k obrázkom už <b>nie je chránený heslom</b>.</small>
	</div>
	
	<div class="col-12 border-top mt-1 pt-2" v-if="item.subory">
		<h3>Súbory</h3><!-- TODO odkazy -->
		V zariadení je uložené <a href="Device:blobs item.id"><b>{{ item.subory }}</b> súborov</a>.
	</div>
</template>