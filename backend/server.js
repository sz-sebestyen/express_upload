const express = require("express");
const fileUpload = require("express-fileupload");
const { resolve } = require("path");
const path = require("path");
const app = express();

const PORT = 8000;
app.use("/form", express.static(path.join(__dirname, "../frontend")));

// default options
app.use(fileUpload());

app.get("/ping", function (req, res) {
  res.send("pong");
});

app.post("/upload", function (req, res) {
  console.log("userName:", req.body.userName);

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  console.log("req.files >>>", req.files); // eslint-disable-line

  const allFiles = req.files.sampleFile.length
    ? req.files.sampleFile
    : [req.files.sampleFile];

  /*   allFiles.forEach((file) => {
    const uploadPath = __dirname + "/uploads/" + file.name;

    file.mv(uploadPath, function (err) {
      if (err) {
        return res.status(500).send(err);
      }

      res.write("File uploaded to " + uploadPath);
    });
  }); */

  Promise.allSettled(
    allFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const uploadPath = __dirname + "/uploads/" + file.name;

          file.mv(uploadPath, function (err) {
            if (err) {
              return res.status(500).write(err);
            }

            res.write("File uploaded to " + uploadPath + "\n");
            resolve();
          });
        })
    )
  ).then(() => res.end());
});

app.listen(PORT, function () {
  console.log("Express server listening on port ", PORT); // eslint-disable-line
});
