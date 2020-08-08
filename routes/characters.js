// Import des Packages
const express = require("express");
const router = express.Router();

// Installer axios pour faire des requête vers l'API Marvel
const axios = require("axios");

// installer dotenv pour stocker la data sensible
require("dotenv").config();

// Installer le package crypto-js pour la sécurisation de la requête vers l'API Marvel
const md5 = require("crypto-js/md5");

// Route vers la liste de tout les personnages
router.get("/characters", async (req, res) => {
  try {
    //Securiser l'api secret
    //création d'un timestamp
    const date = new Date();
    const timestamp = date.getTime() / 1000;
    const ts = Math.floor(timestamp);
    console.log(ts);

    // création d'un hash demandé par l'API Marvel
    const hash = md5(
      ts + process.env.PRIVATE_API_KEY + process.env.PUBLIC_API_KEY
    ).toString();

    // console.log(hash);
    // console.log(process.env.PRIVATE_API_KEY);
    // console.log(process.env.PUBLIC_API_KEY);
    // console.log(ts + process.env.PRIVATE_API_KEY + process.env.PUBLIC_API_KEY);

    // preciser la limit d'une page à 100 personnages par page
    const limit = 100; // ensuite la passer en paramètre query dans la requete vers l'API de Marvel

    //recuperer le numero de page demandés cote front
    const offset = req.query.page ? (req.query.page - 1) * limit : 0;

    // faire une requete Get axios vers l API Marvel pour recuperer un json des characters list
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${process.env.PUBLIC_API_KEY}&hash=${hash}&limit=${limit}&orderBy=name&offset=${offset}`
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

//Route vers la Recherche d'un personnage par nom
router.get("/characters/search/:name", async (req, res) => {
  try {
    console.log("coucou");
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
    // const name = new RegExp(req.params.name, "i");

    const name = req.params.name;
    console.log(name);

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${name}&ts=${ts}&apikey=${process.env.PUBLIC_API_KEY}&hash=${hash}`
    );
    console.log(response.data);
    console.log(response.data.data.results);
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
