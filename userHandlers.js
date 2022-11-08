const database = require('./database');

const getUsers = (req, res) => {
    let initialSql = "SELECT * FROM users";
    const where = [];

    if (req.query.language != null) {
        where.push({
            column: "language",
            value: req.query.language,
            operator: "="
        });
    }
    if (req.query.city != null) {
        where.push({
            column: "city",
            value: req.query.city,
            operator: "="
        })
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
                res.status(200).json(users)
            } else {
                console.error("There's no users")
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database")
        })
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
        .query('SELECT * FROM users WHERE id = ?', [id])
        .then(([users]) => {
            if (users[0] != null) {
                console.log(users[0])
                res.status(200).json(users[0])
            } else {
                res.status(404).send("Not Found")
            }
        })
        .catch((err) => {
            console.log(err)
            console.error("Error retrieving data in the database")
        })
}

const postUsers = (req, res) => {
    const { id, firstname, lastname, email, city, language } = req.body;

    database
        .query(
            "INSERT INTO users(id, firstname, lastname, email, city, language) VALUES(?, ?, ?, ?, ?, ?)",
            [id, firstname, lastname, email, city, language]
        )
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`).sendStatus(201)
        })
        .catch((err) => {
            console.log(err)
            console.error("Error saving the user")
        })
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;

    database
     .query(
        "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?", 
        [firstname, lastname, email, city, language, id])
     .then(([result]) => {
        if (result.affectedRows === 0) {
            res.status(404).send("Not found");
        } else {
            res.status(204);
        }
     })
     .catch((err) => {
        console.log(err);
        res.status(500).send("Error editing the user")
     })
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    database
     .query
     (
        "DELETE FROM users WHERE id = ?", [id]
     )
     .then(([results]) => {
        if (results.affectedRows === 0) {
            res.status(404).send("Not found")
        } else {
            res.status(204).send("Deletion succeed !")
        }
     })
     .catch((err) => {
        console.log(err);
        res.status(500).send("Missing deletion of this user")
     })
};

module.exports = {
    getUsers,
    getUsersById,
    postUsers,
    updateUser,
    deleteUser,
}