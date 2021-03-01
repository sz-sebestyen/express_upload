"use strict";

function _load() {
  console.log("Client is Running");

  const form = document.getElementById("uploadForm");
  const uploadFiles = document.getElementById("uploadFiles");
  const userName = document.getElementById("userName");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // const formData = new FormData(event.target);
    const formData = new FormData();

    formData.append("userName", userName.value);

    // console.log("uploadFiles:", uploadFiles.files);
    // console.log("userName:", userName.value);

    for (const f of uploadFiles.files) {
      formData.append("uploadFiles", f);
    }

    console.log("formData:", Object.fromEntries(formData));

    let text;

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      text = await res.text();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      console.log("Response:", text);
    }
  });
}

window.addEventListener("load", _load);
