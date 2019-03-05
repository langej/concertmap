package main

import (
	"fmt"
	"net/http"

	"github.com/kataras/iris"
)

func getSetlistsForArtist(ctx iris.Context) {
	query := clearQueryString(ctx.Params().Get("name"))

	client := &http.Client{}

	req, _ := http.NewRequest("GET", fmt.Sprintf("https://api.setlist.fm/rest/1.0/search/setlists?artistName=%s", query), nil)
	req.Header.Add("x-api-key", SetlistfmAPIKey)
	req.Header.Add("Accept", "application/json")
	res, _ := client.Do(req)
	result := readBody(res.Body)

	ctx.Writef("%s", result)
}
