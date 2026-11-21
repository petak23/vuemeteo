<script setup>
import { RouterLink } from 'vue-router'
const props = defineProps({
	views: {
		type: Object,
		default: null
	}
})
// Farba položky; chýbajúca farba (napr. pri neúplných dátach) -> priehľadná
const getColor = (color) => {
	if (color == null) return 'transparent'
	return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'
}

// Senzor podľa id; zmazaný / neznámy senzor nespôsobí pád šablóny
const sensorById = (sid) => props.views?.sensors?.[sid] ?? null
const sensorLabel = (sid) => {
	const s = sensorById(sid)
	return s ? s.dev_name + ':' + s.name : '(neznámy senzor #' + sid + ')'
}

</script>

<template>	
	<div class="row">
		<h6 class="col-12 pt-2">Token</h6>
		<div class="col-12 mb-3" v-for="view in props.views.views" :key="view.id">
			<div class="w-100 bg-primary-subtle text-primary-emphasis p-1">{{ view.token }}</div>
			<table class="table mt-2">
				<thead>
					<tr>
						<th>Pohľad</th>
						<th>#</th>
						<th>Zobrazenie</th>
						<th>Popis</th>
						<th>Akcia</th>
					</tr>
				</thead>
				<tbody>
					<tr class="table-info">
						<td>{{ view.name }}</td>
						<td>{{ view.vorder }}</td>
						<td>{{ view.render }}</td>
						<td>{{ view.vdesc }}</td>
						<td>
							<ul class="mb-0">
								<li v-for="source in view.data_sources" :key="source.id_data_source">
									{{ source.name }}
								</li>
							</ul>
							<RouterLink :to="`/view/edit/${view.id}`" class="btn btn-sm btn-outline-primary">
								<i class="fa-solid fa-pen me-1"></i>Upraviť
							</RouterLink>
						</td>
					</tr>
					<tr>
						<td colspan="5">
							<table class="table mb-0 table-sm">
								<thead>
									<tr>
										<th>Senzory</th>
										<th>Použitá hodnota</th>
										<th>Jednotka</th>
										<th>Os Y</th>
										<th>Aktuálny rok</th>
										<th>Zrovnávací rok</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="item in view.items" :key="item.id">
										<td>
											<span v-for="sid in item.sensorIds" :key="sid" class="me-2">
												{{ sensorLabel(sid) }}
											</span>
										</td>
										<td>{{ item.source_desc }}</td>
										<td>{{ item.unit }} {{ sensorById(item.sensorIds?.[0])?.unit ?? '' }}</td>
										<td>
											<i class="fa fa-angle-double-left" aria-hidden="true" v-if="item.axisY == 1"></i>
											{{ item.axisY == 1 ? 'ľavá' : 'pravá' }}
											<i class="fa fa-angle-double-right" aria-hidden="true" v-if="item.axisY == 2"></i>
										</td>
										<td>
											<div :style="{ width: '15px', height: '100%', backgroundColor: getColor(item.colors?.[1]) }">
												&nbsp;
											</div>
										</td>
										<td>
											<div :style="{ width: '15px', height: '100%', backgroundColor: getColor(item.colors?.[2]) }">
												&nbsp;
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>