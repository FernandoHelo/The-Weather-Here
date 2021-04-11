const express = require('express');
const Datastore = require('nedb');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config();

//console.log(process.env.API_KEY);

app.listen(3000, () => console.log('listening on port 3000'));
app.use(express.static('public'));
app.use(
    express.json({
        limit: '1mb'
    })
);

const database = new Datastore('database.db');
database.loadDatabase();
//database.insert({ name: "Sheefman", status: "🌈" });
//database.insert({ name: "Daniel", status: "🚆" });
//const database = [];

app.post('/api', (request, response) => {
    console.log('I got a request!');
    //console.log(request.body);

    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.get('/weather/:latlng', async (request, response) => {
    const latlng = request.params.latlng.split(',');
    //console.log(latlng);
    const lat = latlng[0];
    const lng = latlng[1];
    const api_key = process.env.API_KEY;
    
    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const airPollution_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${api_key}`;
    const air_pollution_response = await fetch(airPollution_url);
    const air_pollution_data = await air_pollution_response.json();
    
    const data = {
        weather: weather_data,
        air_pollution: air_pollution_data,
    };

    response.json(data);
});
