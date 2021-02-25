function _load() {
  console.log("Client is Running");

  const form = document.getElementById("uploadForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("the file upload process is blocked");
  });
}

window.addEventListener("load", _load);
