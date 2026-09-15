const initializeMap = () => {
  const mapElement = document.getElementById("travelMap");
  if (!mapElement || !window.L) return;

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    worldCopyJump: false,
    maxBounds: [[-85, -180], [85, 180]],
    maxBoundsViscosity: 1,
    minZoom: 0,
    zoomSnap: 0.25
  });
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri",
    maxZoom: 16,
    noWrap: true
  }).addTo(map);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 16,
    noWrap: true
  }).addTo(map);
  map.fitBounds([[-55, -180], [75, 180]], { padding: [12, 12], maxZoom: 2.25 });

  const ciciPin = L.divIcon({
    className: "",
    html: '<span style="display:block;width:13px;height:13px;border:2px solid #17130e;border-radius:50%;background:#f6dfb5;box-shadow:0 0 0 2px rgba(217,154,36,.55),0 0 16px rgba(217,154,36,.38)"></span>',
    iconSize: [13, 13],
    iconAnchor: [6, 6]
  });
  const soloPin = L.divIcon({
    className: "",
    html: '<span style="display:block;width:13px;height:13px;border:2px solid #17130e;border-radius:50%;background:#9bc7dc;box-shadow:0 0 0 2px rgba(116,174,201,.55),0 0 16px rgba(116,174,201,.38)"></span>',
    iconSize: [13, 13],
    iconAnchor: [6, 6]
  });
  const destinations = [
    [21.1619, -86.8515, "Cancún", "Mexico", "cancun.html"], [28.1413, 86.8550, "Mount Everest", "Tibet, China", "tibet.html"], [25.0000, 101.5000, "Yunnan", "China", "yunnan.html"], [31.2304, 121.4737, "Shanghai", "China"], [39.9042, 116.4074, "Beijing", "China"], [39.3434, 117.3616, "Tianjin", "China"], [22.3193, 114.1694, "Hong Kong", "China"], [41.8057, 123.4315, "Shenyang", "China"], [23.1291, 113.2644, "Guangzhou", "China"], [37.8651, -119.5383, "Yosemite National Park", "California, USA", "yosemite.html"], [39.0968, -120.0324, "Lake Tahoe", "California / Nevada, USA", "laketahoe.html"], [34.1347, -116.3131, "Joshua Tree National Park", "California, USA", "joshuatree.html"], [38.7331, -109.5925, "Arches National Park", "Utah, USA"], [37.1870, -86.1005, "Mammoth Cave National Park", "Kentucky, USA"], [37.2982, -113.0263, "Zion National Park", "Utah, USA"], [46.8523, -121.7603, "Mount Rainier National Park", "Washington, USA"], [47.8021, -123.6044, "Olympic National Park", "Washington, USA"], [44.3386, -68.2733, "Acadia National Park", "Maine, USA"], [34.2439, -116.9114, "Big Bear", "California, USA"], [34.0522, -118.2437, "Los Angeles", "California, USA"], [33.3422, -118.3273, "Catalina Island", "California, USA"], [32.8801, -117.2340, "UC San Diego", "California, USA"], [36.1699, -115.1398, "Las Vegas", "Nevada, USA"], [33.8303, -116.5453, "Palm Springs", "California, USA"], [33.6846, -117.8265, "Irvine", "California, USA"], [40.7128, -74.0060, "New York", "USA"], [39.2904, -76.6122, "Baltimore", "Maryland, USA", "baltimore.html"], [43.6591, -70.2568, "Portland", "Maine, USA"], [37.7749, -122.4194, "San Francisco (Highway 1)", "California, USA"], [22.8905, -109.9167, "Los Cabos", "Mexico", "loscabos.html"], [44.4280, -110.5885, "Yellowstone", "Wyoming, USA", "yellowstone.html"], [43.7904, -110.6818, "Grand Teton", "Wyoming, USA", "yellowstone.html"], [25.7617, -80.1918, "Miami", "Florida, USA"], [38.5655, -78.2936, "Shenandoah", "Old Rag Mountain, Virginia", "baltimore.html"]
  ];
  const soloDestinations = [
    [15.8700, 100.9925, "Thailand", "Personal trip"], [64.5000, 11.0000, "Norway", "Personal trip"], [56.2639, 9.5018, "Denmark", "Personal trip"], [46.2276, 2.2137, "France", "Personal trip"], [46.8182, 8.2275, "Switzerland", "Personal trip"], [40.4637, -3.7492, "Spain", "Personal trip"], [39.3999, -8.2245, "Portugal", "Personal trip"], [42.8333, 12.8333, "Italy", "Personal trip"], [36.2048, 138.2529, "Japan", "Personal trip"], [35.9078, 127.7669, "South Korea", "Personal trip"], [39.0742, 21.8243, "Greece", "Personal trip"], [55.3781, -3.4360, "United Kingdom", "Personal trip"], [-25.2744, 133.7751, "Australia", "Personal trip"], [-40.9006, 174.8860, "New Zealand", "Personal trip"]
  ];
  const addMarkers = (items, icon) => items.forEach(([lat, lng, title, place, page]) => {
    L.marker([lat, lng], { icon }).bindPopup(`<strong>${title}</strong>${place}${page ? `<br><a href="${page}">Open story</a>` : ""}`).addTo(map);
  });
  addMarkers(destinations, ciciPin);
  addMarkers(soloDestinations, soloPin);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMap, { once: true });
} else {
  initializeMap();
}
