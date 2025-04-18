require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const userRouter = require("./routes/userRouter.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("this is root");
});

app.use("/api/user",userRouter);

app.listen(PORT, () => {
  console.log(`server is runing on ${PORT}`);
});
