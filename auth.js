const argon2 = require("argon2");
// const readline = require("readline");

// Exemple de création de hashed password;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question("Enter your password :", async (password) => {
//   const hash = await argon2.hash(password, { type: argon2.argon2id });
//   console.log(`${hash}`);

//   rl.question("Re-enter your password :", async (pw) => {
//     const correct = await argon2.verify(hash, pw);
//     console.log(correct ? "Correct" : "Incorrect");
//     process.exit(0);
//   });
// });

// Création des options :

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

// Création du "hashed password"

const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      req.body.hashedPassword = hashedPassword;
      delete req.body.password;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  hashPassword,
};
