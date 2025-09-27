var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=01sE8JZlhmPkBYwE6XjT', {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);


fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson')
    .then(response => response.json())
    .then(data => {

        countriesLayer = L.geoJSON(data, {
            style: {
                color: '#9caab5',
                weight: 1,
                fillColor: '#8a9299',
                fillOpacity: 0.3
            },

            onEachFeature: function (feature, layer) {
                selectedCountry = null;
                previousCountry = null;
                layer.on('click', function (x) {

                    const countryName = feature.properties.sovereignt;
                    getCountryHistory(countryName)
                    if (selectedCountry && selectedCountry !== layer) {
                        countriesLayer.resetStyle(selectedCountry);
                    }

                    layer.setStyle({
                        fillColor: '#2a3138ff',
                        fillOpacity: 0.5
                    })
                    previousCountry = selectedCountry;
                    selectedCountry = layer



                });
            }
        }).addTo(map);
    });

function getCountryHistory(countryName) {
    countryName = countryName.replace(/ /g, "_");

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`)
        .then(response => response.json())
        .then(data => {
            resumoPais = data.extract_html
            document.getElementById("resumoPais").innerHTML = resumoPais
        })
        .catch(error => {
            console.error("Erro ao buscar Wikipedia:", error);
        });
}