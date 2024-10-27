<script>
    import { getDistance, getMapBounds } from '$lib'
    import { onMount } from 'svelte'
    import Geolocation from 'svelte-geolocation'

    import {
        Control,
        ControlButton,
        ControlGroup,
        DefaultMarker,
        FillLayer,
        GeoJSON,
        hoverStateFilter,
        LineLayer,
        MapEvents,
        MapLibre,
        Marker,
        Popup,
    } from 'svelte-maplibre'

    let markers = [
        {
            lngLat: { lng: 144.9638347277324, lat: -37.80967960080751 },
            name: 'Take a photo of Federation Square’s iconic architecture',
            label: 'Federation Square',
        },
        {
            lngLat: { lng: 144.969995, lat: -37.817221 },
            name: 'Reach Flinders Street Station in under 5 minutes for a bonus',
            label: 'Flinders Street Station',
        },
        {
            lngLat: { lng: 144.984661, lat: -37.819611 },
            name: 'Cycle safely around the Melbourne Cricket Ground perimeter',
            label: 'Melbourne Cricket Ground',
        },
        {
            lngLat: { lng: 144.9717383224767, lat: -37.803284097096956 },
            name: 'Visit Melbourne Museum and identify 3 artifacts for bonus points',
            label: 'Melbourne Museum',
        },
        {
            lngLat: { lng: 144.9656282506281, lat: -37.802673745787104 },
            name: 'Relax in Argyle Square and capture a scenic photo',
            label: 'Argyle Square',
        },
        {
            lngLat: { lng: 144.95397137079547, lat: -37.78980433144111 },
            name: 'Observe local wildlife in Royal Park without disturbing them',
            label: 'Royal Park',
        },
        {
            lngLat: { lng: 144.98297141414045, lat: -37.78735397173653 },
            name: 'Do a quick lap around Edinburgh Gardens and earn a health bonus',
            label: 'Edinburgh Gardens',
        },
        {
            lngLat: { lng: 144.9627475592528, lat: -37.80225836544848 },
            name: 'Find a quiet spot in Lincoln Square and meditate for 5 minutes',
            label: 'Lincoln Square',
        },
        {
            lngLat: { lng: 144.9817697854466, lat: -37.84131937258544 },
            name: 'Navigate Fawkner Park bike trails to earn a safety bonus',
            label: 'Fawkner Park',
        },
        {
            lngLat: { lng: 144.92724584357123, lat: -37.836909200670476 },
            name: 'Take a photo of the sunset at Port Melbourne Beach',
            label: 'Port Melbourne Beach',
        },
        {
            lngLat: { lng: 144.9501009455486, lat: -37.78354049074126 },
            name: 'Cycle to Melbourne Zoo and identify 3 animal exhibits',
            label: 'Melbourne Zoo',
        },
        {
            lngLat: { lng: 144.90739613731589, lat: -37.78638984192456 },
            name: 'Arrive at Flemington Racecourse before noon for bonus points',
            label: 'Flemington Racecourse',
        },
        {
            lngLat: { lng: 144.96100276706855, lat: -37.798344272443856 },
            name: 'Visit University of Melbourne and learn one fact for extra points',
            label: 'University of Melbourne',
        },
        {
            lngLat: { lng: 144.95424896508666, lat: -37.81050019842236 },
            name: 'Take a break at Flagstaff Gardens and earn a stamina boost',
            label: 'Flagstaff Gardens',
        },
        {
            lngLat: { lng: 144.94702, lat: -37.8206 },
            name: 'Check out Docklands’ artwork and capture a picture',
            label: 'Docklands',
        },
        {
            lngLat: { lng: 144.9834313984615, lat: -37.81961159201031 },
            name: 'Cycle through the Royal Botanic Gardens safely to earn rewards',
            label: 'Royal Botanic Gardens',
        },
        {
            lngLat: { lng: 144.9890747661773, lat: -37.8129921701347 },
            name: 'Cycle to Darling Square and find a unique landmark',
            label: 'Darling Square',
        },
        {
            lngLat: { lng: 144.99403148796972, lat: -37.78842477466465 },
            name: 'Pause at Mayor’s Park and take a scenic shot of the trees',
            label: 'Mayor’s Park',
        },
        {
            lngLat: { lng: 144.9613514535756, lat: -37.78494839648465 },
            name: 'Take a lap around Princes Park in under 3 minutes for speed bonus',
            label: 'Princes Park',
        },
        {
            lngLat: { lng: 144.978728, lat: -37.821164 },
            name: 'Visit the Shrine of Remembrance and pay respects for extra points',
            label: 'Shrine of Remembrance',
        },
    ]

    // Define the options variable for geolocation
    const options = {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0,
    }

    let bounds = getMapBounds(markers)
    let getPosition = false
    let success = false
    let error = ''
    let position = {}
    let coords = []
    let weatherInfo = {}
    let showWeather = false

    // Define the addMarker function
    function addMarker(event, label, name) {
        markers = [
            ...markers,
            { lngLat: event.detail.lngLat, label, name },
        ]
    }

    async function fetchWeatherData(lat, lon) {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=2faec65baed44b68acd111824242610&q=${lat},${lon}`)
        return await response.json()
    }

    async function checkCurrentWeather() {
        weatherInfo = await fetchWeatherData(-37.8136, 144.9631)
        showWeather = true
    }
    $: if (success || error) {
        getPosition = false
    }

    $: if (success) {
        coords = [position.coords.longitude, position.coords.latitude]
        markers = [
            ...markers,
            {
                lngLat: { lng: coords[0], lat: coords[1] },
                label: 'Current Position',
                name: 'This is the current position',
            },
        ]
    }

    let watchPosition = false
    let watchedPosition = {}
    let watchedMarker = {}
    let count = 0

    $: if (watchedPosition.coords) {
        watchedMarker = {
            lngLat: { lng: watchedPosition.coords.longitude, lat: watchedPosition.coords.latitude },
        }
        markers.forEach((marker) => {
            const distance = getDistance([watchedMarker, marker])
            const threshold = 10
            if (distance <= threshold) {
                count += 1
            }
        })
    }

    let showGeoJSON = false
    let geojsonData

    onMount(async () => {
        const response = await fetch('melbourne.geojson')
        geojsonData = await response.json()
    })
</script>

<div class="flex flex-col h-[calc(100vh-80px)] w-full">
    <div class="grid grid-cols-4 gap-4 p-4">
        <div class="col-span-4 md:col-span-1 text-center">
            <h1 class="font-bold">Click button to get a one-time current position and add it to the map</h1>
            <button
                class="btn btn-neutral px-6 py-3 text-center"
                on:click={() => { getPosition = true }}>
                Get geolocation
            </button>
            <Geolocation
                {getPosition}
                options={options}
                bind:position
                let:loading
                bind:success
                bind:error
                let:notSupported
            >
                {#if notSupported}
                    Your browser does not support the Geolocation API.
                {:else}
                    {#if loading}
                        Loading...
                    {/if}
                    {#if success}
                        Success!
                    {/if}
                    {#if error}
                        An error occurred. Error code {error.code}: {error.message}.
                    {/if}
                {/if}
            </Geolocation>
            <p class="break-words text-left">Coordinates: {coords}</p>
            <p class="break-words text-left">Position: {JSON.stringify(position)}</p>
        </div>

        <div class="col-span-4 md:col-span-1 text-center">
            <h1 class="font-bold">Automatically updated position when moving</h1>
            <button
                class="btn btn-neutral px-6 py-3 text-center"
                on:click={() => { watchPosition = true }}>
                Start watching
            </button>
            <Geolocation
                getPosition={watchPosition}
                options={options}
                watch={true}
                on:position={(e) => { watchedPosition = e.detail }}
            />
            <p class="break-words text-left">watchedPosition: {JSON.stringify(watchedPosition)}</p>
        </div>

        <div class="col-span-4 md:col-span-1 text-center">
            <h1 class="font-bold">Toggle Melbourne Suburbs</h1>
            <button
                class="btn btn-neutral px-6 py-3 text-center"
                on:click={() => { showGeoJSON = !showGeoJSON }}>
                Toggle
            </button>
        </div>

        <div class="col-span-4 md:col-span-1 text-center">
            <h1 class="font-bold">Check Current Weather</h1>
            <button
                class="btn btn-neutral px-6 py-3 text-center"
                on:click={checkCurrentWeather}>
                Click
            </button>
        </div>

        <div class="col-span-4 text-center">
            <h1 class="font-bold">Found {count} markers</h1>
            <p>The count will go up by one each time you are within 10 meters of a marker.</p>
        </div>
    </div>

    {#if showWeather}
        <div class="weather-info text-center font-bold p-4 bg-blue-100 rounded-md my-4">
            <h2>Weather Information (Melbourne)</h2>
            <p>Temperature: {weatherInfo.current?.temp_c}°C</p>
            <p>Humidity: {weatherInfo.current?.humidity}%</p>
            <p>Wind Speed: {weatherInfo.current?.wind_kph} km/h</p>
        </div>
    {/if}

    <MapLibre
        center={[144.9631, -37.8136]}
        class="map flex-grow min-h-[500px]"
        standardControls
        style="https://tiles.basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        bind:bounds
        zoom={10}
    >
        <Control class="flex flex-col gap-y-2">
            <ControlGroup>
                <ControlButton on:click={() => { bounds = getMapBounds(markers) }}>
                    Fit
                </ControlButton>
            </ControlGroup>
        </Control>

        <MapEvents on:click={event => addMarker(event, 'Added', 'This is an added marker')} />

        {#if showGeoJSON}
            <GeoJSON
                id="geojsonData"
                data={geojsonData}
                promoteId="name">
                <FillLayer
                    paint={{
                        'fill-color': hoverStateFilter('purple', 'yellow'),
                        'fill-opacity': 0.3,
                    }}
                    beforeLayerType="symbol"
                    manageHoverState
                >
                    <Popup
                        openOn="hover"
                        let:data>
                        {@const props = data?.properties}
                        {#if props}
                            <div class="flex flex-col gap-2">
                                <p>{props.name}</p>
                            </div>
                        {/if}
                    </Popup>
                </FillLayer>
                <LineLayer
                    layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                    paint={{ 'line-color': 'purple', 'line-width': 3 }}
                    beforeLayerType="symbol" />
            </GeoJSON>
        {/if}

        {#each markers as { lngLat, label, name }, i (i)}
            <Marker
                {lngLat}
                class="grid px-4 py-2 place-items-center rounded-md border border-gray-200 bg-red-300 text-black shadow-2xl focus:outline-2 focus:outline-black"
            >
                <span>{label}</span>
                <Popup
                    openOn="hover"
                    offset={[0, -10]}>
                    <div class="text-lg font-bold">{name}</div>
                </Popup>
            </Marker>
        {/each}

        <Popup
            lngLat={{ lng: 144.9631, lat: -37.8136 }}
            offset={[0, -10]}>
            <div class="text-sm font-bold">
                Temperature: {weatherInfo.current?.temp_c}°C <br />
                Humidity: {weatherInfo.current?.humidity}% <br />
                Wind Speed: {weatherInfo.current?.wind_kph} km/h
            </div>
        </Popup>

        {#if watchedMarker.lngLat}
            <DefaultMarker lngLat={watchedMarker.lngLat}>
                <Popup offset={[0, -10]}>
                    <div class="text-lg font-bold">You</div>
                </Popup>
            </DefaultMarker>
        {/if}
    </MapLibre>
</div>
