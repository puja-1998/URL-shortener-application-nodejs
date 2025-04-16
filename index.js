const express = require('express');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// In-memory database to store URL mappings
const urlDatabase = {};
app.use(express.static(__dirname)); 
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form for URL shortening
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle URL shortening
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;

  if (!isValidUrl(longUrl)) {
    return res.status(400).send('Invalid URL');
  }

  const shortUrl = generateShortUrl();
  urlDatabase[shortUrl] = longUrl;

  res.send(`Shortened URL: http://localhost:${PORT}/${shortUrl}`);
});

// Redirect to the original URL when a short URL is accessed
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl];

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Helper function to generate a short URL
function generateShortUrl() {
  return nanoid(8); // Adjust the length of the generated ID as needed
}

// Helper function to check if a URL is valid
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

