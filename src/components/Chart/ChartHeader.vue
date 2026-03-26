<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
	id: { type: [String, Number], required: true },
	dateFrom: { type: String, default: () => new Date().toISOString().split('T')[0] },
	lenDays: { type: Number, default: 3 },
	altYear: { type: [String, Number], default: null },
	allowCompare: { type: Boolean, default: true },
	years: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:dateFrom', 'update:lenDays', 'update:altYear',
													'update:minus', 'update:plus', 
													'update:link',
												])

const form = reactive({
	dateFrom: props.dateFrom,
	lenDays: props.lenDays,
	altYear: props.altYear ?? null,
})

watch(
	() => props.dateFrom,
	(value) => {
		form.dateFrom = value
	}
)
watch(
	() => props.lenDays,
	(value) => {
		form.lenDays = value
	}
)
watch(
	() => props.altYear,
	(value) => {
		form.altYear = value
	}
)
watch(
	() => form.dateFrom,
	(value) => {
		dateFromSend(value)
	}
)
watch(
	() => form.lenDays,
	(value) => {
		emit('update:lenDays', Number(value))
	}
)
watch
(
	() => form.altYear,
	(value) => {
		if (value === "") {
			form.altYear = null
		}
		emit('update:altYear', form)
	}
)

function addDays(dateStr, days = 0) {
  const d = new Date(dateStr)      // 2026-03-26
  d.setDate(d.getDate() + days)    // + alebo - dní
  return d.toISOString().split('T')[0]
}

const updateLink = (val) => {
	const d = new Date().toISOString().split('T')[0]
	switch (val) {
		case 'day':
			form.dateFrom = addDays(d)
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
			form.dateFrom = new Date(Date.UTC(d.getFullYear(), 0, 1)).toISOString().split('T')[0]
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

	emit('update:link', form)
}

const updateAltYear = (val) => {
	switch (val) {
		case 'minus':
			form.altYear = form.altYear ? Number(form.altYear) - 1 : null
			break;
		case 'plus':
			form.altYear = form.altYear ? Number(form.altYear) + 1 : null
			break;
		default:
			break;
	}
	//emit("update:altYear", form) // emit by sa mal udiať cez watch
}
const dateFromSend = (val) => {
	emit("update:dateFrom", val)
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
				<td class="align-center">
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
				<td class="align-center">
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
								:max="new Date().toISOString().split('T')[0]" 
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
				<td class="align-center">
					<div class="row">
						<div class="col btn-group" role="group" aria-label="Posun obdobia">
							<button @click="updateAltYear('minus')" class="btn btn-outline-secondary btn-sm">- rok</button>
						</div>
						<div class="col">
							Porovnávací rok:
						</div>
						<div class="col">
							<select class="form-select form-select-sm" v-model="form.altYear">
								<option value=""></option>
								<option v-for="year in props.years" :key="year" :value="year">{{ year }}</option>
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
