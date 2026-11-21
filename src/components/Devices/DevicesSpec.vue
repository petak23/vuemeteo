<script setup>
import { computed } from 'vue'

const props = defineProps({
	temperature: {	// teplota v °C (null = hodnota nie je k dispozícii)
		type: Number,
		default: null
	},
	humidity: {	// relatívna vlhkosť v %
		type: Number,
		default: null
	},
	windSpeed: { // rýchlosť vetra v km/h
		type: Number,
		default: null
	}
})

/**
 * Výpočet Wind Chill (Ochladzovanie vetrom)
 * Vzorec podľa NOAA / National Weather Service (NWS)
 * Určené pre T <= 10 °C a v > 4.8 km/h
 */
function calculateWindChill(tempC, speedKmH) {
	return 13.12 + (0.6215 * tempC) - (11.37 * Math.pow(speedKmH, 0.16)) + (0.3965 * tempC * Math.pow(speedKmH, 0.16))
}

/**
 * Výpočet Heat Index (Index horka / Dusno)
 * Používa kompletnú Rothfuszovu regresnú rovnicu.
 * Určené pre T >= 26.7 °C (80 °F) a vlhkosť >= 40 %
 */
function calculateHeatIndex(tempC, RH) {
	// Heat Index vzorec pracuje s Fahrenheitmi, preto prevedieme °C na °F
	const T = (tempC * 9 / 5) + 32

	// Rothfuszova rovnica
	let hi = -42.379 +
		(2.04901523 * T) +
		(10.14333127 * RH) -
		(0.22475541 * T * RH) -
		(6.83783e-3 * T * T) -
		(5.481717e-2 * RH * RH) +
		(1.22874e-3 * T * T * RH) +
		(8.5282e-4 * T * RH * RH) -
		(1.99e-6 * T * T * RH * RH)

	// Korekcia pre nízku vlhkosť
	if (RH < 13 && T >= 80 && T <= 112) {
		const adjustment = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17)
		hi -= adjustment
	}
	// Korekcia pre vysokú vlhkosť
	else if (RH > 85 && T >= 80 && T <= 87) {
		const adjustment = ((RH - 85) / 10) * ((87 - T) / 5)
		hi += adjustment
	}

	// Prevod výsledku späť na stupne Celzia
	return (hi - 32) * 5 / 9
}

/**
 * Výpočet pocitovej teploty na základe meteorologických podmienok.
 * Vracia { value, type } – computed nemá vedľajšie efekty.
 */
const feelsLikeResult = computed(() => {
	const T = props.temperature
	const RH = props.humidity
	const V = props.windSpeed

	// Kontrola platnosti vstupných dát
	if (T === null || RH === null || V === null || isNaN(T) || isNaN(RH) || isNaN(V)) {
		return { value: null, type: 'Chýbajúce vstupy' }
	}

	let result = T
	let type

	// 1. Podmienka pre Wind Chill (Zima + Vietor)
	if (T <= 10 && V > 4.8) {
		result = calculateWindChill(T, V)
		type = '(vplyv vetra - Wind Chill)'
	} 
	// 2. Podmienka pre Heat Index (Teplo + Vlhkosť)
	else if (T >= 26.7 && RH >= 40) {
		result = calculateHeatIndex(T, RH)
		type = '(vplyv vlhkosti - Heat Index)'
	} 
	// 3. Bežné podmienky
	else {
		type = '(štandardná teplota)'
	}

	// Zaokrúhlenie na 1 desatinné miesto
	return { value: Math.round(result * 10) / 10, type }
})

const feelsLike = computed(() => feelsLikeResult.value.value)
const feelsLikeType = computed(() => feelsLikeResult.value.type)

/**
 * Výpočet Rosného bodu (Dew Point) pomocou Magnusovej rovnice
 * Konštanty: a = 17.27, b = 237.7 (Arden Buck korigované)
 */
const dewPoint = computed(() => {
	const T = props.temperature
	const RH = props.humidity

	// Kontrola platnosti vstupov (vlhkosť musí byť > 0)
	if (T === null || RH === null || isNaN(T) || isNaN(RH) || RH <= 0) {
		return null
	}

	const a = 17.27
	const b = 237.7

	// Magnusov koeficient alpha
	const alpha = ((a * T) / (b + T)) + Math.log(RH / 100)
	
	// Výpočet samotného rosného bodu
	const dp = (b * alpha) / (a - alpha)

	// Zaokrúhlenie na 1 desatinné miesto
	return Math.round(dp * 10) / 10
})
</script>

<template>
	<h6 class="mt-2">Výpočet pocitovej teploty a rosného bodu:</h6>
	<div class="row row-cols-2 g-2">
		<div class="col">
			<div class="card h-100">
				<h5 class="card-header">Pocitová teplota</h5>
				<div class="card-body">
					<p class="card-text text-primary-emphasis fs-5 fw-bold" v-if="feelsLike !== null">{{ feelsLike }} °C</p>
					<p class="card-text" v-else>—</p>
					<small class="card-text text-muted">{{ feelsLikeType }}</small>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card h-100">
				<h5 class="card-header">Rosný bod</h5>
				<div class="card-body">
					<p class="card-text text-primary-emphasis fs-5 fw-bold" v-if="dewPoint !== null">{{ dewPoint }} °C</p>
					<p class="card-text" v-else>—</p>
				</div>
			</div>
		</div>
	</div>
</template>
