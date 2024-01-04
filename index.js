const connection = require("./config/db");
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
require("dotenv").config();
const expenseRouter = require("./routes/expense.routes");

const app = express();
app.use(
  cors({
    origin: ["https://subtle-cupcake-2e83a9.netlify.app",'http://localhost:3000'],
  })
  // --
  // --
);
app.use(express.json());
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use("/users", userRouter);
app.use("/expenses", expenseRouter);



app.listen(PORT, async () => {
  try {
    await connection;

    console.log("database connected");
  } catch (error) {
    console.log("error while listening", error);
  }
});
