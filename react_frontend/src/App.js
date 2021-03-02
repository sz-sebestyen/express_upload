import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const [submitted, setSubmitted] = useState(false);

  const fileInput = useRef(null);
  const userNameInput = useRef(null);

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
      <label htmlFor="userName">Username</label>
      <input
        type="text"
        name="userName"
        placeholder="username"
        ref={userNameInput}
      />

      <input type="file" name="uploadFiles" multiple ref={fileInput} />

      <button type="button" onClick={() => setSubmitted(true)}>
        Upload!
      </button>
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