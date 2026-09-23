require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

require("./db");

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));


app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
app.use(
  "/api/orders",
  require("./routes/orders")
);
app.use(
  "/api/admin",
  require("./routes/admin")
);
app.use(
  "/api/cart",
  require("./routes/cart")
);
app.use(
  "/api/medicines",
  require("./routes/medicines")
);
app.use(
  "/api/reminders",
  require("./routes/reminders")
);
app.use(
  "/api/auth",
  require("./routes/auth")
);

app.use(
  "/api/prescriptions",
  require("./routes/prescriptions")
);


app.get("/", (req, res) => {
  res.send("DawaCo Backend Running");
});


const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});