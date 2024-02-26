require('dotenv').config({path: "../../.env"});
const axios = require('axios');

const YT_API_KEY = process.env.YOUTUBE_API_KEY



var {google} = require('googleapis');



const sample_channel_id = "UCHnyfMqiRRG1u-2MsSQLbXA"
const sameple_upload_playlist_id = "UUHnyfMqiRRG1u-2MsSQLbXA"


// Initialize YouTube service
const youtube = google.youtube({
    version: 'v3',
    auth: YT_API_KEY // Your API key
});


// alreadying working except the title
async function getChannelInfo(handle){
  payload = {
        forHandle: handle,
        part: 'statistics,id',
    }
    try {
        const response = await youtube.channels.list(payload);
        const data = response.data.items[0];
        const info = {
          id: data.id,
          title: data.title,
          viewCount: data.statistics.viewCount,
          subscriberCount: data.statistics.subscriberCount,
          videoCount: data.statistics.videoCount
        }
      
        return info

    } catch (error) {
        console.error('Error fetching channel id:', error);
        return null;
    }
}

async function getVideoStats(channelId){
  payload = {
    part: 'contentDetails, localizations, player, snippet, status',
    channelId: channelId,
    maxResults: 50,
  }
  try {
    const response = await youtube.playlists.list(payload);
    const data = response.data.items[0];

  } catch (error) {
      console.error('Error fetching channel id:', error);
      return null;
  }
}

async function getUploadsPlaylistId(channelId) {
  try {
      const response = await youtube.channels.list({
          part: 'contentDetails',
          id: channelId,
      });

      const uploadsPlaylistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;
      return uploadsPlaylistId;
  } catch (error) {
      console.error('Error fetching uploads playlist ID:', error);
      throw error;
  }
}

// Function to recursively fetch all videos from the uploads playlist
async function getAllVideosFromPlaylist(playlistId, nextPageToken = '', videos = []) {
  try {
      const response = await youtube.playlistItems.list({
          part: 'snippet',
          playlistId: playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
      });

      videos.push(...response.data.items);


      return videos;
  } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
  }
}







async function getPlaylists(channelId) {
  const payload = {
      part: 'snippet,contentDetails',
      channelId: channelId,
      maxResults: 50,
  };
  try {
      const response = await youtube.playlists.list(payload);
      return response.data.items; // Return the playlists
  } catch (error) {
      console.error('Error fetching playlists:', error);
      return null;
  }
}


async function getIDfromHandle(handle){
    payload = {
        forHandle: handle,
        part: 'snippet,contentDetails,statistics',
    }
    try {
        const response = await youtube.channels.list(payload);
        const result = response.data.items[0].id;


        return result

    } catch (error) {
        console.error('Error fetching channel id:', error);
        return null;
    }
}



async function getRecentVideos(playlistId, maxResults=5) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        playlistId: playlistId,
        maxResults: maxResults,
        key: YT_API_KEY,
      },
    });

    const videos = response.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
      publishedAt: item.snippet.publishedAt,
    }));

    return videos;
  } catch (error) {
    console.error('Error fetching recent videos:', error);
    return [];
  }
}



async function getVideofromChannelId(channelId = sample_channel_id) {
  try {
      const playlistId = await getUploadsPlaylistId(channelId);
      if (!playlistId) {
          console.log("No playlist ID found.");
          return [];
      }
      const videos = await getAllVideosFromPlaylist(playlistId);

      // Fetch metrics for each video and add them to the video data
      const videosWithMetrics = await Promise.all(videos.map(async (item) => {
        const metrics = await getVideoMetrics(item.snippet.resourceId.videoId);
        return {
          title: item.snippet.title,
          videoId: item.snippet.resourceId.videoId,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          statistics: metrics, // assuming getVideoMetrics now returns an object with statistics and publishedAt
          publishedAt: metrics.publishedAt // Add the publishedAt date here
        };
      }));

      return videosWithMetrics; // Returns the enriched video list
  } catch (error) {
      console.error('Error fetching videos from channel ID:', error);
      return []; // Return an empty array or handle the error as needed
  }
}




async function getVideoMetrics(videoId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'statistics, snippet', // The 'statistics' part holds the engagement metrics
        id: videoId, // The video ID for which you want to get the metrics
        key: YT_API_KEY
      }
    });

    // If the response contains items, return the statistics
    if (response.data.items && response.data.items.length > 0) {
      const videoDetails = response.data.items[0];
      return {
        ...videoDetails.statistics, // Spread the statistics
        publishedAt: videoDetails.snippet.publishedAt // Include the publishedAt date
      };
    } else {
      throw new Error('No details found for the given video ID.');
    }
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}


async function test(videoId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet', // The 'statistics' part holds the engagement metrics
        id: videoId, // The video ID for which you want to get the metrics
        key: YT_API_KEY
      }
    });
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video statistics:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}


// getVideofromChannelId("UCHnyfMqiRRG1u-2MsSQLbXA").then(res => console.log(res));


module.exports = {getChannelInfo, getVideoStats, getVideofromChannelId, getAllVideosFromPlaylist}