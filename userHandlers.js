const database = require("./database");

const getUsers = (req, res) => {
  let initialSql =
    "SELECT firstname, lastname, email, city, language FROM users";
  const where = [];

  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, value, operator }, index) =>
          `${sql} ${index === 0 ? "WHERE" : "AND"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([users]) => {
      if (users && users.length > 0) {
        res.status(200).json(users);
      } else {
        console.error("There's no users");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

// database
// .query('SELECT * FROM users')
// .then(([users]) => {
//     if (users && users.length > 0) {
//         res.status(200).json(users)
//     } else {
//         console.error("There's no users")
//     }
// })
// .catch((err) => {
//     console.log(err);
//     res.status(404).send("Cannot reach database")
// })
// };

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(
      "SELECT firstname, lastname, email, city, language FROM users WHERE id = ?",
      [id]
    )
    .then(([users]) => {
      if (users[0] != null && users[0].id === req.payload.sub) {
        console.log(users[0]);
        res.status(200).json(users[0]);
      } else {
        res.status(403).send("Forbidden");
      }
    })
    .catch((err) => {
      console.log(err);
      console.error("Error retrieving data in the database");
    });
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;

  database
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUsers = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES(?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      console.error("Error saving the user");
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not found");
      } else {
        res.status(204);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error editing the user");
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM users WHERE id = ?", [id])
    .then(([results]) => {
      if (results.affectedRows === 1 && users[0].id === req.payload.sub) {
        res.status(204).send("Deletion succeed !");
      } else {
        res.status(404).send("Not found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Missing deletion of this user");
    });
};

module.exports = {
  getUsers,
  getUsersById,
  postUsers,
  updateUser,
  deleteUser,
  getUserByEmailWithPasswordAndPassToNext,
};
