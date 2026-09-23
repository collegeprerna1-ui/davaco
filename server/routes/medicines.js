const express = require("express");
const db = require("../db");

const router = express.Router();


// GET ALL MEDICINES

router.get("/", (req, res) => {
  const { category, search } = req.query;

  let sql = "SELECT * FROM medicines WHERE 1=1";
  let params = [];

  if (category && category !== "All Medicines") {
    sql += " AND category = ?";
    params.push(category);
  }

  if (search) {
    sql += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  sql += " ORDER BY id DESC";

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(rows);
  });
});

// GET SINGLE MEDICINE

router.get("/:id", (req, res) => {

  db.get(
    "SELECT * FROM medicines WHERE id=?",
    [req.params.id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      if (!row) {
        return res.status(404).json({
          message: "Medicine not found"
        });
      }

      res.json(row);

    }
  );

});


// CREATE MEDICINE

router.post("/", (req, res) => {

  const {
    name,
    description,
    price,
    stock,
    image,
    category
  } = req.body;

  db.run(
    `INSERT INTO medicines
    (name,description,price,stock,image,category)
    VALUES(?,?,?,?,?,?)`,
    [
      name,
      description,
      price,
      stock,
      image,
      category
    ],
    function(err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        id: this.lastID,
        message: "Medicine added"
      });

    }
  );

});


// UPDATE MEDICINE

router.put("/:id", (req, res) => {

  const {
    name,
    description,
    price,
    stock,
    image,
    category
  } = req.body;

  db.run(
    `
    UPDATE medicines
    SET
      name=?,
      description=?,
      price=?,
      stock=?,
      image=?,
      category=?
    WHERE id=?
    `,
    [
      name,
      description,
      price,
      stock,
      image,
      category,
      req.params.id
    ],
    function(err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Medicine updated"
      });

    }
  );

});


// DELETE MEDICINE

router.delete("/:id", (req, res) => {

  db.run(
    "DELETE FROM medicines WHERE id=?",
    [req.params.id],
    function(err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Medicine deleted"
      });

    }
  );

});

module.exports = router;