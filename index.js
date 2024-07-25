const express = require("express");
const ytsr = require("ytsr");
const cors = require("cors");

const app = express();
const port = 3000; // You can choose any port you like

// Use CORS middleware
app.use(cors());

app.get("/search", async (req, res) => {
  const query = req.query.q; // Default query
  const limit = parseInt(req.query.limit) || 20; // Default limit to 20 if not provided

  try {
    // Search for videos based on the query and limit
    const searchResults = await ytsr(query, { limit: limit });

    // Filter out only videos and map them to desired format
    const resultsJson = searchResults.items
      .filter((item) => item.type === "video") // Ensure only videos are included
      .map((video, index) => ({
        index: index + 1,
        title: video.title,
        url: video.url,
        thumbnail: video.bestThumbnail.url || "", // Include thumbnail URL if available
      }));

    // Output JSON with video templates
    res.json({
      searchResults: resultsJson,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Example usage: http://localhost:3000/search?q=hacking&limit=10
