const express = require("express");
const connectDB = require("./db");
const authenticate = require("./middleware/authenticate");
const routes = require("./routes/index");
const app = express();

app.use(express.json());
app.use(routes);

app.get("/private", authenticate, async (req, res) => {
  console.log("I am User", req.user);
  return res.status(200).json({ message: "I am a Private router" });
});
app.get("/public", (_req, res) => {
  return res.status(200).json({ message: "I am a public router" });
});

app.get("/", (_req, res) => {
  const obj = {
    name: "Rezuan",
    email: "rezuan@gmail.com",
  };
  res.json(obj);
});

app.use((err, _req, res, _next) => {
  console.log(err);
  const message = err.message ? err.message : "Server Error Occurred";
  const status = err.status ? err.status : 500;
  res.status(status).json({ message });
});

connectDB("mongodb://localhost:27017/attendance-app")
  .then(() => {
    console.log("Database Connected");
    app.listen(4000, () => {
      console.log("Server is running on PORT 4000...");
    });
  })
  .catch((e) => console.log(e));
