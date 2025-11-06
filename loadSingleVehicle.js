const loadVehicle = () => {
  this.currentVehicle = vehicleData.find(
    (vehicle) => vehicle.vehicleId === this.id
  );

  if (!this.currentVehicle) {
    console.warn("Vehicle not found for ID:", this.vehicleId);
    return;
  }
  const { latitude, longitude } = this.currentVehicle.location;

  const customIcon = L.icon({
    iconUrl: carIcon,
    iconSize: [45, 45],
  });

  let marker = this.markers[this.id];

  if (marker) {
    marker.setLatLng([latitude, longitude]);
  } else {
    marker = L.marker([latitude, longitude], {
      icon: customIcon,
    });

    const popupDiv = document.createElement("div");
    const popupApp = createApp(VehiclePopup, { vehicleId: this.id });
    popupApp.mount(popupDiv);
    marker.bindPopup(popupDiv);

    this.markerCluster.addLayer(marker);

    this.markers[this.id] = marker;
  }

  this.map.setView([latitude, longitude], 13);
};
