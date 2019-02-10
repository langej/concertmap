import Axios from 'axios'
import { getNewEventMarker, showMarkersOnMap } from '../maps';
import { hideResultModal } from '../main'

const getEventsByArtist = evt => {
    let events = []
    Axios.get(`http://localhost:8080/get/events/artist/${evt.target.id}`).then(
        response => {
            response.data.resultsPage.results.event.map(
                (event) => {
                    event.location.lat ? null : console.log(event)
                    events.push(getNewEventMarker(event.location.lat, event.location.lng, event))
                }
            )
            showMarkersOnMap(events)
            hideResultModal()
        }
    )
}

const getEventsByVenue = evt => {
    let events = []
    Axios.get(`http://localhost:8080/get/events/venue/${evt.target.id}`).then(
        response => {
            response.data.resultsPage.results.event.map(
                (event) => {
                    events.push(getNewEventMarker(event.location.lat, event.location.lng, event))
                }
            )
            showMarkersOnMap(events)
            hideResultModal()
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