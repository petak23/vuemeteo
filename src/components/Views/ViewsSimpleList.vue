<script setup>
const props = defineProps({
	views: {
		type: Object,
		default: null
	}
})
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
					<tr>
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
				</tbody>
			</table>
		</div>
	</div>
</template>