const express = require("express");
const connectDB = require("./db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());

app.post("/register", async (req, res, next) => {
  /* Request Body Sources:
    -req Body
    -req param
    -req query
    -req header
    -req cookies
  */
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;

    await user.save();
    return res.status(201).json({ message: "User Created Successfully", user });
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credential" });
    }
    delete user._doc.password;
    return res.status(200).json({ message: "Login Successful", user });
  } catch (e) {
    next(e);
  }
});

app.get("/", (req, res) => {
  const obj = {
    name: "Rezuan",
    email: "rezuan@gmail.com",
  };
  res.json(obj);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Server Error Occurred" });
});

connectDB("mongodb://localhost:27017/attendance-app")
  .then(() => {
    console.log("Database Connected");
    app.listen(4000, () => {
      console.log("Server is running on PORT 4000...");
    });
  })
  .catch((e) => console.log(e));
