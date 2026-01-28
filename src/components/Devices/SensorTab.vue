<script setup>
import { RouterLink } from 'vue-router';
import Device_popover from './Device_popover.vue'

const props = defineProps({
	sensors: {
		type: Object,
		default: null
	}
})
</script>


<template>
	<div v-if="props.sensors != null && Object.keys(props.sensors).length" class="row pl-4 pr-1 py-2">
		<div class="col-12">
			<div class="row bg-secondary-subtle sensor-head">
				<div class="col-6 col-md-2"><small>(id)</small>Senzor</div>
				<div class="col-5 col-md-2">Stav</div>
				<div class="col-1">Typ</div>
				<div class="col-6 col-md-1">Faktor</div>
				<div class="col-6 col-md-2">Interval</div>
				<div class="col-12 col-md-2">Popis</div>
			</div>
			<div 
				v-for="(sensor, k, index) in props.sensors" :key="sensor.id" 
				class="row"
				:class="index % 2 ? 'bg-light-subtle' : 'bg-dark-subtle'"
			>
				<div class="col-6 col-md-2">
					<RouterLink class="btn btn-link btn-sm" :to="'/sensor/' + sensor.id" >
						<small>({{ k }})</small><b>{{sensor.name}}</b>
					</RouterLink>
					<Device_popover v-if="sensor.warningIcon > 0"
						:fa_icon="'exclamation-triangle ' + sensor.warningIcon == 1 ? 'text-danger' : 'text-warning'"
						:text="'Senzor nedodáva data. Posledné data: ' + format_date(sensor.last_data_time) + '.'"
					/>
				</div>
				<div class="col-5 col-md-2" v-if="sensor.last_out_value !== null">
					{{ sensor.last_out_value }} {{ sensor.value_unit }}
					<Device_popover v-if="sensor.warn_max_fired"
						fa_icon="arrow-circle-up text-danger"
						:text="'Od ' + sensor.warn_max_fired +' je hodnota nad limitom.'"
					/>
					<Device_popover v-if="sensor.warn_min_fired"
						fa_icon="arrow-circle-down text-danger"
						:text="'Od ' + sensor.warn_min_fired +' je hodnota pod limitom.'"
					/>
				</div>
				<div class="col-5 col-md-2" v-else>
						--- [{{ sensor.value_unit }}]
				</div>
				<div class="col-1">
					<Device_popover
						:click_me="true"
						:text_to_target="'#' + sensor.device_class"
						:text="sensor.dc_desc"
					/>
				</div>
				<div class="col-6 col-md-1">
					<span v-if="sensor.preprocess_data == 1">
						x {{ sensor.preprocess_factor }}
					</span>
				</div>
				<div class="col-6 col-md-2">{{ sensor.msg_rate }}, {{ sensor.display_nodata_interval }}</div>
				<div class="col-12 col-md-2">
					<Device_popover v-if="sensor.warn_max"
						fa_icon="sort-amount-up"
						text="Senzor má nastavené posielanie varovaní pri prekročení horného limitu."
					/>
					<Device_popover v-if="sensor.warn_min"
						fa_icon="sort-amount-down"
						text="Senzor má nastavené posielanie varovaní pri prekročení spodného limitu."
					/>
					<i>{{ sensor.desc }}</i>
				</div>
				<div class="col-6 col-md-2"><!-- TODO links -->
					<a aria-disabled="true" class="btn btn-link btn-sm disabled text-warning-emphasis pe-2" 
					  :href="'../chart/sensorstat/show/' + sensor.id + '/?current=1'"
						title="Štatistika"
					>
						<i class="fa-solid fa-chart-simple"></i>
					</a>
					<a 
						aria-disabled="true" class="btn btn-link btn-sm disabled text-warning-emphasis pe-2"
						:href="'../chart/sensor/show/' + sensor.id + '/?current=1'"
						title="Graf"
					>
						<i class="fa-solid fa-chart-line"></i>
					</a> 
					<a 
						aria-disabled="true" class="btn btn-link btn-sm disabled text-warning-emphasis"
						:href="'sensor/edit/' + sensor.id" title="Edit">
						<i class="fa-solid fa-pencil"></i>
					</a>
				</div>
			</div>
		</div>
	</div>
	<div v-else>Žiadny senzor.</div>
</template>

<style lang="scss" scoped>

</style>