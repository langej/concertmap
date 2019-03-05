import Axios from 'axios'
import { bind, wire } from 'hyperhtml'
import { moveMapToGeolocation, getNewEventMarker, showMarkersOnMap } from './maps'
import { getEventsByArtist, getEventsByVenue, getEventsByLocation, getEventsWithGeolocation } from './requestHandler/GetEvents'

const inputChangeHandler = (evt: any) => {
    if (evt.target.value !== '') {
        document.getElementById('result-modal').style.display = 'block'
        Axios.get(`http://localhost:8080/search/artist/${evt.target.value}`).then(
            (response) => {
                let dom = document.getElementById('result-artists')
                if (response.data.ResultsPage.Results.Artist)
                    bind(dom)`
                        ${response.data.ResultsPage.Results.Artist.map(
                            result => wire(result)`
                                <div class='result' id=${result.Id} onclick=${getEventsByArtist} name=${result.DisplayName}>
                                    ${result.DisplayName}
                                </div>
                            `
                        )}
                    `
            }
        )
        Axios.get(`http://localhost:8080/search/venue/${evt.target.value}`).then(
            (response) => {
                let dom = document.getElementById('result-venues')
                if (response.data.resultsPage.results.venue)
                    bind(dom)`
                        ${response.data.resultsPage.results.venue.map(
                            result => wire(result)`
                                <div class='result' id=${result.id} onclick=${getEventsByVenue}>
                                    ${result.displayName} -
                                    ${result.city.displayName} 
                                </div>
                            `
                        )}
                    `
            }
        )
        Axios.get(`http://localhost:8080/search/location/${evt.target.value}`).then(
            (response) => {
                let dom = document.getElementById('result-locations')
                if (response.data.resultsPage.results.location)
                    bind(dom)`
                        ${response.data.resultsPage.results.location.map(
                            result =>
                                wire(result)`
                            <div class='result' id=${result.metroArea.id} onclick=${getEventsByLocation}>
                                ${result.city.displayName} - 
                                ${result.metroArea.displayName} -
                                ${result.city.country.displayName}
                            </div>
                        `
                        )}
                    `
            }
        )
    }
}



if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const
                latitude = position.coords.latitude,
                longitude = position.coords.longitude

            moveMapToGeolocation(latitude, longitude)
            getEventsWithGeolocation(latitude, longitude)
        }
    )
}

export const showResultModal = () => {
    document.getElementById('result-modal').style.display = 'block'
}

export const hideResultModal = () => {
    document.getElementById('result-modal').style.display = 'none'
}

document.getElementById('searchbar').addEventListener('input', inputChangeHandler)

document.getElementById('close').addEventListener('click', hideResultModal)
document.getElementById('map-container').addEventListener('click', hideResultModal)
document.getElementById('searchbar').addEventListener('click', (evt: any) => {
    if (evt.target.value !== '')
        showResultModal()
    else
        hideResultModal()
})
