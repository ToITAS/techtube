const mysql = require("mysql2/promise");

module.exports = (router, conf) => {
  async function fetchArticles({ condition, limit }) {
    const conn = await mysql.createConnection(conf);

    const [rows, fields] = await conn.execute(
      `SELECT artikkel.artikkel_id, artikkel.tittel, artikkel.moduler, artikkel.lagt_til_dato, tema.navn, brukere.bruker_id, brukere.brukernavn, tema.navn
      FROM artikkel, tema, brukere 
      ${condition ? `WHERE ${condition} &&` : "WHERE"} 
      artikkel.lagt_til_av_id = brukere.bruker_id && artikkel.tema_id = tema.tema_id
      ORDER BY artikkel_id
      ${limit ? `LIMIT ${limit}` : `LIMIT 30`}`
    );

    conn.end();

    return rows;
  }

  function formatArticles(articleRows) {
    var response = [];

    articleRows.forEach((article) => {
      response.push({
        artikkel_id: article.artikkel_id,
        tittel: article.tittel,
        moduler: JSON.parse(article.moduler),
        lagt_til_dato: article.lagt_til_dato,
        tema: article.navn,
        lagt_til_av: {
          bruker_id: article.bruker_id,
          brukernavn: article.brukernavn,
        },
      });
    });

    return response;
  }

  router.get("/artikler", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 30;
      const articles = await fetchArticles({ limit: limit });
      res.status(200).json(articles ? formatArticles(articles) : []);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Could not fetch data" });
    }
  });

  router.get("/artikler/id/:id", async (req, res) => {
    try {
      const articles = await fetchArticles({
        condition: `artikkel.artikkel_id = ${req.params.id}`,
      });
      if (articles.length !== 0) {
        res.status(200).json(formatArticles(articles)[0]);
      } else {
        res.status(200).json({});
      }
    } catch {
      res.status(500).json({ error: "Could not fetch data :(" });
    }
  });

  router.get("/artikler/tittel/:tittel", async (req, res) => {
    try {
      const limit = req.query.limit || 30;
      const articleRows = await fetchArticles({
        condition: `artikkel.tittel LIKE '%${req.params.tittel}%'`,
        limit: limit,
      });
      res.status(200).json(formatArticles(articleRows));
    } catch {
      res.status(500).json({ error: "Could not fetch data :(" });
    }
  });

  router.post("/artikler/ny", async (req, res) => {
    try {
      const tittel = req.body.tittel;
      const moduler = req.body.moduler;
      const lagtTilAvId = req.body.lagtTilAvId;
      const temaId = req.body.temaId;
      const unix = Math.floor(Date.now() / 1000);

      console.log(tittel, JSON.stringify(moduler), lagtTilAvId, temaId);

      const conn = await mysql
        .createConnection(conf)
        .catch((err) => res.status(500).json({ erorr: err }));

      conn
        .query(
          `INSERT INTO artikkel (tittel, moduler, lagt_til_av_id, lagt_til_dato, tema_id) VALUES (?, ?, ?, ?, ?)`,
          [tittel, JSON.stringify(moduler), lagtTilAvId, unix, temaId]
        )
        .then(([rows, fields]) => {
          res.status(200).json({ articleId: rows.insertId });
        })
        .catch((err) => {
          if (err.errno == 1452) {
            res.status(400).json({ error: "Invalid id(s)" });
            return;
          }
          if (err.errno == 1048) {
            res.status(400).json({ error: "Missing field(s)" });
            return;
          }
          res.status(500).json({ error: err });
        });
    } catch (e) {
      console.log(e);
    }
  });
};
