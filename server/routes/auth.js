const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// ======================
// REGISTER USER
// ======================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (user) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          `
          INSERT INTO users
          (name,email,password,role)
          VALUES(?,?,?,?)
          `,
          [
            name,
            email,
            hashedPassword,
            "user",
          ],
          function (err) {
            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            const token = jwt.sign(
              {
                id: this.lastID,
                role: "user",
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );

            res.status(201).json({
              token,
              user: {
                id: this.lastID,
                name,
                email,
                role: "user",
              },
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// LOGIN
// ======================

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `,
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (!user) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      const validPassword = await bcrypt.compare(
        password,
        user.password
      );

      if (!validPassword) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role || "user",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
      });
    }
  );
});

// ======================
// CURRENT USER
// ======================

router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    db.get(
      `
      SELECT
      id,
      name,
      email,
      role
      FROM users
      WHERE id = ?
      `,
      [decoded.id],
      (err, user) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        res.json(user);
      }
    );
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
});

// ======================
// REGISTER ADMIN
// ======================

router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    db.run(
      `
      INSERT INTO users
      (name,email,password,role)
      VALUES(?,?,?,?)
      `,
      [
        name,
        email,
        hashedPassword,
        "admin",
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.json({
          message: "Admin created successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// MAKE EXISTING USER ADMIN
// ======================

router.get("/make-admin", (req, res) => {
  db.run(
    `
    UPDATE users
    SET role = 'admin'
    WHERE email = 'collegeprerna1@gmail.com'
    `,
    function (err) {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "User promoted to admin",
      });
    }
  );
});

module.exports = router;