//Création du serveur & Installation des packages(express:GET) et (express-formidable:POST)
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

// importer les routes
const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);

// Pages introuvables
app.all("*", function (req, res) {
  res.json({ message: "all routes" });
});

//Lancer le serveur
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
