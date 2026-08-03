<script setup lang="ts">
import { ref, computed} from 'vue'

const modal1 = ref(false)
const modal2 = ref(false)
const sname = ref("")

const props = defineProps({
	sensor: {
		type: Object,
		required: true
	}
})

const viewDelete = computed(() => {
	return props.sensor.name == sname.value
})

const emit = defineEmits(['deletem'])

const hideModals = () => {
	modal1.value = false
	modal2.value = false
	sname.value = ""
}

const doDelete = () => {
	hideModals()	
	emit('deletem', props.sensor.id)
}
</script>

<template>
  <BButton
		variant="danger"
		class="ms-4" 
		@click="modal1 = !modal1"
	>
		<i class="fa-solid fa-circle-exclamation me-1"></i>Odstrániť senzor
	</BButton>
  <BModal
    v-model="modal1"
		centered
		body-bg-variant="danger"
		body-text-variant="white"
  >
		<template #title>
			<i class="fa-solid fa-circle-exclamation me-1 text-danger"></i>Vymazanie senzora: {{ props.sensor.name }}!!!
		</template>
		<div class="text-center">
    	Chcete naozaj vymazať senzor <b>{{ props.sensor.name }}</b>? <br />Po vymazaní sa už nedá obnoviť.
			<br />
			<i class="fa-solid fa-circle-exclamation me-1 text-white fa-3x"></i><br />
			Pozor!!! Budú vymazané aj všetky namerané hodnoty senzora a jeho sumárne dáta.
			<br /><br />
			<b>Zároveň budú vymazané aj všetky grafy v ktorých sa senzor používa!!!</b>
			<br />
			Pre vymazanie napíš názov senzora:
			<input type="text" v-model="sname" />
		</div>
		<template #footer>
			<BButton variant="secondary" @click="hideModals">Zrušiť</BButton>
			<BButton 
				variant="outline-danger" 
				@click="modal2 = !modal2"
				:disabled="!viewDelete"
				:class="viewDelete ? '': 'disabled'"
			>Odstrániť</BButton>
		</template>
  </BModal>
	<BModal
		v-model="modal2"
		centered
		body-bg-variant="danger"
		body-text-variant="white"
		title="Naozaj?!?"
	>
		Naozaj vymazať senzor: {{ props.sensor.name }}?
		<template #footer>
			<BButton variant="secondary" @click="hideModals">NIE</BButton>
			<BButton 
				variant="outline-danger" 
				@click="doDelete"
				:disabled="!viewDelete"
				:class="viewDelete ? '': 'disabled'"
			>Áno</BButton>
		</template>
	</BModal>
</template>

