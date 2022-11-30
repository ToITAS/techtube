const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bp = require("body-parser");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const conf = require("./lib/dbConf");

const corsConf = {
  credentials: true,
  origin: ["http://localhost", "http://192.168.1.211"],
};

const app = express();
app.use(cors(corsConf));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require("./routes/users")(router, conf);
require("./routes/articles")(router, conf);
require("./routes/topics")(router, conf);

const auth = require("./middleware/auth");

/*
######
AUTH
######
*/

router.post("/autoriser", async (req, res) => {
  const conn = await mysql
    .createConnection(conf)
    .catch((err) => res.status(500).json({ erorr: err }));

  try {
    const username = req.body.brukernavn;
    const password = req.body.passord;

    if (!username || !password) throw 1;

    const [users, fields] = await conn.query(
      `SELECT * 
      FROM brukere, bruker_rolle
      WHERE brukernavn = '${username}' && bruker_rolle_id = rolle_id`
    );

    if (users.length === 0) throw 2;

    const user = users[0];

    var passDecrypted = CryptoJS.AES.decrypt(
      user.passord,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (password == passDecrypted) {
      const token = jwt.sign(
        {
          bruker_id: user.bruker_id,
        },
        process.env.SECRET_KEY
      );
      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({ result: "authenticated" });
    } else {
      throw 2;
    }
  } catch (e) {
    switch (e) {
      case 1:
        res.status(400).json({ error: "Missing field(s)" });
        break;
      case 2:
        res.status(401).json({ error: "Invalid password or username" });
        break;
    }
  }

  conn.end();
});

router.post("/validate", auth, async (req, res) => {
  const conn = await mysql
    .createConnection(conf)
    .catch((err) => res.status(500).json({ erorr: err }));

  try {
    const [users, fields] = await conn.query(
      `SELECT bruker_id, brukernavn, rolle_id, rolle_navn, autoritet
      FROM brukere, bruker_rolle
      WHERE bruker_id = '${res.locals.user.bruker_id}' && bruker_rolle_id = rolle_id`
    );
    res.status(200).json(users[0]);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/deautoriser", async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ result: "deauthorized" });
  } catch (e) {
    console.log(e);
    res.send(500).json({ error: "Internal server error" });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log("listening on port", PORT));
