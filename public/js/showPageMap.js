mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [139.77, 35.68], // starting position [lng, lat]
        zoom: 9 // starting zoom
});
