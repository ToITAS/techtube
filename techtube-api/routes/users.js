const mysql = require("mysql2/promise");
const CryptoJS = require("crypto-js");

module.exports = (router, conf) => {
  async function fetchUsers({ condition, limit }) {
    const conn = await mysql.createConnection(conf);

    const [rows, fields] = await conn.execute(
      `SELECT bruker_id, brukernavn, rolle_id, rolle_navn, autoritet
      FROM brukere, bruker_rolle
      WHERE bruker_rolle_id = rolle_id
      ${condition ? `&& ${condition}` : ""} 
      ${limit ? `LIMIT ${limit}` : `LIMIT 30`}`
    );

    conn.end();

    return rows;
  }

  router.get("/brukere", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 30;
      const users = await fetchUsers({ limit: limit });
      res.status(200).json(users ? users : []);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Could not fetch data" });
    }
  });

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
    const conn = await mysql
      .createConnection(conf)
      .catch((err) => res.status(500).json({ erorr: err }));

    try {
      const username = req.body.brukernavn;
      const password = req.body.passord;

      if (!username || !password) throw 1;
      if (username.includes(" ") || password.includes(" ")) throw 2;
      if (username.length < 5 || password.length < 5) throw 3;

      const passEncrypted = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString();

      const users = await fetchUsers({
        condition: `brukernavn = '${username}'`,
      });

      if (users.length !== 0) throw 4;

      conn
        .query(
          `INSERT INTO brukere (brukernavn, passord, rolle_id) VALUES (?, ?, ?)`,
          [username, passEncrypted, 3]
        )
        .then(([rows, fields]) => {
          res.status(201).json({ bruker_id: rows.insertId });
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    } catch (e) {
      switch (e) {
        case 1:
          res.status(400).json({
            error: "Missing field(s)",
          });
          break;
        case 2:
          res.status(400).json({
            error: "Brukernavn og passord kan ikke inneholde mellomrom",
          });
          break;
        case 3:
          res.status(400).json({
            error: "Brukernavn og passord må bestå av minst 5 bokstaver",
          });
          break;
        case 4:
          res.status(400).json({
            error: "Brukernavn allerede i bruk",
          });
          break;
      }
    }
    conn.end();
  });
};
