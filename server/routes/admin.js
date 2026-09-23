const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// Admin Check Middleware
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

// ======================
// DASHBOARD STATS
// ======================

router.get("/stats", auth, adminOnly, (req, res) => {

  const stats = {};

  db.get(
    "SELECT COUNT(*) as total FROM users",
    [],
    (err, users) => {

      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      stats.users = users.total;

      db.get(
        "SELECT COUNT(*) as total FROM medicines",
        [],
        (err, medicines) => {

          stats.medicines = medicines.total;

          db.get(
            "SELECT COUNT(*) as total FROM orders",
            [],
            (err, orders) => {

              stats.orders = orders.total;

              db.get(
                "SELECT COUNT(*) as total FROM prescriptions",
                [],
                (err, prescriptions) => {

                  stats.prescriptions =
                    prescriptions.total;

                  res.json(stats);

                }
              );

            }
          );

        }
      );

    }
  );

});

// ======================
// ALL ORDERS
// ======================

router.get(
  "/orders",
  auth,
  adminOnly,
  (req, res) => {

    db.all(
      `
      SELECT
      orders.*,
      users.name,
      users.email

      FROM orders

      JOIN users
      ON orders.user_id = users.id

      ORDER BY orders.id DESC
      `,
      [],
      (err, rows) => {

        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.json(rows);

      }
    );

  }
);

// ======================
// UPDATE ORDER STATUS
// ======================

router.put(
  "/orders/:id",
  auth,
  adminOnly,
  (req, res) => {

    const { status } = req.body;

    db.run(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [
        status,
        req.params.id
      ],
      function(err) {

        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.json({
          message:
            "Order updated successfully",
        });

      }
    );

  }
);

// ======================
// ALL USERS
// ======================

router.get(
  "/users",
  auth,
  adminOnly,
  (req, res) => {

    db.all(
      `
      SELECT
      id,
      name,
      email,
      role

      FROM users
      ORDER BY id DESC
      `,
      [],
      (err, rows) => {

        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.json(rows);

      }
    );

  }
);

// ======================
// ALL PRESCRIPTIONS
// ======================

router.get(
  "/prescriptions",
  auth,
  adminOnly,
  (req, res) => {

    db.all(
      `
      SELECT *
      FROM prescriptions
      ORDER BY id DESC
      `,
      [],
      (err, rows) => {

        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.json(rows);

      }
    );

  }
);

module.exports = router;