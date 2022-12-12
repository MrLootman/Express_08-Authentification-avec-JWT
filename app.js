require("dotenv").config();

const express = require("express");
const { validateMovie, validateUser } = require("./validators");

const app = express();

app.use(express.json()); //middleware permettant de lire le corps des requêtes JSON.

const port = process.env.APP_PORT ?? 5000;
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

const welcome = (req, res) => {
  res.send("Welcome to my favorite list of movies");
};

// /!\ Publics path /!\

app.get("/", welcome);

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.post("/api/users", hashPassword, userHandlers.postUsers);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

// /!\ Routes to protect below /!\

app.use(verifyToken); // Authenticated wall

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);

app.post("/api/movies", verifyToken, movieHandlers.postMovie);

app.put("/api/movies/:id", movieHandlers.updateMovie);
app.put("/api/users/:id", userHandlers.updateUser);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
