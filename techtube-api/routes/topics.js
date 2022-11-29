const mysql = require("mysql2/promise");

module.exports = (router) => {
  async function fetchTema({ condition, limit }) {
    const conn = await mysql.createConnection(conf);

    const [rows, fields] = await conn.execute(
      `SELECT *
      FROM tema
      ${condition ? `WHERE ${condition}` : ""} 
      ${limit ? `LIMIT ${limit}` : `LIMIT 30`}`
    );

    return rows;
  }

  router.get("/tema", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 30;
      const temaer = await fetchTema({ limit: limit });
      res.status(200).json(temaer);
    } catch (e) {
      res.status(500).json({ error: "Could not fetch data" });
    }
  });
  router.get("/tema/navn/:navn", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 30;
      const temaer = await fetchTema({
        condition: `tema.navn LIKE '%${req.params.navn}%'`,
        limit: limit,
      });
      res.status(200).json(temaer);
    } catch (e) {
      res.status(500).json({ error: "Could not fetch data" });
    }
  });
  router.get("/tema/id/:id", async (req, res) => {
    try {
      const articleRows = await fetchTema({
        condition: `tema.tema_id = ${req.params.id}`,
      });
      res.status(200).json(articleRows[0] || {});
    } catch {
      res.status(500).json({ error: "Could not fetch data :(" });
    }
  });

  router.post("/leggTilTema", async (req, res) => {
    const navn = req.body.navn;
    const beskrivelse = req.body.beskrivelse;
    const katalog_id = req.body.katalog_id;

    const conn = await mysql
      .createConnection(conf)
      .catch((err) => res.status(500).json({ erorr: err }));

    conn
      .query(`INSERT INTO tema (navn, beskrivelse, kat_id) VALUES (?, ?, ?)`, [
        navn,
        beskrivelse,
        katalog_id,
      ])
      .then(([rows, fields]) => {
        res.status(200).json({ tema_id: rows.insertId });
      })
      .catch((err) => {
        if (err.errno == 1452) {
          res.status(400).json({ error: "Invalid id(s)" });
          return;
        }
        if (err.errno == 1048) {
          res.status(400).json({ error: "Missing field(s)" });
        }
        res.status(500).json({ error: err });
      });
  });
};
