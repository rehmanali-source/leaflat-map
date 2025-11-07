<template lang="">
  <div class="base-map-container">
    <div :id="mapId" class="base-map"></div>

    <teleport v-if="popupContainer" :to="popupContainer">
      <div class="popup-wrapper">
        <slot name="popup" :item="activeItem" />
      </div>
    </teleport>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  defineProps,
  onBeforeUnmount,
  defineEmits,
  defineExpose,
  nextTick,
} from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import carIcon from "../assets/car.svg";

const props = defineProps({
  mapId: { type: String, default: "baseMap" },
  items: { type: Array, required: true },
  getLatLng: { type: Function, required: true },
  customIcon: { type: Function, default: null },
  zoom: { type: Number, default: 10 },
  maxZoom: { type: Number, default: 19 },
  initialCenter: { type: Array, default: () => [25.276987, 55.296249] },
  getMarkerKey: { type: Function, required: true },
});

const map = ref(null);
const markerCluster = ref(null);
const markers = ref({});
const popupContainer = ref(null);
const activeItem = ref(null);
const activeMarker = ref(null);

const defaultIcon = L.icon({
  iconUrl: carIcon,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -27],
});

const emit = defineEmits(["marker-click"]);

const initMap = () => {
  const { mapId, initialCenter, zoom, maxZoom } = props;

  map.value = L.map(mapId, {
    zoomAnimation: false,
    markerZoomAnimation: false,
  }).setView(initialCenter, zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom,
    attribution: "© OpenStreetMap",
  }).addTo(map.value);

  markerCluster.value = L.markerClusterGroup();
  map.value.addLayer(markerCluster.value);
};

const loadMarkers = () => {
  const { items, getLatLng, customIcon, getMarkerKey } = props;

  items.forEach((item) => {
    const [lat, lng] = getLatLng(item);
    if (!lat || !lng) return;
    const popupDiv = L.DomUtil.create("div", "popup-map");

    const marker = L.marker([lat, lng], {
      icon: customIcon ? customIcon(item) : defaultIcon,
    });

    marker.bindPopup(popupDiv, { maxWidth: "420px" }).on("click", () => {
      activeMarker.value = marker;
      activeItem.value = item;
      popupContainer.value = popupDiv;
      marker.openPopup();
      emit("marker-click", item);
    });

    markerCluster.value.addLayer(marker);
    markers.value[getMarkerKey(item)] = marker;
  });

  if (markerCluster.value.getLayers().length > 0) {
    map.value.fitBounds(markerCluster.value.getBounds());
  }
};

const focusMarker = async (id, currentItem) => {
  const marker = markers.value[id];
  if (!marker || !currentItem) return;

  activeMarker.value = marker;
  activeItem.value = currentItem;
  const [lat, lng] = props.getLatLng(currentItem);
  map.value.setView([lat, lng], 16);

  marker.openPopup();

  const content = marker.getPopup()?.getElement()?.querySelector(".popup-map");
  popupContainer.value = content;

  await nextTick();

  marker.getPopup()?.update();
};

defineExpose({ focusMarker });

onMounted(() => {
  initMap();
  loadMarkers();
});

onBeforeUnmount(() => {
  map.value?.off();
  map.value?.remove();
});
</script>

<style>
.base-map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.base-map {
  width: 100%;
  height: calc(100vh - 10px);
}
.popup-wrapper {
  width: 100%;
  height: auto;
}
</style>
