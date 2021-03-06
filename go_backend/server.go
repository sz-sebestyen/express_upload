package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("../react_frontend/build/")))

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
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var parsedJSON map[string]interface{}
		json.Unmarshal([]byte(r.FormValue("jsonData")), &parsedJSON)

		fmt.Print(r.MultipartForm.File, "\n", parsedJSON, "\n")

		for _, fileHeader := range r.MultipartForm.File["uploadFiles"] {
			if saveFile(fileHeader) != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		w.Write([]byte("success"))
	} else {
		w.WriteHeader(400)
		// w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("error"))
	}
}

func saveFile(fileHeader *multipart.FileHeader) error {
	file, err := fileHeader.Open()
	defer file.Close()

	if err != nil {
		return err
	}

	savedFile, err := os.OpenFile("./upload/"+fileHeader.Filename, os.O_WRONLY|os.O_CREATE, 0666)
	defer savedFile.Close()

	if err != nil {
		return err
	}

	io.Copy(savedFile, file)
	return nil
}
