import Axios from 'axios'
import moment from 'moment'
import { getNewEventMarker, showMarkersOnMap } from '../maps';
import { hideResultModal } from '../main'

async function getSongsFromSetlists(artistName) {
    try {
        const response = await Axios.get(`http://localhost:8080/get/setlist/${artistName}`)
        let songs = []
        response.data.setlist ?
            response.data.setlist.map(
                setlist => {
                    if (setlist.sets.set[0]) {
                        setlist.sets.set[0].song.map(
                            song => {
                                let tmp = songs.find(elem => { return elem.name === song.name })
                                if (tmp) {
                                    tmp.count += 1
                                } else {
                                    songs.push({ name: song.name, count: 1 })
                                }
                            }
                        )
                    }
                }
            ) : ""
        songs.sort(
            (a, b) => { return b.count - a.count }
        )
        return songs
    } catch (error) {
        console.error(error)
    }
}

const getEventsByArtist = evt => {
    let events = []
    Axios.get(`http://localhost:8080/get/events/artist/${evt.target.id}`).then(
        response => {
            if (response.data.resultsPage.results.event) {
                getSongsFromSetlists(evt.target.getAttribute("name")).then(
                    songs => {
                        response.data.resultsPage.results.event.map(
                            event => {
                                event.songs = songs
                                events.push(event)
                            }
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
                    })
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
                        event.songs = []
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
                        getSongsFromSetlists(event.performance[0].artist.displayName).then(
                            songs => {
                                event.songs = songs
                                events.push(getNewEventMarker(event.location.lat, event.location.lng, event))
                                showMarkersOnMap(events)
                                hideResultModal()
                            }
                        )
                    }
                )
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

const getEventsWithGeolocation = (latitude: number, longitude: number) => {
    Axios.get(`http://localhost:8080/get/events/location/geo/${latitude}/${longitude}`).then(
        (response) => {
            const events = response.data.resultsPage.results.event
            let markers = []
            events.map(
                (event: any) => {
                    getSongsFromSetlists(event.performance[0].artist.displayName).then(
                        songs => {
                            event.songs = songs

                            markers.push(getNewEventMarker(
                                event.location.lat,
                                event.location.lng,
                                event
                            ))
                            showMarkersOnMap(markers, 'geo')
                        }
                    ).catch(
                        err => console.log(err)
                    )
                }
            )
        }
    )
}

export {
    getEventsByArtist,
    getEventsByLocation,
    getEventsByVenue,
    getEventsWithGeolocation
}