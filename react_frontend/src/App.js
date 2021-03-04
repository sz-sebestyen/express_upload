import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const [submitted, setSubmitted] = useState(false);

  const fileInput = useRef(null);

  const firstnameInput = useRef(null);
  const lastnameInput = useRef(null);
  const countryInput = useRef(null);
  const emailInput = useRef(null);
  const addressInput = useRef(null);
  const cityInput = useRef(null);
  const [choosenFiles, setChoosenFiles] = useState("No files choosen");

  useEffect(() => {
    if (submitted) {
      const data = packData(
        {
          firstname: firstnameInput.current.value,
          lastname: lastnameInput.current.value,
          country: countryInput.current.value,
          email: emailInput.current.value,
          address: addressInput.current.value,
          city: cityInput.current.value,
        },
        fileInput.current.files
      );
      send(data);
      setSubmitted(false);
    }
  }, [submitted]);

  return (
    <div className="App">
      <div className="column">
        <div className="inputWrap">
          <label htmlFor="firstname">Firstname</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Firstname"
            ref={firstnameInput}
          />
        </div>
        <div className="inputWrap">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            ref={emailInput}
          />
        </div>

        <div className="inputWrap">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            name="country"
            id="country"
            placeholder="Your Country"
            ref={countryInput}
          />
        </div>
      </div>

      <div className="column">
        <div className="inputWrap">
          <label htmlFor="lastname">Lastname</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Lastname"
            ref={lastnameInput}
          />
        </div>

        <div className="inputWrap">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Type Address"
            ref={addressInput}
          />
        </div>

        <div className="inputWrap">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Your City"
            ref={cityInput}
          />
        </div>
      </div>
      <div className="files">
        <input
          type="file"
          name="uploadFiles"
          id="uploadFiles"
          multiple
          ref={fileInput}
          onInput={() => {
            if (fileInput.current.files.length !== 1) {
              const count = fileInput.current.files.length;
              setChoosenFiles(`${count} files choosen`);
            } else {
              setChoosenFiles(fileInput.current.files[0].name);
            }
          }}
        />
        <p>Upload document</p>
        <label htmlFor="uploadFiles">Choose files</label>
        <span>{choosenFiles}</span>
      </div>
      <div className="submit">
        <button type="button" onClick={() => setSubmitted(true)}>
          Upload!
        </button>
      </div>
    </div>
  );
}

const packData = (data, files) => {
  const formData = new FormData();

  formData.append("jsonData", JSON.stringify(data));

  for (const file of files) {
    formData.append("uploadFiles", file);
  }
  return formData;
};

const send = async (formData) => {
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
};

export default App;
