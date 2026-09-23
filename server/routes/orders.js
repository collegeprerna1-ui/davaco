const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();


// ===============================
// PLACE ORDER
// ===============================

router.post("/", auth, (req, res) => {

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({
      message: "Address is required"
    });
  }

  const cartQuery = `
    SELECT
      cart.*,
      medicines.price,
      medicines.name
    FROM cart
    JOIN medicines
      ON cart.medicine_id = medicines.id
    WHERE cart.user_id = ?
  `;

  db.all(cartQuery, [req.user.id], (err, cartItems) => {

    if (err) {
      return res.status(500).json({
        message: err.message
      });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    db.run(
      `
      INSERT INTO orders
      (user_id,total_amount,address,status)
      VALUES(?,?,?,?)
      `,
      [
        req.user.id,
        totalAmount,
        address,
        "Pending"
      ],
      function(err) {

        if (err) {
          return res.status(500).json({
            message: err.message
          });
        }

        const orderId = this.lastID;

        const stmt = db.prepare(`
          INSERT INTO order_items
          (order_id,medicine_id,quantity,price)
          VALUES(?,?,?,?)
        `);

        cartItems.forEach(item => {
          stmt.run(
            orderId,
            item.medicine_id,
            item.quantity,
            item.price
          );
        });

        stmt.finalize();

        db.run(
          "DELETE FROM cart WHERE user_id=?",
          [req.user.id]
        );

        res.status(201).json({
          success: true,
          message: "Order placed successfully",
          orderId,
          totalAmount
        });

      }
    );

  });

});


// ===============================
// GET MY ORDERS
// ===============================

router.get("/my-orders", auth, (req, res) => {

  db.all(
    `
    SELECT *
    FROM orders
    WHERE user_id = ?
    ORDER BY id DESC
    `,
    [req.user.id],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json(rows);

    }
  );

});


// ===============================
// GET ORDER DETAILS
// ===============================

router.get("/:id", auth, (req, res) => {

  db.all(
    `
    SELECT
      order_items.id,
      medicines.name,
      medicines.image,
      order_items.quantity,
      order_items.price
    FROM order_items
    JOIN medicines
      ON medicines.id =
      order_items.medicine_id
    WHERE order_items.order_id = ?
    `,
    [req.params.id],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json(rows);

    }
  );

});


// ===============================
// ORDER TRACKING
// ===============================

router.get("/:id/tracking", auth, (req, res) => {

  db.get(
    `
    SELECT
      id,
      status,
      created_at
    FROM orders
    WHERE id = ?
    AND user_id = ?
    `,
    [
      req.params.id,
      req.user.id
    ],
    (err, order) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      const steps = [
        "Pending",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered"
      ];

      const currentStep =
        steps.indexOf(order.status);

      res.json({
        orderId: order.id,
        status: order.status,
        created_at: order.created_at,
        steps,
        currentStep
      });

    }
  );

});


// ===============================
// CANCEL ORDER
// ===============================

router.put("/:id/cancel", auth, (req, res) => {

  db.run(
    `
    UPDATE orders
    SET status='Cancelled'
    WHERE id=?
    AND user_id=?
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
        message: "Order cancelled"
      });

    }
  );

});


// ===============================
// ADMIN UPDATE STATUS
// ===============================

router.put("/:id/status", (req, res) => {

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
          message: err.message
        });
      }

      res.json({
        message: "Status updated",
        status
      });

    }
  );

});

module.exports = router;