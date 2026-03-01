import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRouter from "./routes/github.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);

// GitHub API proxy
app.use("/api/github", githubRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
