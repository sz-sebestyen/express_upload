"use strict";

const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const { nanoid } = require("nanoid");
const idlength = 8;

const adapter = new FileSync("db.json");
const dbAll = low(adapter);
dbAll.defaults({ userDbs: [] }).write();

const PORT = 8000;
app.use("/form", express.static(path.join(__dirname, "../frontend")));

// default options
// app.use(fileUpload());

app.get("/ping", (req, res) => {
  res.send("pong");
});

const asd = (req, res, next) => {
  console.log("asd called");
  next();
};

app.post("/upload", fileUpload(), asd, (req, res) => {
  const data = JSON.parse(req.body.jsonData);
  console.log("jsonData:", data);

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  console.log("req.files >>>", req.files);

  const allFiles = req.files.uploadFiles.length
    ? req.files.uploadFiles
    : [req.files.uploadFiles];

  const fileName = data.email.split("@").join("").split(".").join("") + ".json";

  const adapter = new FileSync(fileName);
  const db = low(adapter);

  db.defaults({
    user: data,
    files: allFiles.map((file) => "/uploads" + file.name),
  }).write();

  if (!dbAll.get("userDbs").find({ fileName }).value()) {
    dbAll
      .get("userDbs")
      .push({ fileName, id: nanoid(idlength) })
      .write();
  }

  Promise.all(
    allFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const uploadPath = path.resolve(__dirname, "uploads", file.name);

          file.mv(uploadPath, (err) => {
            if (err) {
              reject(err);
              return res.status(500).write(err);
            }

            res.write(`File uploaded to ${uploadPath}\n`);
            resolve(uploadPath);
          });
        })
    )
  ).then(() => {
    res.end();
  });
});

app.listen(PORT, () => {
  console.log("Express server listening on port ", PORT);
});
