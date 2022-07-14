const express = require("express");
const router = express.Router();
const pool = require("../helpers/database");
const bcrypt = require("bcrypt");

router.get("/:id", async function (req, res) {
  try {
    const sqlQuery =
      "SELECT id, username, password, email, phone, role_fk, created_at, is_restricted FROM atulixer_ywkdb.`user` WHERE id=?;";
    const rows = await pool.query(sqlQuery, req.params.id);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
  res.status(200).json({ id: req.params.id });
});

router.post("/register", async function (req, res) {
  try {
    const { email, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    const sqlQuery =
      "INSERT INTO atulixer_ywkdb.`user` (email, password) VALUES (?, ?)";
    const result = await JSON.stringify(
      pool.query(sqlQuery, [email, encryptedPassword])
    );

    res.status(200).json({ userId: result.insertId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async function (req, res) {
  try {
    const { id, password } = req.body;

    const sqlGetUser = "SELECT password FROM atulixer_ywkdb.`user` WHERE id=?";
    const rows = await pool.query(sqlGetUser, id);
    if (rows) {
      const isValid = await bcrypt.compare(password, rows[0].password);
      res.status(200).json({ valid_password: isValid });
    }
    res.status(200).send(`User with id ${id} was not found`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = router;