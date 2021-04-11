var mymap = L.map("mapid");

var marker = L.marker([0, 0]).addTo(mymap);

L.tileLayer(
	"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: "mapbox/streets-v11",
		tileSize: 512,
		zoomOffset: -1,
		accessToken: "pk.eyJ1IjoiZmVybmFuZG9oZWxvIiwiYSI6ImNrbXdzZ2ZqbTAxbmoycnA3Y2o4ZnVjcXoifQ.ru_eaai49GScr-IEMDEOdQ",
	}
).addTo(mymap);

if ("geolocation" in navigator) {
	console.log("geolocation available");
	navigator.geolocation.getCurrentPosition(async (position) => {
		try {
			//console.log(position);
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;
			document.getElementById("latitude").textContent = lat + "°";
			document.getElementById("longitude").textContent = lng + "°";
			mymap.setView([lat, lng], 5);
			marker.setLatLng([lat, lng]);

			async function sendLatLng() {
				const api_url = `/weather/${lat},${lng}`;
				const response_weather = await fetch(api_url);
				const data_weather = await response_weather.json();
				console.log(data_weather);
				
				let toCelcius = data_weather.weather.main.temp - 273.15;
				toCelcius = toCelcius.toFixed(2);
				const pm2_5 = data_weather.air_pollution.list[0].components.pm2_5;
				document.getElementById("temperature").textContent = toCelcius;
				document.getElementById("pm2_5").textContent = pm2_5;

				const db_data = { lat, lng, toCelcius, pm2_5 };
				const db_options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(db_data),
				};

				const db_response = await fetch("/api", db_options);
				const db_data_resp = await db_response.json();
				console.log(db_data_resp);
			};

			document.onreadystatechange = () => {
				if (document.readyState === "complete") {
					sendLatLng();
				}
			};
			document.getElementById("submit").onclick = sendLatLng;
		} catch (erro) {
			console.log("Something went wrong!");
		}
	});

	//document.getElementById('submit').onclick = sendLatLng;
} else {
	console.log("geolocation not available");
}