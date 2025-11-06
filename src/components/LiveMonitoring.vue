<template lang="">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4">
        <VehicleListing @handle-vehicle="setVehicleClickId" />
      </div>
      <div class="col-md-8">
        <VehicleMap ref="vehicleMap" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import VehicleListing from "./VehicleListing.vue";
import VehicleMap from "./VehicleMap.vue";

const vehicleMap = ref(null);

const setVehicleClickId = ({ vehicleId }) => {
  if (vehicleMap.value && vehicleMap.value.activeVehicle) {
    vehicleMap.value.activeVehicle(vehicleId);
  }
};
</script>
<style lang=""></style>
