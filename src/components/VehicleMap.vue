<template lang="">
  <div class="vehicle-map-container">
    <div id="vehicleMap" class="vehicle-map"></div>
  </div>
</template>

<script setup>
import L from "leaflet";
import vehicleData from "../../vehicle.json";
import carIcon from "../assets/car.svg";
import VehiclePopup from "./VehiclePopup.vue";
import { createApp, onBeforeUnmount, onMounted, ref, defineExpose } from "vue";
import "leaflet.markercluster";

const map = ref(null);
const markers = ref({});
const markerCluster = ref(null);

const createVehicleIcon = () =>
  L.icon({
    iconUrl: carIcon,
    iconSize: [45, 45],
  });

const createVehiclePopup = (vehicleId) => {
  const div = document.createElement("div");
  const popupApp = createApp(VehiclePopup, { vehicleId });
  popupApp.mount(div);
  return div;
};

const initMap = () => {
  map.value = L.map("vehicleMap").setView([51.5, -0.09], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map.value);

  L.Popup.prototype._animateZoom = function (e) {
    if (!this._map) {
      return;
    }
    var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
      anchor = this._getAnchor();
    L.DomUtil.setPosition(this._container, pos.add(anchor));
  };

  markerCluster.value = L.markerClusterGroup();

  map.value.addLayer(markerCluster.value);
};

const loadAllVehicles = () => {
  const icon = createVehicleIcon();

  vehicleData.forEach((vehicle) => {
    const { latitude, longitude } = vehicle.location;
    const marker = L.marker([latitude, longitude], {
      icon,
      vehicle: vehicle.vehicleName,
    });

    marker.bindPopup(createVehiclePopup(vehicle.vehicleId));
    markerCluster.value.addLayer(marker);
    markers.value[vehicle.vehicleId] = marker;
  });

  if (markerCluster.value.getLayers().length > 0) {
    map.value.fitBounds(markerCluster.value.getBounds());
  }
};

const activeVehicle = (vehicleId) => {
  const marker = markers.value[vehicleId];
  if (!marker || !map.value) return;

  map.value.whenReady(() => {
    const latLng = marker.getLatLng();
    map.value.setView(latLng, 14);
    marker.openPopup();
  });
};

defineExpose({
  activeVehicle,
});

onMounted(() => {
  initMap();
  loadAllVehicles();
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.off();
    map.value.remove();
    map.value = null;
  }
});
</script>

<style scoped>
.vehicle-map-container {
  width: 100%;
  height: 100%;
}
.vehicle-map {
  width: 100%;
  height: calc(100vh - 10px);
}
</style>
