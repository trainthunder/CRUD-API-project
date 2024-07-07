import express from "express";
import questionRouter from "./routes/questions.mjs";
import "dotenv/config";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/questions", questionRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
