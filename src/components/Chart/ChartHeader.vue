<script setup>
import { reactive, watch } from 'vue'
import dayjs from 'dayjs'

// Dnešný dátum v lokálnom čase (toISOString by vrátil UTC – okolo polnoci včerajší deň)
const today = () => dayjs().format('YYYY-MM-DD')

const props = defineProps({
	id: { type: [String, Number], required: true },
	dateFrom: { type: String, default: () => dayjs().format('YYYY-MM-DD') },
	lenDays: { type: Number, default: 3 },
	altYear: { type: [String, Number], default: null },
	allowCompare: { type: Boolean, default: true },
	years: { type: Array, default: () => [] },
})

// Jediná udalosť s kompletnými parametrami grafu: { dateFrom, lenDays, altYear }
const emit = defineEmits(['update:params'])

const form = reactive({
	dateFrom: props.dateFrom,
	lenDays: props.lenDays,
	altYear: props.altYear ?? null,
})

// Zmena zvonka (props) -> formulár
watch(() => [props.dateFrom, props.lenDays, props.altYear], ([dateFrom, lenDays, altYear]) => {
	form.dateFrom = dateFrom
	form.lenDays = lenDays
	form.altYear = altYear ?? null
})

// Akákoľvek zmena formulára (preddefinované tlačidlá, input dátumu, select dĺžky aj roku) -> rodič
watch(() => [form.dateFrom, form.lenDays, form.altYear], () => {
	if (!form.dateFrom) return	// neúplne zadaný dátum v inpute
	emit('update:params', {
		dateFrom: form.dateFrom,
		lenDays: Number(form.lenDays),
		altYear: form.altYear === '' || form.altYear == null ? null : Number(form.altYear),
	})
})

function addDays(dateStr, days = 0) {
	return dayjs(dateStr).add(days, 'day').format('YYYY-MM-DD')
}

const updateLink = (val) => {
	const d = today()
	switch (val) {
		case 'day':
			form.dateFrom = d
			form.lenDays = 1
			break;
		case 'now':
			form.dateFrom = addDays(d, -2)
			form.lenDays = 3
			break;
		case 'week':
			form.dateFrom = addDays(d, -7)
			form.lenDays = 8
			break;
		case 'month':
			form.dateFrom = addDays(d, -30)
			form.lenDays = 31
			break;
		case 'year':
			form.dateFrom = dayjs().startOf('year').format('YYYY-MM-DD')
			form.lenDays = 366
			break;
		case 'minus':
			form.dateFrom = addDays(form.dateFrom, -form.lenDays)
			break;
		case 'plus':
			form.dateFrom = addDays(form.dateFrom, form.lenDays)
			break;
		case 'minusyear':
			form.dateFrom = addDays(form.dateFrom, -365)
			break;
		case 'minusmonth':
			form.dateFrom = addDays(form.dateFrom, -30)
			break;
		case 'plusmonth':
			form.dateFrom = addDays(form.dateFrom, +30)
			break;
		case 'plusyear':
			form.dateFrom = addDays(form.dateFrom, +365)
			break;
		default:
			break;
	}
}

// Posun porovnávacieho roku. Ak ešte nie je zvolený, začne sa od roku zobrazeného obdobia.
const updateAltYear = (val) => {
	const base = form.altYear ? Number(form.altYear) : dayjs(form.dateFrom).year()
	switch (val) {
		case 'minus':
			form.altYear = base - 1
			break;
		case 'plus':
			form.altYear = base + 1
			break;
		default:
			break;
	}
}
</script>

<template>
	<div class="col-12">
		<table width="100%" class="table table-borderless table-sm border border-warning">
			<tbody>
			<tr>
				<td :rowspan="props.allowCompare ? 3 : 2" class="align-middle">
					<button
						@click="updateLink('minus')"
						alt="Predchádzajúce obdobie"
						title="Predchádzajúce obdobie"
						class="btn btn-link"
					>
						<i class="fa fa-arrow-circle-left fa-2x"></i>
					</button>
				</td>
				<td class="text-center">
					Predvoľby:
					<div class="btn-group" role="group" aria-label="Predvoľby">
						<button type="button" @click="updateLink('day')" class="btn btn-outline-secondary btn-sm">Aktuálny deň.</button>
						<button type="button" @click="updateLink('now')" class="btn btn-outline-secondary btn-sm">Posledné tri dni.</button>
						<button type="button" @click="updateLink('week')" class="btn btn-outline-secondary btn-sm">Posledný týždeň.</button>
						<button type="button" @click="updateLink('month')" class="btn btn-outline-secondary btn-sm">Posledný mesiac.</button>
						<button type="button" @click="updateLink('year')" class="btn btn-outline-secondary btn-sm">Tento rok.</button>
					</div>
				</td>
				<td :rowspan="props.allowCompare ? 3 : 2" class="align-middle">
					<button
						@click="updateLink('plus')"
						alt="Ďalšie obdobie"
						title="Ďalšie obdobie"
						class="btn btn-link"
					>
						<i class="fa fa-arrow-circle-right fa-2x"></i>
					</button>
				</td>
			</tr>

			<tr>
				<td class="text-center">
					<div class="row">
						<div class="col btn-group" role="group" aria-label="Posun obdobia">
							<button @click="updateLink('minusyear')" class="btn btn-outline-secondary btn-sm">- rok</button>
							<button @click="updateLink('minusmonth')" class="btn btn-outline-secondary btn-sm">- mesiac</button>
						</div>
						<div class="col">
							Zobraz
						</div>
						<div class="col">
							<select class="form-select form-select-sm" 
								v-model.number="form.lenDays"
								aria-label="Dĺžka obdobia"
								style="min-width: 8em;"
							>
								<option value="1">1 deň</option>
								<option value="3">3 dni</option>
								<option value="8">týždeň</option>
								<option value="31">mesiac</option>
								<option value="92">3 mesiace</option>
								<option value="183">pol roka</option>
								<option value="366">rok</option>
							</select>
						</div>
						<div class="col">
							Od:
						</div>
						<div class="col">
							<input 
								type="date" 
								v-model="form.dateFrom"
								:max="today()" 
								aria-label="date" id="date_from"/>
						</div>
						<div class="col btn-group" role="group" aria-label="Posun obdobia">
							<button @click="updateLink('plusmonth')" class="btn btn-outline-secondary btn-sm">+ mesiac</button>
							<button @click="updateLink('plusyear')" class="btn btn-outline-secondary btn-sm">+ rok</button>
						</div>
					</div>
				</td>
			</tr>
			<tr v-if="props.allowCompare">
				<td class="text-center">
					<div class="row">
						<div class="col btn-group" role="group" aria-label="Posun obdobia">
							<button @click="updateAltYear('minus')" class="btn btn-outline-secondary btn-sm">- rok</button>
						</div>
						<div class="col">
							Porovnávací rok:
						</div>
						<div class="col">
							<select class="form-select form-select-sm" v-model.number="form.altYear">
								<option :value="null"></option>
								<option v-for="year in props.years" :key="year" :value="Number(year)">{{ year }}</option>
							</select>
						</div>
						<div class="col btn-group" role="group" aria-label="Posun obdobia">
							<button @click="updateAltYear('plus')" class="btn btn-outline-secondary btn-sm">+ rok</button>
						</div>
					</div>
				</td>
			</tr>
		</tbody>
		</table>
	</div>
</template>
