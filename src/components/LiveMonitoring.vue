<template lang="">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4">
        <VehicleListing @handle-vehicle="handleVehicleClick" />
      </div>
      <div class="col-md-8">
        <BaseMap
          :items="vehicleData"
          :get-lat-lng="(v) => [v.location.latitude, v.location.longitude]"
          :get-marker-key="(vehicle) => vehicle.id"
          @marker-click="handleVehicleClick"
          ref="baseMapRef"
        >
          <template #popup="{ item }">
            <VehiclePopup v-if="item" :vehicle="item" />
          </template>
        </BaseMap>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VehicleListing from "./VehicleListing.vue";
import BaseMap from "./BaseMap.vue";
import VehiclePopup from "./VehiclePopup.vue";
import vehicleData from "../../vehicle.json";
const baseMapRef = ref(null);

const handleVehicleClick = (vehicle) => {
  baseMapRef.value?.focusMarker(vehicle.id, vehicle);
};
</script>
<style lang=""></style>
