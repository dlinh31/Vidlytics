const express = require('express');
const cors = require('cors');
const app = express();

// Import getChannelInfo function from helper.js
const {getChannelInfo, getVideoStats, getVideofromChannelId} = require('./helper'); // Adjust the path as necessary

app.use(cors());

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

app.get('/api/playlist/:channelId', async (req, res) => {
  const channelId = req.params.channelId;
  try {
      const videos = await getVideofromChannelId(channelId);
      if (videos.length > 0) {
          res.json(videos);
      } else {
          res.status(404).json({ error: 'No videos found for the specified channel' });
      }

  } catch (error) {
      console.error('Error in route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
