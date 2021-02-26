function _load() {
  console.log("Client is Running");

  const form = document.getElementById("uploadForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    //formData.append("asd", "lol");

    console.log("formData:", Object.fromEntries(formData));

    let text;

    try {
      const res = await fetch("http://localhost:8000/upload/", {
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
