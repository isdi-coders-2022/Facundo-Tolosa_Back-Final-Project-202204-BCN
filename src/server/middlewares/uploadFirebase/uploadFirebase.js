require("dotenv").config();
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const fs = require("fs");
const path = require("path");
const { initializeApp } = require("firebase/app");

const uploadFirebase = (req, res, next) => {
  const { file } = req;

  const firebaseConfig = {
    apiKey: "AIzaSyBazGT76I-Zl3YKAtkEuq4kNoj7MXKTpcc",
    authDomain: "amazing-notes-fe460.firebaseapp.com",
    projectId: "amazing-notes-fe460",
    storageBucket: "amazing-notes-fe460.appspot.com",
    messagingSenderId: "943544956811",
    appId: "1:943544956811:web:cafdfe38167ee664f2a18e",
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const newImageName = file ? `${Date.now()}${file.originalname}` : "";

  if (file) {
    fs.rename(
      path.join("uploads", "images", file.filename),
      path.join("uploads", "images", newImageName),
      async (error) => {
        if (error) {
          next(error);
        }

        fs.readFile(
          path.join("uploads", "images", newImageName),
          async (readError, readFile) => {
            if (readError) {
              next(readError);
              return;
            }

            const storage = getStorage(firebaseApp);

            const storageRef = ref(storage, newImageName);

            await uploadBytes(storageRef, readFile);

            const firebaseImageURL = await getDownloadURL(storageRef);

            req.imgBackup = firebaseImageURL;
            req.img = path.join("images", newImageName);

            next();
          }
        );
      }
    );
  }
};

module.exports = uploadFirebase;
