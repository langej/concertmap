import { credentials } from './Credentials'

let visibleGroup = null

var platform = new window.H.service.Platform(credentials)
var defaultLayers = platform.createDefaultLayers()
const map = new H.Map(
    document.getElementById('map-container'),
    defaultLayers.normal.map,
    {
        zoom: 10,
        center: { lat:52.5159, lng:13.3777 }
    }
)

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers)

const moveMapToGeolocation = (latitude, longitude) => {
    map.setCenter({lat: latitude, lng: longitude})
    map.setZoom(14)
}

const getNewEventMarker = (latitude, longitude, data) => {
    return new H.map.Marker({lat: latitude, lng: longitude});
}

const showMarkersOnMap = (markers) => {
    if (visibleGroup)
        map.removeObject(visibleGroup)

    let group = new H.map.Group();

    group.addObjects(markers)
    visibleGroup = group
    map.addObject(group)
    map.setViewBounds(group.getBounds())
}

export {
    moveMapToGeolocation,
    getNewEventMarker,
    showMarkersOnMap
}
