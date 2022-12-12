require("dotenv").config();
const path = require("path");

const express = require("express");
const { validateMovie, validateUser } = require("./validators");

const app = express();

app.use(express.json()); //middleware permettant de lire le corps des requêtes JSON.

const port = process.env.APP_PORT ?? 5000;

// const welcome = (req, res) => {
//   res.send("Welcome to my favorite list of movies");
// };

const welcome = (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
};

app.use(express.static("public"));

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

const userHandlers = require("./userHandlers");

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);

const { hashPassword } = require("./auth");
app.post("/api/users", hashPassword, userHandlers.postUsers);

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
