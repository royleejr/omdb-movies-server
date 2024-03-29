const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const searchRoute = require("./routes/search.js");
const nominationsRoute = require("./routes/nominations.js");
const categoryRoute = require("./routes/category.js");

app.use(cors());
app.use(express.json());

app.use("/search", searchRoute);
app.use("/nominations", nominationsRoute);
app.use("/category", categoryRoute);

app.listen(PORT, () => {
  console.log("The server is running");
});
