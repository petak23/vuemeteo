<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
	id: { type: [String, Number], required: true },
	dateFrom: { type: String, default: () => new Date().toISOString().split('T')[0] },
	lenDays: { type: Number, default: 1 },
	altYear: { type: [String, Number], default: '' },
	allowCompare: { type: Boolean, default: true },
	years: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:dateFrom', 'update:lenDays', 'update:altYear',
													'update:minus', 'update:plus', 'update:current'])

const form = reactive({
	dateFrom: props.dateFrom,
	lenDays: props.lenDays,
	altYear: props.altYear ?? '',
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

const currentSend = (val) => {
	emit("update:current", val)
}
const minustSend = (val) => {
	emit("update:minus", val)
}
const plusSend = (val) => {
	emit("update:plus", val)
}
const dateFromSend = (val) => {
	emit("update:dateFrom", val)
}

function submitForm() {
}
</script>

<template>
	<div class="col-12">
		<table width="100%" class="table table-borderless table-sm border border-warning">
			<tbody>
			<tr>
				<td :rowspan="props.allowCompare ? 3 : 2" class="align-middle">
					<button
						@click="minustSend('now')"
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
						<button type="button" @click="currentSend('day')" class="btn btn-outline-secondary btn-sm">Aktuálny deň.</button>
						<button type="button" @click="currentSend('now')" class="btn btn-outline-secondary btn-sm">Posledné tri dni.</button>
						<button type="button" @click="currentSend('week')" class="btn btn-outline-secondary btn-sm">Posledný týždeň.</button>
						<button type="button" @click="currentSend('month')" class="btn btn-outline-secondary btn-sm">Posledný mesiac.</button>
						<button type="button" @click="currentSend('year')" class="btn btn-outline-secondary btn-sm">Tento rok.</button>
					</div>
				</td>
				<td :rowspan="props.allowCompare ? 3 : 2" class="align-middle">
					<button
						@click="plusSend('now')"
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
							<button @click="minustSend('year')" class="btn btn-outline-secondary btn-sm">- rok</button>
							<button @click="minustSend('month')" class="btn btn-outline-secondary btn-sm">- mesiac</button>
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
							<button @click="plusSend('month')" class="btn btn-outline-secondary btn-sm">+ mesiac</button>
							<button @click="plusSend('year')" class="btn btn-outline-secondary btn-sm">+ rok</button>
						</div>
					</div>
				</td>
			</tr>
			<tr v-if="props.allowCompare">
				<td class="align-center">
					<div class="row">
						<div class="col btn-group" role="group" aria-label="Posun obdobia">
							<button @click="minustSend('altyear')" class="btn btn-outline-secondary btn-sm">- rok</button>
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
							<button @click="plusSend('altyear')" class="btn btn-outline-secondary btn-sm">+ rok</button>
						</div>
					</div>
				</td>
			</tr>
		</tbody>
		</table>
	</div>
</template>
