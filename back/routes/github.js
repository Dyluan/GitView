import express from "express";
import axios from "axios";

const router = express.Router();

// Proxy all GitHub API requests
router.all("/", async (req, res) => {
  try {
    const githubPath = req.params[0]; // Everything after /api/github/
    const githubUrl = `https://api.github.com/${githubPath}`;

    const response = await axios({
      method: req.method,
      url: githubUrl,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Node-GitHub-Proxy",
      },
      params: req.query,
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ error: "Proxy request failed", message: error.message });
    }
  }
});

export default router;
