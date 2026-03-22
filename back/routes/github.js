import express from "express";
import axios from "axios";
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

// Helper function to fetch all pages from GitHub API
async function fetchAllPages(url, params = {}) {
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="next")/i;
  let allData = [];
  let nextUrl = url;
  let requestParams = { ...params, per_page: 100 };
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 1);

  while (nextUrl) {
    const response = await axios({
      method: 'GET',
      url: nextUrl,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      },
      params: {
        requestParams,
        since: currentDate.toISOString()
      }
    });

    allData = allData.concat(response.data);

    const linkHeader = response.headers.link;
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(nextPattern);
      nextUrl = match ? match[0] : null;
      // Clear params for subsequent requests since the URL already contains them
      requestParams = {};
    } else {
      nextUrl = null;
    }
  }

  return allData;
}

router.get('/users', async (req, res) => {
  console.log('/users called');
  try {
    const username = req.query.username;
    
    const response = await axios({
      method: 'GET',
      url: `https://api.github.com/users/${username}`,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    });

    res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Proxy request failed", message: error.message });
    }
  }
});

// TODO: apply the helper function to this endpoint as well as there could be more than 100 repositories
router.get('/repos', async (req, res) => {
  console.log('/repos called');
  try {

    const username = req.query.username;
    
    const response = await axios({
      method: 'GET',
      url: `https://api.github.com/users/${username}/repos`,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      },
      params: {per_page: 100}
    });

    res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Proxy request failed", message: error.message });
    }
  }
});

router.get('/commits', async (req, res) => {
  console.log('/commits called');
  try {

    const username = req.query.username;
    const repository = req.query.repo;

    const allCommits = await fetchAllPages(
      `https://api.github.com/repos/${username}/${repository}/commits`
    );

    res.status(200).json(allCommits);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Proxy request failed", message: error.message });
    }
  }
});

router.get('/events', async (req, res) => {
  console.log('/events called');
  try {

    const username = req.query.username;
    
    const response = await axios({
      method: 'GET',
      url: `https://api.github.com/users/${username}/events`,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      },
      params: {per_page: 100}
    });

    res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Proxy request failed", message: error.message });
    }
  }
})

export default router;
