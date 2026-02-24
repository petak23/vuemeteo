<script setup>
const props = defineProps({
	views: {
		type: Object,
		default: null
	}
})
const getColor = (item) => {
		return 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
}

</script>

<template>	
	<div class="row">
		<h6 class="col-12 pt-2">Token</h6>
		<div class="col-12 mb-3" v-for="view in props.views.views" :key="view.id_view">
			<div class="w-100 bg-primary-subtle text-primary-emphasis p-1">{{ view.token }}</div>
			<table density="compact" theme="dark" class="table mt-2">
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
						</td>
					</tr>
					<tr>
						<td colspan="5">
							<table density="compact" theme="dark" class="table mb-0 table-sm">
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
											<span v-for="sid in item.sensorIds" :key="sid">
												{{ views.sensors[sid].dev_name }}:{{ views.sensors[sid].name }}
											</span>
										</td>
										<td>{{ item.source_desc }}</td>
										<td>{{ item.unit }} {{ views.sensors[item.sensorIds[0]].unit }}</td>
										<td>
											<i class="fa fa-angle-double-left" aria-hidden="true" v-if="item.axisY == 1"></i>
											{{ item.axisY == 1 ? 'ľavá' : 'pravá' }}
											<i class="fa fa-angle-double-right" aria-hidden="true" v-if="item.axisY == 2"></i>
										</td>
										<td>
											<div :style="{ width: '15px', height: '100%', backgroundColor: getColor(item.colors[1]) }">
												&nbsp;
											</div>
										</td>
										<td>
											<div :style="{ width: '15px', height: '100%', backgroundColor: getColor(item.colors[2]) }">
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