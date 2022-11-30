const mysql = require("mysql2/promise");
const CryptoJS = require("crypto-js");

module.exports = (router, conf) => {
  async function fetchUsers({ condition, limit }) {
    const conn = await mysql.createConnection(conf);

    const [rows, fields] = await conn.execute(
      `SELECT brukernavn, bruker_id
      FROM brukere
      ${condition ? `WHERE ${condition}` : ""} 
      ${limit ? `LIMIT ${limit}` : `LIMIT 30`}`
    );

    return rows;
  }

  router.get("/brukere/brukernavn/:brukernavn", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 30;
      const users = await fetchUsers({
        condition: `brukere.brukernavn LIKE '%${req.params.brukernavn}%'`,
        limit: limit,
      });
      res.status(200).json(users);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.get("/brukere/id/:id", async (req, res) => {
    try {
      const users = await fetchUsers({
        condition: `brukere.bruker_id = ${req.params.id}`,
      });
      res.status(200).json(users[0] || {});
    } catch {
      res.status(500).json({ error: "Could not fetch data :(" });
    }
  });

  router.post("/brukere/ny", async (req, res) => {
    try {
      const username = req.body.brukernavn;
      const password = req.body.passord;

      const passEncrypted = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString();

      const conn = await mysql
        .createConnection(conf)
        .catch((err) => res.status(500).json({ erorr: err }));

      conn
        .query(
          `INSERT INTO brukere (brukernavn, passord, rolle_id) VALUES (?, ?, ?)`,
          [username, passEncrypted, 3]
        )
        .then(([rows, fields]) => {
          res.status(201).json({ bruker_id: rows.insertId });
        })
        .catch((err) => {
          if (err.errno == 1048) {
            res.status(400).json({ error: "Missing field(s)" });
          }
          res.status(500).json({ error: err });
        });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });

  router.get("/brukere", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 30;
      const users = await fetchUsers({ limit: limit });
      res.status(200).json(users);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Could not fetch data" });
    }
  });
};
