package main

import (
	"fmt"
	"log"
	"net/http"
)

// PORT is what the server is listening on
const PORT = 8080

func main() {

	fs := http.FileServer(http.Dir("../react_frontend/build/"))
	http.Handle("/", fs)

	log.Println("Listening on :" + fmt.Sprint(PORT) + "...")
	err := http.ListenAndServe(":"+fmt.Sprint(PORT), nil)
	if err != nil {
		log.Fatal(err)
	}
}
