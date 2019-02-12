import Axios from 'axios'
import moment from 'moment'
import { getNewEventMarker, showMarkersOnMap } from '../maps';
import { hideResultModal } from '../main'

const getEventsByArtist = evt => {
    let events = []
    Axios.get(`http://localhost:8080/get/events/artist/${evt.target.id}`).then(
        response => {
            if (response.data.resultsPage.results.event) {
                response.data.resultsPage.results.event.map(
                    event => events.push(event)
                )
                events.sort(
                    (ev1, ev2) => {
                        return moment(ev1.start.date).diff(moment(ev2.start.date))
                    }
                )
                let markers = []
                events.map(
                    (event) => {
                        markers.push(getNewEventMarker(event.location.lat, event.location.lng, event))
                    }
                )
                showMarkersOnMap(markers, 'artist')
                hideResultModal()
            } else {
                let dom = document.getElementById('infobox-noevents')
                dom.style.visibility = 'visible'
                setTimeout(() => {
                    dom.style.visibility = 'hidden'
                }, 5000);
            }
        }
    )
}

const getEventsByVenue = evt => {
    let events = []
    Axios.get(`http://localhost:8080/get/events/venue/${evt.target.id}`).then(
        response => {
            if (response.data.resultsPage.results.event) {
                response.data.resultsPage.results.event.map(
                    (event) => {
                        events.push(getNewEventMarker(event.location.lat, event.location.lng, event))
                    }
                )
                showMarkersOnMap(events)
                hideResultModal()
            } else {
                let dom = document.getElementById('infobox-noevents')
                dom.style.visibility = 'visible'
                setTimeout(() => {
                    dom.style.visibility = 'hidden'
                }, 5000);
            }
        }
    )
}

const getEventsByLocation = evt => {
    let events = []
    Axios.get(`http://localhost:8080/get/events/location/${evt.target.id}`).then(
        response => {
            if (response.data.resultsPage.results.event) {
                response.data.resultsPage.results.event.map(
                    (event) => {
                        events.push(getNewEventMarker(event.location.lat, event.location.lng, event))
                    }
                )
                showMarkersOnMap(events)
                hideResultModal()
            } else {
                let dom = document.getElementById('infobox-noevents')
                dom.style.visibility = 'visible'
                setTimeout(() => {
                    dom.style.visibility = 'hidden'
                }, 5000);
            }
        }
    )
}

export {
    getEventsByArtist,
    getEventsByLocation,
    getEventsByVenue
}