// server.js

const express = require('express');
const cors = require('cors');
const app = express();

// Import getChannelInfo function from helper.js
const {getChannelInfo} = require('./helper'); // Adjust the path as necessary

app.use(cors()); // Enable CORS

// Your Express route that uses getChannelInfo
app.get('/api/channel/:handle', async (req, res) => {
  const handle = req.params.handle;
  const channelInfo = await getChannelInfo(handle);
  if (channelInfo) {
    res.json(channelInfo);
  } else {
    res.status(404).json({ error: 'Channel not found' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
