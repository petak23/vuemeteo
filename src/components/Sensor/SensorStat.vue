<script setup>
import { computed } from 'vue'

const props = defineProps({
  sensor_one: {
    type: Object,
    default: null
  }
})

const sensorName = computed(() => props.sensor_one.name || 'N/A')
const sensorValue = computed(() => props.sensor_one.value || 0)
const sensorUnit = computed(() => props.sensor_one.unit || '')
const sensorStatus = computed(() => props.sensor_one.status || 'inactive')
</script>

<template>
  <div class="sensor-stat">
    <h3>{{ sensorName }}</h3>
    <div class="sensor-content">
      <span class="sensor-value">{{ sensorValue }}</span>
      <span class="sensor-unit">{{ sensorUnit }}</span>
    </div>
    <div class="sensor-status" :class="sensorStatus">
      {{ sensorStatus }}
    </div>
  </div>
</template>

<style scoped>
.sensor-stat {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.sensor-content {
  font-size: 24px;
  margin: 12px 0;
}

.sensor-value {
  font-weight: bold;
  margin-right: 4px;
}

.sensor-unit {
  font-size: 14px;
  color: #666;
}

.sensor-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.sensor-status.active {
  background-color: #4caf50;
  color: white;
}

.sensor-status.inactive {
  background-color: #f44336;
  color: white;
}
</style>