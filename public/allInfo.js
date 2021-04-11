var mymap = L.map("chekins").setView([0, 0], 1);

L.tileLayer(
	"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
	{
		attribution:
			'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: "mapbox/streets-v11",
		tileSize: 512,
		zoomOffset: -1,
		accessToken:
			"pk.eyJ1IjoiZmVybmFuZG9oZWxvIiwiYSI6ImNrbXdzZ2ZqbTAxbmoycnA3Y2o4ZnVjcXoifQ.ru_eaai49GScr-IEMDEOdQ",
	}
).addTo(mymap);

getData();
async function getData() {
	const response = await fetch("/api");
	const data = await response.json();
	console.log(data);

	for(item of data) {
		const marker = L.marker([item.lat, item.lng]).addTo(mymap);
		const text = 
		`The temperature here is ${item.toCelcius} degrees celcius.<br>The concentration of particulate matter (PM 2.5) is ${item.pm2_5} ug/m3.`

		marker.bindPopup(text)
	};
}
