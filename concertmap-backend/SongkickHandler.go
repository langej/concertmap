package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/kataras/iris"
)

func searchArtist(ctx iris.Context) {
	query := clearQueryString(ctx.Params().Get("name"))

	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/search/artists.json?apikey=%s&query=%s", SongkickAPIKey, query))
	if err != nil {
		log.Fatal(err)
	}
	resultString := readBody(res.Body)
	var result ArtistSearchResults
	json.Unmarshal([]byte(resultString), &result)
	response, _ := json.Marshal(result)
	ctx.Writef("%s", string(response))
}

func searchLocation(ctx iris.Context) {
	query := clearQueryString(ctx.Params().Get("name"))

	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/search/locations.json?query=%s&apikey=%s", query, SongkickAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func searchLocationByGeodata(ctx iris.Context) {
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/search/locations.json?location=geo:%s,%s&apikey=%s", ctx.Params().Get("latitude"), ctx.Params().Get("longitude"), SongkickAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func searchLocationByIP(ctx iris.Context) {
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/search/locations.json?location=ip:%s&apikey=%s", ctx.Params().Get("ip"), SongkickAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func searchVenueByName(ctx iris.Context) {
	query := clearQueryString(ctx.Params().Get("name"))
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/search/venues.json?query=%s&apikey=%s", query, SongkickAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func getEventsFromArtist(ctx iris.Context) {
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/artists/%s/calendar.json?apikey=%s", ctx.Params().Get("id"), SongkickAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func getEventsFromVenue(ctx iris.Context) {
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/venues/%s/calendar.json?apikey=%s", ctx.Params().Get("id"), SongkickAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func getEventsFromMetroArea(ctx iris.Context) {
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/metro_areas/%s/calendar.json?apikey=%s", ctx.Params().Get("id"), SongkickAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func getEventsFromIP(ctx iris.Context) {
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/events.json?apikey=%s&location=ip:%s", SongkickAPIKey, ctx.Params().Get("ip")))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func getEventsFromGeolocation(ctx iris.Context) {
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/events.json?apikey=%s&location=geo:%s,%s", SongkickAPIKey, ctx.Params().Get("latitude"), ctx.Params().Get("longitude")))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func getPastEventsFromArtist(ctx iris.Context) {
	res, err :=
		http.Get(fmt.Sprintf("https://api.songkick.com/api/3.0/artists/%s/gigography.json?apikey=%s", ctx.Params().Get("id"), SongkickAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	result := readBody(res.Body)
	ctx.Writef("%s", result)
}

func readBody(closer io.ReadCloser) []byte {
	content, err := ioutil.ReadAll(closer)
	closer.Close()
	if err != nil {
		log.Fatal(err)
	}
	return content
}

func clearQueryString(query string) string {
	return strings.Replace(query, " ", "+", -1)
}
