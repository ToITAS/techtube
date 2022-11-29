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

require("./routes/users")(router);
require("./routes/articles")(router);
require("./routes/topics")(router);

const auth = require("./middleware/auth");

/*
######
AUTH
######
*/

router.post("/autoriser", async (req, res) => {
  try {
    const username = req.body.brukernavn;
    const password = req.body.passord;


    if (!username || !password) {
      res.status(400).json("Missing field(s)");
      return;
    }

    const conn = await mysql
      .createConnection(conf)
      .catch((err) => res.status(500).json({ erorr: err }));

    const [users, fields] = await conn.query(
      `SELECT * 
      FROM brukere, bruker_rolle
      WHERE brukernavn = '${username}' && bruker_rolle_id = rolle_id`
    );

    if (users.length == 0) {
      res.status(401).json({ error: "Invalid password or username" });
      return;
    }

    const user = users[0];

    console.log(user);

    var passDecrypted = CryptoJS.AES.decrypt(
      user.passord,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (password == passDecrypted) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          user: {
            bruker_id: user.bruker_id,
            brukernavn: user.brukernavn,
            rolle: user.rolle_navn,
            autoritet: user.autoritet,
          },
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
      res.status(401).json({
        error: new Error("Unauthorized"),
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Bad request" });
  }
});

router.post("/validate", auth, async (req, res) => {
  res.status(200).json(res.locals.user.user);
});

router.post("/deautoriser", async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({ result: "deauthorized" });
});

const PORT = 8080;
app.listen(PORT, () => console.log("listening on port", PORT));
