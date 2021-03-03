import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const [submitted, setSubmitted] = useState(false);

  const fileInput = useRef(null);
  const userNameInput = useRef(null);

  const firstnameInput = useRef(null);
  const lastnameInput = useRef(null);
  const countryInput = useRef(null);
  const emailInput = useRef(null);
  const addressInput = useRef(null);
  const cityInput = useRef(null);

  useEffect(() => {
    if (submitted) {
      const data = packData(
        userNameInput.current.value,
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
            placeholder="Email"
            ref={emailInput}
          />
        </div>

        <div className="inputWrap">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            name="country"
            id="country"
            placeholder="Country"
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
            placeholder="Address"
            ref={addressInput}
          />
        </div>

        <div className="inputWrap">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="City"
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
        />
        <label htmlFor="uploadFiles">Choose a file</label>
      </div>
      <div className="submit">
        <button type="button" onClick={() => setSubmitted(true)}>
          Upload!
        </button>
      </div>
    </div>
  );
}

const packData = (username, files) => {
  const formData = new FormData();

  formData.append("userName", username);

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
