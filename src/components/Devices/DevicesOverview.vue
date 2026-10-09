<script setup>
import dayjs from 'dayjs'; //https://day.js.org/docs/en/display/format

import { useMainStore } from '../../stores/main.js'
const store = useMainStore()

const format_date = (value) => {
	const date = dayjs(value);
	// Then specify how you want your dates to be formatted
	return date.format('D.M.YYYY HH:mm:ss');
}
</script>

<template v-if="store.devices != null">
	<div v-for="item in store.devices" :key="item.id" class="col">
		<div class="card h-100 bg-light-subtle border-warning">
			<h5 class="card-header">
				{{ item.name }}
			</h5>
			<div class="card-body">
				<p class="card-text"><small>
					{{ item.desc }}<br />{{ Object.keys(item.sensors).length }} senzorov.<br />
					<span v-if="Object.keys(item.sensors).length">
						Posledné meranie:<br />{{ format_date(Object.values(item.sensors)[0].last_data_time) }}
					</span>
					<span v-else class="text-danger">Nemám hodnoty o meraniach!</span>
				</small></p>
				<h6 class="card-title" v-if="Object.keys(item.sensors).length">Posledné hodnoty zo senzorov:</h6>
				<ul class="list-group list-group-flush" v-if="Object.keys(item.sensors).length">
					<li 
						v-for="sen in item.sensors"
						:key="sen.id"
						class="list-group-item"
					>
						<small>
							{{ sen.name }} ( {{ format_date(sen.last_data_time) }} ) {{ sen.last_out_value.toFixed(2) }} {{ sen.value_unit }}
							<br /><span class="text-muted fs-7">{{ sen.desc }}</span>
						</small>
					</li>
				</ul>
			</div>
			<div class="card-footer" v-if="store.is_logged_in">
				<div class="d-flex justify-content-end pt-2">
					<RouterLink :to="'device/' + item.id" class="btn btn-outline-secondary">
						Viac info <i class="fa-solid fa-angles-right"></i>
					</RouterLink>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	.fs-7
		font-size: 0.8rem
</style>