import React, { useState, useEffect } from 'react';
import ChannelInfo from './components/ChannelInfo';
import VideoCard from './components/VideoCard';



import './App.css';

function App() {
  const [handle, setHandle] = useState("");
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [sortMethod, setSortMethod] = useState('dateNewest'); 
  const [errorMessage, setErrorMessage] = useState("");

  
  


  useEffect(() => {
    const sortedVideos = sortVideos([...videos], sortMethod);
    setVideos(sortedVideos);
  }, [sortMethod]); // React to changes in fetched videos or sort method



  // const fetchChannelInfo = async (channelHandle) => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/api/channel/${channelHandle}`);
  //     if (!response.ok) {
  //       throw new Error('Channel data could not be fetched');
  //     }
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     return null; // Make sure to return null here to trigger the error message
  //   }
  // };


  const fetchChannelInfo = async (channelHandle) => {
    try {
      const response = await fetch(`http://localhost:3001/api/channel/${channelHandle}`);
      if (response.ok) {
        const data = await response.json();
        // Check if the data contains valid channel information.
        // Assuming that a valid channel will always have more than 0 subscribers.
        if (data && data.subscriberCount > 0) {
          return { success: true, data };
        } else {
          // If the data is not valid, return success: false.
          return { success: false };
        }
      }
      // If the response is not OK, treat it as a failure to find the channel.
      return { success: false };
    } catch (error) {
      console.error('Fetch error:', error);
      return { success: false }; // Treat errors as failure to find the channel
    }
  };
  
  

  function sortVideos(videos, method) {
    return [...videos].sort((a, b) => {
      switch (method) {
        case 'viewsDesc':
          return parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount);
        case 'likesDesc':
          return parseInt(b.statistics.likeCount) - parseInt(a.statistics.likeCount);
        case 'commentsDesc':
          return parseInt(b.statistics.commentCount) - parseInt(a.statistics.commentCount);
        case 'dateNewest':
          return new Date(b.publishedAt) - new Date(a.publishedAt); // Sorting by date descending
        case 'dateOldest':
          return new Date(a.publishedAt) - new Date(b.publishedAt); // Sorting by date ascending
        default:
          return 0;
      }
    });
  }
  




const fetchVideos = async (channelId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/playlist/${channelId}`);
    if (!response.ok) throw new Error('Video data could not be fetched');
    const data = await response.json();
    const sortedVideos = sortVideos(data, sortMethod)

    setVideos(sortedVideos); // Just set the fetched data here
  } catch (error) {
    console.error('Fetch error:', error);
    setVideos([]); // Clear on error
  }
};





  // Event handler for the search button
  // const handleSearch = async () => {
  //   if (handle.trim()) {
  //     const channelData = await fetchChannelInfo(handle);
  //     if (channelData) {
  //       setChannelInfo(channelData);
  //       setErrorMessage(""); // Clear any existing error message
  //       await fetchVideos(channelData.id);
  //     } else {
  //       setErrorMessage("Channel with given username doesn't exist"); // Set the error message
  //       setChannelInfo(null); // Clear any existing channel info
  //       setVideos([]); // Clear any existing videos
  //     }
  //   }
  // };
  
  const handleSearch = async () => {
    if (handle.trim()) {
      const { success, data } = await fetchChannelInfo(handle);
      if (success) {
        setChannelInfo(data);
        setErrorMessage(""); // Clear any existing error message
        await fetchVideos(data.id);
      } else {
        setErrorMessage("Channel with given username doesn't exist"); // Set the error message
        setChannelInfo(null); // Ensure to clear any existing channel info
        setVideos([]); // Clear any existing videos
      }
    }
  };
  

  // Input field event handler
  const handleInputChange = (event) => {
    setHandle(event.target.value);
  };

  const handleNextPage = () => {
    setCurrentPageToken(nextPageToken); // Update the current page token
    fetchVideos(channelInfo.id, nextPageToken); // Fetch videos with the next page token
  };
  

  return (
    <div className="space-y-4 mx-8">
      <input
        type="text"
        value={handle}
        onChange={handleInputChange}
        placeholder="Enter YouTube channel or username"
        className="p-2 border rounded w-80 shadow-sm focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleSearch}
        className="mx-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      {channelInfo && !errorMessage && (<ChannelInfo info={channelInfo} />)}
      {videos.length > 0 && (
        <div className="flex items-center">
          <p className="mr-2">Sort by:</p>
          <select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
            className="p-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="dateNewest">Date (Latest to Oldest)</option>
            <option value="dateOldest">Date (Oldest to Latest)</option>
            <option value="viewsDesc">Views (High to Low)</option>
            <option value="likesDesc">Likes (High to Low)</option>
            <option value="commentsDesc">Comments (High to Low)</option>
            
          </select>
        </div>
      )}
    </div>

      

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {videos.length > 0 && videos.map(video => (
          <VideoCard key={video.id} info={video} />
        ))}
      </div>
    </div>
  );
}

export default App;
