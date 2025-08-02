<script>
import { onMounted, ref } from 'vue'
import MainService from '../services/MainService'

export default {
	setup () {

		const items = ref(null)

		onMounted(()=> {
			getUnits();
		}) 

		const getUnits = () => {
			MainService.getUnits()
				.then(response => {
					items.value = response.data
				})
				.catch((error) => {
					console.log(error);
				});
		}
	
		return { items }
	}
}
</script>

<template>
	<table density="compact" theme="dark" v-if="items != null" class="table">
		<tbody class="big">
			<tr>
				<th>Id</th>
				<td v-for="(unit, id) in items" :key="id">{{ id }}</td>
			</tr>
			<tr>
				<th>Meno</th>
				<td v-for="(unit, id) in items" :key="id">{{ unit }}</td>
			</tr>
		</tbody>
		<tbody class="small">
			<tr>
				<th>Id</th>
				<th>Meno</th>
			</tr>
			<tr v-for="(unit, id) in items" :key="id">
				<td>{{ id }}</td>
				<td>{{ unit }}</td>
			</tr>
		</tbody>
	</table>
</template>


<style lang="scss" scoped>
	.table{
		margin-top: 1rem;

		th {
			border-right: 2px solid #999;
		}
	}
	.small td {
		border-right: 1px solid #aaa;
	}
	.big {
		display: none;
	}
	@media (min-width: 720px) {
		.small{
			display: none;
		}
		.big {
			display: block;
		}
	}
</style>