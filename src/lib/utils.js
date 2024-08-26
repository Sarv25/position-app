/**
 * Compute map centre based on a list of markers
 * @param markers Map markers to compute the centre of
 * @returns Map centre
 */
export function getMapCentre(markers) {
    const lats = markers.map(marker => marker.lngLat.lat)
    const lngs = markers.map(marker => marker.lngLat.lng)
    const latMin = Math.min(...lats)
    const latMax = Math.max(...lats)
    const lngMin = Math.min(...lngs)
    const lngMax = Math.max(...lngs)
    return { lng: (lngMin + lngMax) / 2, lat: (latMin + latMax) / 2 }
}

/**
 * Compute map bounds based on a list of markers
 * @param markers Map markers to compute the bounds of
 * @returns Map bounds
 */
export function getMapBounds(markers) {
    const lats = markers.map(marker => marker.lngLat.lat)
    const lngs = markers.map(marker => marker.lngLat.lng)
    const latMin = Math.min(...lats)
    const latMax = Math.max(...lats)
    const lngMin = Math.min(...lngs)
    const lngMax = Math.max(...lngs)
    return [lngMin, latMin, lngMax, latMax]
}
