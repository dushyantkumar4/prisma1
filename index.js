require("dotenv").config();
const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("this is root");
});
//get data
app.get("/api/user", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
//post data
app.post("/api/user", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const findUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (findUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.listen(PORT, () => {
  console.log(`server is runing on ${PORT}`);
});
