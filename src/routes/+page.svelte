<!-- <script> tag includes JavaScript code -->
<script>
    import {
        Control,
        ControlButton,
        ControlGroup,
        FillLayer,
        GeoJSON,
        LineLayer,
        MapEvents,
        MapLibre,
        Marker,
        Popup,
        hoverStateFilter
    } from 'svelte-maplibre'
    import Geolocation from 'svelte-geolocation' // DoNotChange

    /**
     * You can put functions you need for multiple components in a js file in
     * the lib folder, export them in lib/index.js and then import them like this
     */
    import { onMount } from 'svelte'
    import { getMapBounds } from '$lib'

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
                lng: 144.98,
                lat: -37.805,
            },
            label: 'Marker 1',
            name: 'This is a marker'
        },
        {
            lngLat: {
                lng: 144.98,
                lat: -37.81,
            },
            label: 'Marker 2',
            name: 'This is a marker'
        },
        {
            lngLat: {
                lng: 144.96,
                lat: -37.81,
            },
            label: 'Marker 3',
            name: 'This is a marker'
        }
    ]

    // Extent of the map
    let bounds = getMapBounds(markers)

    // Geolocation API related
    let getPosition = false
    let positionSuccess = false
    let position = {}
    let coords = []

    /**
     * $: indicates a reactive statement, meaning that this block of code is
     * executed whenever the variable used as the condition changes its value
     *
     * In this case: whenever positionSuccess is set to true, a Position object
     * has been successfully obtained. Immediately update the relevant variables
     */
    $: {
        if (positionSuccess) {
            coords = [position.coords.longitude, position.coords.latitude]
            markers = [
                ...markers,
                {
                    lngLat: { lng: coords[0], lat: coords[1] },
                    label: 'Current',
                    name: 'This is the current position',
                }
            ]

            // reset the flags
            getPosition = false
            positionSuccess = false
        }
    }

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
            }
        ]
    }

    /**
     * Variables can be initialised without a value and populated later
     * WARNING: this can lead to errors if the variable is used before being
     * assigned a value
     */
    let geojsonData

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
     * WARNING: it is bad practice to put large data files in the project as
     * they will make the loading of the application very slow, here it is done
     * for demonstration only. The proper way is to use a URL to the file hsoted
     * on a remote server.
     */
    onMount(async () => {
        const response = await fetch('property-boundaries.geojson')
        geojsonData = await response.json()
    })
</script>

<!-- Everything after <script> will be HTML for rendering -->
<div class="flex flex-col h-[calc(100vh-80px)] w-full">
    <div class="mx-4">
        <!-- on:click declares what to do when the button is clicked -->
        <!-- In the HTML part, {} tells the framework to treat what's inside as code (variables or functions), instead of as strings -->
        <!-- () => {} is an arrow function, almost equivalent to function foo() {} -->
        <button
            class="btn btn-neutral"
            on:click={() => (getPosition = true)}
        >
            Get geolocation
        </button>

        <!-- <Geolocation> tag is used to access the Geolocation API -->
        <Geolocation
            {getPosition}
            bind:position
            let:loading
            bind:success={positionSuccess}
            let:error
            let:notSupported
        >
            <!-- If-else block syntax -->
            {#if notSupported}
                Your browser does not support the Geolocation API.
            {:else}
                {#if loading}
                    Loading...
                {/if}
                {#if positionSuccess}
                    Success!
                {/if}
                {#if error}
                    An error occurred. {error.code} {error.message}
                {/if}
            {/if}
        </Geolocation>

        <p class="break-words">Coordinates: {coords}</p>
        <!-- Objects cannot be directly rendered, use JSON.stringify() to convert it to a string -->
        <p class="break-words">Position: {JSON.stringify(position)}</p>
    </div>

    <!-- More basemap options -->
    <!-- "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" -->
    <!-- "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" -->
    <!-- "https://tiles.basemaps.cartocdn.com/gl/voyager-gl-style/style.json" -->

    <!-- bind:variable associates the parameter with the variable with the same name declared in <script> reactively -->
    <MapLibre
        center={[144.97, -37.81]}
        class="map flex-grow"
        standardControls
        style="https://tiles.basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        bind:bounds
        zoom={14}
    >
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

        <MapEvents on:click={event => addMarker(event, 'Added', 'This is an added marker')} />

        <GeoJSON
            id="geojsonData"
            data={geojsonData}
            promoteId="property_id"
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
                            <p>{props.address}</p>
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
    </MapLibre>
</div>

<!-- Optionally, you can have a <style> tag for CSS at the end, but with TailwindCSS it is usually not necessary -->
