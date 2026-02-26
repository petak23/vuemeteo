<script setup>
import { ref, watch } from "vue"
import MainService from '../services/MainService'

const props = defineProps({
  sensor: {
    type: Object,
    default: () => ({
      desc: "",
      msg_rate: 3600,
      display_nodata_interval: 7200,
      preprocess_data: 0,
      preprocess_factor: null,
      warn_max: 0,
      warn_max_val: null,
      warn_max_val_off: null,
      warn_max_after: 0,
      warn_max_text: null,
      warn_min: 0,
      warn_min_val: null,
      warn_min_val_off: null,
      warn_min_after: 0,
      warn_min_text: null,
    }),
  },
});

const emit = defineEmits(["save", "cancel"]);

const formData = ref({ ...props.sensor });

watch(
  () => props.sensor,
  (val) => {
    formData.value = { ...val };
  },
  { deep: true }
);

const handleSubmit = () => {
  MainService.postSensorEdit(props.sensor.id, formData.value)
    .then(response => {
      if (response.data.status == 200) {
        emit("save", formData.value);
      } else {
        console.error("Error saving sensor:", response.data.message);
      }
    })
    .catch(error => {
      console.error("Error saving sensor:", error);
    });
};

const handleCancel = () => {
  emit("cancel");
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="container mt-4">
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Základné údaje</h5>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="desc" class="form-label">Popis</label>
          <textarea
            id="desc"
            v-model="formData.desc"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="msg_rate" class="form-label">
            Očakávaný interval dát [s]
          </label>
          <input
            id="msg_rate"
            v-model.number="formData.msg_rate"
            type="number"
            class="form-control"
            min="0"
          />
          <small class="form-text text-muted">
            Ak zo senzora prídu dáta s väčším odstupom, monitoring ho bude
            označovať za nefunkčný. 0 = interval sa nekontroluje.
          </small>
        </div>

        <div class="mb-3">
          <label for="display_nodata_interval" class="form-label">
            Maximálny interval dát [s]
          </label>
          <input
            id="display_nodata_interval"
            v-model.number="formData.display_nodata_interval"
            type="number"
            class="form-control"
            min="0"
          />
          <small class="form-text text-muted">
            Ak budú zaznamenané dáta s väčším rozostupom, v grafe nebudú
            spojené čiarou; graf bude prerušený.
          </small>
        </div>

        <div class="form-check mb-3">
          <input
            id="preprocess_data"
            v-model="formData.preprocess_data"
            type="checkbox"
            class="form-check-input"
          />
          <label for="preprocess_data" class="form-check-label">
            Násobiť nameranú hodnotu
          </label>
          <small class="form-text text-muted d-block">
            Ak je zaškrtnuté, nameraná hodnota sa bude násobiť zadaným
            koeficientom.
          </small>
          <div v-if="formData.preprocess_data" class="mt-2">
            <label for="preprocess_factor" class="form-label">Koeficient násobenia</label>
            <input
              id="preprocess_factor"
              v-model.number="formData.preprocess_factor"
              type="number"
              step="any"
              class="form-control"
            />
            <small class="form-text text-muted d-block">Zadajte reálne číslo, ktorým sa bude hodnota násobiť.</small>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Poplach pri vysokej hodnote</h5>
      </div>
      <div class="card-body">
        <div class="form-check mb-3">
          <input
            id="warn_max"
            v-model="formData.warn_max"
            type="checkbox"
            class="form-check-input"
          />
          <label for="warn_max" class="form-check-label">
            Zapnúť zasielanie
          </label>
          <small class="form-text text-muted d-block">
            Ak je zaškrtnuté, budú sa zasielať notifikácie pri dosiahnutí alebo
            prekročení maxima.
          </small>
        </div>
        
        <div v-if="formData.warn_max" class="border-top pt-3">
          <div class="mb-3">
            <label for="warn_max_val" class="form-label">Spustiť varovanie pri:</label>
            <input
              id="warn_max_val"
              v-model.number="formData.warn_max_val"
              type="number"
              step="any"
              class="form-control"
            />
            <small class="form-text text-muted d-block">Poplach sa generuje pri prekročení tejto hodnoty.</small>
          </div>
          
          <div class="mb-3">
            <label for="warn_max_val_off" class="form-label">Vypnúť varovanie pri:</label>
            <input
              id="warn_max_val_off"
              v-model.number="formData.warn_max_val_off"
              type="number"
              step="any"
              class="form-control"
            />
            <small class="form-text text-muted d-block">Poplach končí pri pokles hodnoty pod tento limit. 
              Odporúčame nastaviť o trochu menej, ako je hodnota, pri ktorej sa varovanie spúšťa - aby pri oscilácii 
              nameranej hodnoty okolo limitu nešla jedna notifikácia za druhou (tzv. hysteréza).</small>
          </div>
          
          <div class="mb-3">
            <label for="warn_max_after" class="form-label">Notifikáciu poslať po:</label>
            <input
              id="warn_max_after"
              v-model.number="formData.warn_max_after"
              type="number"
              class="form-control"
              min="0"
            />
            <small class="form-text text-muted d-block">Počet sekúnd, počas ktorých musí byť hodnota nad limitom, aby bola notifikácia odoslaná. 0 = hneď.</small>
          </div>
          
          <div class="mb-3">
            <label for="warn_max_text" class="form-label">Informatívny text (max):</label>
            <input
              id="warn_max_text"
              v-model="formData.warn_max_text"
              type="text"
              maxlength="50"
              class="form-control"
            />
            <small class="form-text text-muted d-block">Tento text bude súčasťou varovania. (Maximálne 50 znakov)</small>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Poplach pri nízkej hodnote</h5>
      </div>
      <div class="card-body">
        <div class="form-check mb-3">
          <input
            id="warn_min"
            v-model="formData.warn_min"
            type="checkbox"
            class="form-check-input"
          />
          <label for="warn_min" class="form-check-label">
            Zapnúť zasielanie
          </label>
          <small class="form-text text-muted d-block">
            Ak je zaškrtnuté, budú sa zasielať notifikácie pri dosiahnutí alebo
            prekročení minima.
          </small>
        </div>
        
        <div v-if="formData.warn_min" class="border-top pt-3">
          <div class="mb-3">
            <label for="warn_min_val" class="form-label">Spustiť varovanie pri:</label>
            <input
              id="warn_min_val"
              v-model.number="formData.warn_min_val"
              type="number"
              step="any"
              class="form-control"
            />
            <small class="form-text text-muted d-block">Poplach sa generuje pri pokles pod túto hodnotu.</small>
          </div>
          
          <div class="mb-3">
            <label for="warn_min_val_off" class="form-label">Vypnúť varovanie pri:</label>
            <input
              id="warn_min_val_off"
              v-model.number="formData.warn_min_val_off"
              type="number"
              step="any"
              class="form-control"
            />
            <small class="form-text text-muted d-block">Poplach končí pri vzostupe hodnoty nad tento limit. Odporúčame nastaviť o trochu viac, ako je hodnota, pri ktorej sa varovanie spúšťa - aby pri oscilácii nameranej hodnoty okolo limitu nešla jedna notifikácia za druhou (tzv. hysteréza).</small>
          </div>
          
          <div class="mb-3">
            <label for="warn_min_after" class="form-label">Notifikáciu poslať po:</label>
            <input
              id="warn_min_after"
              v-model.number="formData.warn_min_after"
              type="number"
              class="form-control"
              min="0"
            />
            <small class="form-text text-muted d-block">Počet sekúnd, počas ktorých musí byť hodnota pod limitom, aby bola notifikácia odoslaná. 0 = hneď.</small>
          </div>
          
          <div class="mb-3">
            <label for="warn_min_text" class="form-label">Informatívny text (min):</label>
            <input
              id="warn_min_text"
              v-model="formData.warn_min_text"
              type="text"
              maxlength="50"
              class="form-control"
              placeholder="Nepovinné"
            />
            <small class="form-text text-muted d-block">Tento text bude súčasťou varovania. (Maximálne 50 znakov)</small>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex gap-2 mb-4">
      <button type="submit" class="btn btn-primary">Uložiť</button>
      <button type="button" class="btn btn-secondary" @click="handleCancel">
        Zrušiť
      </button>
    </div>
  </form>
</template>