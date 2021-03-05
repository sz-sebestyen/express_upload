package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

// PORT is what the server is listening on
const PORT = 8080

func hello(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

func main() {

	router := mux.NewRouter()

	router.HandleFunc("/{something}", SomethingHandler)

	http.Handle("/", router)

	fmt.Println("Server is running on PORT " + fmt.Sprint(PORT))

	if err := http.ListenAndServe(":"+fmt.Sprint(PORT), nil); err != nil {
		panic(err)
	}
}

// SomethingHandler responds to route /{something}
func SomethingHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)

	w.WriteHeader(http.StatusOK)

	w.Write([]byte(vars["something"]))

	// fmt.Fprintf(w, "Something: %v\n", vars["something"])
}
