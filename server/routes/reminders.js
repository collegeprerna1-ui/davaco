const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
  db.all(
    "SELECT * FROM reminders WHERE user_id=? ORDER BY dateTime",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
});

router.post("/", auth, (req, res) => {
  const { title, dateTime } = req.body;

  db.run(
    "INSERT INTO reminders(user_id,title,dateTime) VALUES(?,?,?)",
    [req.user.id, title, dateTime],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        id: this.lastID,
        title,
        dateTime,
        notified: 0,
      });
    }
  );
});

router.put("/:id/notified", auth, (req, res) => {
  db.run(
    "UPDATE reminders SET notified=1 WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });

      res.json({ message: "Updated" });
    }
  );
});

router.delete("/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM reminders WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });

      res.json({ message: "Deleted" });
    }
  );
});

module.exports = router;