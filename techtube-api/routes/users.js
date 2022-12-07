const mysql = require("mysql2/promise");
const CryptoJS = require("crypto-js");
const auth = require("../middleware/auth");
const conf = require("../lib/dbConf");
const { format } = require("mysql");

module.exports = (router) => {
  router.get("/brukere", auth, async (req, res) => {
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

  router.get("/bruker", auth, async (req, res) => {
    try {
      const user = await fetchUserGroups(res.locals.user.bruker_id);
      const formatedUser = formatUsers(user)[0];
      if (user) {
        res.status(200).json(formatedUser);
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Could not fetch data" });
    }
  });
};

function formatUsers(users) {
  return users.map((user) => ({
    bruker_id: user.bruker_id,
    brukernavn: user.brukernavn,
    autoritet: user.autoritet,
    grupper: user.grupper.split(",").map((gruppe) => parseInt(gruppe)),
  }));
}

async function fetchUsers({ condition, limit }) {
  const conn = await mysql.createConnection(conf);

  const [rows, fields] = await conn.execute(
    `SELECT b.bruker_id, b.brukernavn, br.autoritet, br.rolle_navn
    FROM brukere b
    INNER JOIN bruker_rolle br ON b.rolle_id = br.bruker_rolle_id
    ${condition ? `&& ${condition}` : ""} 
    ${limit ? `LIMIT ${limit}` : `LIMIT 30`}`
  );

  conn.end();

  return rows;
}

async function fetchUserGroups(user_id) {
  const conn = await mysql.createConnection(conf);

  const [rows, fields] = await conn.execute(
    `SELECT b.bruker_id, b.brukernavn, br.autoritet, GROUP_CONCAT(DISTINCT g.gruppe_id ORDER BY g.gruppe_id DESC SEPARATOR ', ') grupper
    FROM brukere b
    INNER JOIN brukere_gruppe bg ON b.bruker_id = bg.bruker_id
    INNER JOIN gruppe g ON bg.gruppe_id = g.gruppe_id
    INNER JOIN bruker_rolle br ON b.rolle_id = br.bruker_rolle_id
    WHERE b.bruker_id = ${user_id}
    GROUP BY b.bruker_id, b.brukernavn`
  );

  conn.end();

  return rows;
}
