const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();


// GET USER CART

router.get("/", auth, (req, res) => {

  const sql = `
    SELECT
      cart.id,
      cart.quantity,
      medicines.id as medicine_id,
      medicines.name,
      medicines.price,
      medicines.image,
      medicines.category
    FROM cart
    JOIN medicines
      ON cart.medicine_id = medicines.id
    WHERE cart.user_id = ?
    ORDER BY cart.id DESC
  `;

  db.all(sql, [req.user.id], (err, rows) => {

    if (err) {
      return res.status(500).json({
        message: err.message
      });
    }

    res.json(rows);

  });

});


// ADD TO CART

router.post("/", auth, (req, res) => {
console.log("BODY:", req.body);
const quantity = req.body.quantity || 1;

const medicine_id =
  req.body.medicine_id ||
  req.body.medicineId;

console.log("BODY:", req.body);
console.log("medicine_id:", medicine_id);

  db.get(
    `
    SELECT *
    FROM cart
    WHERE user_id = ?
    AND medicine_id = ?
    `,
    [req.user.id, medicine_id],
    (err, existing) => {

      if (existing) {

        db.run(
          `
          UPDATE cart
          SET quantity = quantity + ?
          WHERE id = ?
          `,
          [quantity || 1, existing.id],
          function(err) {

            if (err) {
              return res.status(500).json({
                message: err.message
              });
            }

            res.json({
              message: "Cart updated"
            });

          }
        );

      } else {

        db.run(
          `
          INSERT INTO cart
          (user_id, medicine_id, quantity)
          VALUES(?,?,?)
          `,
          [
            req.user.id,
            medicine_id,
            quantity || 1
          ],
          function(err) {

            if (err) {
              return res.status(500).json({
                message: err.message
              });
            }

            res.status(201).json({
              message: "Added to cart"
            });

          }
        );

      }

    }
  );

});


// UPDATE QUANTITY

router.put("/:id", auth, (req, res) => {

  const { quantity } = req.body;

  db.run(
    `
    UPDATE cart
    SET quantity = ?
    WHERE id = ?
    AND user_id = ?
    `,
    [
      quantity,
      req.params.id,
      req.user.id
    ],
    function(err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Quantity updated"
      });

    }
  );

});


// REMOVE ITEM

router.delete("/:id", auth, (req, res) => {

  db.run(
    `
    DELETE FROM cart
    WHERE id = ?
    AND user_id = ?
    `,
    [
      req.params.id,
      req.user.id
    ],
    function(err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Item removed"
      });

    }
  );

});

module.exports = router;