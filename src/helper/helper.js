const axios = require('axios');
const YT_API_KEY = "AIzaSyDWR8umz87buINaMHeRsGXYpEwYZaeFDlg"

var {google} = require('googleapis');

// Initialize YouTube service
const youtube = google.youtube({
    version: 'v3',
    auth: YT_API_KEY // Your API key
});

async function getChannelInfo(handle){
  payload = {
        forHandle: handle,
        part: 'statistics',
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
      
        return  info

    } catch (error) {
        console.error('Error fetching channel id:', error);
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

        console.log(result); 
        return result

    } catch (error) {
        console.error('Error fetching channel id:', error);
        return null;
    }
}


async function getUploadsPlaylistId(channelId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'contentDetails',
        id: channelId,
        key: YT_API_KEY,
      },
    });

    if (response.data.items.length > 0) {
      return response.data.items[0].contentDetails.relatedPlaylists.uploads;
    } else {
      console.log('No uploads playlist found for the specified channel ID.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching uploads playlist ID:', error);
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

getChannelInfo('veritasium').then(res => console.log(res));


module.exports = {getChannelInfo}
