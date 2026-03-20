<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
  dateFrom: { type: String, default: () => new Date().toISOString().split('T')[0] },
  lenDays: { type: Number, default: 1 },
  altYear: { type: [String, Number], default: '' },
  allowCompare: { type: Boolean, default: false },
  years: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:dateFrom', 'update:lenDays', 'update:altYear'])

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
  () => ({ ...form }),
  (value) => {
    emit('update:dateFrom', value.dateFrom)
    emit('update:lenDays', Number(value.lenDays))
    emit('update:altYear', value.altYear)
  },
  { deep: true }
)

const baseQuery = computed(() => {
  const params = new URLSearchParams()
  params.set('dateFrom', form.dateFrom || '')
  params.set('lenDays', String(form.lenDays || 1))
  params.set('altYear', String(form.altYear || ''))
  return params.toString()
})

function makeLink(extra = {}) {
  const params = new URLSearchParams(baseQuery.value)

  Object.entries(extra).forEach(([key, value]) => {
    params.set(key, String(value))
  })

  const query = params.toString()
  return `../../../../chart/sensor/show/${encodeURIComponent(props.id)}/?${query}`
}

function submitForm() {
  const url = makeLink({})
  window.location.href = url
}
</script>

<template>
  <div class="px-2 mb-2">
    <form @submit.prevent="submitForm">
      <table width="100%" cellspacing="0" cellpadding="3" border="0">
        <tr>
          <td>&nbsp;</td>
          <td align="center">
            Predvoľby:
            <a :href="makeLink({ currentday: 1 })">Aktuálny deň.</a>
            <a :href="makeLink({ current: 1 })">Posledné tri dni.</a>
            <a :href="makeLink({ currentweek: 1 })">Posledný týždeň.</a>
            <a :href="makeLink({ currentmonth: 1 })">Posledný mesiac.</a>
            <a :href="makeLink({ currentyear: 1 })">Tento rok.</a>
          </td>
          <td>&nbsp;</td>
        </tr>

        <tr>
          <td>
            <a
              :href="makeLink({ minus: 1 })"
              alt="Predchádzajúce obdobie"
              title="Predchádzajúce obdobie"
              ><i class="fa fa-arrow-circle-left fa-2x"></i></a
            >
          </td>
          <td align="center">
            <a :href="makeLink({ minusYear: 1 })">[- rok]</a>
            <a :href="makeLink({ minusMon: 1 })">[- mesiac]</a>
            Zobraz
            <select v-model.number="form.lenDays">
              <option value="1">1 deň</option>
              <option value="3">3 dni</option>
              <option value="8">týždeň</option>
              <option value="31">mesiac</option>
              <option value="92">3 mesiace</option>
              <option value="183">pol roka</option>
              <option value="366">rok</option>
            </select>
            od
            <input type="date" v-model="form.dateFrom" aria-label="date"/>
            <button type="submit">Zobraz!</button>
            <a :href="makeLink({ plusMon: 1 })">[+ mesiac]</a>
            <a :href="makeLink({ plusYear: 1 })">[+ rok]</a>
          </td>
          <td>
            <a
              :href="makeLink({ plus: 1 })"
              alt="Ďalšie obdobie"
              title="Ďalšie obdobie"
              ><i class="fa fa-arrow-circle-right fa-2x"></i></a
            >
          </td>
        </tr>

        <tr v-if="props.allowCompare">
          <td></td>
          <td align="center">
            <a :href="makeLink({ altminus: 1 })">[- rok]</a>
            Porovnávací rok:
            <select v-model="form.altYear">
              <option value=""></option>
              <option v-for="year in props.years" :key="year" :value="year">{{ year }}</option>
            </select>
            <button type="submit">Zobraz!</button>
            <a :href="makeLink({ altplus: 1 })">[+ rok]</a>
          </td>
          <td></td>
        </tr>
      </table>
    </form>
  </div>
</template>
