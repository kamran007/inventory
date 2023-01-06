// Import Module
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

//Port Configuration, Uri
const PORT = process.env.PORT;
const con_string = process.env.DBSTR;

// Configure Express
const app = express();

//view engine setting
app.set("view engine", "ejs");

app.set("views", path.resolve(__dirname, "./src/views"));

//static folder setup
app.use("/assets", express.static(path.join(__dirname, "./src/asset/")));
app.use("/img", express.static(path.join(__dirname, "./src/uploads")));

// import project files
const setMiddleware = require("./src/middlewares/middleware");
const setRoute = require("./src/routes/route");

setMiddleware(app);
setRoute(app);

mongoose
  .connect(con_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
