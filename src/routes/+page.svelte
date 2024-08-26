<script>
    import { MapEvents, MapLibre, Marker, Popup } from 'svelte-maplibre'
    import Geolocation from 'svelte-geolocation'

    let markers = [
        {
            lngLat: {
                lon: 144.98,
                lat: -37.805,
            },
            label: 'Marker 1',
            name: 'This is a marker'
        },
        {
            lngLat: {
                lon: 144.98,
                lat: -37.81,
            },
            label: 'Marker 2',
            name: 'This is a marker'
        },
        {
            lngLat: {
                lon: 144.96,
                lat: -37.81,
            },
            label: 'Marker 3',
            name: 'This is a marker'
        }
    ]

    let getPosition = false
    let positionSuccess = false
    let position = {}
    let coords = []
    $: {
        if (positionSuccess) {
            coords = [position.coords.longitude, position.coords.latitude]
            markers = [
                ...markers,
                {
                    lngLat: coords,
                    label: 'Current',
                    name: 'This is the current position',
                }
            ]
        }
    }

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
</script>

<div class="w-full text-center">
    <button
        class="btn btn-neutral"
        on:click={() => (getPosition = true)}
    >
        Get geolocation
    </button>

    <Geolocation
        {getPosition}
        bind:position
        let:loading
        bind:success={positionSuccess}
        let:error
        let:notSupported
    >
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

    <p>Coordinates: {coords}</p>
    <p>Position: {JSON.stringify(position)}</p>
</div>

<MapLibre
    center={[144.97, -37.81]}
    zoom={14}
    class="h-[60vh] max-h-[700px] w-full md:w-3/5 mx-auto"
    standardControls
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
>
    <MapEvents on:click={event => addMarker(event, 'Added', 'This is an added marker')} />

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
