<template>
  <div class="vehicle-map-container">
    <div id="vehicleMap" class="vehicle-map"></div>

    <teleport v-if="popupContainer" :to="popupContainer">
      <div class="popup-wrapper">
        <slot name="popup" :vehicle="activeVehicleData" />
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineExpose, nextTick } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import vehicleData from "../../vehicle.json";
import carIcon from "../assets/car.svg";

const map = ref(null);
const markerCluster = ref(null);
const markers = ref({});
const popupContainer = ref(null);
const activeVehicleData = ref(null);
const activeMarker = ref(null);

const createVehicleIcon = () =>
  L.icon({
    iconUrl: carIcon,
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -27],
  });

const initMap = () => {
  map.value = L.map("vehicleMap", {
    zoomAnimation: false,
    markerZoomAnimation: false,
  }).setView([51.5, -0.09], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map.value);

  markerCluster.value = L.markerClusterGroup();
  map.value.addLayer(markerCluster.value);
};

const loadAllVehicles = () => {
  const icon = createVehicleIcon();

  vehicleData.forEach((vehicle) => {
    const { latitude, longitude } = vehicle.location;
    const popupDiv = L.DomUtil.create("div", "popup-map");

    const marker = L.marker([latitude, longitude], {
      icon,
      vehicleId: vehicle.id,
    });

    marker.bindPopup(popupDiv, { maxWidth: "420px" }).on("click", async () => {
      activeMarker.value = marker;
      activeVehicleData.value = vehicle;

      marker.openPopup();

      popupContainer.value = popupDiv;
      await nextTick();
      marker.getPopup()?.update();
    });

    markerCluster.value.addLayer(marker);
    markers.value[vehicle.id] = marker;
  });

  if (markerCluster.value.getLayers().length > 0) {
    map.value.fitBounds(markerCluster.value.getBounds());
  }
};

const activeVehicle = async (vehicleId) => {
  const vehicle = vehicleData.find((v) => v.id === vehicleId);
  if (!vehicle) return;

  const marker = markers.value[vehicle.id];
  if (!marker) return;

  activeMarker.value = marker;
  activeVehicleData.value = vehicle;

  const { latitude, longitude } = vehicle.location;
  map.value.setView([latitude, longitude], 16);

  marker.openPopup();
  const contentContainer = marker
    .getPopup()
    ?.getElement()
    ?.querySelector(".popup-map");

  popupContainer.value = contentContainer;
  await nextTick();
  marker.getPopup()?.update();
};

defineExpose({ activeVehicle });

onMounted(() => {
  initMap();
  loadAllVehicles();
});

onBeforeUnmount(() => {
  map.value?.off();
  map.value?.remove();
});
</script>

<style scoped>
.vehicle-map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.vehicle-map {
  width: 100%;
  height: calc(100vh - 10px);
}

.popup-wrapper {
  width: 100%;
  height: auto;
}
</style>
