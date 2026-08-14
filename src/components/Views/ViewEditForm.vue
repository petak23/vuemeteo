<script setup>
import { computed, reactive, ref, onMounted, watch } from 'vue'

// Nette's Form::addProtection() adds a hidden CSRF token field rendered
// server-side. In a decoupled Vue app there is no such field to render;
// the CSRF token typically has to come from the backend (e.g. embedded
// in the page, fetched from an endpoint, or handled via a same-site
// cookie + header pair). Adjust to match how your API expects it.
const props = defineProps({
	csrfToken: {
		type: String,
		default: '',
	},
	id: {
		type: Number,
		default: 0
	},
	view: {
		type: Object,
		default: () => ({
			name: '',
			app_name: '',
			vdesc: '',
			token: '',
			allow_compare: false,
			render: 'chart',
			vorder: 10,
		}),
	},
})

const emit = defineEmits(['success'])

const renders = {
	chart: 'Základný graf',
	coverage: 'Zobrazenie pokrytia dát',
	avgtemp: 'Priemerná teplota',
	avgyears0: 'Porovnanie priemernej teploty',
	avgyears1: 'Porovnanie minimálnej teploty',
	line: 'Vodorovné čiary - vhodné pre smer vetra',
	bar: 'Stĺpcový graf - vhodné pre zrážky',
}

// mirrors PHP's Random::generate(40) — a 40-char alphanumeric token
function generateToken(length = 40) {
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

const form = reactive({
	name: '',
	app_name: '',
	vdesc: '',
	token: generateToken(40),
	allow_compare: false,
	render: 'chart',
	vorder: 10,
})

const errors = reactive({
	name: '',
	app_name: '',
	vdesc: '',
	token: '',
	render: '',
	vorder: '',
})

const valid = reactive({
	name: null,
	app_name: null,
	token: null,
	render: null,
	vorder: null,
})

const validForm = ref(false)

const submitting = ref(false)

function clearErrors() {
	Object.keys(errors).forEach((key) => (errors[key] = ''))
}

const validate = computed(() => {
	/*clearErrors()
	validateName()
	validateAppName()
	validateToken()
	validateRender()
	validateVorder()*/

	validForm.value = !Object.values(valid).some((value) => value === false)
	return validForm.value 
})

/*const validate = () => {
	clearErrors()
	validateName()
	validateAppName()
	validateToken()
	validateRender()
	validateVorder()

	validForm.value = !Object.values(valid).some((value) => value === false)
	return validForm.value
}*/

const validateName = () => {
	if (!form.name.trim()) {
		errors.name = 'Toto pole je povinné a musí byť vyplnené.'
		valid.name = false
	} else {
		errors.name = ''
		valid.name = true
	}
}

const validateAppName = () => {
	if (!form.app_name.trim()) {
		errors.app_name = 'Toto pole je povinné a musí byť vyplnené.'
		valid.app_name = false
	} else {
		errors.app_name = ''
		valid.app_name = true
	}
}

const validateToken = () => {
	if (!form.token.trim()) {
		errors.token = 'Toto pole je povinné a musí byť vyplnené.'
		valid.token = false
	} else if (!/^[0-9A-Za-z-]+$/.test(form.token)) {
		errors.token = 'Len písmena, čísla a pomlčka'
		valid.token = false
	} else {
		errors.token = ''
		valid.token = true
	}
}

const validateRender = () => {
	if (!form.render.length) {
		errors.render = 'Toto pole je povinné. Musíte vybrať nejakú možnosť.'
		valid.render = false
	} else {
		errors.render = ''
		valid.render = true
	}
}

const validateVorder = () => {
	if (form.vorder === null || form.vorder === '' || Number.isNaN(form.vorder)) {
		errors.vorder = 'Toto pole je povinné a musíte zadať číslo väčšie ako 0.'
		valid.vorder = false
	} else {
		errors.vorder = ''
		valid.vorder = true
	}
}

watch(() => form.token, () => {
	validateToken()
})

watch(() => form.name, () => {
	validateName()
})

watch(() => form.app_name, () => {
	validateAppName()
})

watch(() => form.render, () => {
	validateRender()
})

watch(() => form.vorder, () => {
	validateVorder()
})

async function handleSubmit() {
	if (!validate()) return

	submitting.value = true
	try {
		const response = await fetch('/api/view-form', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// adjust to your CSRF scheme, e.g.:
				// 'X-CSRF-Token': props.csrfToken,
			},
			body: JSON.stringify(form),
		})

		if (!response.ok) {
			throw new Error(`Server vrátil chybu: ${response.status}`)
		}

		const data = await response.json()
		emit('success', data)
	} catch (err) {
		// basic fallback error handling — replace with your app's approach
		console.error(err)
		alert('Uloženie sa nepodarilo. Skúste to prosím znovu.')
	} finally {
		submitting.value = false
	}
}

const classType = (type) => {
	return type == null ? '' : (type ? 'is-valid' : 'is-invalid')
}

onMounted(() => {
	if (props.id > 0) {
		form.name = props.view.name
		form.app_name = props.view.app_name
		form.vdesc = props.view.vdesc
		form.token = props.view.token
		form.allow_compare = props.view.allow_compare
		form.render = props.view.render
		form.vorder = props.view.vorder
	}
})
watch(() => props.view, () => {
	if (props.id > 0) {
		form.name = props.view.name
		form.app_name = props.view.app_name
		form.vdesc = props.view.vdesc
		form.token = props.view.token
		form.allow_compare = props.view.allow_compare
		form.render = props.view.render
		form.vorder = props.view.vorder
	}
})
</script>

<template>
	<form @submit.prevent="handleSubmit" class="view-form">

		<!-- name -->
		<div class="form-group">
			<label class="form-label" for="name">Meno grafu:</label>
			<input
				id="name"
				v-model="form.name"
				type="text"
				size="50"
				required
				class="form-control"
				@blur="validateName"
				:class="classType(valid.name)"
			/>
			<div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
			<div class="form-text">
				Bude zobrazené ako nadpis nad grafom a ako meno voľby v ľavom menu.
			</div>
		</div>

		<!-- app_name -->
		<div class="form-group">
			<label class="form-label" for="app_name">Meno aplikácie:</label>
			<input
				id="app_name"
				v-model="form.app_name"
				type="text"
				size="50"
				required
				class="form-control"
				@blur="validateAppName"
				:class="classType(valid.app_name)"
			/>
			<div v-if="errors.app_name" class="invalid-feedback">{{ errors.app_name }}</div>
			<div class="form-text">Bude zobrazené v šedom pruhu hore.</div>
		</div>

		<!-- vdesc -->
		<div class="form-group">
			<label class="form-label" for="vdesc">Popis:</label>
			<textarea
				id="vdesc"
				v-model="form.vdesc"
				rows="8"
				cols="80"
				class="form-control"
			></textarea>
		</div>

		<!-- token -->
		<div class="form-group">
			<label class="form-label" for="token">Zabezpečovací token:</label>
			<input
				id="token"
				class="form-control"
				v-model="form.token"
				type="text"
				size="50"
				pattern="[0-9A-Za-z\-]+"
				title="Jen písmena, čísla, pomlčka"
				required
				@blur="validateToken"
				:class="classType(valid.token)"
			/>
			<div v-if="errors.token" class="invalid-feedback">{{ errors.token }}</div>
			<div class="form-text">
				Stane sa súčasťou URL. Zadejte dlhý náhodný text. Všetky grafy s
				rovnakým tokenom budú viditeľné v jednom bloku a budú mať spoločné ľavé menu.
			</div>
			
		</div>

		<!-- allow_compare -->
		<div class="form-group form-check">
			<input
				id="allow_compare"
				v-model="form.allow_compare"
				type="checkbox"
				class="form-check-input"
			/>
			<label for="allow_compare" class="form-check-label">
				Povoliť porovnávanie
			</label>
			<div class="form-text">
				Pokiaľ je zaškrtnuté, bude ponúknutá možnost porovnávania s iným rokom.
			</div>
		</div>

		<!-- render -->
		<div class="form-group">
			<label for="render" class="form-label">Vykreslovací stroj:</label>
			<select 
				id="render" 
				v-model="form.render" 
				required
				class="form-select"
				@blur="validateRender"
				:class="classType(valid.render)"
			>
				<option value="" disabled>- Zvolte spôsob vykreslenia -</option>
				<option
					v-for="(label, value) in renders"
					:key="value"
					:value="value"
				>
					{{ label }}
				</option>
			</select>
			<div v-if="errors.render" class="invalid-feedback">{{ errors.render }}</div>
		</div>

		<!-- vorder -->
		<div class="form-group">
			<label class="form-label" for="vorder">Poradie:</label>
			<input
				id="vorder"
				v-model.number="form.vorder"
				type="number"
				step="1"
				required
				class="form-control"
				aria-describedby="vorderHelpBlock"
			/>
			<div v-if="errors.vorder" class="invalid-feedback">{{ errors.vorder }}</div>
			<div id="vorderHelpBlock" class="form-text">
				Poradie v menu - ak je viac grafov s rovnakým tokenom, radia sa podľa
				tejto hodnoty. Vyššie číslo = viac hore.
			</div>
		</div>

		<!-- submit -->
		<div class="form-group">
			<button class="btn btn-success" type="submit" :disabled="!validForm || submitting">
				{{ submitting ? 'Ukládám…' : 'Uložit' }}
			</button>
			<button class="btn btn-outline-secondary ms-2" type="submit">
				Zruš
			</button>
		</div>

	</form>
</template>


<style scoped>
.view-form {
	max-width: 640px;
}
.form-group {
	margin-bottom: 1.25rem;
}
.form-group label {
	display: block;
	font-weight: 600;
	margin-bottom: 0.25rem;
}
input[type='text'],
input[type='number'],
textarea,
select {
	width: 100%;
	max-width: 500px;
	padding: 0.4rem;
	box-sizing: border-box;
}
/*.form-text {
	color: #666;
	font-size: 0.85rem;
	margin: 0.25rem 0 0;
}*/
.error {
	color: #c0392b;
	font-size: 0.85rem;
	margin: 0.25rem 0 0;
}
</style>
