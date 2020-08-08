// Import des Packages
const express = require("express");
const router = express.Router();

// Installer axios pour faire des requête vers l'API Marvel
const axios = require("axios");

// installer dotenv pour stocker la data sensible
require("dotenv").config();

// Installer le package crypto-js
const md5 = require("crypto-js/md5");

// Route vers la liste de tout les comics
router.get("/comics", async (req, res) => {
  try {
    //generer un timestamp
    console.log("route 1");
    const date = new Date();
    const timestamp = date.getTime() / 1000;
    const ts = Math.floor(timestamp);
    console.log(ts);
    // generer un hash a partir de MD5
    const hash = md5(
      ts + process.env.PRIVATE_API_KEY + process.env.PUBLIC_API_KEY
    ).toString();

    // console.log(hash);
    // console.log(process.env.PRIVATE_API_KEY);
    // console.log(process.env.PUBLIC_API_KEY);

    // preciser la limit d'une page à 100 personnages par page
    const limit = 100; // ensuite la passer en paramètre query dans la requete vers l'API de Marvel

    //recuperer le numero de page demandés cote front
    const offset = req.query.page ? (req.query.page - 1) * limit : 0;

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${process.env.PUBLIC_API_KEY}&hash=${hash}&orderBy=title&limit=${limit}&offset=${offset}`
    );
    console.log(
      `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${process.env.PUBLIC_API_KEY}&hash=${hash}&orderBy=title`
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.log("ERROR");
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Liste des comics par personnage Id
router.get("/comics/:characterId", async (req, res) => {
  try {
    console.log("route 2");
    //generer un timestamp
    const date = new Date();
    const timestamp = date.getTime() / 1000;
    const ts = Math.floor(timestamp);
    console.log(ts);
    // generer un hash a partir de MD5
    const hash = md5(
      ts + process.env.PRIVATE_API_KEY + process.env.PUBLIC_API_KEY
    ).toString();

    //recuperer l'id du charactere cliqué dessus cote front
    const characterId = req.params.characterId;

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters/${characterId}/comics?ts=${ts}&apikey=${process.env.PUBLIC_API_KEY}&hash=${hash}`
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//Route vers la Recherche d'un comic par titre
router.get("/comics/search/:title", async (req, res) => {
  try {
    //generer un timestamp
    const date = new Date();
    const timestamp = date.getTime() / 1000;
    const ts = Math.floor(timestamp);
    console.log(ts);

    // generer un hash a partir de MD5
    const hash = md5(
      ts + process.env.PRIVATE_API_KEY + process.env.PUBLIC_API_KEY
    ).toString();

    //recuperer le nom rentré par l'utilisateur coté front
    const title = req.params.title;
    console.log(title);

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics?title=${title}&ts=${ts}&apikey=${process.env.PUBLIC_API_KEY}&hash=${hash}`
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
