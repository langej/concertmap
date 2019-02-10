package main

import (
	"github.com/iris-contrib/middleware/cors"
	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/logger"
	"github.com/kataras/iris/middleware/recover"
)

func main() {
	app := iris.New()

	crs := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // allows everything, use that to change the hosts.
		AllowCredentials: true,
	})

	app.Logger().SetLevel("debug")
	// Optionally, add two built'n handlers
	// that can recover from any http-relative panics
	// and log the requests to the terminal.
	app.Use(recover.New())
	app.Use(logger.New())

	routes := app.Party("/", crs).AllowMethods(iris.MethodOptions)

	// Method:		GET
	// Resource:	http://localhost:8080/search/artist/
	routes.Get("/search/artist/{name}", searchArtist)
	routes.Get("/search/location/{name}", searchLocation)
	routes.Get("/search/location/ip/{ip}", searchLocationByIP)
	routes.Get("/search/location/geo/{latitude}/{longitude}", searchLocationByGeodata)
	routes.Get("/search/venue/{name}", searchVenueByName)
	routes.Get("/get/events/artist/{id}", getEventsFromArtist)
	routes.Get("/get/events/location/{id}", getEventsFromMetroArea)
	routes.Get("/get/events/location/ip/{ip}", getEventsFromIP)
	routes.Get("/get/events/location/geo/{latitude}/{longitude}", getEventsFromGeolocation)
	routes.Get("/get/events/venue/{id}", getEventsFromVenue)
	routes.Get("/get/past-events/artist/{id}", getPastEventsFromArtist)

	app.Run(iris.Addr(":8080"), iris.WithoutServerError(iris.ErrServerClosed))
}
