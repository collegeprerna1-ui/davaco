const express = require("express");
const multer = require("multer");

const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();


// STORAGE

const storage = multer.diskStorage({

  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function(req, file, cb) {

    const unique =
      Date.now() +
      "-" +
      file.originalname;

    cb(null, unique);

  }

});

const upload = multer({
  storage
});


// UPLOAD

router.post(
  "/upload",
  auth,
  upload.single("prescription"),
  (req, res) => {

    const notes = req.body.notes || "";

    const fileName =
      req.file?.filename || "";

    db.run(
      `INSERT INTO prescriptions
      (user_id,file_name,notes)
      VALUES(?,?,?)`,
      [
        req.user.id,
        fileName,
        notes
      ],
      function(err) {

        if (err) {

          return res.status(500).json({
            message: err.message
          });

        }

        res.status(201).json({
          message:
            "Prescription uploaded successfully",
          id: this.lastID
        });

      }
    );

  }
);


// USER PRESCRIPTIONS

router.get(
  "/my",
  auth,
  (req, res) => {

    db.all(
      `SELECT *
       FROM prescriptions
       WHERE user_id = ?
       ORDER BY id DESC`,
      [req.user.id],
      (err, rows) => {

        res.json(rows);

      }
    );

  }
);

module.exports = router;