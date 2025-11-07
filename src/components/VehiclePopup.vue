<template>
  <div class="vehicle-popup p-2" style="min-width: 280px" v-if="vehicle">
    <div class="d-flex align-items-center">
      <div class="flex-grow-1">
        <h6 class="mb-1 fw-bold text-primary">
          {{ vehicle.vehicleName }}
        </h6>
        <p class="mb-1 text-muted small">{{ vehicle.vehicleNumber }}</p>

        <div class="small">
          <span class="badge me-1" :class="statusColor(vehicle.status)">
            {{ vehicle.status }}
          </span>
          <span class="text-muted ml-2">Ignition: {{ vehicle.ignition }}</span>
        </div>
      </div>
    </div>

    <hr class="my-2" />

    <div class="d-flex justify-content-between text-center small">
      <div>
        <i class="bi bi-speedometer2 text-primary"></i>
        <div>
          <strong>Speed: {{ vehicle.speed }}</strong> km/h
        </div>
      </div>
      <div>
        <i class="bi bi-fuel-pump text-success"></i>
        <div>
          <strong>Fuel: {{ vehicle.fuelLevel }}</strong
          >%
        </div>
      </div>
      <div>
        <i class="bi bi-thermometer-half text-danger"></i>
        <div>
          <strong>Temp: {{ vehicle.engineTemperature }}</strong
          >°C
        </div>
      </div>
      <div>
        <i class="bi bi-battery-half text-warning"></i>
        <div>
          <strong>Battery: {{ vehicle.batteryVoltage }}</strong
          >V
        </div>
      </div>
    </div>

    <hr class="my-2" />

    <div class="small text-muted">
      <div>
        <i class="bi bi-person-fill text-primary"></i>
        {{ vehicle.driver.name }} ({{ vehicle.driver.contact }})
      </div>
      <div>
        <i class="bi bi-geo-alt-fill text-danger"></i>
        {{ vehicle.location.address }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { statusColor } from "@/utils";

defineProps({
  vehicle: Object,
});
</script>

<style scoped>
.vehicle-popup {
  min-width: 180px;
  font-size: 0.85rem;
  line-height: 1.4;
}
</style>
