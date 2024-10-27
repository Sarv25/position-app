<!-- <script> tag includes JavaScript code -->
<script>
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
    } from 'svelte-maplibre' // DoNotChange

    /**
     * You can put functions you need for multiple components in a js file in
     * the lib folder, export them in lib/index.js and then import them like this
     */
    import { getDistance, getMapBounds } from '$lib'

    /**
     * Declare variables
     * let decalres an immutable variable
     * const declares a constant
     *
     * Note the format of markers
     */

    let markers = [
        {
            lngLat: {
                lng: 144.9638347277324,
                lat: -37.80967960080751,
            },
            label: 'Marker 1',
            name: 'This is a marker',
        },
        {
            lngLat: {
                lng: 144.96318039790924,
                lat: -37.808357984258315,
            },
            label: 'Marker 2',
            name: 'This is a marker',
        },
        {
            lngLat: {
                lng: 144.96280297287632,
                lat: -37.80668719932231,
            },
            label: 'Marker 3',
            name: 'This is a marker',
        },
        {
            lngLat: {
                lng: 144.9717383224767,
                lat: -37.803284097096956,
            },
            label: 'Marker 4',
            name: 'Melbourne Museum',
        },
        {
            lngLat: {
                lng: 144.9656282506281,
                lat: -37.802673745787104,
            },
            label: 'Marker 5',
            name: 'Argyle Square',
        },
        {
            lngLat: {
                lng: 144.95397137079547,
                lat: -37.78980433144111,
            },
            label: 'Marker 6',
            name: 'Royal Park',
        },
        {
            lngLat: {
                lng: 144.98297141414045,
                lat: -37.78735397173653,
            },
            label: 'Marker 7',
            name: 'Edinburgh Gardens',
        },
        {
            lngLat: {
                lng: 144.9627475592528,
                lat: -37.80225836544848,
            },
            label: 'Marker 8',
            name: 'Licoln Square',
        },
        {
            lngLat: {
                lng: 144.9817697854466,
                lat: -37.84131937258544,
            },
            label: 'Marker 9',
            name: 'Fawkner Park',
        },
        {
            lngLat: {
                lng: 144.92724584357123,
                lat: -37.836909200670476,
            },
            label: 'Marker 10',
            name: 'Port Melbourne',
        },
        {
            lngLat: {
                lng: 144.9501009455486,
                lat: -37.78354049074126,
            },
            label: 'Marker 11',
            name: 'Melbourne Zoo',
        },
        {
            lngLat: {
                lng: 144.90739613731589,
                lat: -37.78638984192456,
            },
            label: 'Marker 12',
            name: 'Flemington Racecourse',
        },
        {
            lngLat: {
                lng: 144.96100276706855,
                lat: -37.798344272443856,
            },
            label: 'Marker 13',
            name: 'University of Melbounre',
        },
        {
            lngLat: {
                lng: 144.95424896508666,
                lat: -37.81050019842236,
            },
            label: 'Marker 14',
            name: 'Flagstaff Gardens',
        },
        {
            lngLat: {
                lng: 144.96280297287632,
                lat: -37.80668719932231,
            },
            label: 'Marker 15',
            name: 'Marvel Stadium',
        },
        {
            lngLat: {
                lng: 144.9834313984615,
                lat: -37.81961159201031,
            },
            label: 'Marker 16',
            name: 'Melbourne Cricket Ground',
        },
        {
            lngLat: {
                lng: 144.9890747661773,
                lat: -37.8129921701347,
            },
            label: 'Marker 17',
            name: 'Darling Sqaure',
        },
        {
            lngLat: {
                lng: 144.99403148796972,
                lat: -37.78842477466465,
            },
            label: 'Marker 18',
            name: 'Mayors Park',
        },
        {
            lngLat: {
                lng: 144.9613514535756,
                lat: -37.78494839648465,
            },
            label: 'Marker 19',
            name: 'Princess Park',
        },
    ]

    // Extent of the map
    let bounds = getMapBounds(markers)

    /**
     * Declaring a function
     *
     * Functions declared in <script> can only be used in this component
     */

    function addMarker(e, label, name) {
        markers = [
            ...markers,
            {
                lngLat: e.detail.lngLat,
                label,
                name,
            },
        ]
    }

    // Geolocation API related
    const options = {
        enableHighAccuracy: true,
        timeout: 10000, // milliseconds
        maximumAge: 0, // milliseconds, 0 disables cached positions
    }
    let getPosition = false
    let success = false
    let error = ''
    let position = {}
    let coords = []
    const accuracyThreshold = 15
    let showPopup = false
    let watchPosition = false
    let watchedPosition = {}

    // Function to get position and check accuracy
    function checkPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options) // CHANGE HERE
        }
        else {
            errorMessage = 'Geolocation is not supported by this browser.'
        }
    }

    // Success callback
    function successCallback(pos) {
        position = pos
        // Check if the accuracy is above the threshold
        if (pos.coords.accuracy > accuracyThreshold) { // CHANGE HERE
            showPopup = true // Show popup if not GNSS-based // CHANGE HERE
        }
        else {
            showPopup = false
        }
    }

    // Error callback
    function errorCallback(error) {
        errorMessage = `Error occurred: ${error.message}`
        showPopup = true // Show popup if an error occurred // CHANGE HERE
    }

    /**
     * $: indicates a reactive statement, meaning that this block of code is
     * executed whenever the variable used as the condition changes its value
     *
     * In this case: whenever success is set to true, a Position object
     * has been successfully obtained. Immediately update the relevant variables
     */
    $: if (success || error) {
        // reset the flag
        getPosition = false
    }

    $: if (success) {
        coords = [position.coords.longitude, position.coords.latitude]
        markers = [
            ...markers,
            {
                lngLat: { lng: coords[0], lat: coords[1] },
                label: 'Current',
                name: 'This is the current position',
            },
        ]
    }

    // Watch a position using Geolocation API if you need continuous updates

    let watchedMarker = {}

    /**
     * Trigger an action when getting close to a marker
     */
    let count = 0 // number of markers found
    $: if (watchedPosition.coords) { // this block is triggered when watchedPosition is updated
        // The tracked position in marker format
        watchedMarker = {
            lngLat: {
                lng: watchedPosition.coords.longitude,
                lat: watchedPosition.coords.latitude,
            },
        }

        // Whenever the watched position is updated, check if it is within 10 meters of any marker
        markers.forEach((marker) => {
            const distance = getDistance([watchedMarker, marker])

            const threshold = 10

            if (distance <= threshold) {
                count += 1
            }
        })
    }

    /**
     * Variables can be initialised without a value and populated later
     * WARNING: this can lead to errors if the variable is used before being
     * assigned a value
     */

    let showGeoJSON = false
    let geojsonData
    let bicycle_route
    let showbicycle_route = false
    let road
    let showroad = false
    let style = 'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

    /**
     * onMount is executed immediately after the component is mounted, it can be
     * used to load large datasets or to execute code required after the page
     * has been loaded
     *
     * async/await indicate an asynchronous function (i.e., program is paused
     * when a line marked with await starts and resumes when it is resolved)
     *
     * Asset files (e.g., data files, images) can be put in static folder
     *
     * Another way to load data files is to use a URL to the file hosted
     * on a remote server. Try this by replacing 'melbourne.geojson' with
     * 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/melbourne.geojson'
     */
    onMount(async () => {
        const response = await fetch('melbourne.geojson')
        geojsonData = await response.json()
    })
    // Check position when the page loads
    onMount(() => {
        checkPosition() // CHANGE HERE
    })
    onMount(async () => {
        const response = await fetch('bicycle_route.geojson')
        bicycle_route = await response.json()
    })
    onMount(async () => {
        const response = await fetch('road.geojson')
        road = await response.json()
    })
</script>

<!-- Everything after <script> will be HTML for rendering -->

<!-- This section demonstrates how to get the current user location -->
<div class="flex flex-col h-[calc(100vh-80px)] w-full">
    <!-- Popup shown when accuracy is low (non-GNSS source) -->
    {#if showPopup} <!-- Add this part in your HTML -->
        <div class="popup bg-red-500 text-white p-4 rounded">
            <p>Warning: Your location is being determined using Wi-Fi or another source, not GNSS. This may affect accuracy.</p>
        </div>
    {/if}

    <!-- grid, grid-cols-#, col-span-#, md:xxxx are some Tailwind utilities you can use for responsive design -->
    <div class="grid grid-cols-4">
        <div class="col-span-4 md:col-span-1 text-center">
            <h1 class="font-bold">Click button to get a one-time current position and add it to the map</h1>

            <!-- on:click declares what to do when the button is clicked -->
            <!-- In the HTML part, {} tells the framework to treat what's inside as code (variables or functions), instead of as strings -->
            <!-- () => {} is an arrow function, almost equivalent to function foo() {} -->
            <button
                class="btn btn-neutral"
                on:click={() => { getPosition = true }}
            >
                Get geolocation
            </button>

            <!-- <Geolocation> tag is used to access the Geolocation API -->
            <!-- {getPosition} is equivalent to getPosition={getPosition} -->
            <!-- bind:variable associates the parameter with the variable with the same name declared in <script> reactively -->
            <!-- let:variable creates a variable for use from the component's return -->
            <Geolocation
                {getPosition}
                options={options}
                bind:position
                let:loading
                bind:success
                bind:error
                let:notSupported
            >
                <!-- If-else block syntax -->
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
            <!-- Objects cannot be directly rendered, use JSON.stringify() to convert it to a string -->
            <p class="break-words text-left">Position: {JSON.stringify(position)}</p>

            <div class="text-center font-medium text-red-500">Note that in some browsers, you cannot repeatedly request the current location. If you need to continuously update the location, use the watch option below.</div>
        </div>

        <!-- This section demonstrates how to get automatically updated user location -->
        <div class="col-span-4 md:col-span-1 text-center">
            <h1 class="font-bold">Automatically updated position when moving</h1>

            <button
                class="btn btn-neutral"
                on:click={() => { watchPosition = true }}
            >
                Start watching
            </button>

            <Geolocation
                getPosition={watchPosition}
                options={options}
                watch={true}
                on:position={(e) => {
                    watchedPosition = e.detail
                }}
            />

            <p class="break-words text-left">watchedPosition: {JSON.stringify(watchedPosition)}</p>
        </div>
        <div class="col-span-3 md:col-span-1 text-center">
            <h1 class="font-bold">Switch Basemap</h1>

            <!-- Dropdown to change the basemap -->

            <select
                class="select"
                bind:value={style}>
                <option value="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json">Positron</option>
                <option value="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json">Voyager</option>
                <option value="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json">Dark Matter</option>
            </select>
        </div>
        <div class="col-span-3 md:col-span-1 text-center">
            <h1 class="font-bold">Toggle Melbourne Suburbs</h1>

            <button
                class="btn btn-neutral"
                on:click={() => { showGeoJSON = !showGeoJSON }}
            >
                Toggle
            </button>
        </div>

        <div class="col-span-4 md:col-span-1 text-center">
            <h1 class="font-bold">Found {count} markers</h1>

            The count will go up by one each time you are within 10 meters of a marker.
        </div>
        <div class="col-span-3 md:col-span-1 text-center">
            <h1 class="font-bold"> bicycle_route</h1>

            <button
                class="btn btn-neutral"
                on:click={() => { showbicycle_route = !showbicycle_route }}
            >
                Click here to check bicycle route
            </button>
        </div>
        <div class="col-span-3 md:col-span-1 text-center">
            <h1 class="font-bold"> road </h1>

            <button
                class="btn btn-neutral"
                on:click={() => { showroad = !showroad }}
            >
                Click here to check road
            </button>
        </div>
    </div>

    <!-- This section demonstrates how to make a web map using MapLibre -->
    <!-- More basemap options -->
    <!-- "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" -->
    <!-- "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" -->
    <!-- "https://tiles.basemaps.cartocdn.com/gl/voyager-gl-style/style.json" -->
    <MapLibre
        center={[144.97, -37.81]}
        class="map flex-grow min-h-[500px]"
        standardControls
        {style}
        bind:bounds
        zoom={14}
    >
        <!-- Custom control buttons -->
        <Control class="flex flex-col gap-y-2">
            <ControlGroup>
                <ControlButton
                    on:click={() => {
                        bounds = getMapBounds(markers)
                    }}
                >
                    Fit
                </ControlButton>
            </ControlGroup>
        </Control>

        <!-- A map event to add a marker when clicked -->
        <MapEvents on:click={event => addMarker(event, 'Added', 'This is an added marker')} />

        <!-- This is how GeoJSON datasets are rendered -->
        <!-- promoteId must be a unique ID field in properties of each feature -->
        {#if showGeoJSON}
            <GeoJSON
                id="geojsonData"
                data={geojsonData}
                promoteId="name"
            >
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
                        let:data
                    >
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
                    beforeLayerType="symbol"
                />
            </GeoJSON>
        {/if}
        <!-- Add Bicycle Route GeoJSON layer -->
        {#if showbicycle_route}
            <GeoJSON
                id="bicycleRoutes"
                data={bicycle_route}
                promoteId="route_id">
                <LineLayer
                    layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                    paint={{ 'line-color': 'green', 'line-width': 2 }}
                    beforeLayerType="symbol" />
                <Popup
                    openOn="hover"
                    let:data>
                    {@const props = data?.properties}
                    {#if props}
                        <div class="flex flex-col gap-2">
                            <p>Route Name: {props.name}</p>
                            <p>Distance: {props.distance} km</p>
                        </div>
                    {/if}
                </Popup>
            </GeoJSON>
        {/if}
        <!-- Add Road GeoJSON layer -->
        {#if showroad}
            <GeoJSON
                id="Road"
                data={road}
                promoteId="road_id">
                <LineLayer
                    layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                    paint={{ 'line-color': 'red', 'line-width': 3 }}
                    beforeLayerType="symbol" />
                <Popup
                    openOn="hover"
                    let:data>
                    {@const props = data?.properties}
                    {#if props}
                        <div class="flex flex-col gap-2">
                            <p>Route Name: {props.name}</p>
                            <p>Distance: {props.distance} km</p>
                        </div>
                    {/if}
                </Popup>
            </GeoJSON>
        {/if}

        <!-- Displaying markers, this is reactive -->
        <!-- For-each loop syntax -->
        <!-- markers is an object, lngLat, label, name are the fields in the object -->
        <!-- i is the index, () indicates the unique ID for each item, duplicate IDs will lead to errors -->
        {#each markers as { lngLat, label, name }, i (i)}
            <Marker
                {lngLat}
                class="grid h-8 w-14 place-items-center rounded-md border
                    border-gray-200 bg-red-300 text-black shadow-2xl
                    focus:outline-2 focus:outline-black"
            >
                <span>
                    {label}
                </span>

                <Popup
                    openOn="hover"
                    offset={[0, -10]}>
                    <div class="text-lg font-bold">{name}</div>
                </Popup>
            </Marker>
        {/each}

        <!-- Display the watched position as a marker -->
        {#if watchedMarker.lngLat}
            <DefaultMarker lngLat={watchedMarker.lngLat}>
                <Popup offset={[0, -10]}>
                    <div class="text-lg font-bold">You</div>
                </Popup>
            </DefaultMarker>
        {/if}
        <!-- User Location Marker (Custom Triangle Marker) -->
        {#if coords.length}
            <Marker lngLat={coords}>
                <div class="user-location-marker"></div> <!-- Triangle Marker -->
                <Popup offset={[0, -10]}>
                    <div class="text-lg font-bold">You are here</div>
                </Popup>
            </Marker>
        {/if}
    </MapLibre>
</div>
<!-- Optional CSS for Popup -->
<style>
    .popup {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1000;
        background-color: rgba(255, 0, 0, 0.8);
        padding: 10px;
        border-radius: 5px;
        color: white;
    }

    /* CSS for the custom marker */
    .user-location-marker {
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        position: absolute;
        border-bottom: 20px solid rgb(0, 98, 255); /* Triangle color */
        transform: Translate(-50%, -50%); /* Pointing the triangle upwards */
    } /* Added missing closing brace */
</style>

<!-- Optionally, you can have a <style> tag for CSS at the end, but with TailwindCSS it is usually not necessary -->
