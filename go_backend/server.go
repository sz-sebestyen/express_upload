package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func main() {

	fs := http.FileServer(http.Dir("../react_frontend/build/"))
	http.Handle("/", fs)

	http.HandleFunc("/upload", uploadHandler)

	log.Println("Listening on :3000...")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		err := r.ParseMultipartForm(32 << 20) // 32MB max upload size
		checkForError(err, w)

		fmt.Print(r.MultipartForm)

		fmt.Print("\n")

		json := r.FormValue("jsonData")
		fmt.Print(json)

		files := r.MultipartForm.File["uploadFiles"]

		for _, fileHeader := range files {
			file, err := fileHeader.Open()

			defer file.Close()
			checkForError(err, w)

			f, err := os.OpenFile("./upload/"+fileHeader.Filename, os.O_WRONLY|os.O_CREATE, 0666)
			checkForError(err, w)

			defer f.Close()
			io.Copy(f, file)
		}

		w.WriteHeader(200)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("success"))
	}
	// w.Header().Set("Content-Type", "application/json")
	// w.Write([]byte("error"))
	// w.WriteHeader(400)
}

func checkForError(err error, w http.ResponseWriter) {
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
