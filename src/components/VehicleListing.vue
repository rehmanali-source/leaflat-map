<template>
  <div class="vehicle-list p-2">
    <h5 class="mb-3 fw-bold text-primary border-bottom p-2 border-primary">
      Vehicle Listing
    </h5>

    <div
      v-for="vehicle in vehicles"
      :key="vehicle.vehicleId"
      class="card mb-3 shadow-sm p-3"
      @click="handleVehicle(vehicle)"
    >
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img :src="carIcon" alt="Car Icon" class="car-img me-3" />
          <h6 class="mb-0 fw-semibold ml-2">{{ vehicle.vehicleName }}</h6>
        </div>
        <span class="badge fs-6 px-3 py-2" :class="statusColor(vehicle.status)">
          {{ vehicle.status }}
        </span>
      </div>

      <div class="mt-2 pt-2 border-top">
        <div class="small text-muted mb-1 d-flex justify-content-between">
          <span> <strong>Number:</strong> {{ vehicle.vehicleNumber }} </span>
          <span> <strong>Type:</strong> {{ vehicle.vehicleType }} </span>
        </div>
        <div class="small mb-1 d-flex justify-content-between">
          <span> <strong>Speed:</strong> {{ vehicle.speed }} km/h </span>
          <span>
            <strong>Ignition:</strong>
            <span
              :class="
                vehicle.ignition === 'On' ? 'text-success' : 'text-danger'
              "
            >
              {{ vehicle.ignition }}
            </span>
          </span>
        </div>
        <div class="small mb-1 d-flex justify-content-between">
          <div class="small text-muted text-left">
            <strong>Driver:</strong> {{ vehicle.driver.name }}
          </div>
          <div class="small text-muted text-left">
            {{ vehicle.location.address }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { statusColor } from "@/utils";
import vehicleData from "../../vehicle.json";
import carIcon from "../assets/car.svg";

const vehicles = ref(vehicleData);

const emit = defineEmits(["handle-vehicle"]);

const handleVehicle = (vehicle) => {
  emit("handle-vehicle", vehicle);
};
</script>

<style scoped>
.vehicle-list {
  max-height: calc(100vh - 10px);
  overflow-y: auto;
  border-right: 1px solid grey;
}
.vehicle-list::-webkit-scrollbar {
  width: 6px;
}
.vehicle-list::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 6px;
}
.card {
  background-color: #2c3e5008;
  border-radius: 10px;
}
</style>
