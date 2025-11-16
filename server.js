const express = require("express");
const app = express();
const userRoutes = require("./Routes/userroutes.js");

app.use(express.json());
app.use("/nodeapi", userRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
