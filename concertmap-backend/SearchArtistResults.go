package main

// Identifier ...
type Identifier struct {
	Mbid         string
	Href         string
	Eventshref   string
	Setlistshref string
}

// Artist ...
type Artist struct {
	Id          int
	DisplayName string
	Uri         string
	Identifier  []Identifier
	OnTourUntil string
}

// Result ...
type Result struct {
	Artist []Artist
}

// ResultsPage ...
type ResultsPage struct {
	Status       string
	Results      Result
	PerPage      int
	Page         int
	TotalEntries int
}

// ArtistSearchResults ...
type ArtistSearchResults struct {
	ResultsPage ResultsPage
}
