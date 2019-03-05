import { credentials } from './Credentials'

let visibleGroup = null
let visibleLine = null

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

const getNewEventMarker = (latitude, longitude, event) => {
    let marker = new H.map.Marker({lat: latitude, lng: longitude});
    let html = `
        <div style="width: 200px;">
            <h5>${event.displayName}</h5>
            <hr>
            <p>Date: ${event.start.date}</p>
            <p>Artists:</p>
            <ul> ${event.performance.map(
                artist => `
                    <li>${artist.artist.displayName}</li>
                `
            )}</ul>
            <p>Venue: ${event.venue.displayName}</p>
            <a href=${event.uri}>Event details</a>
            <hr>
            ${event.songs.length > 0 ? `<h4>Most played Songs</h4>` : ""}
            ${event.songs.length > 0 ? event.songs.map(
                song => `
                    <span style="font-size: x-small;">${song.name}: ${song.count} times</span><br>
                `
            ) : ""}
        </div>
    `

    let test = "<h1>Hallo</h1>"
    marker.setData(html)
    return marker
}

const showMarkersOnMap = (markers, type) => {
    if (visibleGroup) {
        map.removeObject(visibleGroup)
        visibleGroup = null
    }
    if (visibleLine) {
        map.removeObject(visibleLine)
        visibleLine = null
    }

    let group = new H.map.Group();

    if (type === 'artist') {
        let linestring = new H.geo.LineString()
        markers.map(
            marker => linestring.pushPoint({lat: marker.b.lat, lng: marker.b.lng})
        )
        let polyline = new H.map.Polyline(linestring, { style: { lineWidth: 7 }});
        polyline.setArrows({frequency: 3, fillColor: 'rgba(255,255,255, 0.4)'})
        visibleLine = polyline
        map.addObject(polyline)
    }

    group.addObjects(markers)
    visibleGroup = group
    map.addObject(group)

    group.addEventListener('tap', evt => {
        let bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
            content: evt.target.getData()
        })
        ui.addBubble(bubble)
    }, false)

    map.setViewBounds(group.getBounds())
}

export {
    moveMapToGeolocation,
    getNewEventMarker,
    showMarkersOnMap
}
